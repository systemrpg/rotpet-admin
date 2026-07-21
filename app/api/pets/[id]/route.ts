import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

interface RouteContext {
    params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
    const { id } = await context.params;
    try {
        const body = await request.json();
        const { name, type, breed, birth_date, gender, weight, allergies } = body;

        const { data, error } = await supabaseAdmin
            .from('pets')
            .update({ name, type, breed, birth_date, gender, weight, allergies })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        if (!data) return NextResponse.json({ success: false, error: 'Mascota no encontrada' }, { status: 404 });
        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: RouteContext) {
    const { id } = await context.params;
    try {
        const { error } = await supabaseAdmin.from('pets').delete().eq('id', id);
        if (error) throw error;
        return NextResponse.json({ success: true, message: 'Mascota eliminada correctamente' });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
