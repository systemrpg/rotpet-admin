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
        const { data: product, error: productError } = await supabaseAdmin
            .from('products')
            .select(`
                *,
                category:categories(id, name),
                pet_type:pet_types(id, name, slug)
            `)
            .eq('id', id)
            .single();

        if (productError && productError.code === 'PGRST116') {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }
        if (productError) throw productError;
        if (!product) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        const { data: variants } = await supabaseAdmin
            .from('product_variants')
            .select('*')
            .eq('product_id', id);

        return NextResponse.json({
            success: true,
            data: { ...product, variants: variants || [] }
        });
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
        const { name, sku, price, quantity, category_id, pet_type_id, image_url, description, status, variants } = body;

        const updateData: any = { name, sku, price, quantity, category_id, image_url, description, status };
        if (pet_type_id !== undefined) updateData.pet_type_id = pet_type_id;

        const { data: product, error: productError } = await supabaseAdmin
            .from('products')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (productError) throw productError;

        if (variants) {
            await supabaseAdmin.from('product_variants').delete().eq('product_id', id);
            if (variants.length > 0) {
                const variantsToInsert = variants.map((v: any) => ({
                    product_id: id,
                    sku: v.sku,
                    price: v.price || null,
                    stock: v.stock || 0,
                    attributes: v.attributes,
                    status: v.status || 'active',
                }));
                const { error: variantsError } = await supabaseAdmin
                    .from('product_variants')
                    .insert(variantsToInsert);
                if (variantsError) throw variantsError;
            }
        }

        return NextResponse.json({ success: true, data: product });
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
            .from('products')
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
