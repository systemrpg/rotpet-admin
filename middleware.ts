import NextAuth from 'next-auth'
import { authConfig } from './auth.config'

// Middleware edge-compatible: solo usa la config sin providers
// (los providers con DB solo se cargan en Node runtime, no en edge).
// El callback `authorized` en auth.config.ts se ejecuta en cada request
// y decide si requiere sesión (redirect a signIn) o no.
const { auth } = NextAuth(authConfig)

export default auth

export const config = {
    matcher: [
        // Páginas admin (todas requieren sesión)
        '/products',
        '/products/:path*',
        '/categories',
        '/categories/:path*',
        '/users',
        '/users/:path*',
        '/orders',
        '/orders/:path*',
        '/gallery',
        '/gallery/:path*',
        '/reports',
        '/reports/:path*',
        '/settings',
        '/settings/:path*',
        '/support',
        '/support/:path*',
        '/roles',
        '/roles/:path*',
        '/dashboard',
        '/dashboard/:path*',
        '/coupons',
        '/coupons/:path*',
        '/blog',
        '/blog/:path*',
        '/brands',
        '/brands/:path*',
        '/pets',
        '/pets/:path*',
        // APIs SIEMPRE protegidas (route handlers públicos manejan su
        // propia auth en métodos de escritura)
        '/api/users',
        '/api/users/:path*',
        '/api/orders',
        '/api/orders/:path*',
        '/api/dashboard',
        '/api/dashboard/:path*',
        '/api/settings',
        '/api/settings/:path*',
        '/api/roles',
        '/api/roles/:path*',
        '/api/gallery',
        '/api/gallery/:path*',
    ],
}
