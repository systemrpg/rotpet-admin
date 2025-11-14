import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Upload, Trash2 } from "lucide-react"

export default function GalleryPage() {
  return (
    <div className="layout-wrap">
      <Sidebar />
      <div className="section-content-right">
        <Header />
        <main className="main-content">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Galería</h1>
            <p className="text-gray-600 mt-1">Gestiona imágenes y multimedia de Rot Pet</p>
          </div>

          {/* Upload Area */}
          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 mb-8 text-center hover:border-orange-400 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Arrastra imágenes aquí</h3>
            <p className="text-gray-600 mb-4">o haz clic para seleccionar archivos</p>
            <button className="tf-button">Seleccionar Archivo</button>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="relative group bg-gray-200 rounded-lg aspect-square overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="w-full h-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center text-white text-center p-4">
                  <span className="font-semibold">Imagen {i}</span>
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors">
                    <Trash2 size={18} />
                  </button>
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
