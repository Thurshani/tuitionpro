import { httpError } from '../utils/httpError.js';
export default function requireRole(...roles) {
  return (req, res, next) =>
    roles.includes(req.user.role) ? next() : next(httpError('You do not have permission', 403));
}
