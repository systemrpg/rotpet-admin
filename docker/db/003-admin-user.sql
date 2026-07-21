-- ============================================================================
-- Rot Pet Shop — Creación de Usuario Admin para Gestión
-- ============================================================================
-- Este script crea un usuario admin con acceso completo al panel administrativo
-- Se ejecuta después de las migraciones base (001-schema.sql, 002-seed.sql)
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- NOTAS IMPORTANTES:
-- ────────────────────────────────────────────────────────────────────────────
-- 1. En desarrollo local (Docker): El usuario admin se autentica con email+password
-- 2. En producción (Supabase Cloud): El ID debe coincidir con auth.users.id
-- 3. El rol_id debe ser 'a0000000-0000-0000-0000-000000000002' (admin)
--    o 'a0000000-0000-0000-0000-000000000001' (superadmin)
-- ────────────────────────────────────────────────────────────────────────────

-- Crear usuario admin principal (si no existe)
INSERT INTO users (id, email, full_name, role_id, status, created_at, updated_at)
VALUES (
    'a1000000-0000-0000-0000-000000000001',
    'admin@rotpet.shop',
    'Administrador RotPet',
    'a0000000-0000-0000-0000-000000000002',  -- Admin role
    'active',
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Crear usuario superadmin (opcional, para acceso total)
INSERT INTO users (id, email, full_name, role_id, status, created_at, updated_at)
VALUES (
    'a2000000-0000-0000-0000-000000000001',
    'superadmin@rotpet.shop',
    'SuperAdmin RotPet',
    'a0000000-0000-0000-0000-000000000001',  -- Superadmin role
    'active',
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING;

-- ────────────────────────────────────────────────────────────────────────────
-- INSTRUCCIONES DE ACCESO
-- ────────────────────────────────────────────────────────────────────────────
--
-- DESARROLLO LOCAL (Docker):
-- ─────────────────────────
-- Email: admin@rotpet.shop
-- Contraseña: (sin contraseña - acceso automático en modo local)
-- URL: http://localhost:3000/admin
--
-- En modo Docker local, el middleware pasa automáticamente al usuario admin@rot.pet
-- Ver: lib/auth-server.ts - LOCAL_DEV_USER
--
--
-- PRODUCCIÓN (Supabase Cloud):
-- ───────────────────────────
-- 1. Crear usuario en Supabase Auth Console:
--    - Email: admin@rotpet.shop
--    - Generar contraseña segura
--
-- 2. El ID de Supabase debe coincidir con el users.id arriba
--    (O crear registro en users table después de registrar en Supabase Auth)
--
-- 3. Login en: https://tudominio.com/admin/login
--    - Email: admin@rotpet.shop
--    - Contraseña: (la generada en Supabase)
--
-- ────────────────────────────────────────────────────────────────────────────
-- CAMBIAR CONTRASEÑA EN PRODUCCIÓN
-- ────────────────────────────────────────────────────────────────────────────
-- 1. Ir a Supabase Auth Console → Users
-- 2. Encontrar admin@rotpet.shop
-- 3. Hacer click en el usuario
-- 4. "Reset password" o cambiar contraseña manualmente
-- 5. Confirmar en Email
--
-- ────────────────────────────────────────────────────────────────────────────
-- CREAR MÁS ADMINS
-- ────────────────────────────────────────────────────────────────────────────
--
-- INSERT INTO users (id, email, full_name, role_id, status)
-- VALUES (
--     'a3000000-0000-0000-0000-000000000001',  -- Cambiar UUID
--     'newadmin@rotpet.shop',                   -- Cambiar email
--     'Nuevo Administrador',                    -- Cambiar nombre
--     'a0000000-0000-0000-0000-000000000002',  -- Admin role
--     'active'
-- );
--
-- Luego en Supabase Auth, crear el usuario en auth.users con el mismo email.
--
-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================
