import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

export async function GET() {
    const { data: roles, error } = await supabaseAdmin.from('roles').select('*')
    return NextResponse.json({ success: true, roles, error })
}
