import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME?.trim() || 'Hospital Administrator';

if (!email || !password || password.length < 12) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env. The password must be at least 12 characters.');
  process.exit(1);
}

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hospital_db',
});

try {
  const passwordHash = await bcrypt.hash(password, 12);
  await connection.execute(
    'INSERT INTO users (public_id, name, email, password_hash, role, department) VALUES (?, ?, ?, ?, ?, ?)',
    [`USR-${randomUUID().slice(0, 8).toUpperCase()}`, name, email, passwordHash, 'admin', 'Administration'],
  );
  console.log(`Administrator account created for ${email}.`);
} catch (error) {
  console.error('Administrator creation failed:', error.code === 'ER_DUP_ENTRY' ? 'That email already has an account.' : error.message);
  process.exitCode = 1;
} finally {
  await connection.end();
}
