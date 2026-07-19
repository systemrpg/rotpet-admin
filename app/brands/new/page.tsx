import Link from "next/link"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function NewBrandPage() {
  return (
    <div className="layout-wrap">
      <Sidebar />
      <div className="section-content-right min-w-0">
        <Header />
        <main className="main-content space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Catálogos</p>
            <h1 className="text-3xl font-black text-zinc-950">Nueva Marca</h1>
            <p className="text-sm text-zinc-600">Crea una nueva marca para el catálogo.</p>
          </div>

          <div className="wg-box space-y-4">
            <input className="w-full rounded-xl border border-zinc-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black" placeholder="Nombre de la marca" />
            <textarea className="w-full rounded-xl border border-zinc-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black" rows={4} placeholder="Descripción" />
            <div className="flex gap-3">
              <button className="tf-button">Guardar</button>
              <Link href="/brands" className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700">Cancelar</Link>
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  )
}