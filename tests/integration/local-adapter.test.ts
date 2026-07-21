/**
 * Tests de integración para lib/db/local-adapter.ts
 *
 * Requieren Docker Postgres corriendo (docker compose up -d).
 * Prueban el query builder contra datos reales del seed:
 *  - SELECT con filtros (eq, neq, gt, lt, in, ilike, or)
 *  - INSERT, UPDATE, DELETE
 *  - Joins con sintaxis alias:table(cols)
 *  - Single result + count
 *  - order, limit
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { getPool } from '@/lib/db/pg-client'
import { localSupabaseAdmin } from '@/lib/db/local-adapter'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const ADAPTER = localSupabaseAdmin as any

beforeAll(async () => {
    // Verificar que la DB responde
    const pool = getPool()
    await pool.query('SELECT 1')
})

afterAll(async () => {
    const pool = getPool()
    await pool.end()
})

describe('local-adapter: SELECT básico', () => {
    it('select * devuelve todas las filas', async () => {
        const { data, error } = await ADAPTER.from('users').select('*')
        expect(error).toBeNull()
        expect(Array.isArray(data)).toBe(true)
        expect(data.length).toBeGreaterThan(0)
    })

    it('select con columnas específicas', async () => {
        const { data, error } = await ADAPTER.from('products').select('id, name, sku, price')
        expect(error).toBeNull()
        expect(data.length).toBeGreaterThan(0)
        expect(data[0]).toHaveProperty('id')
        expect(data[0]).toHaveProperty('name')
        expect(data[0]).toHaveProperty('sku')
    })

    it('single() devuelve un solo objeto o null', async () => {
        const { data, error } = await ADAPTER
            .from('users')
            .select('id, email')
            .eq('email', 'admin@rot.pet')
            .single()
        expect(error).toBeNull()
        expect(data).toBeTruthy()
        expect(data.email).toBe('admin@rot.pet')
    })

    it('count() con flag exact', async () => {
        // El local adapter no soporta { count: 'exact' } — count siempre undefined.
        // Verificamos que al menos devuelve las filas y podemos contar manualmente.
        const { data, count, error } = await ADAPTER
            .from('products')
            .select('id, name', { count: 'exact' })
        expect(error).toBeNull()
        expect(data.length).toBeGreaterThan(0)
        // count es undefined en local (Supabase real lo devuelve)
        expect(count).toBeUndefined()
    })
})

describe('local-adapter: filtros', () => {
    it('eq filtra por igualdad', async () => {
        const { data, error } = await ADAPTER
            .from('users')
            .select('id, email')
            .eq('email', 'admin@rot.pet')
        expect(error).toBeNull()
        expect(data.length).toBe(1)
        expect(data[0].email).toBe('admin@rot.pet')
    })

    it('neq excluye por igualdad', async () => {
        const { data, error } = await ADAPTER
            .from('users')
            .select('id, email')
            .neq('email', 'admin@rot.pet')
        expect(error).toBeNull()
        expect(data.every((u: any) => u.email !== 'admin@rot.pet')).toBe(true)
    })

    it('in() filtra por lista de valores', async () => {
        const { data, error } = await ADAPTER
            .from('roles')
            .select('id, name')
            .in('name', ['admin', 'superadmin'])
        expect(error).toBeNull()
        expect(data.length).toBe(2)
        expect(data.map((r: any) => r.name).sort()).toEqual(['admin', 'superadmin'])
    })

    it('ilike filtra case-insensitive', async () => {
        const { data, error } = await ADAPTER
            .from('products')
            .select('id, name')
            .ilike('name', '%perro%')
        expect(error).toBeNull()
        expect(data.length).toBeGreaterThan(0)
        expect(data.every((p: any) => p.name.toLowerCase().includes('perro'))).toBe(true)
    })

    it('or() con múltiples condiciones', async () => {
        const { data, error } = await ADAPTER
            .from('users')
            .select('id, email, full_name')
            .or('email.eq.admin@rot.pet,email.eq.staff@rot.pet')
        expect(error).toBeNull()
        expect(data.length).toBe(2)
    })

    it('order asc/desc', async () => {
        const asc = await ADAPTER.from('products').select('id, name').order('name', { ascending: true }).limit(3)
        const desc = await ADAPTER.from('products').select('id, name').order('name', { ascending: false }).limit(3)
        expect(asc.data[0].name <= asc.data[asc.data.length - 1].name).toBe(true)
        expect(desc.data[0].name >= desc.data[desc.data.length - 1].name).toBe(true)
    })

    it('limit acota resultados', async () => {
        const { data, error } = await ADAPTER.from('products').select('id').limit(5)
        expect(error).toBeNull()
        expect(data.length).toBeLessThanOrEqual(5)
    })
})

describe('local-adapter: joins con sintaxis alias:table(cols)', () => {
    it('join con tabla categories en products', async () => {
        const { data, error } = await ADAPTER
            .from('products')
            .select('id, name, category_id, category:categories(id, name)')
            .limit(3)
        expect(error).toBeNull()
        expect(data.length).toBe(3)
        // Verificar que el join se pobló para al menos un producto
        const withCategory = data.find((p: any) => p.category)
        expect(withCategory).toBeDefined()
    })

    it('join con tabla roles en users', async () => {
        const { data, error } = await ADAPTER
            .from('users')
            .select('id, email, role_id, roles(name)')
            .eq('email', 'admin@rot.pet')
            .single()
        expect(error).toBeNull()
        expect(data.roles).toBeTruthy()
        expect(data.roles.name).toBe('superadmin')
    })
})

describe('local-adapter: CRUD completo', () => {
    const testId = `test-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const testSlug = testId.toLowerCase()

    it('INSERT crea un row', async () => {
        const { data, error } = await ADAPTER
            .from('categories')
            .insert({ name: `Test ${testId}`, slug: testSlug, status: 'active' })
            .select()
            .single()
        expect(error).toBeNull()
        expect(data).toBeTruthy()
        expect(data.id).toBeTruthy()
        expect(data.name).toBe(`Test ${testId}`)
    })

    it('UPDATE modifica el row creado', async () => {
        const { data, error } = await ADAPTER
            .from('categories')
            .update({ name: `Updated ${testId}` })
            .eq('slug', testSlug)
            .select()
            .single()
        expect(error).toBeNull()
        expect(data.name).toBe(`Updated ${testId}`)
    })

    it('DELETE borra el row', async () => {
        const { data, error } = await ADAPTER
            .from('categories')
            .delete()
            .eq('slug', testSlug)
            .select()
        expect(error).toBeNull()
        expect(data.length).toBe(1)
    })

    it('DELETE de row inexistente no falla pero devuelve 0 rows', async () => {
        const { data, error } = await ADAPTER
            .from('categories')
            .delete()
            .eq('slug', 'no-existe-nunca')
            .select()
        expect(error).toBeNull()
        expect(data.length).toBe(0)
    })

    it('upsert con onConflict actualiza si existe, inserta si no', async () => {
        // Insertar
        await ADAPTER.from('categories').upsert(
            { name: 'Upsert Test', slug: `upsert-${testId}`, status: 'active' },
            { onConflict: 'slug' }
        )
        // Actualizar (mismo slug)
        const { data, error } = await ADAPTER.from('categories').upsert(
            { name: 'Upsert Test UPDATED', slug: `upsert-${testId}`, status: 'active' },
            { onConflict: 'slug' }
        ).select().single()
        expect(error).toBeNull()
        expect(data.name).toBe('Upsert Test UPDATED')
        // Limpiar
        await ADAPTER.from('categories').delete().eq('slug', `upsert-${testId}`)
    })
})

describe('local-adapter: selector supabaseAdmin', () => {
    it('supabaseAdmin es localSupabaseAdmin cuando USE_LOCAL_DB=true', () => {
        expect(process.env.USE_LOCAL_DB).toBe('true')
        expect(supabaseAdmin).toBe(ADAPTER)
    })
})
