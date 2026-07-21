/**
 * Helpers de auth para server components y route handlers.
 *
 * En NextAuth v5, `auth()` retorna la sesión del usuario actual
 * (o null si no hay sesión). El objeto session.user está extendido
 * con `id`, `role` e `isAdmin` via el callback `session` en
 * auth.config.ts.
 *
 * API expuesta (back-compat con la versión anterior):
 *  - requireAdmin(): retorna session.user, lanza si no es admin
 *  - getAuthenticatedUser(): retorna session.user o null
 */
import { auth } from '@/auth'

/**
 * Requiere sesión y rol admin/superadmin. Lanza Error si falla.
 * El caller (route handler) traduce el Error a status HTTP.
 */
export async function requireAdmin() {
    const session = await auth()
    if (!session?.user) {
        throw new Error('Unauthorized: No session found')
    }
    if (!session.user.isAdmin) {
        throw new Error(`Forbidden: Admin access required (role: ${session.user.role})`)
    }
    return session.user
}

/**
 * Devuelve el usuario autenticado (session.user) o null.
 */
export async function getAuthenticatedUser() {
    const session = await auth()
    return session?.user ?? null
}
