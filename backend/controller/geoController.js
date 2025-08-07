import prisma from '../db.js';
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
      timezone = null,
    } = data;

    const historyEntry = await prisma.history.create({
      data: {
        user_id: userId,
        ip,
        hostname,
        city,
        region,
        country,
        loc,
        org,
        postal,
        timezone,
      },
    });

    res.json(historyEntry);
  } catch (err) {
    console.error('Geo fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch IP data' });
  }
}

export async function getSearchHistory(req, res) {
  const userId = req.user.id;

  try {
    const history = await prisma.history.findMany({
      where: { user_id: userId },
      orderBy: { id: 'desc' },
      select: {
        id: true,
        ip: true,
        hostname: true,
        city: true,
        region: true,
        country: true,
        org: true,
        postal: true,
        timezone: true,
      },
    });

    res.json(history);
  } catch (err) {
    console.error('Fetch history error:', err);
    res.status(500).json({ error: 'Failed to load history' });
  }
}

export async function deleteMultipleHistory(req, res) {
  const userId = req.user.id;
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'No IDs provided' });
  }

  try {
    await prisma.history.deleteMany({
      where: {
        user_id: userId,
        id: { in: ids },
      },
    });

    res.json({ message: 'Selected history deleted' });
  } catch (err) {
    console.error('Delete selected error:', err);
    res.status(500).json({ error: 'Failed to delete selected items' });
  }
}
