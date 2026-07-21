import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const destacado = searchParams.get('destacado') === 'true';
        const nuevo = searchParams.get('nuevo') === 'true';
        const search = searchParams.get('search');
        const category_id = searchParams.get('category_id') || searchParams.get('categoria');
        const pet_type_id = searchParams.get('pet_type_id') || searchParams.get('petType') || searchParams.get('mascota');
        const limit = parseInt(searchParams.get('limit') || '50');

        let query = supabaseAdmin
            .from('products')
            .select(`
                *,
                category:categories(id, name),
                pet_type:pet_types(id, name, slug)
            `);

        if (category_id) {
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(category_id);
            if (isUuid) {
                query = query.eq('category_id', category_id);
            } else {
                const { data: cat } = await supabaseAdmin.from('categories').select('id').eq('slug', category_id.toLowerCase()).single();
                if (cat) query = query.eq('category_id', cat.id);
            }
        }

        if (pet_type_id) {
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(pet_type_id);
            if (isUuid) {
                query = query.eq('pet_type_id', pet_type_id);
            } else {
                const { data: pt } = await supabaseAdmin.from('pet_types').select('id').eq('slug', pet_type_id.toLowerCase()).single();
                if (pt) query = query.eq('pet_type_id', pt.id);
            }
        }

        if (search) {
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(search);
            if (isUuid) {
                query = query.eq('id', search);
            } else {
                query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,sku.ilike.%${search}%`);
            }
        }

        const { data: products, error: productsError } = await query
            .order('created_at', { ascending: false })
            .limit(limit);

        if (productsError) throw productsError;
        if (!products) {
            return NextResponse.json({ success: true, data: [] });
        }

        // Fetch variant counts
        let productsWithVariants = products;
        try {
            const { data: variants } = await supabaseAdmin
                .from('product_variants')
                .select('product_id');
            if (variants) {
                productsWithVariants = products.map((p: any) => {
                    const cnt = variants.filter((v: any) => v.product_id === p.id).length;
                    return { ...p, variants: [{ count: cnt }] };
                });
            }
        } catch (e) {
            console.warn('Variant fetch failed:', e);
        }

        return NextResponse.json({ success: true, data: productsWithVariants });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: error.message, data: [] }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await requireAdmin();

        const body = await request.json();
        const { name, sku, price, quantity, category_id, pet_type_id, image_url, description, status, variants } = body;

        const insertData: any = { name, sku, price, quantity, category_id, image_url, description, status };
        if (pet_type_id) insertData.pet_type_id = pet_type_id;

        const { data: product, error: productError } = await supabaseAdmin
            .from('products')
            .insert([insertData])
            .select()
            .single();

        if (productError) throw productError;

        if (variants && variants.length > 0) {
            const variantsToInsert = variants.map((v: any) => ({
                product_id: product.id,
                sku: v.sku,
                price: v.price || null,
                stock: v.stock || 0,
                attributes: v.attributes,
                status: v.status || 'active',
            }));

            const { error: variantsError } = await supabaseAdmin
                .from('product_variants')
                .insert(variantsToInsert);

            if (variantsError) console.error('Error creating variants:', variantsError);
        }

        return NextResponse.json({ success: true, data: product }, { status: 201 });
    } catch (error: any) {
        console.error('API Error:', error);
        const status = error.message.includes('Unauthorized') || error.message.includes('Forbidden') ? 401 : 500;
        return NextResponse.json({ success: false, error: error.message }, { status });
    }
}
