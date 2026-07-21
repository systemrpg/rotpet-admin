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
            .from('users')
            .select('*, roles(name)')
            .eq('id', id)
            .single();

        if (error && (error.code === 'PGRST116' || !data)) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }
        if (error) throw error;
        if (!data) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request, context: RouteContext) {
    const { id } = await context.params;
    try {
        // Security check: only admins can update other users
        await requireAdmin();

        const body = await request.json();
        const { email, full_name, role_id, status, balance, internal_notes, phone, password } = body;

        const updateData: any = { email, full_name, role_id, status };
        if (balance !== undefined) updateData.balance = balance;
        if (internal_notes !== undefined) updateData.internal_notes = internal_notes;
        if (phone !== undefined) updateData.phone = phone;

        // Si viene password nuevo, hashearlo
        if (password) {
            const { hashPassword } = await import('@/lib/db/local-auth');
            updateData.password_hash = await hashPassword(password);
        }

        const { data, error } = await supabaseAdmin
            .from('users')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('API Error:', error);
        const httpStatus = error.message.includes('Unauthorized') || error.message.includes('Forbidden') ? 401 : 500;
        return NextResponse.json({ success: false, error: error.message }, { status: httpStatus });
    }
}

export async function DELETE(request: Request, context: RouteContext) {
    const { id } = await context.params;
    try {
        // Security check
        await requireAdmin();

        // Soft delete: status = inactive
        const { error } = await supabaseAdmin
            .from('users')
            .update({ status: 'inactive' })
            .eq('id', id);

        if (error) throw error;

        return new NextResponse(null, { status: 204 });
    } catch (error: any) {
        console.error('API Error:', error);
        const httpStatus = error.message.includes('Unauthorized') || error.message.includes('Forbidden') ? 401 : 500;
        return NextResponse.json({ success: false, error: error.message }, { status: httpStatus });
    }
}
