import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export default async function authUser(req, res, next) {
  try {
    const token = req.headers.authorization?.replace(/^Bearer /, '');
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ error: 'Account not found' });
    req.user = user;
    next();
  } catch (error) {
    if (error.code?.startsWith('ER_') || error.code === 'ECONNREFUSED') return next(error);
    res.status(401).json({ error: 'Login required or session expired' });
  }
}
