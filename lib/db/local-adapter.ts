/**
 * Adaptador local que emula la interfaz de supabase-js para desarrollo con Docker.
 * 
 * Implementa un subconjunto de la API de Supabase JS v2:
 *   supabaseAdmin.from('table').select('*').eq('col', val).single()
 *   supabaseAdmin.from('table').insert([...]).select().single()
 *   supabaseAdmin.from('table').update({...}).eq('col', val)
 *   supabaseAdmin.from('table').delete().eq('col', val)
 *   supabaseAdmin.from('table').upsert([...], { onConflict: 'key' })
 * 
 * Esto permite que todo el código de API Routes funcione sin cambios
 * tanto contra Supabase Cloud como contra PostgreSQL local en Docker.
 */

import { getPool } from './pg-client';

// ─── Tipos ──────────────────────────────────────────────────────────────

interface QueryResult<T = any> {
    data: T | null;
    error: { message: string; code?: string; details?: string } | null;
    count?: number;
}

// ─── Query Builder ──────────────────────────────────────────────────────

class QueryBuilder {
    private tableName: string;
    private operation: 'select' | 'insert' | 'update' | 'delete' | 'upsert' = 'select';
    private selectColumns = '*';
    private joins: { table: string; columns: string; fk: string }[] = [];
    private conditions: { column: string; operator: string; value: any }[] = [];
    private orConditions: string[] = [];
    private orderByClause: { column: string; ascending: boolean }[] = [];
    private limitValue: number | null = null;
    private isSingle = false;
    private insertData: Record<string, any>[] = [];
    private updateData: Record<string, any> = {};
    private upsertConflict: string | null = null;
    private returnData = false;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    // ── SELECT ──────────────────────────────────────────────────────────

    select(columns: string = '*'): QueryBuilder {
        // Only start a SELECT if this is a fresh query.
        // When chained after insert/update/delete/upsert, just enable RETURNING *.
        if (!['insert', 'update', 'delete', 'upsert'].includes(this.operation)) {
            this.operation = 'select';
        }
        this.returnData = true;

        // Parse Supabase-style join syntax (supports nested parentheses):
        //   "*, users(full_name, email)"                              → join table "users"
        //   "*, category:categories(id, name)"                        → alias "category" → table "categories"
        //   "*, order_items(product_id, qty, products(name))"         → nested joins
        const parsed = this.parseJoins(columns);
        this.selectColumns = parsed.columns || '*';
        this.joins = parsed.joins;

        return this;
    }

