import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';

const schemaPath = fileURLToPath(new URL('../database/schema.sql', import.meta.url));
const connection = await mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true,
});

try {
  const schema = await readFile(schemaPath, 'utf8');
  await connection.query(schema);
  console.log(`Database schema and sample records installed in ${process.env.DB_NAME || 'hospital_db'}.`);
} catch (error) {
  console.error('Database setup failed:', error.message);
  process.exitCode = 1;
} finally {
  await connection.end();
}
