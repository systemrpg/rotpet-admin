import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isLocalDb } from '@/lib/db/pg-client'

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        if (isLocalDb()) {
            return await handleLocalLogin(email, password)
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        const supabase = createClient(supabaseUrl, supabaseAnonKey)

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            const isUnverified = error.message.toLowerCase().includes('email not confirmed')
            return NextResponse.json(
                {
                    success: false,
                    error: isUnverified ? 'Debes verificar tu correo electrónico' : error.message,
                    requiresVerification: isUnverified
                },
                { status: 401 }
            )
        }

        const { supabaseAdmin } = await import('@/lib/supabaseAdmin')
        const { data: profile } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single()

        let isAdmin = false
        let isClient = true

        if (profile && profile.role_id) {
            const { data: roleData } = await supabaseAdmin
                .from('roles')
                .select('name')
                .eq('id', profile.role_id)
                .single()

            const roleName = roleData?.name?.toLowerCase()
            if (roleName === 'admin' || roleName === 'superadmin') {
                isAdmin = true
            }
        }

        return NextResponse.json({
            success: true,
            session: data.session,
            user: data.user,
            profile: {
                ...profile,
                es_admin: isAdmin,
                es_cliente: isClient
            }
        })

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}

async function handleLocalLogin(email: string, password: string) {
    const { verifyPassword, hashPassword, createLocalToken, ensurePasswordColumn } = await import('@/lib/db/local-auth')
    const { supabaseAdmin } = await import('@/lib/supabaseAdmin')

    await ensurePasswordColumn()

    const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

    if (error || !user) {
        return NextResponse.json(
            { success: false, error: 'Credenciales inválidas' },
            { status: 401 }
        )
    }

    // Usuario sin password_hash: en modo local, establecer contraseña en primer login
    if (!user.password_hash) {
        const passwordHash = await hashPassword(password)
        await supabaseAdmin
            .from('users')
            .update({ password_hash: passwordHash })
            .eq('id', user.id)
        // Continuar con login
    } else {
        const valid = await verifyPassword(password, user.password_hash)
        if (!valid) {
            return NextResponse.json(
                { success: false, error: 'Credenciales inválidas' },
                { status: 401 }
            )
        }
    }

    let isAdmin = false
    let isClient = true

    if (user.role_id) {
        const { data: roleData } = await supabaseAdmin
            .from('roles')
            .select('name')
            .eq('id', user.role_id)
            .single()

        const roleName = roleData?.name?.toLowerCase()
        if (roleName === 'admin' || roleName === 'superadmin') {
            isAdmin = true
        }
    }

    const token = createLocalToken(user.id, email)

    return NextResponse.json({
        success: true,
        session: { access_token: token },
        user: {
            id: user.id,
            email: user.email,
            user_metadata: { nombre_completo: user.full_name, telefono: user.phone }
        },
        profile: {
            ...user,
            es_admin: isAdmin,
            es_cliente: isClient
        }
    })
}
