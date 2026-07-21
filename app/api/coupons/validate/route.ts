import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { code, cartTotal } = body;

        if (!code) {
            return NextResponse.json({ success: false, error: 'Código requerido' }, { status: 400 });
        }

        const upperCode = code.toUpperCase();

        const { data: coupon, error } = await supabaseAdmin
            .from('coupons')
            .select('*')
            .eq('code', upperCode)
            .single();

        if (error || !coupon) {
            return NextResponse.json({ success: false, error: 'Cupón inválido' }, { status: 404 });
        }

        if (coupon.status !== 'active') {
            return NextResponse.json({ success: false, error: 'Este cupón está inactivo' }, { status: 400 });
        }

        if (coupon.expiration_date && new Date(coupon.expiration_date) < new Date()) {
            return NextResponse.json({ success: false, error: 'Este cupón ha expirado' }, { status: 400 });
        }

        if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
            return NextResponse.json({ success: false, error: 'Este cupón ha agotado sus usos' }, { status: 400 });
        }

        if (coupon.min_purchase && cartTotal < coupon.min_purchase) {
            return NextResponse.json(
                { success: false, error: `La compra mínima para este cupón es de $${coupon.min_purchase}` },
                { status: 400 }
            );
        }

        let discountAmount = 0;
        if (coupon.discount_type === 'percentage') {
            discountAmount = (cartTotal * coupon.discount_value) / 100;
        } else {
            discountAmount = coupon.discount_value;
        }

        if (discountAmount > cartTotal) {
            discountAmount = cartTotal;
        }

        return NextResponse.json({
            success: true,
            valid: true,
            coupon_code: coupon.code,
            discount_type: coupon.discount_type,
            discount_value: coupon.discount_value,
            discount_amount: discountAmount,
            final_total: cartTotal - discountAmount,
        });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
