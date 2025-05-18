import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'AYWAYWAYWAYW';

export function verifyToken(token: string) {
  try {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

export function getUserRoleFromRequest(req: Request): string | null {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) return null;
  const payload = verifyToken(authHeader as string);
  if (payload && typeof payload === 'object' && 'role' in payload) {
    return payload['role'];
  }
  return null;
}
