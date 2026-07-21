# Arquitectura — Rot Pet Admin

> Documento vivo. Se actualiza con cada cambio mayor del backend.
> Última actualización: 2026-07-21

## 1. Resumen del proyecto

Panel administrativo para **Rot Pet Shop** (e-commerce de mascotas). Es la
interfaz de gestión de productos, categorías, marcas, pedidos, usuarios,
roles, cupones, galería, blog, dashboard, etc.

Stack base: **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind 4
+ shadcn/ui (Radix)**. Backend: **Next.js Route Handlers (`app/api/`) +
PostgreSQL 16** (local en Docker, compatible con Supabase Cloud).

Hereda el patrón del proyecto legacy `E:\Projects\rotpet` (Next 14 +
Supabase + Postgres), adaptado a Next 16 / React 19.

---

## 2. Stack técnico

| Capa            | Tecnología                                            |
|-----------------|-------------------------------------------------------|
| Framework       | Next.js 16.0.0 (App Router, Turbopack)                |
| UI              | React 19.2.0, Tailwind 4, Radix UI, lucide-react      |
| Lenguaje        | TypeScript 5                                          |
| Backend         | Route Handlers en `app/api/**/route.ts`               |
| DB local        | PostgreSQL 16 (Docker, puerto 5435)                   |
| DB cloud (alt.) | Supabase (Postgres gestionado)                        |
| ORM/Cliente     | `pg` (cliente nativo) + adapter Supabase-compatible   |
| Auth            | Sesiones vía cookie `auth_token` (HMAC-SHA256 local)  |
| Email (opt.)    | Resend                                                |
| Build           | Turbopack, `next build` en ~2s                        |

---

## 3. Patrón clave: el `supabaseAdmin` adapter

El proyecto soporta **dos backends de DB** con **el mismo código de rutas**:

```
┌──────────────────┐         ┌──────────────────┐
│   app/api/*      │ ──────▶ │ lib/supabaseAdmin│
│   route.ts       │         │   (selector)     │
└──────────────────┘         └──────┬───────────┘
                                    │
                          USE_LOCAL_DB?
                         ┌──────────┴──────────┐
                         ▼                     ▼
              ┌──────────────────┐  ┌────────────────────┐
              │  localSupabase   │  │  @supabase/        │
              │  Admin           │  │  supabase-js       │
              │  (lib/db/        │  │  (Service Role)    │
              │   local-adapter) │  │                    │
              └────────┬─────────┘  └─────────┬──────────┘
                       │                      │
                       ▼                      ▼
              ┌──────────────────┐  ┌────────────────────┐
              │ lib/db/pg-client │  │ Supabase Cloud     │
              │ (Driver pg)      │  │ (Postgres HTTP)    │
              └────────┬─────────┘  └────────────────────┘
                       │
                       ▼
              ┌──────────────────┐
              │ Docker Postgres  │
              │ (puerto 5435)    │
              └──────────────────┘
```

**Cómo funciona:**

- `lib/supabaseAdmin.ts` decide en **tiempo de import** qué backend usar
  según `USE_LOCAL_DB=true` en `.env.local`.
- `lib/db/local-adapter.ts` implementa un subconjunto del API de Supabase JS
  v2 (`from().select().eq().single()`, joins con sintaxis `alias:table(...)`,
  filtros `ilike`, `or`, `in`, etc.) sobre `pg`.
- **Las rutas `app/api/*` no se enteran** del backend. Mismo código,
  mismos tipos, misma sintaxis.

**Limitaciones del local adapter** (documentadas, no son bugs):

1. **Joins requieren FK explícita**: si hacés
   `select('id, name, category:categories(id, name)')` sin incluir
   `category_id` en la lista de columnas, el join devuelve `null`.
   Solución: usar `*` o agregar la FK explícitamente.
2. **Agregaciones de count (`products(count)`) no funcionan** vía join. Se
   hace con query separada (ver `app/categories/page.tsx`).
3. **Sin transacciones multi-statement** vía API. El POST de productos
   inserta producto y variantes en queries separadas (idempotente por
   soft-fail con log).

---

## 4. Modelo de auth

