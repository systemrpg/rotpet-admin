// Setup global para vitest
// Carga variables de entorno de .env.local antes que cualquier módulo
import { config } from 'dotenv'
import path from 'node:path'

// Solo cargar .env.local si existe (no falla si no)
try {
    config({ path: path.resolve(process.cwd(), '.env.local') })
} catch {
    // ignore
}

// Polyfill de fetch (Node 18+ lo tiene, pero por seguridad)
if (typeof globalThis.fetch === 'undefined') {
    // @ts-ignore
    globalThis.fetch = (...args: any[]) => import('node-fetch').then(({ default: f }) => f(...args))
}
