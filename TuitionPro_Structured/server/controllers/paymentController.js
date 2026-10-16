import * as valid from '../utils/validation.js';
import { validate as must } from '../utils/httpError.js';
import { allowedClass, allowedStudent } from '../services/accessService.js';
import Payment from '../models/Payment.js';

export const updatePayment = async (req, res) => {
  let s = await allowedStudent(req, req.params.id),
    mo = req.body.month;
  must(valid.month(mo) && typeof req.body.paid === 'boolean', 'Invalid payment details');
  if (req.body.paid) {
    let c = await allowedClass(req, s.class_id);
    await Payment.markPaid(s.id, mo, c.fee);
  } else await Payment.remove(s.id, mo);
  res.json({ ok: true });
};
