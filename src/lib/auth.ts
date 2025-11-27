import { SESSION_SECRET } from './config';
import { UserId } from './types';

export function validateToken(token: string | null): UserId | null {
  if (!token) return null;
  
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId, secret] = decoded.split(':');
    
    if (secret !== SESSION_SECRET) return null;
    if (userId !== 'a' && userId !== 'b') return null;
    
    return userId as UserId;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

