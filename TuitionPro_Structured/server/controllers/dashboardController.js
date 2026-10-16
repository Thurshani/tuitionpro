import { getDashboardState } from '../models/Dashboard.js';
import * as valid from '../utils/validation.js';
import { validate } from '../utils/httpError.js';

export async function getState(req, res) {
  const month = req.query.month || new Date().toISOString().slice(0, 7);
  validate(valid.month(month), 'Invalid month');
  res.json(await getDashboardState(req.user, month));
}
