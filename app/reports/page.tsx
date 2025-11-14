import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { TrendingUp, BarChart3, PieChart } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="layout-wrap">
      <Sidebar />
      <div className="section-content-right">
        <Header />
        <main className="main-content">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
            <p className="text-gray-600 mt-1">Analiza el desempeño de Rot Pet Shop</p>
          </div>

          {/* Report Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ventas Totales</p>
                  <p className="text-2xl font-bold text-gray-900">$125,430</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Órdenes Completadas</p>
                  <p className="text-2xl font-bold text-gray-900">324</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <PieChart className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Productos Vendidos</p>
                  <p className="text-2xl font-bold text-gray-900">1,842</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chart placeholder */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 h-96 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Gráficos disponibles próximamente</p>
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  )
}
