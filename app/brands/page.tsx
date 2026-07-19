import Link from "next/link"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"

const brands = [
  { name: "Rot Pet", status: "Activa", products: 18 },
  { name: "Pet Care", status: "Activa", products: 12 },
  { name: "Urban Paw", status: "Borrador", products: 4 },
]

export default function BrandsPage() {
  return (
    <div className="layout-wrap">
      <Sidebar />
      <div className="section-content-right min-w-0">
        <Header />
        <main className="main-content space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Catálogos</p>
              <h1 className="text-3xl font-black text-zinc-950">Marcas</h1>
              <p className="text-sm text-zinc-600">Administración de marcas del catálogo.</p>
            </div>
            <Link href="/brands/new" className="tf-button">Nueva marca</Link>
          </div>

          <div className="wg-box overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className="border-b border-zinc-200 bg-zinc-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">Marca</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">Estado</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">Productos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {brands.map((brand) => (
                    <tr key={brand.name} className="hover:bg-zinc-50">
                      <td className="px-6 py-4 font-medium text-zinc-950">{brand.name}</td>
                      <td className="px-6 py-4 text-zinc-600">{brand.status}</td>
                      <td className="px-6 py-4 text-zinc-600">{brand.products}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  )
}