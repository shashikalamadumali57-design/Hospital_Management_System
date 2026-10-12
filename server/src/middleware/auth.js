import 'dotenv/config';
import jwt from 'jsonwebtoken';

const demoAccessEnabled = process.env.NODE_ENV !== 'production' && process.env.ALLOW_DEMO_ACCESS === 'true';

export function requireAuth(req, res, next) {
  const authorization = req.get('authorization');
  if (!authorization?.startsWith('Bearer ')) {
    if (demoAccessEnabled) {
      req.user = { id: null, name: 'Local demo administrator', role: 'admin' };
      return next();
    }
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }

  try {
    req.user = jwt.verify(authorization.slice(7), process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ success: false, error: 'Session is invalid or expired.' });
  }
}

export function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'You do not have permission to perform this action.' });
    }
    return next();
  };
}
