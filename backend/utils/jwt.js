import jwt from 'jsonwebtoken';

export function generateAccessToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}
