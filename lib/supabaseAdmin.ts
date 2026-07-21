import { createClient } from '@supabase/supabase-js';
import { isLocalDb } from './db/pg-client';
import { localSupabaseAdmin } from './db/local-adapter';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!isLocalDb() && (!supabaseUrl || !supabaseServiceRoleKey)) {
    if (process.env.NODE_ENV === 'development') {
        console.warn('Missing Supabase Service Role credentials in .env.local');
    }
}

// En modo Docker local usa el adaptador directo a PostgreSQL.
// En producción / staging usa el cliente de Supabase normal.
const supabaseCloudClient = (!isLocalDb() && supabaseUrl && supabaseServiceRoleKey)
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
    : null;

export const supabaseAdmin: any = isLocalDb() ? localSupabaseAdmin : supabaseCloudClient!;
