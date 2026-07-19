import Link from "next/link"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function EditContentPage({ params }: { params: { id: string } }) {
  return (
    <div className="layout-wrap">
      <Sidebar />
      <div className="section-content-right min-w-0">
        <Header />
        <main className="main-content space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Contenido</p>
            <h1 className="text-3xl font-black text-zinc-950">Editar Página</h1>
            <p className="text-sm text-zinc-600">ID de la página: {params.id}</p>
          </div>

          <div className="wg-box space-y-4">
            <input className="w-full rounded-xl border border-zinc-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black" defaultValue="Sobre Nosotros" />
            <input className="w-full rounded-xl border border-zinc-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black" defaultValue="sobre-nosotros" />
            <textarea className="w-full rounded-xl border border-zinc-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black" rows={6} defaultValue="Contenido de la página..." />
            <div className="flex gap-3">
              <button className="tf-button">Actualizar</button>
              <Link href="/pages" className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700">Volver</Link>
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  )
}