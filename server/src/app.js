import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { checkDatabase } from './config/database.js';
import authRoutes from './routes/auth.js';
import overviewRoutes from './routes/overview.js';
import resourceRoutes from './routes/resources.js';
import { errorHandler, notFound } from './middleware/errors.js';

const app = express();
const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: origins, methods: ['GET', 'POST', 'PATCH', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', async (req, res) => {
  try {
    await checkDatabase();
    return res.json({ success: true, status: 'ok', database: 'connected' });
  } catch {
    return res.status(503).json({ success: false, status: 'degraded', database: 'unavailable' });
  }
});

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false, message: { success: false, error: 'Too many login attempts. Try again in 15 minutes.' } });
app.use('/api/v1/auth/login', loginLimiter);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', overviewRoutes);
app.use('/api/v1', resourceRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