```
┌─────────────┐    POST /api/auth/login     ┌──────────────────┐
│  /login     │ ◀─────────────────────────▶ │  API route       │
│  (client)   │    { email, password }      │  (route handler)│
└──────┬──────┘                             └────────┬─────────┘
       │ set-cookie: auth_token                     │
       │ document.cookie = ...                      │
       ▼                                            ▼
       │                              ┌──────────────────────────┐
       │                              │  Si USE_LOCAL_DB=true:   │
       │                              │  - hash scrypt del pass  │
       │                              │  - createLocalToken()    │
       │                              │  - HMAC-SHA256 + base64  │
       │                              │  Si Supabase:            │
       │                              │  - supabase.auth.signIn  │
       │                              └──────────┬───────────────┘
       │                                         │
       │              Set-Cookie: auth_token     │
       ▼ ◀────────────────────────────────────────┘
       │
       │  GET /products, /api/*, etc.
       ▼
┌──────────────────┐
│  middleware.ts   │  ← corre antes de cada request a rutas protegidas
│  (Next 16)       │
└──────┬───────────┘
       │
       ▼
  auth_token cookie OK? ──▶ si no, redirect a /login (UI) o 401 (API)
       │
       ▼
  requireAdmin() en lib/auth-server.ts
  - Lee cookie (async)
  - Verifica HMAC + DB
  - Lanza si no es admin/superadmin
```

**Cookies:**
- `auth_token`: opaque token, HMAC-signed, no httpOnly (porque el cliente
  también la lee para mostrar UI). En producción real debería migrarse a
  httpOnly vía Set-Cookie desde el route handler.

**Modo dev local (bypass):**
- Si `USE_LOCAL_DB=true` y no hay cookie válida, `requireAdmin()` cae al
  usuario `admin@rot.pet` (superadmin del seed).
- Si un usuario seedeado no tiene `password_hash`, el primer login lo setea
  con la contraseña ingresada.

---

## 5. Estructura de archivos

