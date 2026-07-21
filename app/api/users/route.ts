import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Security check: Only admins can list users
        await requireAdmin();

        const { data, error } = await supabaseAdmin
            .from('users')
            .select('*, roles(name)')
            .neq('status', 'inactive');

        if (error) throw error;

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('API Error:', error);
        const status = error.message.includes('Unauthorized') || error.message.includes('Forbidden') ? 401 : 500;
        return NextResponse.json({ success: false, error: error.message }, { status });
    }
}

export async function POST(request: Request) {
    try {
        // Security check: Only admins can create users with specific roles directly
        await requireAdmin();

        const body = await request.json();
        const { email, full_name, role_id, status } = body;

        const { data, error } = await supabaseAdmin
            .from('users')
            .insert([{ email, full_name, role_id, status }])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, data }, { status: 201 });
    } catch (error: any) {
        console.error('API Error:', error);
        const status = error.message.includes('Unauthorized') || error.message.includes('Forbidden') ? 401 : 500;
        return NextResponse.json({ success: false, error: error.message }, { status });
    }
}
