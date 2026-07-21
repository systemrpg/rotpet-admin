import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('categories')
            .select('*, products(count)');

        if (error) throw error;

        const categories = (data || []).map((cat: any) => ({
            ...cat,
            product_count: cat.products ? cat.products[0]?.count || 0 : 0,
        }));

        return NextResponse.json({ success: true, data: categories });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await requireAdmin();

        const body = await request.json();
        const { name, slug, image_url, status } = body;

        const { data, error } = await supabaseAdmin
            .from('categories')
            .insert([{ name, slug, image_url, status: status || 'active' }])
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
