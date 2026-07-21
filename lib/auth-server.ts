import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { isLocalDb } from './db/pg-client'

// Usamos las variables públicas para crear un cliente "seguro" que valide el token
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// ─── Modo Docker local: usuario de prueba por defecto ────────────────────
const LOCAL_DEV_USER = {
    id: 'b0000000-0000-0000-0000-000000000001',
    email: 'admin@rot.pet',
}

/**
 * Verifica si el usuario actual es administrador.
 * Lanza un error si no lo es o no está autenticado.
 */
export async function requireAdmin() {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    // ─── Modo Docker local: bypass de Supabase Auth ─────────────────────
    if (isLocalDb()) {
        const { supabaseAdmin } = await import('./supabaseAdmin')

        if (token) {
            // Decodificar el JWT local para obtener el user ID
            const { verifyLocalToken } = await import('./db/local-auth')
            const payload = verifyLocalToken(token)

            if (payload) {
                const { data: userData, error } = await supabaseAdmin
                    .from('users')
                    .select('*, roles(name)')
                    .eq('id', payload.sub)
                    .single()

                if (!error && userData) {
                    const roleName = userData.roles?.name?.toLowerCase()
                    if (roleName !== 'admin' && roleName !== 'superadmin') {
                        throw new Error(`Forbidden: User is not admin (Role: ${roleName})`)
                    }
                    return userData
                }
            }
        }

        // Sin token válido: fallback al admin por defecto (solo para rutas admin en dev local sin autenticar)
        const { data: adminUser } = await supabaseAdmin
            .from('users')
            .select('*, roles(name)')
            .eq('email', LOCAL_DEV_USER.email)
            .single()

        if (!adminUser) {
            throw new Error('Forbidden: User profile not found (local mode)')
        }
        return adminUser
    }

    // ─── Modo Supabase Cloud (producción) ──────────────────────────────
    if (!token) {
        throw new Error('Unauthorized: No session token found')
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    })

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        throw new Error('Unauthorized: Invalid session')
    }

    const { supabaseAdmin } = await import('./supabaseAdmin')

    const { data: userData, error: roleError } = await supabaseAdmin
        .from('users')
        .select('*, roles(name)')
        .eq('email', user.email)
        .single()

    if (roleError || !userData) {
        const { data: userDataById, error: roleErrorById } = await supabaseAdmin
            .from('users')
            .select('*, roles(name)')
            .eq('id', user.id)
            .single()

        if (roleErrorById || !userDataById) {
            throw new Error('Forbidden: User profile not found')
        }

        if (userDataById.roles?.name !== 'admin' && userDataById.roles?.name !== 'superadmin') {
            throw new Error('Forbidden: Admin access required')
        }
        return userDataById
    }

    const roleName = userData.roles?.name?.toLowerCase()

    if (roleName !== 'admin' && roleName !== 'superadmin') {
        throw new Error(`Forbidden: User is not admin (Role: ${roleName})`)
    }

    return userData
}

/**
 * Verifica si hay un usuario autenticado y lo devuelve.
 */
export async function getAuthenticatedUser() {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    // ─── Modo Docker local ──────────────────────────────────────────────
    if (isLocalDb()) {
        if (!token) {
            return null
        }

        const { verifyLocalToken } = await import('./db/local-auth')
        const payload = verifyLocalToken(token)
        if (!payload) {
            return null
        }

        const { supabaseAdmin } = await import('./supabaseAdmin')
        const { data: userData } = await supabaseAdmin
            .from('users')
            .select('id, email, full_name')
            .eq('id', payload.sub)
            .single()

        if (userData) {
            return {
                id: userData.id,
                email: userData.email,
                user_metadata: { full_name: userData.full_name },
            }
        }

        return null
    }

    // ─── Modo Supabase Cloud ────────────────────────────────────────────
    if (!token) {
        return null
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    })

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return null
    }

    return user
}
