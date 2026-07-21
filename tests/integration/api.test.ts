/**
 * Tests de integración para API routes
 *
 * Requieren:
 *  - Docker Postgres corriendo (docker compose up -d)
 *  - Dev server corriendo en http://localhost:3000 (pnpm dev)
 *
 * Prueban los endpoints más importantes end-to-end:
 *  - /api/health
 *  - /api/auth/login + /api/auth/me + /api/auth/logout
 *  - /api/products (list, filter, create via fixture)
 *  - /api/categories (CRUD completo)
 *  - /api/coupons/validate (lógica de descuento)
 *  - /api/dashboard/stats
 *  - /api/orders (list con join)
 */
import { describe, it, expect, beforeAll } from 'vitest'

const BASE = process.env.TEST_BASE_URL || 'http://localhost:3000'

let authToken: string | null = null

beforeAll(async () => {
    // Login como admin (en dev local el primer login setea password automático)
    const res = await fetch(`${BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@rot.pet', password: 'rotpet123' }),
    })
    if (!res.ok) {
        throw new Error(`Setup failed: cannot login (${res.status})`)
    }
    const data = await res.json()
    authToken = data?.session?.access_token
    if (!authToken) {
        throw new Error('Setup failed: no token returned')
    }
})

describe('API: /api/health', () => {
    it('devuelve 200 con mode local-postgres', async () => {
        const res = await fetch(`${BASE}/api/health`)
        expect(res.status).toBe(200)
        const json = await res.json()
        expect(json.success).toBe(true)
        expect(json.mode).toBe('local-postgres')
        expect(json.db.users_count).toBeGreaterThan(0)
    })
})

describe('API: /api/auth', () => {
    it('POST /api/auth/login con credenciales inválidas devuelve 401', async () => {
        const res = await fetch(`${BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'noexiste@rot.pet', password: 'wrong' }),
        })
        expect(res.status).toBe(401)
        const json = await res.json()
        expect(json.success).toBe(false)
    })

    it('GET /api/auth/me sin token devuelve 401', async () => {
        const res = await fetch(`${BASE}/api/auth/me`)
        expect(res.status).toBe(401)
    })

    it('GET /api/auth/me con token válido devuelve user + profile', async () => {
        const res = await fetch(`${BASE}/api/auth/me`, {
            headers: { Authorization: `Bearer ${authToken}` },
        })
        expect(res.status).toBe(200)
        const json = await res.json()
        expect(json.success).toBe(true)
        expect(json.user.email).toBe('admin@rot.pet')
        expect(json.profile.es_admin).toBe(true)
    })
})

describe('API: /api/products', () => {
    it('GET lista productos con category join', async () => {
        const res = await fetch(`${BASE}/api/products?limit=3`)
        expect(res.status).toBe(200)
        const json = await res.json()
        expect(json.success).toBe(true)
        expect(Array.isArray(json.data)).toBe(true)
        expect(json.data.length).toBeGreaterThan(0)
        // Al menos un producto tiene category join
        const withCat = json.data.find((p: any) => p.category)
        expect(withCat).toBeDefined()
    })

    it('GET filtra por search con ilike', async () => {
        const res = await fetch(`${BASE}/api/products?search=perro`)
        expect(res.status).toBe(200)
        const json = await res.json()
        expect(json.data.length).toBeGreaterThan(0)
        // El endpoint busca en name, description y sku; verificamos que al menos
        // uno de los campos contiene "perro" (case-insensitive).
        expect(json.data.every((p: any) => {
            const name = (p.name || '').toLowerCase()
            const desc = (p.description || '').toLowerCase()
            const sku = (p.sku || '').toLowerCase()
            return name.includes('perro') || desc.includes('perro') || sku.includes('perro')
        })).toBe(true)
    })

    it('GET sin token admin (en local funciona por bypass) devuelve lista', async () => {
        // En local, GET /api/products NO requiere auth (es público).
        // En prod con Supabase, este test fallaría (401).
        const res = await fetch(`${BASE}/api/products?limit=1`)
        expect(res.status).toBe(200)
    })
})

