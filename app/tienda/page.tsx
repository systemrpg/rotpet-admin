import { Suspense } from "react"
import ProductGrid from "@/components/product-grid"
import { Skeleton } from "@/components/ui/skeleton"
import { createClient } from "@/lib/supabase/server"

export const revalidate = 60

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array(8)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-60 w-full rounded-lg" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
    </div>
  )
}

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: { categoria?: string; mascota?: string }
}) {
  const supabase = await createClient()

  let products: any[] = []

  try {
    let query = supabase.from("productos").select("*")

    if (searchParams.categoria) {
      query = query.eq("categoria", searchParams.categoria)
    }

    if (searchParams.mascota) {
      query = query.eq("mascota", searchParams.mascota)
    }

    const { data, error } = await query

    if (error) throw error

    products = data || []
  } catch (error) {
    console.error("[v0] Error cargando productos:", error)
    products = []
  }

  return (
    <div className="container px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-8">Tienda</h1>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        <div>
          <h3 className="font-semibold mb-4">Filtros</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Mascota</h4>
              <div className="space-y-2">
                <a href="/tienda?mascota=gato" className="block text-sm text-muted-foreground hover:text-primary">
                  Gatos
                </a>
                <a href="/tienda?mascota=perro" className="block text-sm text-muted-foreground hover:text-primary">
                  Perros
                </a>
                <a href="/tienda" className="block text-sm text-muted-foreground hover:text-primary">
                  Todos
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Categoría</h4>
              <div className="space-y-2">
                <a href="/tienda?categoria=alimento" className="block text-sm text-muted-foreground hover:text-primary">
                  Alimentos
                </a>
                <a href="/tienda?categoria=juguetes" className="block text-sm text-muted-foreground hover:text-primary">
                  Juguetes
                </a>
                <a
                  href="/tienda?categoria=accesorios"
                  className="block text-sm text-muted-foreground hover:text-primary"
                >
                  Accesorios
                </a>
                <a href="/tienda?categoria=arena" className="block text-sm text-muted-foreground hover:text-primary">
                  Arena
                </a>
                <a href="/tienda?categoria=muebles" className="block text-sm text-muted-foreground hover:text-primary">
                  Muebles
                </a>
                <a href="/tienda" className="block text-sm text-muted-foreground hover:text-primary">
                  Todas
                </a>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Suspense fallback={<LoadingSkeleton />}>
            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No se encontraron productos</p>
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  )
}
