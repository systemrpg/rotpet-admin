/**
 * NextAuth v5 — edge-compatible config.
 *
 * Esta config NO debe importar módulos que usen APIs de Node
 * (pg, fs, etc.) porque se ejecuta en el edge runtime del middleware.
 *
 * Para agregar providers que necesiten DB, hacerlo en auth.ts (no acá).
 *
 * Define:
 *  - Páginas custom (signIn, error)
 *  - Callbacks authorized (gate de rutas en middleware)
 *  - Callbacks jwt y session (agregan role al token y session)
 *  - Secret de firma JWT
 */
import type { NextAuthConfig } from 'next-auth'

/**
 * Rutas de UI que requieren sesión (admin pages).
 * Definidas en middleware; en este archivo se exponen para reuso.
 */
export const ADMIN_PAGE_PREFIXES = [
    '/products',
    '/categories',
    '/users',
    '/orders',
    '/gallery',
    '/reports',
    '/settings',
    '/support',
    '/roles',
    '/dashboard',
    '/coupons',
    '/blog',
    '/brands',
    '/pets',
]

/**
 * Rutas API que requieren auth SIEMPRE (sin importar el método).
 * Para rutas con GET público + POST/PUT/DELETE admin (ej: /api/products),
 * el route handler hace su propia validación con requireAdmin() en métodos
 * de escritura. El middleware solo gatea rutas 100% protegidas.
 */
export const PROTECTED_API_PREFIXES = [
    '/api/users',
    '/api/orders',
    '/api/dashboard',
    '/api/settings',
    '/api/roles',
    '/api/gallery',
]

function isAdminPage(pathname: string): boolean {
    return ADMIN_PAGE_PREFIXES.some(
        (p) => pathname === p || pathname.startsWith(p + '/')
    )
}

function isProtectedApi(pathname: string): boolean {
    return PROTECTED_API_PREFIXES.some(
        (p) => pathname === p || pathname.startsWith(p + '/')
    )
}

export const authConfig: NextAuthConfig = {
    pages: {
        signIn: '/login',
        error: '/login',
    },
    // En dev local permitimos HTTP (no HTTPS)
    trustHost: true,
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60 * 24 * 7, // 7 días
    },
    providers: [
        // Los providers reales van en auth.ts (usan DB).
    ],
    callbacks: {
        /**
         * Gate de rutas en middleware. Se ejecuta en el edge runtime
         * y solo conoce la presencia/ausencia de sesión (no carga
         * el profile completo — eso lo hace auth() en el server).
         */
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const pathname = nextUrl.pathname

            // Páginas admin → requieren sesión
            if (isAdminPage(pathname)) {
                if (isLoggedIn) return true
                return false // redirige a /login (pages.signIn)
            }

            // APIs protegidas → requieren sesión
            if (isProtectedApi(pathname)) {
                return isLoggedIn
            }

            // El resto es público
            return true
        },
        /**
         * Callback JWT: enriquece el token con role/isAdmin.
         * Se ejecuta cada vez que se crea/actualiza un JWT.
         * En signIn vía Credentials, el `user` viene de authorize().
         */
        async jwt({ token, user }) {
            if (user) {
                const u = user as any
                token.id = u.id
                token.email = user.email
                token.name = user.name
                token.role = u.role
                token.isAdmin = u.isAdmin
            }
            return token
        },
        /**
         * Callback session: shape del objeto que reciben server
         * components y client components vía useSession.
         */
        async session({ session, token }) {
            if (session.user) {
                // Type augmentation via types/next-auth.d.ts adds these to JWT,
                // but TS sometimes doesn't pick it up in this context.
                const t = token as any
                session.user.id = t.id
                session.user.role = t.role
                session.user.isAdmin = t.isAdmin
            }
            return session
        },
    },
}