describe('API: /api/categories CRUD', () => {
    const testSlug = `test-cat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    let createdId: string

    it('POST crea una categoría', async () => {
        const res = await fetch(`${BASE}/api/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({ name: `Test ${testSlug}`, slug: testSlug, status: 'active' }),
        })
        expect(res.status).toBe(201)
        const json = await res.json()
        expect(json.success).toBe(true)
        expect(json.data.slug).toBe(testSlug)
        createdId = json.data.id
    })

    it('GET /api/categories/[id] la devuelve', async () => {
        const res = await fetch(`${BASE}/api/categories/${createdId}`)
        expect(res.status).toBe(200)
        const json = await res.json()
        expect(json.data.id).toBe(createdId)
    })

    it('PUT actualiza el nombre', async () => {
        const res = await fetch(`${BASE}/api/categories/${createdId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({ name: 'Updated', slug: testSlug, status: 'inactive' }),
        })
        expect(res.status).toBe(200)
        const json = await res.json()
        expect(json.data.name).toBe('Updated')
        expect(json.data.status).toBe('inactive')
    })

    it('DELETE la elimina', async () => {
        const res = await fetch(`${BASE}/api/categories/${createdId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` },
        })
        expect(res.status).toBe(204)
    })

    it('GET 404 después de eliminar', async () => {
        const res = await fetch(`${BASE}/api/categories/${createdId}`)
        expect(res.status).toBe(404)
    })
})

describe('API: /api/coupons/validate', () => {
    it('cupón válido devuelve descuento aplicado', async () => {
        const res = await fetch(`${BASE}/api/coupons/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: 'BIENVENIDO10', cartTotal: 1000 }),
        })
        expect(res.status).toBe(200)
        const json = await res.json()
        expect(json.valid).toBe(true)
        expect(json.discount_amount).toBe(100) // 10% de 1000
        expect(json.final_total).toBe(900)
    })

    it('cupón inexistente devuelve 404', async () => {
        const res = await fetch(`${BASE}/api/coupons/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: 'NOEXISTE123', cartTotal: 1000 }),
        })
        expect(res.status).toBe(404)
    })
})

describe('API: /api/dashboard/stats', () => {
    it('devuelve stats con totales', async () => {
        const res = await fetch(`${BASE}/api/dashboard/stats`, {
            headers: { 'Authorization': `Bearer ${authToken}` },
        })
        expect(res.status).toBe(200)
        const json = await res.json()
        expect(json.success).toBe(true)
        expect(json.data.stats.totalOrders).toBeGreaterThan(0)
        expect(json.data.stats.totalProducts).toBeGreaterThan(0)
        expect(json.data.stats.totalUsers).toBeGreaterThan(0)
    })
})

describe('API: /api/orders', () => {
    it('GET lista órdenes con join a users', async () => {
        const res = await fetch(`${BASE}/api/orders`, {
            headers: { 'Authorization': `Bearer ${authToken}` },
        })
        expect(res.status).toBe(200)
        const json = await res.json()
        expect(json.success).toBe(true)
        expect(json.data.length).toBeGreaterThan(0)
        // Join: orders tiene users y order_items
        const withJoin = json.data.find((o: any) => o.users || o.order_items)
        expect(withJoin).toBeDefined()
    })
})

describe('API: /api/roles', () => {
    it('GET lista los 3 roles del seed', async () => {
        const res = await fetch(`${BASE}/api/roles`, {
            headers: { 'Authorization': `Bearer ${authToken}` },
        })
        expect(res.status).toBe(200)
        const json = await res.json()
        expect(json.success).toBe(true)
        expect(json.data.length).toBe(3)
        const names = json.data.map((r: any) => r.name).sort()
        expect(names).toEqual(['admin', 'client', 'superadmin'])
    })
})

describe('API: /api/blog', () => {
    it('GET lista posts publicados', async () => {
        const res = await fetch(`${BASE}/api/blog`)
        expect(res.status).toBe(200)
        const json = await res.json()
        expect(json.success).toBe(true)
        expect(json.data.length).toBeGreaterThan(0)
        // Por default filtra status=published
        expect(json.data.every((p: any) => p.status === 'published')).toBe(true)
    })

    it('GET /api/blog/[slug] devuelve un post por slug', async () => {
        // Primero obtener un slug
        const list = await fetch(`${BASE}/api/blog`)
        const listJson = await list.json()
        const slug = listJson.data[0].slug
        const res = await fetch(`${BASE}/api/blog/${slug}`)
        expect(res.status).toBe(200)
        const json = await res.json()
        expect(json.data.slug).toBe(slug)
    })
})
