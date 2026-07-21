import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const producto_id = searchParams.get('producto_id');

        if (!producto_id) {
            return NextResponse.json({ success: false, error: 'producto_id is required' }, { status: 400 });
        }

        const { data: reviews, error } = await supabaseAdmin
            .from('reviews')
            .select('*')
            .eq('producto_id', producto_id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json({ success: true, data: reviews || [] });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { producto_id, user_id, nombre_usuario, calificacion, comentario } = body;

        if (!producto_id || !calificacion || !comentario) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('reviews')
            .insert([{
                producto_id,
                user_id: user_id || null,
                nombre_usuario: nombre_usuario || 'Anónimo',
                calificacion,
                comentario,
                created_at: new Date().toISOString(),
            }])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ success: true, data }, { status: 201 });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
