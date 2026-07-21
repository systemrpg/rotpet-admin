/**
 * Cliente PostgreSQL directo para desarrollo local con Docker.
 * Solo se activa cuando USE_LOCAL_DB=true y DATABASE_URL está configurada.
 */
import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPool(): Pool {
    if (!pool) {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
            throw new Error('DATABASE_URL no está configurada');
        }
        pool = new Pool({
            connectionString,
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
        });

        pool.on('error', (err) => {
            console.error('Error inesperado en el pool de PostgreSQL:', err);
        });
    }
    return pool;
}

export function isLocalDb(): boolean {
    return process.env.USE_LOCAL_DB === 'true' && !!process.env.DATABASE_URL;
}
