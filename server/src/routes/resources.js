import { randomBytes } from 'node:crypto';
import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../config/database.js';
import { allowRoles, requireAuth } from '../middleware/auth.js';
import { resources, validResourceNames } from '../data/resources.js';

const router = Router();
const identifier = /^[A-Za-z_][A-Za-z0-9_]*$/;

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function loadResource(req, res, next) {
  if (!validResourceNames.includes(req.params.resource)) {
    return res.status(404).json({ success: false, error: 'Resource not found.' });
  }
  req.resource = resources[req.params.resource];
  return next();
}

function canAccess(action) {
  return (req, res, next) => {
    const roles = req.resource[action];
    return allowRoles(...roles)(req, res, next);
  };
}

function quoteIdentifier(value) {
  if (!identifier.test(value)) throw new Error('Invalid SQL identifier in resource configuration.');
  return `\`${value}\``;
}

function selectClause(resource) {
  return Object.entries(resource.select)
    .map(([alias, expression]) => `${expression} AS ${quoteIdentifier(alias)}`)
    .join(', ');
}

function validationSchema(resource, partial = false, includePatientId = false) {
  const shape = Object.fromEntries(Object.entries(resource.create).map(([key, [column, type, required]]) => {
    let value = type === 'number'
      ? z.coerce.number().finite().nonnegative()
      : type === 'date'
        ? partial
          ? z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format.'), z.literal('')]).transform((value) => value || null)
          : z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format.')
        : type === 'datetime'
          ? z.string().min(10).max(32)
          : z.string().trim().min(1).max(255);
    if (partial || !required) value = value.optional();
    return [key, value];
  }));
  if (includePatientId && resource.table === 'patients') {
    shape.patientId = z.string().trim().min(1).max(32).regex(/^(?:PT-[A-Za-z0-9-]+|[0-9]{6,32})$/, 'Use a PT- ID or a numeric ID with 6 to 32 digits.').optional();
  }
  return z.object(shape).strict();
}

function publicId(prefix) {
  const day = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  return `${prefix}-${day}-${randomBytes(3).toString('hex').toUpperCase()}`;
}

router.use('/:resource', requireAuth, loadResource);

router.get('/:resource', canAccess('read'), asyncRoute(async (req, res) => {
  const { resource } = req;
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const pageSize = Math.min(100, Math.max(1, Number.parseInt(req.query.pageSize, 10) || 50));
  const offset = (page - 1) * pageSize;
  const clauses = [];
  const values = [];

  if (typeof req.query.q === 'string' && req.query.q.trim()) {
    const searchable = req.query.q.trim().slice(0, 100);
    clauses.push(`(${resource.search.map((column) => `${quoteIdentifier(column)} LIKE ?`).join(' OR ')})`);
    values.push(...resource.search.map(() => `%${searchable}%`));
  }
  if (typeof req.query.status === 'string' && req.query.status.trim() && resource.select.status) {
    clauses.push('`status` = ?');
    values.push(req.query.status.trim().slice(0, 40));
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const [rows] = await pool.execute(
    `SELECT ${selectClause(resource)} FROM ${quoteIdentifier(resource.table)} ${where} ORDER BY ${quoteIdentifier(resource.order)} DESC LIMIT ? OFFSET ?`,
    [...values, pageSize, offset],
  );
  const [[{ total }]] = await pool.execute(
    `SELECT COUNT(*) AS total FROM ${quoteIdentifier(resource.table)} ${where}`,
    values,
  );
  return res.json({ success: true, data: rows, pagination: { page, pageSize, total: Number(total), pages: Math.ceil(Number(total) / pageSize) } });
}));

router.get('/:resource/:id', canAccess('read'), asyncRoute(async (req, res) => {
  const [rows] = await pool.execute(
    `SELECT ${selectClause(req.resource)} FROM ${quoteIdentifier(req.resource.table)} WHERE public_id = ? LIMIT 1`,
    [req.params.id],
  );
  if (!rows.length) return res.status(404).json({ success: false, error: 'Record not found.' });
  return res.json({ success: true, data: rows[0] });
}));

router.post('/:resource', canAccess('write'), asyncRoute(async (req, res) => {
  const { resource } = req;
  const input = validationSchema(resource, false, true).parse(req.body);
  const requestedId = resource.table === 'patients' ? input.patientId : undefined;
  if (requestedId) delete input.patientId;
  const entries = Object.entries(input).filter(([key, value]) => value !== undefined && resource.create[key]);
  const columns = ['public_id', ...entries.map(([key]) => resource.create[key][0])];
  const values = [requestedId || publicId(resource.prefix), ...entries.map(([, value]) => value)];
  const placeholders = columns.map(() => '?').join(', ');
  await pool.execute(
    `INSERT INTO ${quoteIdentifier(resource.table)} (${columns.map(quoteIdentifier).join(', ')}) VALUES (${placeholders})`,
    values,
  );
  const [rows] = await pool.execute(
    `SELECT ${selectClause(resource)} FROM ${quoteIdentifier(resource.table)} WHERE public_id = ? LIMIT 1`,
    [values[0]],
  );
  return res.status(201).json({ success: true, data: rows[0] });
}));

router.patch('/:resource/:id', canAccess('write'), asyncRoute(async (req, res) => {
  const { resource } = req;
  const input = validationSchema(resource, true, true).parse(req.body);
  const requestedId = resource.table === 'patients' ? input.patientId : undefined;
  if (requestedId !== undefined) delete input.patientId;
  const entries = Object.entries(input).filter(([, value]) => value !== undefined);
  if (!entries.length && requestedId === undefined) return res.status(400).json({ success: false, error: 'Provide at least one field to update.' });
  const assignments = [
    ...(requestedId === undefined ? [] : [`${quoteIdentifier('public_id')} = ?`]),
    ...entries.map(([key]) => `${quoteIdentifier(resource.create[key][0])} = ?`),
  ].join(', ');
  await pool.execute(
    `UPDATE ${quoteIdentifier(resource.table)} SET ${assignments} WHERE public_id = ?`,
    [...(requestedId === undefined ? [] : [requestedId]), ...entries.map(([, value]) => value), req.params.id],
  );
  const [rows] = await pool.execute(
    `SELECT ${selectClause(resource)} FROM ${quoteIdentifier(resource.table)} WHERE public_id = ? LIMIT 1`,
    [requestedId ?? req.params.id],
  );
  if (!rows.length) return res.status(404).json({ success: false, error: 'Record not found.' });
  return res.json({ success: true, data: rows[0] });
}));

export default router;
