import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await requireAdmin();

        const { data, error } = await supabaseAdmin
            .from('coupons')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('API Error:', error);
        const status = error.message?.includes('Unauthorized') || error.message?.includes('Forbidden') ? 401 : 500;
        return NextResponse.json({ success: false, error: error.message }, { status });
    }
}

export async function POST(request: Request) {
    try {
        await requireAdmin();

        const body = await request.json();
        const { code, discount_type, discount_value, min_purchase, expiration_date, usage_limit, status } = body;
        const upperCode = (code || '').toUpperCase();

        const { data, error } = await supabaseAdmin
            .from('coupons')
            .insert([{
                code: upperCode,
                discount_type,
                discount_value,
                min_purchase,
                expiration_date,
                usage_limit,
                status,
            }])
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json({ success: false, error: 'El código del cupón ya existe' }, { status: 400 });
            }
            throw error;
        }

        return NextResponse.json({ success: true, data }, { status: 201 });
    } catch (error: any) {
        console.error('API Error:', error);
        const status = error.message?.includes('Unauthorized') || error.message?.includes('Forbidden') ? 401 : 500;
        return NextResponse.json({ success: false, error: error.message }, { status });
    }
}