    private parseJoins(columns: string): { columns: string; joins: { table: string; columns: string; fk: string }[] } {
        const joins: { table: string; columns: string; fk: string }[] = [];
        let remaining = columns;

        // Match join expressions with balanced parentheses (supports nesting)
        // Pattern: optional_alias:table_name(...)
        const findNextJoin = (str: string): { fullMatch: string; alias: string; table: string; inner: string; startIdx: number } | null => {
            // Find pattern like "word(" or "word:word("
            const startRegex = /(?:(\w+):)?(\w+)\(/g;
            let m: RegExpExecArray | null;

            while ((m = startRegex.exec(str)) !== null) {
                const startIdx = m.index;
                const openParenIdx = m.index + m[0].length - 1;

                // Find matching closing paren (handling nesting)
                let depth = 1;
                let i = openParenIdx + 1;
                while (i < str.length && depth > 0) {
                    if (str[i] === '(') depth++;
                    if (str[i] === ')') depth--;
                    i++;
                }

                if (depth === 0) {
                    const inner = str.substring(openParenIdx + 1, i - 1);
                    const fullMatch = str.substring(startIdx, i);
                    return {
                        fullMatch,
                        alias: m[1] || '',
                        table: m[2],
                        inner,
                        startIdx,
                    };
                }
            }
            return null;
        };

        let joinMatch: ReturnType<typeof findNextJoin>;
        while ((joinMatch = findNextJoin(remaining)) !== null) {
            joins.push({
                table: joinMatch.table,
                columns: joinMatch.inner,
                fk: joinMatch.alias,
            });
            remaining = remaining.replace(joinMatch.fullMatch, '').replace(/,\s*,/g, ',');
        }

        remaining = remaining.replace(/,\s*$/, '').replace(/^\s*,/, '').trim();

        return { columns: remaining || '*', joins };
    }

    // ── INSERT ──────────────────────────────────────────────────────────

    insert(data: Record<string, any> | Record<string, any>[]): QueryBuilder {
        this.operation = 'insert';
        this.insertData = Array.isArray(data) ? data : [data];
        return this;
    }

    // ── UPDATE ──────────────────────────────────────────────────────────

    update(data: Record<string, any>): QueryBuilder {
        this.operation = 'update';
        this.updateData = data;
        return this;
    }

    // ── DELETE ──────────────────────────────────────────────────────────

    delete(): QueryBuilder {
        this.operation = 'delete';
        return this;
    }

    // ── UPSERT ──────────────────────────────────────────────────────────

    upsert(data: Record<string, any> | Record<string, any>[], options?: { onConflict?: string }): QueryBuilder {
        this.operation = 'upsert';
        this.insertData = Array.isArray(data) ? data : [data];
        this.upsertConflict = options?.onConflict || null;
        return this;
    }

    // ── FILTERS ─────────────────────────────────────────────────────────

    eq(column: string, value: any): QueryBuilder {
        this.conditions.push({ column, operator: '=', value });
        return this;
    }

    neq(column: string, value: any): QueryBuilder {
        this.conditions.push({ column, operator: '!=', value });
        return this;
    }

    gt(column: string, value: any): QueryBuilder {
        this.conditions.push({ column, operator: '>', value });
        return this;
    }

    gte(column: string, value: any): QueryBuilder {
        this.conditions.push({ column, operator: '>=', value });
        return this;
    }

    lt(column: string, value: any): QueryBuilder {
        this.conditions.push({ column, operator: '<', value });
        return this;
    }

    lte(column: string, value: any): QueryBuilder {
        this.conditions.push({ column, operator: '<=', value });
        return this;
    }

    in(column: string, values: any[]): QueryBuilder {
        this.conditions.push({ column, operator: 'IN', value: values });
        return this;
    }

    not(column: string, operator: string, value: any): QueryBuilder {
        if (operator === 'in') {
            this.conditions.push({ column, operator: 'NOT IN', value });
        } else {
            this.conditions.push({ column, operator: `NOT ${operator}`, value });
        }
        return this;
    }

    ilike(column: string, pattern: string): QueryBuilder {
        this.conditions.push({ column, operator: 'ILIKE', value: pattern });
        return this;
    }

    or(filterString: string): QueryBuilder {
        // Parse Supabase-style OR: "name.ilike.%test%,description.ilike.%test%"
        this.orConditions.push(filterString);
        return this;
    }

    // ── MODIFIERS ───────────────────────────────────────────────────────

    order(column: string, options?: { ascending?: boolean }): QueryBuilder {
        this.orderByClause.push({ column, ascending: options?.ascending ?? true });
        return this;
    }

    limit(count: number): QueryBuilder {
        this.limitValue = count;
        return this;
    }

    single(): QueryBuilder {
        this.isSingle = true;
        this.limitValue = 1;
        return this;
    }

    // ── Chain .select() after .insert()/.update() to return data ────────

    // Note: This method is already defined above for SELECT,
    // but for insert/update it works as a "return data" flag.
    // We handle this by checking `this.operation` in execute().

    // ── EXECUTE ─────────────────────────────────────────────────────────

    async then<TResult1 = QueryResult, TResult2 = never>(
        onfulfilled?: ((value: QueryResult) => TResult1 | PromiseLike<TResult1>) | null,
        onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): Promise<TResult1 | TResult2> {
        try {
            const result = await this.execute();
            return onfulfilled ? onfulfilled(result) : result as any;
        } catch (err) {
            return onrejected ? onrejected(err) : Promise.reject(err);
        }
    }

    private async execute(): Promise<QueryResult> {
        const pool = getPool();

        try {
            switch (this.operation) {
                case 'select':
                    return await this.executeSelect(pool);
                case 'insert':
                    return await this.executeInsert(pool);
                case 'update':
                    return await this.executeUpdate(pool);
                case 'delete':
                    return await this.executeDelete(pool);
                case 'upsert':
                    return await this.executeUpsert(pool);
                default:
                    return { data: null, error: { message: `Operación no soportada: ${this.operation}` } };
            }
        } catch (err: any) {
            return {
                data: null,
                error: {
                    message: err.message || 'Error desconocido',
                    code: err.code,
                    details: err.detail,
                },
            };
        }
    }

    // ── SQL Builders ────────────────────────────────────────────────────

    private buildWhereClause(paramOffset = 0): { sql: string; values: any[] } {
        const parts: string[] = [];
        const values: any[] = [];
        let idx = paramOffset + 1;

        for (const cond of this.conditions) {
            if (cond.operator === 'IN' || cond.operator === 'NOT IN') {
                const arr = cond.value as any[];
                const placeholders = arr.map(() => `$${idx++}`).join(', ');
                parts.push(`"${cond.column}" ${cond.operator} (${placeholders})`);
                values.push(...arr);
            } else {
                parts.push(`"${cond.column}" ${cond.operator} $${idx++}`);
                values.push(cond.value);
            }
        }

        // Parse OR conditions
        for (const orStr of this.orConditions) {
            const orParts = orStr.split(',').map((part) => {
                const [col, op, ...valParts] = part.trim().split('.');
                const val = valParts.join('.');
                if (op === 'ilike') {
                    const placeholder = `$${idx++}`;
                    values.push(val);
                    return `"${col}" ILIKE ${placeholder}`;
                } else if (op === 'eq') {
                    const placeholder = `$${idx++}`;
                    values.push(val === 'true' ? true : val === 'false' ? false : val);
                    return `"${col}" = ${placeholder}`;
                } else if (op === 'neq') {
                    const placeholder = `$${idx++}`;
                    values.push(val);
                    return `"${col}" != ${placeholder}`;
                }
                return 'TRUE';
            });
            if (orParts.length > 0) {
                parts.push(`(${orParts.join(' OR ')})`);
            }
        }

        if (parts.length === 0) return { sql: '', values: [] };
        return { sql: `WHERE ${parts.join(' AND ')}`, values };
    }

    private buildOrderClause(): string {
        if (this.orderByClause.length === 0) return '';
        const parts = this.orderByClause.map(
            (o) => `"${o.column}" ${o.ascending ? 'ASC' : 'DESC'}`,
        );
        return `ORDER BY ${parts.join(', ')}`;
    }

    private buildLimitClause(): string {
        return this.limitValue ? `LIMIT ${this.limitValue}` : '';
    }

    // ── SELECT Execution ────────────────────────────────────────────────

    private async executeSelect(pool: any): Promise<QueryResult> {
        const where = this.buildWhereClause();
        const order = this.buildOrderClause();
        const limit = this.buildLimitClause();

        const sql = `SELECT ${this.selectColumns} FROM "${this.tableName}" ${where.sql} ${order} ${limit}`;
        const result = await pool.query(sql, where.values);

        let rows = result.rows;

        // Handle joins by making additional queries
        for (const join of this.joins) {
            rows = await this.resolveJoin(pool, rows, join);
        }

        if (this.isSingle) {
            if (rows.length === 0) {
                return { data: null, error: { message: 'No rows found', code: 'PGRST116' } };
            }
            return { data: rows[0], error: null };
        }

        return { data: rows, error: null };
    }

    private async resolveJoin(pool: any, rows: any[], join: { table: string; columns: string; fk: string }): Promise<any[]> {
        if (rows.length === 0) return rows;

        const joinTable = join.table;
        const joinColumns = join.columns;

        // Determine foreign key: tableName_id or use provided fk
        // Convention: if main table has `user_id`, join table is `users`
        // if main table has `category_id`, join table is `categories`
        let fkColumn: string;

        // Handle alias syntax like "category:categories(id, name)"
        // The join.table might be the real table name already
        const singularTable = joinTable.replace(/s$/, '').replace(/ie$/, 'y');

        // Check if the main table has a column like `{singular}_id`
        const possibleFks = [
            `${singularTable}_id`,       // user_id, category_id
            `${joinTable.slice(0, -1)}_id`, // order_id from orders
            `${joinTable}_id`,           // direct
        ];

        // For special cases
        if (joinTable === 'products' && this.tableName === 'order_items') {
            fkColumn = 'product_id';
        } else if (joinTable === 'products' && this.tableName === 'wishlist') {
            fkColumn = 'product_id';
        } else if (joinTable === 'roles') {
            fkColumn = 'role_id';
        } else if (joinTable === 'categories') {
            fkColumn = 'category_id';
        } else if (joinTable === 'pet_types') {
            fkColumn = 'pet_type_id';
        } else if (joinTable === 'users') {
            fkColumn = 'user_id';
        } else if (joinTable === 'order_items') {
            // Reverse: join from orders to order_items
            // This is a one-to-many join
            return await this.resolveOneToManyJoin(pool, rows, joinTable, 'order_id', joinColumns);
        } else {
            fkColumn = possibleFks[0];
        }

        // Collect unique FK values
        const fkValues = [...new Set(rows.map((r) => r[fkColumn]).filter(Boolean))];
        if (fkValues.length === 0) {
            return rows.map((r) => ({ ...r, [joinTable]: null }));
        }

        // Determine the select columns for the join
        const selectCols = joinColumns === '*' ? '*' : joinColumns.split(',').map(c => `"${c.trim()}"`).join(', ');

        const placeholders = fkValues.map((_, i) => `$${i + 1}`).join(', ');
        const joinSql = `SELECT ${selectCols === '*' ? '*' : `"id", ${selectCols}`} FROM "${joinTable}" WHERE "id" IN (${placeholders})`;
        const joinResult = await pool.query(joinSql, fkValues);

        const joinMap = new Map<string, any>();
        for (const row of joinResult.rows) {
            joinMap.set(row.id, row);
        }

        // Determine the property name (alias or table name)
        // In Supabase, "category:categories(id, name)" creates a "category" key
        // join.fk stores the alias if provided, otherwise use the table name
        const propName = join.fk || joinTable;

        return rows.map((r) => ({
            ...r,
            [propName]: joinMap.get(r[fkColumn]) || null,
        }));
    }

    private async resolveOneToManyJoin(
        pool: any, rows: any[], joinTable: string, fkColumn: string, joinColumns: string,
    ): Promise<any[]> {
        const ids = rows.map((r) => r.id).filter(Boolean);
        if (ids.length === 0) return rows;

        // Parse nested joins from joinColumns: "product_id, quantity, unit_price, products(name)"
        const nestedJoinRegex = /(\w+)\(([^)]+)\)/g;
        let nestedMatch: RegExpExecArray | null;
        const nestedJoins: { table: string; columns: string }[] = [];

        let cleanJoinCols = joinColumns;
        while ((nestedMatch = nestedJoinRegex.exec(joinColumns)) !== null) {
            nestedJoins.push({ table: nestedMatch[1], columns: nestedMatch[2] });
            cleanJoinCols = cleanJoinCols.replace(nestedMatch[0], '').replace(/,\s*,/, ',');
        }
        cleanJoinCols = cleanJoinCols.replace(/,\s*$/, '').replace(/^\s*,/, '').trim();

        const selectCols = cleanJoinCols === '*' ? '*' : cleanJoinCols.split(',').map(c => {
            const trimmed = c.trim();
            if (trimmed) return `"${trimmed}"`;
            return null;
        }).filter(Boolean).join(', ');

        const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ');
        const sql = `SELECT "id", "${fkColumn}", ${selectCols} FROM "${joinTable}" WHERE "${fkColumn}" IN (${placeholders})`;
        const result = await pool.query(sql, ids);

        let joinRows = result.rows;

        // Resolve nested joins
        for (const nested of nestedJoins) {
            const nestedBuilder = new QueryBuilder(nested.table);
            joinRows = await nestedBuilder['resolveJoin'](pool, joinRows, { table: nested.table, columns: nested.columns, fk: '' });
        }

        // Group by FK
        const groupMap = new Map<string, any[]>();
        for (const row of joinRows) {
            const key = row[fkColumn];
            if (!groupMap.has(key)) groupMap.set(key, []);
            groupMap.get(key)!.push(row);
        }

        return rows.map((r) => ({
            ...r,
            [joinTable]: groupMap.get(r.id) || [],
        }));
    }

