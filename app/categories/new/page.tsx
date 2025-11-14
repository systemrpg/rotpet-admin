import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Save, X } from "lucide-react"
import Link from "next/link"

export default function NewCategoryPage() {
  return (
    <div className="layout-wrap">
      <Sidebar />
      <div className="section-content-right">
        <Header />
        <main className="main-content">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Nueva Categoría</h1>
            <p className="text-gray-600 mt-1">Crea una nueva categoría de productos</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-2xl">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Categoría</label>
                <input
                  type="text"
                  placeholder="Ej: Alimentos Secos"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL)</label>
                <input
                  type="text"
                  placeholder="alimentos-secos"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  placeholder="Describe la categoría..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagen de Categoría</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" />
                  <p className="text-gray-600">Arrastra una imagen o haz clic para seleccionar</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="active" className="w-4 h-4 text-orange-600 rounded" />
                <label htmlFor="active" className="text-sm font-medium text-gray-700">
                  Categoría Activa
                </label>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button type="submit" className="tf-button flex items-center gap-2">
                  <Save size={20} />
                  Guardar Categoría
                </button>
                <Link
                  href="/categories"
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-900 flex items-center gap-2"
                >
                  <X size={20} />
                  Cancelar
                </Link>
              </div>
            </form>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  )
}
