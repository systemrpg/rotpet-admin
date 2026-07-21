import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin, getAuthenticatedUser } from '@/lib/auth-server';
import { sendOrderConfirmationEmail } from '@/lib/email/send';
import { calculateShipping } from '@/lib/shop/utils/shipping';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await requireAdmin();

        const { data, error } = await supabaseAdmin
            .from('orders')
            .select('*, users(full_name, email), order_items(product_id, quantity, unit_price, products(name))')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('API Error:', error);
        const status = error.message?.includes('Unauthorized') || error.message?.includes('Forbidden') ? 401 : 500;
        return NextResponse.json({ success: false, error: error.message }, { status });
    }
}

function normalizeOrderItems(body: any): { product_id: string; quantity: number; unit_price: number }[] {
    const rawItems = body.items || body.productos || [];
    return rawItems.map((item: any) => ({
        product_id: item.product_id || item.producto_id,
        quantity: item.quantity || item.cantidad || 1,
        unit_price: item.unit_price || item.precio_unitario || 0,
    }));
}

export async function POST(request: Request) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json({ success: false, error: 'No autorizado. Inicia sesión para hacer un pedido.' }, { status: 401 });
        }

        const body = await request.json();
        const items = normalizeOrderItems(body);

        if (!items || items.length === 0) {
            return NextResponse.json({ success: false, error: 'El pedido debe contener al menos un producto.' }, { status: 400 });
        }

        const user_id = user.id;

        // 1. Validar stock
        const stockValidation: { id: string; name: string; currentStock: number; requested: number }[] = [];
        for (const item of items) {
            if (!item.product_id) {
                return NextResponse.json({ success: false, error: 'Cada producto debe tener un ID válido.' }, { status: 400 });
            }

            const { data: product, error: productError } = await supabaseAdmin
                .from('products')
                .select('id, name, quantity')
                .eq('id', item.product_id)
                .single();

            if (productError || !product) {
                return NextResponse.json({ success: false, error: `Producto no encontrado: ${item.product_id}` }, { status: 400 });
            }

            const currentStock = product.quantity ?? 0;
            if (currentStock < item.quantity) {
                return NextResponse.json({
                    success: false,
                    error: `Stock insuficiente para "${product.name}". Disponible: ${currentStock}, Solicitado: ${item.quantity}`
                }, { status: 400 });
            }

            stockValidation.push({ id: product.id, name: product.name, currentStock, requested: item.quantity });
        }

        // 2. Calcular total
        const calculatedTotal = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
        const total_amount = body.total_amount || calculatedTotal;

        // 3. Crear orden
        const orderData: Record<string, any> = { user_id, total_amount, status: 'pending' };
        if (body.direccion_entrega || body.shipping_address) {
            orderData.shipping_address = body.direccion_entrega || body.shipping_address;
        }
        if (body.telefono_contacto || body.contact_phone) {
            orderData.contact_phone = body.telefono_contacto || body.contact_phone;
        }
        if (body.metodo_pago || body.payment_method) {
            orderData.payment_method = body.metodo_pago || body.payment_method;
        }
        if (body.notas || body.notes) {
            orderData.notes = body.notas || body.notes;
        }

        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert([orderData])
            .select()
            .single();

        let finalOrder = order;
        if (orderError) {
            console.warn('Order insert with extra fields failed, retrying with basic fields:', orderError.message);
            const { data: basicOrder, error: basicError } = await supabaseAdmin
                .from('orders')
                .insert([{ user_id, total_amount, status: 'pending' }])
                .select()
                .single();

            if (basicError) throw basicError;
            finalOrder = basicOrder;
        }

        // 4. Items + reducir stock
        await insertOrderItemsAndReduceStock(finalOrder.id, items, stockValidation);

        // 5. Email (no bloqueante)
        if (user.email) {
            sendOrderConfirmationEmailAsync(user.email, finalOrder.id, items, stockValidation, total_amount, body);
        }

        return NextResponse.json({ success: true, data: finalOrder }, { status: 201 });
    } catch (error: any) {
        console.error('API Error creating order:', error);
        return NextResponse.json({ success: false, error: error.message || 'Error interno del servidor' }, { status: 500 });
    }
}

async function insertOrderItemsAndReduceStock(
    orderId: string,
    items: { product_id: string; quantity: number; unit_price: number }[],
    stockValidation: { id: string; currentStock: number; requested: number }[]
) {
    const orderItems = items.map((item) => ({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
    }));

    const { error: itemsError } = await supabaseAdmin
        .from('order_items')
        .insert(orderItems);

    if (itemsError) {
        console.error('Error creating order items, rolling back order:', itemsError);
        await supabaseAdmin.from('orders').delete().eq('id', orderId);
        throw new Error(`Error al crear los items del pedido: ${itemsError.message}`);
    }

    for (const validation of stockValidation) {
        const newStock = Math.max(0, validation.currentStock - validation.requested);
        const { error: stockError } = await supabaseAdmin
            .from('products')
            .update({ quantity: newStock })
            .eq('id', validation.id);

        if (stockError) {
            console.error(`Error reducing stock for product ${validation.id}:`, stockError);
        }
    }
}

function sendOrderConfirmationEmailAsync(
    email: string,
    orderId: string,
    items: { product_id: string; quantity: number; unit_price: number }[],
    stockValidation: { id: string; name: string; currentStock: number; requested: number }[],
    totalAmount: number,
    body: any
) {
    (async () => {
        try {
            const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
            const shipping = calculateShipping(subtotal);

            const emailItems = items.map((item) => {
                const validation = stockValidation.find((v) => v.id === item.product_id);
                return { name: validation?.name || 'Producto', quantity: item.quantity, unitPrice: item.unit_price };
            });

            const { data: userData } = await supabaseAdmin
                .from('users')
                .select('full_name')
                .eq('email', email)
                .single();

            await sendOrderConfirmationEmail(email, {
                orderId,
                customerName: userData?.full_name || 'Cliente',
                items: emailItems,
                subtotal,
                shipping,
                total: totalAmount,
                shippingAddress: body.direccion_entrega || body.shipping_address,
                paymentMethod: body.metodo_pago || body.payment_method,
            });
        } catch (err) {
            console.error('Error sending order confirmation email:', err);
        }
    })();
}
