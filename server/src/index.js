import 'dotenv/config';
import app from './app.js';
import { pool } from './config/database.js';

const port = Number(process.env.PORT || 5000);
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Meridian API listening on http://localhost:${port}`);
  if (process.env.NODE_ENV !== 'production' && process.env.ALLOW_DEMO_ACCESS === 'true') {
    console.warn('Development demo access is enabled. Disable it before deployment.');
  }
});

async function shutdown(signal) {
  console.log(`${signal} received. Closing API server.`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
