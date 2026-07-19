import Link from "next/link"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ArrowUpRight, DollarSign, Package, ShoppingBag, Users } from "lucide-react"

const statsCards = [
  { title: "Ventas Totales", value: "34,945", trend: "+1.56%", icon: ShoppingBag },
  { title: "Ingresos Totales", value: "$37,802", trend: "-0.86%", icon: DollarSign },
  { title: "Órdenes Pagadas", value: "12,480", trend: "+3.21%", icon: Package },
  { title: "Visitantes Totales", value: "89,120", trend: "+2.04%", icon: Users },
]

const topProducts = [
  { name: "Alimento Premium", category: "Alimentos", stock: "En stock", revenue: "$28,672" },
  { name: "Snack Natural", category: "Snacks", stock: "En stock", revenue: "$14,210" },
  { name: "Arnés Urban", category: "Accesorios", stock: "Bajo stock", revenue: "$9,840" },
]

const topCountries = ["Turquía", "Bélgica", "Suecia", "Vietnam", "Australia"]

export default function AdminHomePage() {
  return (
    <div className="layout-wrap">
      <Sidebar />
      <div className="section-content-right min-w-0">
        <Header />
        <main className="main-content space-y-8">
          <section className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Admin</p>
            <h1 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">Panel de control</h1>
            <p className="max-w-2xl text-sm text-zinc-600">Resumen general del negocio con la paleta negro y blanco solicitada.</p>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statsCards.map((card) => (
              <article key={card.title} className="wg-box flex items-start justify-between gap-4 border-zinc-200 bg-white">
                <div className="space-y-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
                    <card.icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">{card.title}</p>
                    <h3 className="text-2xl font-bold text-zinc-950">{card.value}</h3>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-700">
                  <ArrowUpRight size={14} />
                  {card.trend}
                </span>
              </article>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
            <article className="wg-box space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-950">Productos más vendidos</h2>
                  <p className="text-sm text-zinc-500">Vista limpia, sin colores de acento saturados.</p>
                </div>
                <Link href="/products" className="tf-button">
                  Ver catálogo
                </Link>
              </div>

              <div className="space-y-3">
                {topProducts.map((product) => (
                  <div key={product.name} className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-zinc-950">{product.name}</p>
                      <p className="text-sm text-zinc-500">Categoría: {product.category}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${product.stock === "En stock" ? "bg-black text-white" : "bg-zinc-100 text-zinc-700"}`}>
                        {product.stock}
                      </span>
                      <p className="font-semibold text-zinc-950">{product.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="wg-box space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">Países principales</h2>
                <p className="text-sm text-zinc-500">Módulo de datos traducido y simplificado.</p>
              </div>

              <div className="space-y-3">
                {topCountries.map((country) => (
                  <div key={country} className="flex items-center justify-between rounded-2xl border border-zinc-200 px-4 py-3">
                    <span className="text-sm font-medium text-zinc-700">{country}</span>
                    <ArrowUpRight className="text-zinc-950" size={16} />
                  </div>
                ))}
              </div>
            </article>
          </section>

          <Footer />
        </main>
      </div>
    </div>
  )
}