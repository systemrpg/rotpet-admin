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
"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Heart,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from "lucide-react"

type Product = {
  id: number
  name: string
  category: string
  pet: string
  price: string
  image: string
  badge?: string
}

const products: Product[] = [
  { id: 1, name: "Dog Food Premium", category: "Alimentos", pet: "Perro", price: "$28.90", image: "/placeholder.svg", badge: "Nuevo" },
  { id: 2, name: "Snack Natural Gato", category: "Snacks", pet: "Gato", price: "$14.50", image: "/placeholder.svg", badge: "Top" },
  { id: 3, name: "Cama Minimal Black", category: "Hogar", pet: "Perro", price: "$62.00", image: "/placeholder.svg" },
  { id: 4, name: "Arnés Urban Fit", category: "Accesorios", pet: "Perro", price: "$18.75", image: "/placeholder.svg" },
  { id: 5, name: "Juguete Interactivo", category: "Juguetes", pet: "Gato", price: "$12.40", image: "/placeholder.svg" },
  { id: 6, name: "Arena Ultra Clean", category: "Higiene", pet: "Gato", price: "$9.99", image: "/placeholder.svg", badge: "-15%" },
]

const categories = ["Todos", "Alimentos", "Snacks", "Hogar", "Accesorios", "Juguetes", "Higiene"]
const pets = ["Todos", "Perro", "Gato"]

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_20px_50px_-30px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/3] bg-zinc-100">
        <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute left-4 top-4 flex gap-2">
          {product.badge ? <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">{product.badge}</span> : null}
        </div>
        <button className="absolute right-4 top-4 rounded-full border border-zinc-200 bg-white/95 p-2 text-zinc-900 shadow-sm transition hover:bg-black hover:text-white">
          <Heart size={16} />
        </button>
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