import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

interface RouteContext {
    params: Promise<{ id: string }>;
}

// GET es público (cualquiera puede ver un post publicado por slug)
export async function GET(request: Request, context: RouteContext) {
    try {
        const idOrSlug = (await context.params).id;
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

        let query = supabaseAdmin.from('blog_posts').select('*');
        if (isUuid) query = query.eq('id', idOrSlug);
        else query = query.eq('slug', idOrSlug);

        const { data, error } = await query.single();
        if (error && (error.code === 'PGRST116' || !data)) {
            return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
        }
        if (error) throw error;
        if (!data) return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 404 });
    }
}

export async function PUT(request: Request, context: RouteContext) {
    try {
        await requireAdmin();
        const id = (await context.params).id;
        const body = await request.json();

        const { data, error } = await supabaseAdmin
            .from('blog_posts')
            .update({ ...body, updated_at: new Date().toISOString() })
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
    try {
        await requireAdmin();
        const id = (await context.params).id;

        const { error } = await supabaseAdmin.from('blog_posts').delete().eq('id', id);
        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('API Error:', error);
        const status = error.message.includes('Unauthorized') || error.message.includes('Forbidden') ? 401 : 500;
        return NextResponse.json({ success: false, error: error.message }, { status });
    }
}
