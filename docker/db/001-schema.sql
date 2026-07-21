-- ============================================================================
-- Rot Pet Shop — Esquema completo de base de datos
-- Compatible con PostgreSQL 16 (Docker local) y Supabase
-- ============================================================================

-- Extensiones requeridas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ROLES
-- ============================================================================
CREATE TABLE IF NOT EXISTS roles (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL UNIQUE,
    permissions JSONB DEFAULT '{}',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 2. USERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           TEXT NOT NULL UNIQUE,
    full_name       TEXT,
    role_id         UUID REFERENCES roles(id) ON DELETE SET NULL,
    status          TEXT NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active', 'inactive', 'pending')),
    balance         NUMERIC(12,2) DEFAULT 0,
    internal_notes  TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- ============================================================================
-- 3. COUNTRIES & STATES
-- ============================================================================
CREATE TABLE IF NOT EXISTS countries (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name       TEXT NOT NULL UNIQUE,
    code       TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS states (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id  UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    code        TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(country_id, name)
);

CREATE INDEX IF NOT EXISTS idx_states_country_id ON states(country_id);

-- ============================================================================
-- 4. PET TYPES
-- ============================================================================
CREATE TABLE IF NOT EXISTS pet_types (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name       TEXT NOT NULL,
    slug       TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 5. CATEGORIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS categories (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name       TEXT NOT NULL,
    slug       TEXT NOT NULL UNIQUE,
    image_url  TEXT,
    status     TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 6. BRANDS
-- ============================================================================
CREATE TABLE IF NOT EXISTS brands (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL UNIQUE,
    slug        TEXT NOT NULL UNIQUE,
    logo_url    TEXT,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 7. PRODUCTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
    id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                     TEXT NOT NULL,
    slug                     TEXT GENERATED ALWAYS AS (
                                LOWER(REGEXP_REPLACE(REGEXP_REPLACE(name, '[^a-zA-Z0-9 ]', '', 'g'), '\s+', '-', 'g'))
                             ) STORED,
    sku                      TEXT,
    price                    NUMERIC(12,2) NOT NULL DEFAULT 0,
    quantity                 INTEGER NOT NULL DEFAULT 0,
    category_id              UUID REFERENCES categories(id) ON DELETE SET NULL,
    pet_type_id              UUID REFERENCES pet_types(id) ON DELETE SET NULL,
    brand_id                 UUID REFERENCES brands(id) ON DELETE SET NULL,
    image_url                TEXT,
    description              TEXT,
    informacion_nutricional  JSONB,
    status                   TEXT DEFAULT 'active',
    destacado                BOOLEAN DEFAULT FALSE,
    nuevo                    BOOLEAN DEFAULT FALSE,
    featured                 BOOLEAN DEFAULT FALSE,
    is_new                   BOOLEAN DEFAULT FALSE,
    created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_pet_type_id ON products(pet_type_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING GIN (to_tsvector('spanish', name));

-- ============================================================================
-- 8. PRODUCT VARIANTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS product_variants (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku         TEXT,
    price       NUMERIC(12,2),
    stock       INTEGER NOT NULL DEFAULT 0,
    attributes  JSONB NOT NULL DEFAULT '{}',
    status      TEXT NOT NULL DEFAULT 'active',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);

-- ============================================================================
-- 9. ORDERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS orders (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id          UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    total_amount     NUMERIC(12,2) NOT NULL DEFAULT 0,
    status           TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'shipped', 'delivered')),
    shipping_address TEXT,
    contact_phone    TEXT,
    payment_method   TEXT,
    notes            TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- ============================================================================
-- 10. ORDER ITEMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS order_items (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id  UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price  NUMERIC(12,2) NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- ============================================================================
-- 11. REVIEWS
-- ============================================================================
CREATE TABLE IF NOT EXISTS reviews (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    producto_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id          UUID REFERENCES users(id) ON DELETE SET NULL,
    nombre_usuario   TEXT NOT NULL DEFAULT 'Anónimo',
    calificacion     INTEGER NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
    comentario       TEXT NOT NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_producto_id ON reviews(producto_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);

-- ============================================================================
-- 12. COUPONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS coupons (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code            TEXT NOT NULL UNIQUE,
    discount_type   TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value  NUMERIC(12,2) NOT NULL DEFAULT 0,
    min_purchase    NUMERIC(12,2),
    expiration_date TIMESTAMPTZ,
    usage_limit     INTEGER,
    used_count      INTEGER NOT NULL DEFAULT 0,
    status          TEXT NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active', 'inactive')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 13. BLOG POSTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title       TEXT NOT NULL,
    slug        TEXT NOT NULL UNIQUE,
    description TEXT,
    content     TEXT,
    author      TEXT,
    category    TEXT,
    image_url   TEXT,
    status      TEXT NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('published', 'draft', 'archived')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);

-- ============================================================================
-- 14. PETS (mascotas del usuario)
-- ============================================================================
CREATE TABLE IF NOT EXISTS pets (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    type        TEXT NOT NULL,
    breed       TEXT,
    birth_date  DATE,
    gender      TEXT,
    weight      NUMERIC(8,2),
    allergies   TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pets_user_id ON pets(user_id);

-- ============================================================================
-- 15. WISHLIST
-- ============================================================================
CREATE TABLE IF NOT EXISTS wishlist (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);

-- ============================================================================
-- 16. SETTINGS (clave-valor para configuración de la tienda)
-- ============================================================================
CREATE TABLE IF NOT EXISTS settings (
    key        TEXT PRIMARY KEY,
    value      TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TRIGGERS — auto-actualizar updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'roles', 'users', 'pet_types', 'categories', 'products',
        'product_variants', 'orders', 'blog_posts', 'settings'
    ] LOOP
        EXECUTE format(
            'DROP TRIGGER IF EXISTS trigger_updated_at ON %I; CREATE TRIGGER trigger_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
            t, t
        );
    END LOOP;
END $$;

-- ============================================================================
-- VISTA — resumen de productos vendidos (para dashboard)
-- ============================================================================
CREATE OR REPLACE VIEW v_top_selling_products AS
SELECT
    p.id,
    p.name,
    p.image_url,
    p.price,
    SUM(oi.quantity) AS total_sold,
    SUM(oi.quantity * oi.unit_price) AS total_revenue
FROM order_items oi
JOIN products p ON p.id = oi.product_id
JOIN orders o ON o.id = oi.order_id
WHERE o.status NOT IN ('cancelled')
GROUP BY p.id, p.name, p.image_url, p.price
ORDER BY total_sold DESC;

-- ============================================================================
-- FIN DEL ESQUEMA
-- ============================================================================
