import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

interface RouteContext {
    params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
    const { id } = await context.params;
    try {
        await requireAdmin();

        const { data, error } = await supabaseAdmin.from('coupons').select('*').eq('id', id).single();
        if (error && (error.code === 'PGRST116' || !data)) {
            return NextResponse.json({ success: false, error: 'Coupon not found' }, { status: 404 });
        }
        if (error) throw error;
        if (!data) return NextResponse.json({ success: false, error: 'Coupon not found' }, { status: 404 });
        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('API Error:', error);
        const status = error.message?.includes('Unauthorized') || error.message?.includes('Forbidden') ? 401 : 500;
        return NextResponse.json({ success: false, error: error.message }, { status });
    }
}

export async function PUT(request: Request, context: RouteContext) {
    const { id } = await context.params;
    try {
        await requireAdmin();

        const body = await request.json();
        const { code, discount_type, discount_value, min_purchase, expiration_date, usage_limit, status } = body;
        const upperCode = (code || '').toUpperCase();

        const { data, error } = await supabaseAdmin
            .from('coupons')
            .update({ code: upperCode, discount_type, discount_value, min_purchase, expiration_date, usage_limit, status })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json({ success: false, error: 'El código del cupón ya existe' }, { status: 400 });
            }
            throw error;
        }
        if (!data) return NextResponse.json({ success: false, error: 'Cupón no encontrado' }, { status: 404 });

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('API Error:', error);
        const status = error.message?.includes('Unauthorized') || error.message?.includes('Forbidden') ? 401 : 500;
        return NextResponse.json({ success: false, error: error.message }, { status });
    }
}

export async function DELETE(request: Request, context: RouteContext) {
    const { id } = await context.params;
    try {
        await requireAdmin();

        const { error } = await supabaseAdmin.from('coupons').delete().eq('id', id);
        if (error) throw error;
        return NextResponse.json({ success: true, message: 'Cupón eliminado correctamente' });
    } catch (error: any) {
        console.error('API Error:', error);
        const status = error.message?.includes('Unauthorized') || error.message?.includes('Forbidden') ? 401 : 500;
        return NextResponse.json({ success: false, error: error.message }, { status });
    }
}
