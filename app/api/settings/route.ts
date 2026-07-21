import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

function getDefaultSettings(): Record<string, string> {
    return {
        store_name: 'Rot Pet Shop',
        store_email: 'info@rot.pet',
        store_phone: '+58 412 123 4567',
        store_address: 'Venezuela',
        store_currency: 'USD',
        store_whatsapp: '+584121234567',
        shipping_free_threshold: '500',
        shipping_standard_cost: '99',
        shipping_estimated_days: '2-3',
    };
}

export async function GET() {
    try {
        await requireAdmin();

        const { data, error } = await supabaseAdmin
            .from('settings')
            .select('*')
            .order('key');

        if (error) {
            if (error.message?.includes('relation') || error.code === '42P01') {
                return NextResponse.json({ success: true, data: getDefaultSettings() });
            }
            throw error;
        }

        const settingsObj: Record<string, string> = {};
        for (const row of (data || [])) {
            settingsObj[row.key] = row.value;
        }

        const merged = { ...getDefaultSettings(), ...settingsObj };
        return NextResponse.json({ success: true, data: merged });
    } catch (error: any) {
        console.error('Settings GET error:', error);
        return NextResponse.json({ success: true, data: getDefaultSettings() });
    }
}

export async function PUT(request: Request) {
    try {
        await requireAdmin();

        const body = await request.json();
        const settings = body.settings || body;

        for (const [key, value] of Object.entries(settings)) {
            const { error } = await supabaseAdmin
                .from('settings')
                .upsert({ key, value: String(value) }, { onConflict: 'key' });

            if (error) {
                if (error.message?.includes('relation') || error.code === '42P01') {
                    return NextResponse.json({
                        success: true,
                        message: 'Tabla settings no existe. Configuración no persistida.',
                        data: settings,
                    });
                }
                throw error;
            }
        }

        return NextResponse.json({ success: true, data: settings });
    } catch (error: any) {
        console.error('Settings PUT error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
