import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { isLocalDb } from '@/lib/db/pg-client'

export async function POST(request: Request) {
    try {
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
        }

        // Modo local: como no tenemos servicio de email, devolvemos OK genérico
        // (la lógica de reset real se hace con la sesión activa vía update-password)
        if (isLocalDb()) {
            return NextResponse.json({
                success: true,
                message: 'Si el email existe, se ha enviado un enlace de recuperación.'
            })
        }

        const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const redirectTo = `${origin}/auth/restablecer-contrasena`

        const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
            redirectTo,
        })

        if (error) {
            console.error('Supabase Reset Password Error:', error)
            if (error.status === 429) {
                return NextResponse.json({ success: false, error: 'Too many requests. Please try again later.' }, { status: 429 })
            }
            return NextResponse.json({ success: false, error: error.message }, { status: 400 })
        }

        return NextResponse.json({ success: true, message: 'Password reset link sent' })
    } catch (error: any) {
        console.error('Forgot Password API Error:', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
