import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const isLocalDb = process.env.USE_LOCAL_DB === 'true'

// Rutas de UI que requieren sesión admin (páginas del nuevo proyecto, todas a root)
const ADMIN_PAGE_PREFIXES = [
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

// Rutas API sensibles (todas las API menos auth y auxiliares públicas)
const PROTECTED_API_PREFIXES = [
    '/api/users',
    '/api/orders',
    '/api/roles',
    '/api/coupons',
    '/api/dashboard',
    '/api/settings',
    '/api/products',
    '/api/categories',
    '/api/brands',
    '/api/blog',
    '/api/pets',
    '/api/reviews',
    '/api/wishlist',
    '/api/gallery',
    '/api/countries',
    '/api/states',
]

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value
    const { pathname } = request.nextUrl

    // 1. Proteger páginas de admin
    const isAdminPage = ADMIN_PAGE_PREFIXES.some(
        (p) => pathname === p || pathname.startsWith(p + '/')
    )
    if (isAdminPage) {
        if (!token && !isLocalDb) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            url.searchParams.set('returnTo', pathname)
            return NextResponse.redirect(url)
        }

        // En modo Docker local, permitir acceso directo al admin sin Supabase Auth
        if (!isLocalDb) {
            try {
                const supabase = createClient(supabaseUrl, supabaseAnonKey, {
                    global: {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                })

                const { data: { user }, error } = await supabase.auth.getUser()

                if (error || !user) {
                    const url = request.nextUrl.clone()
                    url.pathname = '/login'
                    url.searchParams.set('returnTo', pathname)
                    const response = NextResponse.redirect(url)
                    response.cookies.delete('auth_token')
                    return response
                }
            } catch {
                // Si hay error de conexión, permitir acceso (la verificación de rol se hace en el API)
            }
        }
    }

    // 2. Proteger rutas de API sensibles
    const isProtectedApi = PROTECTED_API_PREFIXES.some(
        (p) => pathname === p || pathname.startsWith(p + '/')
    )
    if (isProtectedApi) {
        if (!token && !isLocalDb) {
            return NextResponse.json(
                { success: false, error: 'Authentication required' },
                { status: 401 }
            )
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        // Páginas admin
        '/products/:path*',
        '/categories/:path*',
        '/users/:path*',
        '/orders/:path*',
        '/gallery/:path*',
        '/reports/:path*',
        '/settings/:path*',
        '/support/:path*',
        '/roles/:path*',
        '/dashboard/:path*',
        '/coupons/:path*',
        '/blog/:path*',
        '/brands/:path*',
        '/pets/:path*',
        // APIs protegidas
        '/api/users/:path*',
        '/api/orders/:path*',
        '/api/roles/:path*',
        '/api/coupons/:path*',
        '/api/dashboard/:path*',
        '/api/settings/:path*',
        '/api/products/:path*',
        '/api/categories/:path*',
        '/api/brands/:path*',
        '/api/blog/:path*',
        '/api/pets/:path*',
        '/api/reviews/:path*',
        '/api/wishlist/:path*',
        '/api/gallery/:path*',
        '/api/countries/:path*',
        '/api/states/:path*',
    ],
}
