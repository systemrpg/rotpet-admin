import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin } from '@/lib/auth-server';
import { sendOrderStatusEmail } from '@/lib/email/send';

export const dynamic = 'force-dynamic';

interface RouteContext {
    params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
    try {
        await requireAdmin();
        const { id } = await context.params;

        const { data, error } = await supabaseAdmin
            .from('orders')
            .select('*, users(full_name, email), order_items(product_id, quantity, unit_price, products(name))')
            .eq('id', id)
            .single();

        if (error && error.code === 'PGRST116') {
            return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
        }
        if (error) throw error;
        if (!data) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('API Error:', error);
        const status = error.message.includes('Unauthorized') || error.message.includes('Forbidden') ? 403 : 500;
        return NextResponse.json({ success: false, error: error.message }, { status });
    }
}

export async function PUT(request: Request, context: RouteContext) {
    try {
        await requireAdmin();
        const { id } = await context.params;

        const body = await request.json();
        const { status } = body;

        const allowedStatuses = ['pending', 'processing', 'completed', 'cancelled', 'shipped', 'delivered'];
        if (status && !allowedStatuses.includes(status)) {
            return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select('*, users(full_name, email)')
            .single();

        if (error) throw error;

        // Email notificación (no bloqueante)
        if (data && (data as any).users?.email) {
            const userData = (data as any).users;
            sendOrderStatusEmail(userData.email, {
                orderId: id,
                customerName: userData.full_name || 'Cliente',
                newStatus: status,
                total: Number(data.total_amount) || 0,
            }).catch((err) => console.error('Error sending status email:', err));
        }

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('API Error:', error);
        const errStatus = error.message?.includes('Unauthorized') || error.message?.includes('Forbidden') ? 403 : 500;
        return NextResponse.json({ success: false, error: error.message }, { status: errStatus });
    }
}
