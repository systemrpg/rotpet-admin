import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"

const states = ["Jalisco", "Ciudad de México", "Nuevo León", "Puebla", "Yucatán"]

export default function StatesPage() {
  return (
    <div className="layout-wrap">
      <Sidebar />
      <div className="section-content-right min-w-0">
        <Header />
        <main className="main-content space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Ubicación</p>
            <h1 className="text-3xl font-black text-zinc-950">Estados</h1>
            <p className="text-sm text-zinc-600">Catálogo base para la configuración geográfica.</p>
          </div>

          <div className="wg-box space-y-3">
            {states.map((state) => (
              <div key={state} className="flex items-center justify-between rounded-2xl border border-zinc-200 px-4 py-3">
                <span className="font-medium text-zinc-950">{state}</span>
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