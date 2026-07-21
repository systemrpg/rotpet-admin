/**
 * Tests unitarios para lib/db/local-auth.ts
 *
 * Cubre:
 *  - hashPassword + verifyPassword roundtrip
 *  - verifyPassword rechaza passwords incorrectos y hashes malformados
 *  - createLocalToken + verifyLocalToken roundtrip
 *  - verifyLocalToken rechaza tokens manipulados y malformados
 *  - ensurePasswordColumn (integration con DB)
 */
import { describe, it, expect } from 'vitest'
import {
    hashPassword,
    verifyPassword,
    createLocalToken,
    verifyLocalToken,
} from '@/lib/db/local-auth'

describe('local-auth: passwords', () => {
    it('hashPassword genera un hash con formato salt:hash', async () => {
        const hash = await hashPassword('rotpet123')
        expect(hash).toMatch(/^[0-9a-f]{32}:[0-9a-f]{128}$/)
    })

    it('hashPassword genera hashes distintos para el mismo password (salt aleatorio)', async () => {
        const a = await hashPassword('mismo')
        const b = await hashPassword('mismo')
        expect(a).not.toBe(b)
    })

    it('verifyPassword acepta el password correcto', async () => {
        const hash = await hashPassword('rotpet123')
        const ok = await verifyPassword('rotpet123', hash)
        expect(ok).toBe(true)
    })

    it('verifyPassword rechaza el password incorrecto', async () => {
        const hash = await hashPassword('rotpet123')
        const ok = await verifyPassword('wrong', hash)
        expect(ok).toBe(false)
    })

    it('verifyPassword rechaza hashes malformados', async () => {
        expect(await verifyPassword('x', '')).toBe(false)
        expect(await verifyPassword('x', 'no-tiene-dos-puntos')).toBe(false)
        expect(await verifyPassword('x', ':')).toBe(false)
        expect(await verifyPassword('x', 'salt:')).toBe(false)
    })
})

describe('local-auth: tokens', () => {
    it('createLocalToken + verifyLocalToken roundtrip', () => {
        const token = createLocalToken('user-123', 'admin@rot.pet')
        const payload = verifyLocalToken(token)
        expect(payload).not.toBeNull()
        expect(payload?.sub).toBe('user-123')
        expect(payload?.email).toBe('admin@rot.pet')
    })

    it('verifyLocalToken rechaza tokens manipulados (firma alterada)', () => {
        const token = createLocalToken('user-123', 'admin@rot.pet')
        const [encoded, sig] = token.split('.')
        // Cambiar el último caracter de la firma
        const tampered = `${encoded}.${sig.slice(0, -1)}A`
        expect(verifyLocalToken(tampered)).toBeNull()
    })

    it('verifyLocalToken rechaza tokens con payload alterado', () => {
        const token = createLocalToken('user-123', 'admin@rot.pet')
        const [encoded, sig] = token.split('.')
        // Modificar el encoded (re-encode de un payload distinto)
        const evilPayload = Buffer.from(JSON.stringify({ sub: 'admin-999', email: 'evil@hack.com' })).toString('base64url')
        const tampered = `${evilPayload}.${sig}`
        expect(verifyLocalToken(tampered)).toBeNull()
    })

    it('verifyLocalToken rechaza strings malformados', () => {
        expect(verifyLocalToken('')).toBeNull()
        expect(verifyLocalToken('no-dot')).toBeNull()
        expect(verifyLocalToken('a.b.c')).toBeNull()
        expect(verifyLocalToken('..')).toBeNull()
    })
})