    // ── INSERT Execution ────────────────────────────────────────────────

    private async executeInsert(pool: any): Promise<QueryResult> {
        if (this.insertData.length === 0) {
            return { data: null, error: { message: 'No data to insert' } };
        }

        const columns = Object.keys(this.insertData[0]).filter(k => this.insertData[0][k] !== undefined);
        const allValues: any[] = [];
        const rowPlaceholders: string[] = [];

        for (const row of this.insertData) {
            const vals = columns.map((col) => {
                const val = row[col];
                // Handle JSON objects
                if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
                    return JSON.stringify(val);
                }
                return val ?? null;
            });
            const offset = allValues.length;
            const placeholders = vals.map((_, i) => `$${offset + i + 1}`).join(', ');
            rowPlaceholders.push(`(${placeholders})`);
            allValues.push(...vals);
        }

        const colNames = columns.map((c) => `"${c}"`).join(', ');
        const returning = this.returnData ? 'RETURNING *' : '';

        const sql = `INSERT INTO "${this.tableName}" (${colNames}) VALUES ${rowPlaceholders.join(', ')} ${returning}`;
        const result = await pool.query(sql, allValues);

        if (this.returnData) {
            if (this.isSingle) {
                return { data: result.rows[0] || null, error: null };
            }
            return { data: result.rows, error: null };
        }

