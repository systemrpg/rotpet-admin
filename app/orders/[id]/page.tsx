import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Download, Printer } from "lucide-react"

export default function OrderDetailPage() {
  return (
    <div className="layout-wrap">
      <Sidebar />
      <div className="section-content-right">
        <Header />
        <main className="main-content">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Detalle de Orden #1001</h1>
            <p className="text-gray-600 mt-1">Gestiona los detalles de esta orden</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Productos en la Orden</h2>
                <div className="divide-y divide-gray-200">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center justify-between py-4">
                      <div>
                        <p className="font-medium text-gray-900">Alimento Premium para Perros</p>
                        <p className="text-sm text-gray-600">Cantidad: 2</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">$45.00</p>
                        <p className="text-sm text-gray-600">$90.00</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>$90.00</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío:</span>
                    <span>$10.00</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg text-gray-900 border-t border-gray-200 pt-2">
                    <span>Total:</span>
                    <span>$100.00</span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Cliente</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Nombre</p>
                    <p className="font-medium text-gray-900">Juan García Rodríguez</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">juan@example.com</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Teléfono</p>
                    <p className="font-medium text-gray-900">+56 9 1234 5678</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Status */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de la Orden</h3>
                <div className="space-y-3">
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option>Pendiente</option>
                    <option>En Proceso</option>
                    <option>Completado</option>
                    <option>Cancelado</option>
                  </select>
                  <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                    Pendiente
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button className="tf-button w-full flex items-center justify-center gap-2">
                  <Download size={20} />
                  Descargar
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-900 flex items-center justify-center gap-2">
                  <Printer size={20} />
                  Imprimir
                </button>
              </div>
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  )
}
