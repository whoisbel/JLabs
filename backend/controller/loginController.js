import db from '../db.js';
import { generateAccessToken } from '../utils/jwt.js';

export default function loginController(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  db.get(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, user) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });

      const token = generateAccessToken({ id: user.id, username: user.username });
      res.json({ message: 'Login successful', token });
    }
  );
}
