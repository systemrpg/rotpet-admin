// Shim cliente de Supabase para evitar dependencia en este entorno.
export function createClient() {
  return {
    from(_table: string) {
      return {
        async select() {
          return { data: [], error: null }
        },
      }
    },
  }
}

export default createClient
