import db from '../db.js';
import axios from 'axios';

function isValidIP(ip) {
  return /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/.test(ip);
}


export async function getOwnGeoInfo(req, res) {
  const { ip } = req.body;

  if (!ip) return res.status(400).json({ error: 'IP address required' });

  try {
    const { data } = await axios.get(`https://ipinfo.io/${ip}/json`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch geo info' });
  }
}

export async function getGeoByIP(req, res) {
  const { ip } = req.body;
  const userId = req.user.id;

  if (!ip || !isValidIP(ip)) {
    return res.status(400).json({ error: 'Invalid IP address' });
  }

  try {
    const { data } = await axios.get(`https://ipinfo.io/${ip}/json`);

    const {
      hostname = null,
      city = null,
      region = null,
      country = null,
      loc = null,
      org = null,
      postal = null,
      timezone = null
    } = data;

    const insert = `
      INSERT INTO history (user_id, ip, hostname, city, region, country, loc, org, postal, timezone)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(insert, [
      userId,
      ip,
      hostname,
      city,
      region,
      country,
      loc,
      org,
      postal,
      timezone
    ], function (err) {
      if (err) return res.status(500).json({ error: 'Failed to save history' });

      // Return the saved entry with DB id
      res.json({
        id: this.lastID,
        ip,
        hostname,
        city,
        region,
        country,
        loc,
        org,
        postal,
        timezone
      });
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch IP data' });
  }
}


export function getSearchHistory(req, res) {
  const userId = req.user.id;

  const query = `
    SELECT id, ip, hostname, city, region, country, org, postal, timezone
    FROM history
    WHERE user_id = ?
    ORDER BY id DESC
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to load history' });
    res.json(rows);
  });
}

export function clearSearchHistory(req, res) {
  const userId = req.user.id;

  db.run('DELETE FROM history WHERE user_id = ?', [userId], function (err) {
    if (err) return res.status(500).json({ error: 'Failed to clear history' });
    res.json({ message: 'Search history cleared' });
  });
}

export function deleteMultipleHistory(req, res) {
  const userId = req.user.id;
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'No IDs provided' });
  }

  const placeholders = ids.map(() => '?').join(',');
  const query = `DELETE FROM history WHERE user_id = ? AND id IN (${placeholders})`;

  db.run(query, [userId, ...ids], function (err) {
    if (err) return res.status(500).json({ error: 'Failed to delete selected items' });
    res.json({ message: 'Selected history deleted' });
  });
}