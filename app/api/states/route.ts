import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const country_id = searchParams.get('country_id');

    try {
        let query = supabaseAdmin.from('states').select('*');
        if (country_id) query = query.eq('country_id', country_id);

        const { data, error } = await query;
        if (error) throw error;
        return NextResponse.json({ success: true, data: data || [] });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
