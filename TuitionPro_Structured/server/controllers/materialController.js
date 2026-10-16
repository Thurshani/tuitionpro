import fs from 'node:fs/promises';
import path from 'node:path';
import { query } from '../configs/db.js';
import { uploads } from '../configs/upload.js';
import * as valid from '../utils/validation.js';
import { httpError as fail, validate as must } from '../utils/httpError.js';
import { allowedClass } from '../services/accessService.js';
import Material from '../models/Material.js';

export const uploadMaterial = async (req, res) => {
  try {
    must(req.file, 'Choose a file');
    await allowedClass(req, req.body.class_id);
    must(valid.text(req.body.name, 1, 150), 'Enter a title');
    const header = await fs.open(req.file.path);
    let bytes = Buffer.alloc(16);
    try {
      await header.read(bytes, 0, 16, 0);
    } finally {
      await header.close();
    }
    const ext = path.extname(req.file.filename);
    must(
      ext === '.pdf'
        ? bytes.subarray(0, 5).toString() === '%PDF-'
        : ext === '.mp4'
          ? bytes.subarray(4, 8).toString() === 'ftyp'
          : bytes.subarray(0, 4).toString('hex') === '1a45dfa3',
      'File content does not match PDF/video type',
    );
    let mime = ext === '.pdf' ? 'application/pdf' : ext === '.mp4' ? 'video/mp4' : 'video/webm';
    let r = await query(
      'INSERT INTO materials(class_id,name,type,filename,original_name,mime) VALUES(?,?,?,?,?,?)',
      [
        req.body.class_id,
        req.body.name,
        ext === '.pdf' ? 'PDF' : 'Video',
        req.file.filename,
        req.file.originalname,
        mime,
      ],
    );
    res.status(201).json({ id: r.insertId });
  } catch (e) {
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    throw e;
  }
};
export const downloadMaterial = async (req, res) => {
  const m = await Material.findById(req.params.id);
  if (!m) throw fail('Material not found', 404);
  await allowedClass(req, m.class_id);
  res.set('Content-Type', m.mime);
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('Content-Disposition', `inline; filename*=UTF-8''${encodeURIComponent(m.original_name)}`);
  res.sendFile(path.join(uploads, m.filename));
};
export const deleteMaterial = async (req, res) => {
  const m = await Material.findById(req.params.id);
  if (!m) throw fail('Material not found', 404);
  await allowedClass(req, m.class_id);
  await Material.remove(m.id);
  await fs.unlink(path.join(uploads, m.filename)).catch(() => {});
  res.json({ ok: true });
};
