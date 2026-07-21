import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { isLocalDb } from '@/lib/db/pg-client'
import { hashPassword, verifyLocalToken } from '@/lib/db/local-auth'

export async function POST(request: Request) {
    try {
        const { password, current_password } = await request.json()

        if (!password || password.length < 6) {
            return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 })
        }

        const cookieStore = await cookies()
        let token = cookieStore.get('auth_token')?.value

        if (!token) {
            const authHeader = request.headers.get('Authorization')
            token = authHeader?.split(' ')[1]
        }

        if (!token) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        // Modo local: update directo a la columna password_hash
        if (isLocalDb()) {
            const payload = verifyLocalToken(token)
            if (!payload) {
                return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 })
            }

            // Verificar current_password si fue provisto
            if (current_password) {
                const { data: user } = await supabaseAdmin
                    .from('users')
                    .select('password_hash')
                    .eq('id', payload.sub)
                    .single()
                if (!user?.password_hash) {
                    return NextResponse.json({ success: false, error: 'No password set yet' }, { status: 400 })
                }
                const { verifyPassword } = await import('@/lib/db/local-auth')
                const ok = await verifyPassword(current_password, user.password_hash)
                if (!ok) {
                    return NextResponse.json({ success: false, error: 'Current password incorrect' }, { status: 401 })
                }
            }

            const passwordHash = await hashPassword(password)
            const { error: updateError } = await supabaseAdmin
                .from('users')
                .update({ password_hash: passwordHash })
                .eq('id', payload.sub)

            if (updateError) {
                return NextResponse.json({ success: false, error: updateError.message }, { status: 500 })
            }

            return NextResponse.json({ success: true, message: 'Password updated successfully' })
        }

        // Modo Supabase Cloud
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        const supabase = createClient(supabaseUrl, supabaseAnonKey)

        const { error: setSessionError } = await supabase.auth.setSession({
            access_token: token,
            refresh_token: token
        })

        if (setSessionError) {
            return NextResponse.json({ success: false, error: 'Session invalid' }, { status: 401 })
        }

        const { error } = await supabase.auth.updateUser({ password })

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 400 })
        }

        return NextResponse.json({ success: true, message: 'Password updated successfully' })
    } catch (error: any) {
        console.error('Update Password API Error:', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
