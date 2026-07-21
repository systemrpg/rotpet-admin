import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getAuthenticatedUser } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

interface RouteContext {
    params: Promise<{ productId: string }>;
}

export async function DELETE(request: Request, context: RouteContext) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
        }

        const { productId } = await context.params;

        const { error } = await supabaseAdmin
            .from('wishlist')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', productId);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Wishlist DELETE product error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