        return { data: null, error: null };
    }

    // ── UPDATE Execution ────────────────────────────────────────────────

    private async executeUpdate(pool: any): Promise<QueryResult> {
        const entries = Object.entries(this.updateData).filter(([, v]) => v !== undefined);
        if (entries.length === 0) {
            return { data: null, error: { message: 'No data to update' } };
        }

        const setClauses: string[] = [];
        const values: any[] = [];
        let idx = 1;

        for (const [col, val] of entries) {
            setClauses.push(`"${col}" = $${idx++}`);
            if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
                values.push(JSON.stringify(val));
            } else {
                values.push(val ?? null);
            }
        }

        const where = this.buildWhereClause(values.length);
        const returning = this.returnData ? 'RETURNING *' : '';

        const sql = `UPDATE "${this.tableName}" SET ${setClauses.join(', ')} ${where.sql} ${returning}`;
        const result = await pool.query(sql, [...values, ...where.values]);

        if (this.returnData) {
            if (this.isSingle) {
                return { data: result.rows[0] || null, error: null };
            }
            return { data: result.rows, error: null };
        }

        return { data: null, error: null };
    }

    // ── DELETE Execution ────────────────────────────────────────────────

    private async executeDelete(pool: any): Promise<QueryResult> {
        const where = this.buildWhereClause();
        const returning = this.returnData ? 'RETURNING *' : '';

        const sql = `DELETE FROM "${this.tableName}" ${where.sql} ${returning}`;
        const result = await pool.query(sql, where.values);

        return { data: result.rows || null, error: null };
    }

    // ── UPSERT Execution ────────────────────────────────────────────────

    private async executeUpsert(pool: any): Promise<QueryResult> {
        if (this.insertData.length === 0) {
            return { data: null, error: { message: 'No data to upsert' } };
        }

        const columns = Object.keys(this.insertData[0]);
        const allValues: any[] = [];
        const rowPlaceholders: string[] = [];

        for (const row of this.insertData) {
            const vals = columns.map((col) => {
                const val = row[col];
                if (val !== null && typeof val === 'object') return JSON.stringify(val);
                return val ?? null;
            });
            const offset = allValues.length;
            const placeholders = vals.map((_, i) => `$${offset + i + 1}`).join(', ');
            rowPlaceholders.push(`(${placeholders})`);
            allValues.push(...vals);
        }

        const colNames = columns.map((c) => `"${c}"`).join(', ');
        const conflictCol = this.upsertConflict || columns[0];
        const updateCols = columns
            .filter((c) => c !== conflictCol)
            .map((c) => `"${c}" = EXCLUDED."${c}"`)
            .join(', ');

        const sql = `INSERT INTO "${this.tableName}" (${colNames}) VALUES ${rowPlaceholders.join(', ')} ON CONFLICT ("${conflictCol}") DO UPDATE SET ${updateCols} RETURNING *`;
        const result = await pool.query(sql, allValues);

        if (this.isSingle) {
            return { data: result.rows[0] || null, error: null };
        }
        return { data: result.rows, error: null };
    }
}

// ─── Supabase-compatible Client ─────────────────────────────────────────

class LocalSupabaseClient {
    from(table: string): QueryBuilder {
        return new QueryBuilder(table);
    }

    // Stub auth object for compatibility
    auth = {
        getUser: async () => ({ data: { user: null }, error: { message: 'Auth no disponible en modo local' } }),
        signInWithPassword: async () => ({ data: null, error: { message: 'Auth no disponible en modo local' } }),
        signUp: async () => ({ data: null, error: { message: 'Auth no disponible en modo local' } }),
    };

    rpc(fnName: string, params?: Record<string, any>) {
        return {
            then: async (resolve: any) => {
                try {
                    const pool = getPool();
                    const paramKeys = params ? Object.keys(params) : [];
                    const paramValues = params ? Object.values(params) : [];
                    const placeholders = paramKeys.map((_, i) => `$${i + 1}`).join(', ');
                    const sql = `SELECT * FROM "${fnName}"(${placeholders})`;
                    const result = await pool.query(sql, paramValues);
                    resolve({ data: result.rows, error: null });
                } catch (err: any) {
                    resolve({ data: null, error: { message: err.message } });
                }
            },
        };
    }
}

export const localSupabaseAdmin = new LocalSupabaseClient();
