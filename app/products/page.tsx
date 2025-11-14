import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Edit, Trash2, Plus } from "lucide-react"
import Link from "next/link"

const products = [
  {
    id: 1,
    name: "Alimento para Perros Premium",
    sku: "#70668",
    price: "$450",
    quantity: 403,
    sales: "$28,672.36",
    revenue: "$928.41",
    status: "Disponible",
  },
  {
    id: 2,
    name: "Alimento Grain Free para Perros",
    sku: "#22739",
    price: "$450",
    quantity: 202,
    sales: "$28,672.36",
    revenue: "$450.54",
    status: "No Disponible",
  },
  {
    id: 3,
    name: "Golosinas para Perros Pumpkin",
    sku: "#43178",
    price: "$420",
    quantity: 5032,
    sales: "$28,672.36",
    revenue: "$293.01",
    status: "Disponible",
  },
]

export default function ProductsPage() {
  return (
    <div className="layout-wrap">
      <Sidebar />
      <div className="section-content-right">
        <Header />
        <main className="main-content">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
              <p className="text-gray-600 mt-1">Gestiona tu catálogo de productos para Rot Pet</p>
            </div>
            <Link href="/products/new" className="tf-button flex items-center gap-2">
              <Plus size={20} />
              Agregar Producto
            </Link>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">SKU</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Precio</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cantidad</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ventas</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ingresos</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{product.price}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.quantity}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.sales}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.revenue}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                            product.status === "Disponible" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/products/${product.id}/edit`}
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                          >
                            <Edit size={16} className="text-gray-600" />
                          </Link>
                          <button className="p-2 hover:bg-red-50 rounded transition-colors">
                            <Trash2 size={16} className="text-red-600" />
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
