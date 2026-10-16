import 'dotenv/config';
import mysql from 'mysql2/promise';
import fs from 'node:fs/promises';
import bcrypt from 'bcryptjs';
const name = process.env.DB_NAME || 'tuitionpro';
if (!/^[a-zA-Z0-9_]+$/.test(name)) throw Error('Invalid DB_NAME');
const db = await mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true,
});
try {
  await db.query(
    `CREATE DATABASE IF NOT EXISTS \`${name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; USE \`${name}\`;`,
  );
  await db.query(await fs.readFile(new URL('./schema.sql', import.meta.url), 'utf8'));
  const [rows] = await db.execute('SELECT COUNT(*) n FROM users');
  if (rows[0].n) {
    console.log('Database exists; existing data retained.');
  } else {
    await db.beginTransaction();
    const hash = await bcrypt.hash('Demo1234!', 12);
    for (const [id, n, e, r, p, sub] of [
      [1, 'Institute Admin', 'admin@tuitionpro.local', 'admin', '', ''],
      [2, 'Nilo Nilokshana', 'teacher@tuitionpro.local', 'teacher', '0775551200', 'Mathematics'],
      [3, 'Arun Sivakumar', 'student@tuitionpro.local', 'student', '', ''],
      [4, 'Kavindi Perera', 'kavindi@tuitionpro.local', 'student', '', ''],
      [5, 'Nethmi Fernando', 'nethmi@tuitionpro.local', 'student', '', ''],
      [6, 'Tharushi Silva', 'tharushi@tuitionpro.local', 'student', '', ''],
      [7, 'Dilshan Jayasuriya', 'dilshan@tuitionpro.local', 'student', '', ''],
      [8, 'Shalini Rajan', 'shalini@tuitionpro.local', 'student', '', ''],
    ])
      await db.execute(
        'INSERT INTO users(id,name,email,password_hash,role,phone,subject) VALUES(?,?,?,?,?,?,?)',
        [id, n, e, hash, r, p, sub],
      );
    await db.query(
      "INSERT INTO classes(id,name,schedule,fee,teacher_id) VALUES (1,'Grade 10 · Mathematics','Wednesday · 3:30–5:30 PM',2000,2),(2,'Grade 11 · Mathematics','Wednesday · 6:00–8:00 PM',2500,2),(3,'A/L · Combined Maths','Saturday · 9:00–12:00 PM',3000,2)",
    );
    for (const [id, uid, cls] of [
      [1, 4, 1],
      [2, 3, 1],
      [3, 5, 2],
      [4, 6, 1],
      [5, 7, 3],
      [6, 8, 2],
    ]) {
      await db.execute('INSERT INTO students(id,user_id,class_id,parent_phone) VALUES(?,?,?,?)', [
        id,
        uid,
        cls,
        '0771234567',
      ]);
      for (const date of ['2026-10-07', '2026-10-14'])
        await db.execute('INSERT INTO attendance VALUES(?,?,?,?)', [id, cls, date, id !== 4]);
    }
    await db.query(
      "INSERT INTO payments(student_id,month,amount) VALUES(1,'2026-10',2000),(3,'2026-10',2500),(5,'2026-10',3000)",
    );
    await db.commit();
    console.log(
      'Database and sample accounts created. Password for all sample accounts: Demo1234!',
    );
  }
} catch (e) {
  await db.rollback();
  throw e;
} finally {
  await db.end();
}
