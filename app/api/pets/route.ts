import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getAuthenticatedUser } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
        }

        const body = await request.json();
        const { name, type, breed, birth_date, gender, weight, allergies } = body;

        // Security: pets siempre se crean para el user autenticado
        const user_id = user.id;

        const { data, error } = await supabaseAdmin
            .from('pets')
            .insert([{ user_id, name, type, breed, birth_date, gender, weight, allergies }])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ success: true, data }, { status: 201 });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
