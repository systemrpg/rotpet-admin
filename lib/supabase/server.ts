// Pequeño shim para evitar dependencia de Supabase en este entorno.
// Proporciona una interfaz mínima: createClient().from(table).select().eq(key, val)
type Query = {
  table: string
  filters: Record<string, any>
}

export async function createClient() {
  function from(table: string) {
    const q: Query = { table, filters: {} }

    const api = {
      eq(key: string, val: any) {
        q.filters[key] = val
        return api
      },
      async select(_sel?: string) {
        // En este entorno de pruebas devolvemos siempre array vacío.
        return { data: [], error: null }
      },
    }

    return api
  }

  return { from }
}

export default createClient
