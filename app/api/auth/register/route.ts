import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { isLocalDb } from '@/lib/db/pg-client'

export async function POST(request: Request) {
    try {
        const { email, password, nombre_completo, telefono } = await request.json()

        if (isLocalDb()) {
            return await handleLocalRegister(email, password, nombre_completo, telefono)
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        const supabase = createClient(supabaseUrl, supabaseAnonKey)

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    nombre_completo,
                    telefono
                }
            }
        })

        if (authError) {
            return NextResponse.json(
                { success: false, error: authError.message },
                { status: 400 }
            )
        }

        if (!authData.user) {
            return NextResponse.json(
                { success: false, error: 'No se pudo iniciar el registro. El usuario podría ya existir.' },
                { status: 400 }
            )
        }

        const roleId = await getClientRoleId()

        const { error: dbError } = await supabaseAdmin
            .from('users')
            .upsert({
                id: authData.user.id,
                email: email,
                full_name: nombre_completo,
                role_id: roleId,
                status: 'active'
            })

        if (dbError) {
            console.error('Error creating user profile:', dbError)
        }

        const session = authData.session

        return NextResponse.json({
            success: true,
            message: session ? 'Usuario registrado y logueado' : 'Usuario registrado. Por favor verifica tu correo.',
            user: authData.user,
            session: session,
            requiresVerification: !session
        })

    } catch (error: any) {
        console.error('Register API Error:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}

async function getClientRoleId(): Promise<string | undefined> {
    const { data: roleData } = await supabaseAdmin
        .from('roles')
        .select('id')
        .eq('name', 'client')
        .single()

    if (roleData?.id) return roleData.id

    const { data: fallbackRole } = await supabaseAdmin
        .from('roles')
        .select('id')
        .neq('name', 'admin')
        .limit(1)
        .single()

    return fallbackRole?.id
}

async function handleLocalRegister(email: string, password: string, nombre_completo: string, telefono: string) {
    const { hashPassword, createLocalToken, ensurePasswordColumn } = await import('@/lib/db/local-auth')

    await ensurePasswordColumn()

    const { data: existing } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

    if (existing) {
        return NextResponse.json(
            { success: false, error: 'Ya existe una cuenta con este correo electrónico.' },
            { status: 400 }
        )
    }

    const roleId = await getClientRoleId()
    const passwordHash = await hashPassword(password)

    const { data: newUser, error: insertError } = await supabaseAdmin
        .from('users')
        .insert({
            email,
            full_name: nombre_completo,
            phone: telefono,
            password_hash: passwordHash,
            role_id: roleId,
            status: 'active'
        })
        .select()
        .single()

    if (insertError || !newUser) {
        console.error('Error creating local user:', insertError)
        return NextResponse.json(
            { success: false, error: insertError?.message || 'Error al crear el usuario' },
            { status: 500 }
        )
    }

    const token = createLocalToken(newUser.id, email)

    return NextResponse.json({
        success: true,
        message: 'Usuario registrado y logueado',
        user: {
            id: newUser.id,
            email: newUser.email,
            user_metadata: { nombre_completo, telefono }
        },
        session: { access_token: token },
        requiresVerification: false
    })
}