```
rotpet-admin/
├── app/                                # Next.js App Router
│   ├── api/                            # Backend (route handlers)
│   │   ├── auth/                       # 6 endpoints
│   │   │   ├── login/route.ts          # POST  (Supabase + local)
│   │   │   ├── register/route.ts       # POST
│   │   │   ├── logout/route.ts         # POST
│   │   │   ├── me/route.ts             # GET
│   │   │   ├── forgot-password/route.ts# POST
│   │   │   └── update-password/route.ts# POST
│   │   ├── users/                      # 4 endpoints
│   │   │   ├── route.ts                # GET (list), POST (create)
│   │   │   ├── [id]/route.ts           # GET, PUT, DELETE (soft)
│   │   │   ├── [id]/pets/route.ts      # GET (mascotas del user)
│   │   │   └── profile/route.ts        # GET, PUT (perfil propio)
│   │   ├── products/                   # 4 endpoints
│   │   │   ├── route.ts                # GET (list+filtros), POST
│   │   │   ├── [id]/route.ts           # GET, PUT, DELETE
│   │   │   ├── categories/list/route.ts# GET
│   │   │   └── pet-types/list/route.ts # GET
│   │   ├── categories/                 # 2 endpoints
│   │   │   ├── route.ts                # GET, POST
│   │   │   └── [id]/route.ts           # GET, PUT, DELETE
│   │   ├── brands/                     # 2 endpoints
│   │   │   ├── route.ts                # GET, POST
│   │   │   └── [id]/route.ts           # GET, PUT, DELETE
│   │   └── health/route.ts             # GET (dev only)
│   ├── login/page.tsx                  # Form wireado a /api/auth/login
│   ├── products/
│   │   ├── page.tsx                    # Server Component, fetch real
│   │   ├── new/page.tsx                # (pendiente wirear POST)
│   │   └── [id]/edit/page.tsx          # (pendiente wirear PUT)
│   ├── categories/                     # mismo patrón
│   ├── users/                          # (pendiente)
│   ├── orders/                         # (pendiente)
│   ├── gallery/, reports/, settings/,  # UI shell, sin wirear
│   │   support/                        #
│   ├── globals.css                     # Tailwind 4 + tema
│   ├── layout.tsx                      # Root layout (Sidebar+Header+Footer)
│   └── page.tsx                        # Home
│
├── lib/                                # Lógica compartida
│   ├── db/                             # Capa de DB
│   │   ├── pg-client.ts                # Pool de pg + isLocalDb()
│   │   ├── local-adapter.ts            # QueryBuilder Supabase-like
│   │   └── local-auth.ts               # scrypt + HMAC tokens
│   ├── supabaseAdmin.ts                # Selector Supabase vs local
│   ├── supabaseClient.ts               # Cliente browser (legacy)
│   ├── auth-server.ts                  # requireAdmin, getAuthenticatedUser
│   └── utils.ts                        # cn() para Tailwind
│
├── components/                         # UI components
│   ├── sidebar.tsx                     # Nav lateral admin
│   ├── header.tsx                      # Top bar
│   ├── footer.tsx                      # Footer simple
│   └── theme-provider.tsx              # Dark mode toggle
│
├── docker/                             # Init scripts para Postgres
│   ├── db/
│   │   ├── 001-schema.sql              # 16 tablas + índices + triggers
│   │   ├── 002-seed.sql                # 9 users, 20 products, etc.
│   │   ├── 003-admin-user.sql          # Admin extra (rotpet.shop)
│   │   ├── 003-local-auth.sql          # ALTER TABLE password_hash
│   │   └── 004-fix-product-images.sql  # Fix URLs de imágenes
│   └── pgadmin/                        # (opcional) UI pgAdmin
│
├── docker-compose.yml                  # Postgres 16-alpine, puerto 5435
├── middleware.ts                       # Gate auth para admin pages y APIs
├── next.config.mjs                     # Next config
├── package.json                        # Deps + scripts (db:up, dev, build…)
├── pnpm-lock.yaml
├── tsconfig.json
├── postcss.config.mjs
├── tailwind.config (via postcss)
│
├── .env.example                        # Template completo
├── .env.local.example                  # Mismo, marcado como copy-this
├── .gitignore
├── README.md                           # Boilerplate de v0.app
├── ARCHITECTURE.md                     # ← este archivo
│
└── public/                             # Assets estáticos
```

---

## 6. Flujos principales

### 6.1 Login

1. Usuario entra a `/login`, completa form (client component).
2. POST `/api/auth/login` con `{ email, password }`.
3. Si `isLocalDb()`: `verifyPassword()` (scrypt) y `createLocalToken()`
   (HMAC-SHA256). Si Supabase: `supabase.auth.signInWithPassword()`.
4. Devuelve `{ session: { access_token }, user, profile }`.
5. Cliente setea `document.cookie = auth_token=...` y redirige.

### 6.2 Lectura de productos (Server Component)

1. Usuario navega a `/products`.
2. `app/products/page.tsx` (Server Component) llama `getAuthenticatedUser()`.
3. Hace `supabaseAdmin.from('products').select('id, name, ..., category:categories(id,name)').order(...).limit(100)`.
4. Devuelve el array, la página renderiza la tabla con datos reales.

### 6.3 CRUD de categoría (Admin)

1. Admin en `/categories/new` llena el form.
2. POST `/api/categories` con body.
3. Route handler: `requireAdmin()` valida sesión y rol.
4. `supabaseAdmin.from('categories').insert([{...}]).select().single()`.
5. Devuelve 201 con la categoría creada.
6. Front hace `router.push('/categories')` y el Server Component
   re-renderiza con la lista actualizada.

---

## 7. Esquema de DB (resumen)

