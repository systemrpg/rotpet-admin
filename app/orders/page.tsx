import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Eye, Download } from "lucide-react"
import Link from "next/link"

const orders = [
  {
    id: 1,
    product: "Alimento Crunchy Premium",
    customer: "Juan García",
    price: "$450",
    date: "20 Nov 2024",
    status: "Completado",
  },
  {
    id: 2,
    product: "Golosinas para Perros",
    customer: "María López",
    price: "$85",
    date: "19 Nov 2024",
    status: "Pendiente",
  },
  {
    id: 3,
    product: "Cama para Mascotas",
    customer: "Carlos Rodríguez",
    price: "$250",
    date: "18 Nov 2024",
    status: "Completado",
  },
]

export default function OrdersPage() {
  return (
    <div className="layout-wrap">
      <Sidebar />
      <div className="section-content-right">
        <Header />
        <main className="main-content">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Órdenes</h1>
            <p className="text-gray-600 mt-1">Gestiona todas las órdenes de Rot Pet Shop</p>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID Orden</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Producto</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cliente</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Precio</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-orange-600">#{1000 + order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.product}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{order.price}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                            order.status === "Completado"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/orders/${order.id}`}
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                            title="Ver detalle"
                          >
                            <Eye size={16} className="text-gray-600" />
                          </Link>
                          <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Descargar">
                            <Download size={16} className="text-gray-600" />
                          </button>
                        </div>
                      </td>
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
