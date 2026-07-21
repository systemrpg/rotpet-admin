import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getAuthenticatedUser } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
        }

        const { data, error } = await supabaseAdmin
            .from('wishlist')
            .select('*, products(id, name, slug, price, image_url, description)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            if (error.message?.includes('relation') || error.code === '42P01') {
                return NextResponse.json({ success: true, data: [] });
            }
            throw error;
        }
        return NextResponse.json({ success: true, data: data || [] });
    } catch (error: any) {
        console.error('Wishlist GET error:', error);
        return NextResponse.json({ success: true, data: [] });
    }
}

export async function POST(request: Request) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
        }

        const body = await request.json();
        const product_id = body.producto_id || body.product_id;

        if (!product_id) {
            return NextResponse.json({ success: false, error: 'product_id es requerido' }, { status: 400 });
        }

        // Verificar si ya está
        const { data: existing } = await supabaseAdmin
            .from('wishlist')
            .select('id')
            .eq('user_id', user.id)
            .eq('product_id', product_id)
            .single();

        if (existing) {
            return NextResponse.json({ success: true, data: existing, message: 'Ya está en tu lista de deseos' });
        }

        const { data, error } = await supabaseAdmin
            .from('wishlist')
            .insert([{ user_id: user.id, product_id }])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ success: true, data }, { status: 201 });
    } catch (error: any) {
        console.error('Wishlist POST error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
        }

        const { error } = await supabaseAdmin.from('wishlist').delete().eq('user_id', user.id);
        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Wishlist DELETE error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
