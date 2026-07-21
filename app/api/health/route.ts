import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { isLocalDb } from '@/lib/db/pg-client';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const mode = isLocalDb() ? 'local-postgres' : 'supabase-cloud';

        // Test query: count users + first 3 products
        const [usersRes, productsRes, rolesRes] = await Promise.all([
            supabaseAdmin.from('users').select('*, roles(name)', { count: 'exact' }),
            supabaseAdmin.from('products').select('*').limit(3),
            supabaseAdmin.from('roles').select('id, name'),
        ]);

        return NextResponse.json({
            success: true,
            mode,
            db: {
                users_count: usersRes.count ?? (Array.isArray(usersRes.data) ? usersRes.data.length : 0),
                users_sample: usersRes.data,
                products_sample: productsRes.data,
                products_error: productsRes.error,
                roles: rolesRes.data,
                roles_error: rolesRes.error,
            },
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message, stack: error.stack },
            { status: 500 }
        );
    }
}
