export function notFound(req, res) {
  res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.path}` });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ success: false, error: 'A record with this identifier already exists.' });
  }
  if (error.code === 'ECONNREFUSED' || error.code === 'PROTOCOL_CONNECTION_LOST' || error.code === 'ER_BAD_DB_ERROR') {
    return res.status(503).json({ success: false, error: 'Database is unavailable. Check the MySQL service and server/.env settings.' });
  }
  if (error.name === 'ZodError') {
    return res.status(400).json({ success: false, error: 'Please check the submitted fields.', details: error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message })) });
  }
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ success: false, error: 'Request body is too large.' });
  }

  console.error(error);
  return res.status(500).json({ success: false, error: 'An unexpected server error occurred.' });
}
