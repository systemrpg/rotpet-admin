import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Edit, Trash2, Plus } from "lucide-react"
import Link from "next/link"

const categories = [
  { id: 1, name: "Alimentos Secos", products: 45, status: "Activa" },
  { id: 2, name: "Golosinas y Snacks", products: 32, status: "Activa" },
  { id: 3, name: "Juguetes", products: 28, status: "Activa" },
  { id: 4, name: "Camas y Colchones", products: 15, status: "Activa" },
]

export default function CategoriesPage() {
  return (
    <div className="layout-wrap">
      <Sidebar />
      <div className="section-content-right">
        <Header />
        <main className="main-content">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
              <p className="text-gray-600 mt-1">Gestiona las categorías de productos</p>
            </div>
            <Link href="/categories/new" className="tf-button flex items-center gap-2">
              <Plus size={20} />
              Nueva Categoría
            </Link>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <div className="flex gap-2">
                    <Link
                      href={`/categories/${category.id}/edit`}
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Edit size={16} className="text-gray-600" />
                    </Link>
                    <button className="p-2 hover:bg-red-50 rounded transition-colors">
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{category.products}</span> productos
                  </p>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                    {category.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Footer />
        </main>
      </div>
    </div>
  )
}
