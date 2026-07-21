import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { isLocalDb } from '@/lib/db/pg-client'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies()
        let token = cookieStore.get('auth_token')?.value

        if (!token) {
            const authHeader = request.headers.get('Authorization')
            if (authHeader?.startsWith('Bearer ')) {
                token = authHeader.substring(7)
            }
        }

        if (!token) {
            return NextResponse.json({ success: false, user: null }, { status: 401 })
        }

        if (isLocalDb()) {
            return await handleLocalMe(token)
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: `Bearer ${token}` } }
        })

        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return NextResponse.json({ success: false, user: null }, { status: 401 })
        }

        const { data: profile } = await supabaseAdmin
            .from('users')
            .select('*, roles(name)')
            .eq('id', user.id)
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
            user,
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

async function handleLocalMe(token: string) {
    const { verifyLocalToken } = await import('@/lib/db/local-auth')

    const payload = verifyLocalToken(token)
    if (!payload) {
        return NextResponse.json({ success: false, user: null }, { status: 401 })
    }

    const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('*, roles(name)')
        .eq('id', payload.sub)
        .single()

    if (error || !user) {
        return NextResponse.json({ success: false, user: null }, { status: 401 })
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

    return NextResponse.json({
        success: true,
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
