import { randomBytes, scryptSync, timingSafeEqual, createHmac } from 'crypto';
import { getPool } from './pg-client';

const TOKEN_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || 'local-dev-secret';

export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
    const [salt, hash] = stored.split(':');
    if (!salt || !hash) return false;
    const candidate = scryptSync(password, salt, 64);
    return timingSafeEqual(Buffer.from(hash, 'hex'), candidate);
}

export function createLocalToken(userId: string, email: string): string {
    const payload = JSON.stringify({ sub: userId, email, iat: Date.now() });
    const encoded = Buffer.from(payload).toString('base64url');
    const sig = createHmac('sha256', TOKEN_SECRET).update(encoded).digest('base64url');
    return `${encoded}.${sig}`;
}

export function verifyLocalToken(token: string): { sub: string; email: string } | null {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [encoded, sig] = parts;
    const expected = createHmac('sha256', TOKEN_SECRET).update(encoded).digest('base64url');
    if (sig !== expected) return null;
    try {
        return JSON.parse(Buffer.from(encoded, 'base64url').toString());
    } catch {
        return null;
    }
}

export async function ensurePasswordColumn(): Promise<void> {
    const pool = getPool();
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT');
}
