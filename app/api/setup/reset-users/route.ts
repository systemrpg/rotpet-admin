import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { isLocalDb } from '@/lib/db/pg-client'

export const dynamic = 'force-dynamic'

/**
 * ⚠️ DESTRUCTIVO: Borra TODOS los usuarios del sistema.
 * Solo funciona en modo Supabase Cloud (no en local).
 * Útil para resetear el entorno de desarrollo.
 */
export async function POST() {
    if (isLocalDb()) {
        return NextResponse.json(
            { success: false, error: 'reset-users no soportado en modo local. Usá docker compose down -v para resetear.' },
            { status: 400 }
        );
    }

    try {
        const adminAuth = (supabaseAdmin as any).auth?.admin;
        if (!adminAuth?.listUsers) {
            return NextResponse.json(
                { success: false, error: 'supabaseAdmin.auth.admin no disponible' },
                { status: 500 }
            );
        }

        const { data: { users }, error: listError } = await adminAuth.listUsers();
        if (listError) throw listError;

        const results = [];
        for (const user of users) {
            const { error: deleteError } = await adminAuth.deleteUser(user.id);
            results.push({ id: user.id, email: user.email, deleted: !deleteError, error: deleteError });
        }

        // Limpieza defensiva de la tabla public.users
        const { error: dbError } = await supabaseAdmin
            .from('users')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');

        return NextResponse.json({
            success: true,
            count: users.length,
            results,
            dbCleaned: !dbError,
            dbError,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
