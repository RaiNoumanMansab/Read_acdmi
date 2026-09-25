import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET || 'read_academy_secret_jwt_key_sahiwal_2026', (err, decoded) => {
      if (err) {
        res.status(403).json({ status: 'error', message: 'Forbidden: Invalid or expired token' });
        return;
      }

      req.user = decoded as { userId: string; email: string; role: string };
      next();
    });
  } else {
    res.status(401).json({ status: 'error', message: 'Unauthorized: No token provided' });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'Unauthorized' });
      return;
    }

    if (!allowedRoles.map(r => r.toUpperCase()).includes(req.user.role.toUpperCase())) {
      res.status(403).json({
        status: 'error',
        message: `Forbidden: Requires one of [${allowedRoles.join(', ')}] permissions`,
      });
      return;
    }

    next();
  };
};
