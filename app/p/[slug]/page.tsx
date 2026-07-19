import Link from "next/link"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function PreviewPage({ params }: { params: { slug: string } }) {
  return (
    <div className="layout-wrap">
      <Sidebar />
      <div className="section-content-right min-w-0">
        <Header />
        <main className="main-content space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Vista previa</p>
            <h1 className="text-3xl font-black text-zinc-950">{params.slug}</h1>
            <p className="text-sm text-zinc-600">Previsualización de página pública.</p>
          </div>

          <div className="wg-box space-y-4">
            <p className="text-sm text-zinc-600">Esta es una vista previa interna de la página {params.slug}.</p>
            <Link href="/pages" className="tf-button w-fit">Volver a páginas</Link>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  )
}