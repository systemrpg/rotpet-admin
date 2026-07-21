import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('brands')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await requireAdmin();

        const body = await request.json();
        const { name, slug, logo_url, description } = body;

        const { data, error } = await supabaseAdmin
            .from('brands')
            .insert([{ name, slug, logo_url, description }])
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json({ success: false, error: 'Brand name or slug already exists' }, { status: 400 });
            }
            throw error;
        }
        return NextResponse.json({ success: true, data }, { status: 201 });
    } catch (error: any) {
        console.error('API Error:', error);
        const status = error.message.includes('Unauthorized') || error.message.includes('Forbidden') ? 401 : 500;
        return NextResponse.json({ success: false, error: error.message }, { status });
    }
}
