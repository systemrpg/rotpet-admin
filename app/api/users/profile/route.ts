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
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        // Modo local: derivar user del JWT local
        if (isLocalDb()) {
            const { verifyLocalToken } = await import('@/lib/db/local-auth')
            const payload = verifyLocalToken(token)
            if (!payload) {
                return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 })
            }

            const { data: profile, error: profileError } = await supabaseAdmin
                .from('users')
                .select('*, roles(name)')
                .eq('id', payload.sub)
                .single()

            if (profileError || !profile) {
                return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 })
            }

            return NextResponse.json({ success: true, data: profile })
        }

        // Modo Supabase Cloud
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: `Bearer ${token}` } }
        })

        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 })
        }

        const { data: profile, error: profileError } = await supabaseAdmin
            .from('users')
            .select('*, roles(name)')
            .eq('id', user.id)
            .single()

        if (profileError) {
            if (profileError.code === 'PGRST116') {
                // Profile missing, auto-create it
                const { data: roleData } = await supabaseAdmin
                    .from('roles')
                    .select('id')
                    .ilike('name', '%client%')
                    .single()

                let roleId = roleData?.id
                if (!roleId) {
                    const { data: fallbackRole } = await supabaseAdmin.from('roles').select('id').neq('name', 'admin').limit(1).single()
                    roleId = fallbackRole?.id
                }

                const { data: newProfile, error: createError } = await supabaseAdmin
                    .from('users')
                    .upsert({
                        id: user.id,
                        email: user.email,
                        full_name: user.user_metadata?.nombre_completo || '',
                        role_id: roleId,
                        status: 'active'
                    })
                    .select('*, roles(name)')
                    .single()

                if (createError) {
                    return NextResponse.json({ success: false, error: 'Failed to create profile' }, { status: 500 })
                }

                return NextResponse.json({
                    success: true,
                    data: { ...newProfile, telefono: user.user_metadata?.telefono || '' }
                })
            }
            return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            data: { ...profile, telefono: user.user_metadata?.telefono || '' }
        })

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}

export async function PUT(request: Request) {
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
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { full_name, telefono } = body

        // Modo local
        if (isLocalDb()) {
            const { verifyLocalToken } = await import('@/lib/db/local-auth')
            const payload = verifyLocalToken(token)
            if (!payload) {
                return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 })
            }

            const updateData: any = {}
            if (full_name !== undefined) updateData.full_name = full_name
            if (telefono !== undefined) updateData.phone = telefono

            const { data: profile, error: dbError } = await supabaseAdmin
                .from('users')
                .update(updateData)
                .eq('id', payload.sub)
                .select('*, roles(name)')
                .single()

            if (dbError) {
                return NextResponse.json({ success: false, error: dbError.message }, { status: 500 })
            }

            return NextResponse.json({ success: true, data: profile })
        }

        // Modo Supabase Cloud
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: `Bearer ${token}` } }
        })

        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 })
        }

        if (telefono) {
            const { error: updateAuthError } = await supabase.auth.updateUser({
                data: { telefono }
            })
            if (updateAuthError) console.error('Error updating auth metadata:', updateAuthError)
        }

        const { data: profile, error: dbError } = await supabaseAdmin
            .from('users')
            .update({ full_name })
            .eq('id', user.id)
            .select('*, roles(name)')
            .single()

        if (dbError) {
            return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            data: { ...profile, telefono: telefono || user.user_metadata?.telefono || '' }
        })

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}
