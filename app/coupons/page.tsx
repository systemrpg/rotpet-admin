import Link from "next/link"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"

const coupons = [
  { code: "WELCOME10", discount: "10%", status: "Activo" },
  { code: "FREESHIP", discount: "Envío gratis", status: "Activo" },
  { code: "SUMMER20", discount: "20%", status: "Expirado" },
]

export default function CouponsPage() {
  return (
    <div className="layout-wrap">
      <Sidebar />
      <div className="section-content-right min-w-0">
        <Header />
        <main className="main-content space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Marketing</p>
              <h1 className="text-3xl font-black text-zinc-950">Cupones</h1>
              <p className="text-sm text-zinc-600">Gestión de descuentos y promociones.</p>
            </div>
            <Link href="/coupons/new" className="tf-button">Nuevo cupón</Link>
          </div>

          <div className="wg-box overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className="border-b border-zinc-200 bg-zinc-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">Código</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">Descuento</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {coupons.map((coupon) => (
                    <tr key={coupon.code} className="hover:bg-zinc-50">
                      <td className="px-6 py-4 font-medium text-zinc-950">{coupon.code}</td>
                      <td className="px-6 py-4 text-zinc-600">{coupon.discount}</td>
                      <td className="px-6 py-4 text-zinc-600">{coupon.status}</td>
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