import Link from "next/link"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"

const countries = ["México", "Colombia", "Chile", "Argentina", "España"]

export default function CountriesPage() {
  return (
    <div className="layout-wrap">
      <Sidebar />
      <div className="section-content-right min-w-0">
        <Header />
        <main className="main-content space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Configuración</p>
              <h1 className="text-3xl font-black text-zinc-950">Ubicación</h1>
            </div>
            <Link href="/admin" className="tf-button">Panel</Link>
          </div>

          <div className="wg-box space-y-3">
            {countries.map((country) => (
              <div key={country} className="flex items-center justify-between rounded-2xl border border-zinc-200 px-4 py-3">
                <span className="font-medium text-zinc-950">{country}</span>
                <span className="text-sm text-zinc-500">Activo</span>
              </div>
            ))}
          </div>

          <Footer />
        </main>
      </div>
    </div>
  )
}