import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { pool } from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const loginSchema = z.object({ email: z.string().email().max(190), password: z.string().min(1).max(200) }).strict();
const profileSchema = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(190),
  department: z.string().trim().max(100).optional().nullable(),
}).strict();

function publicUser(user) {
  return { id: user.public_id, name: user.name, email: user.email, role: user.role, department: user.department };
}

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const [users] = await pool.execute(
      'SELECT public_id, name, email, password_hash, role, department, status FROM users WHERE email = ? LIMIT 1',
      [email.toLowerCase()],
    );
    const user = users[0];
    if (!user || user.status !== 'Active' || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ success: false, error: 'Email or password is incorrect.' });
    }

    const payload = { id: user.public_id, name: user.name, email: user.email, role: user.role, department: user.department };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });
    await pool.execute('UPDATE users SET last_login = NOW() WHERE public_id = ?', [user.public_id]);
    return res.json({ success: true, data: { token, user: payload } });
  } catch (error) {
    return next(error);
  }
});

router.get('/me', requireAuth, async (req, res, next) => {
  if (!req.user.id) return res.json({ success: true, data: req.user });
  try {
    const [users] = await pool.execute(
      "SELECT public_id, name, email, role, department FROM users WHERE public_id = ? AND status = 'Active' LIMIT 1",
      [req.user.id],
    );
    if (!users[0]) return res.status(401).json({ success: false, error: 'This account is unavailable.' });
    return res.json({ success: true, data: publicUser(users[0]) });
  } catch (error) {
    return next(error);
  }
});

router.patch('/me', requireAuth, async (req, res, next) => {
  if (!req.user.id) return res.status(403).json({ success: false, error: 'Profile changes are unavailable in local demo mode.' });
  try {
    const profile = profileSchema.parse(req.body);
    const email = profile.email.toLowerCase();
    await pool.execute(
      "UPDATE users SET name = ?, email = ?, department = ? WHERE public_id = ? AND status = 'Active'",
      [profile.name, email, profile.department || null, req.user.id],
    );
    const [users] = await pool.execute(
      "SELECT public_id, name, email, role, department FROM users WHERE public_id = ? AND status = 'Active' LIMIT 1",
      [req.user.id],
    );
    if (!users[0]) return res.status(401).json({ success: false, error: 'This account is unavailable.' });
    const user = publicUser(users[0]);
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });
    return res.json({ success: true, data: { token, user } });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, error: 'That email address is already used by another account.' });
    }
    return next(error);
  }
});

export default router;
