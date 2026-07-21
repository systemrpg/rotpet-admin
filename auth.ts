/**
 * NextAuth v5 — full config.
 *
 * IMPORTANTE: Este archivo importa módulos que usan Node APIs (pg).
 * NO importar desde middleware.ts (que corre en edge). Para middleware
 * usar auth.config.ts.
 */
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { isLocalDb } from './lib/db/pg-client'
import { getPool } from './lib/db/pg-client'

export const { auth, handlers, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const email = String(credentials.email).toLowerCase().trim()
                const password = String(credentials.password)

                // ─── Modo local: scrypt + DB directa ───────────────────
                if (isLocalDb()) {
                    const { verifyPassword, hashPassword, ensurePasswordColumn } = await import(
                        './lib/db/local-auth'
                    )

                    await ensurePasswordColumn()
                    const pool = getPool()

                    const result = await pool.query(
                        'SELECT id, email, full_name, password_hash, status, role_id, ' +
                        '(SELECT name FROM roles WHERE id = users.role_id) AS role_name ' +
                        'FROM users WHERE email = $1 LIMIT 1',
                        [email]
                    )

                    if (result.rows.length === 0) {
                        return null
                    }
                    const user = result.rows[0]

                    if (user.status !== 'active') {
                        return null
                    }

                    // Auto-set password si no tiene (primer login)
                    if (!user.password_hash) {
                        const passwordHash = await hashPassword(password)
                        await pool.query(
                            'UPDATE users SET password_hash = $1 WHERE id = $2',
                            [passwordHash, user.id]
                        )
                    } else {
                        const valid = await verifyPassword(password, user.password_hash)
                        if (!valid) {
                            return null
                        }
                    }

                    const roleName = (user.role_name || '').toLowerCase()
                    const isAdmin = roleName === 'admin' || roleName === 'superadmin'

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.full_name || user.email,
                        role: roleName,
                        isAdmin,
                    } as any
                }

                // ─── Modo Supabase Cloud ─────────────────────────────────
                const { createClient } = await import('@supabase/supabase-js')
                const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
                const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                const supabase = createClient(supabaseUrl, supabaseAnonKey)

                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })

                if (error || !data.user) {
                    return null
                }

                const { supabaseAdmin } = await import('./lib/supabaseAdmin')
                const { data: profile } = await supabaseAdmin
                    .from('users')
                    .select('id, email, full_name, roles(name)')
                    .eq('id', data.user.id)
                    .single()

                if (!profile) return null

                const roleName = (profile.roles as any)?.name?.toLowerCase() || 'client'
                const isAdmin = roleName === 'admin' || roleName === 'superadmin'

                return {
                    id: profile.id,
                    email: profile.email,
                    name: profile.full_name || profile.email,
                    role: roleName,
                    isAdmin,
                } as any
            },
        }),
    ],
})