| Tabla              | Filas seed | Notas                              |
|--------------------|-----------:|------------------------------------|
| `roles`            | 3          | superadmin, admin, client          |
| `users`            | 9          | con role_id FK, status             |
| `categories`       | 10         | slug, image_url, status            |
| `pet_types`        | 6          | perro, gato, ave, pez, etc.        |
| `brands`           | 7          | logo_url, description              |
| `products`         | 20         | FK a category, pet_type, brand     |
| `product_variants` | ~10        | sku, price, stock, attributes JSON|
| `orders`           | 5          | user_id, total, status             |
| `order_items`      | varios     | M:M order↔product                  |
| `reviews`          | 8          | product FK, rating 1-5             |
| `coupons`          | 4          | code, discount_type, expires_at    |
| `blog_posts`       | 4          | slug, content, status              |
| `pets`             | 5          | user_id, type, breed, weight       |
| `wishlist`         | varios     | UNIQUE(user_id, product_id)        |
| `settings`         | 9          | key-value store                    |
| `countries`        | 1          | MX + 8 estados                     |

Triggers: `update_updated_at_column()` en 9 tablas (auto-timestamp).
Índices: email, role_id, status, search FTS en español para products.

---

## 8. Setup local

```bash
# 1. Clonar
git clone <repo>
cd rotpet-admin

# 2. Instalar deps
pnpm install

# 3. Configurar env
cp .env.local.example .env.local
# (los valores default funcionan con el docker-compose)

# 4. Levantar Postgres
pnpm db:up
# Espera ~5s a que el healthcheck pase

# 5. Correr Next
pnpm dev
# → http://localhost:3000
```

**Credenciales dev** (del seed):
- `admin@rot.pet` (superadmin) — primer login setea password automático
- `staff@rot.pet` (admin)
- `cliente@test.com`, `juan@test.com`, `ana@test.com` (clients)

**Comandos útiles:**
```bash
pnpm db:up       # docker compose up -d
pnpm db:down     # docker compose down
pnpm db:reset    # down -v + up (Borra TODO, requiere confirmación)
pnpm dev         # next dev (Turbopack)
pnpm build       # next build (producción)
pnpm test        # vitest (próximamente)
```

---

## 9. Estado actual de migración

| Fase | Scope                                  | Estado       |
|------|----------------------------------------|--------------|
| F0   | Foundation (lib/db, docker, auth-core) | ✅ Completo  |
| F1   | Auth + Users (6 + 4 endpoints)         | ✅ Completo  |
| F2   | Catálogo (Products, Categories, Brands)| ✅ Completo  |
| F3   | Pedidos + Dashboard + Coupons          | ⏳ Pendiente |
| F4   | Roles + Settings + Users admin         | ⏳ Pendiente |
| F5   | Blog, Gallery, Pets, Wishlist, Reviews | ⏳ Pendiente |
| F6   | Forms de new/edit (wirear POST/PUT)    | ⏳ Pendiente |

---

## 10. Convenciones del proyecto

- **Comentarios**: español. Identifiers en inglés. Mensajes de UI en español.
- **Tipado**: `typescript.ignoreBuildErrors: true` en `next.config.mjs`
  (build no falla por TS, pero `tsc --noEmit` SÍ corre en CI). El
  proyecto apunta a **0 TS errors**.
- **Imports**: usar `@/lib/...`, `@/components/...` (tsconfig paths).
- **Rutas API**: devuelven `{ success: bool, data?, error? }`. Errores
  con status HTTP correcto (401, 404, 500).
- **Server Components por default**. `'use client'` solo cuando hay
  estado interactivo o efectos.
- **`force-dynamic`** en rutas que leen cookies/DB dinámicamente.
- **`Promise<{ id: string }>`** en params de route handlers (Next 15+).
- **`await cookies()`** en vez de `cookies()` (Next 15+).

---

## 11. Decisiones técnicas relevantes

- **Por qué `pg` raw en vez de Prisma**: la lógica de joins con sintaxis
  Supabase-style (`category:categories(id, name)`) es central al código
  heredado. Reimplementar eso en Prisma costaba más que portar el adapter.
- **Por qué mantener el adapter Supabase-like**: deja la puerta abierta
  a producción con Supabase Cloud sin tocar el código de las rutas.
- **Por qué soft-delete en users** (status='inactive' en vez de DELETE):
  por integridad referencial con orders (los usuarios con pedidos no
  pueden hard-deletearse).
- **Por qué no usar NextAuth/Auth.js**: la base heredada tiene JWT
  propio + cookie. Migrar a NextAuth sería un sprint entero. Se puede
  hacer en F4 si se justifica.
