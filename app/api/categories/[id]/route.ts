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
        const { data, error } = await supabaseAdmin
            .from('categories')
            .select('*')
            .eq('id', id)
            .single();

        if (error && (error.code === 'PGRST116' || !data)) {
            return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
        }
        if (error) throw error;
        if (!data) return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request, context: RouteContext) {
    const { id } = await context.params;
    try {
        await requireAdmin();

        const body = await request.json();
        const { name, slug, image_url, status } = body;

        const { data, error } = await supabaseAdmin
            .from('categories')
            .update({ name, slug, image_url, status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('API Error:', error);
        const status = error.message.includes('Unauthorized') || error.message.includes('Forbidden') ? 401 : 500;
        return NextResponse.json({ success: false, error: error.message }, { status });
    }
}

export async function DELETE(request: Request, context: RouteContext) {
    const { id } = await context.params;
    try {
        await requireAdmin();

        const { error } = await supabaseAdmin
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return new NextResponse(null, { status: 204 });
    } catch (error: any) {
        console.error('API Error:', error);
        const status = error.message.includes('Unauthorized') || error.message.includes('Forbidden') ? 401 : 500;
        return NextResponse.json({ success: false, error: error.message }, { status });
    }
}
