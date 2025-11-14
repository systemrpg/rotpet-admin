import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { TrendingUp, TrendingDown, ShoppingBag, DollarSign, FileText, Users } from "lucide-react"

const statsCards = [
  {
    title: "Ventas Totales",
    value: "34,945",
    trend: 1.56,
    icon: ShoppingBag,
    color: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    title: "Ingresos Totales",
    value: "$37,802",
    trend: -1.56,
    icon: DollarSign,
    color: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    title: "Órdenes Pagadas",
    value: "34,945",
    trend: 0,
    icon: FileText,
    color: "bg-gray-100",
    iconColor: "text-gray-600",
  },
  {
    title: "Visitantes Totales",
    value: "34,945",
    trend: 1.56,
    icon: Users,
    color: "bg-blue-100",
    iconColor: "text-blue-600",
  },
]

function StatsCard({ title, value, trend, icon: Icon, color, iconColor }: any) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`${color} p-3 rounded-lg`}>
            <Icon className={`${iconColor} w-6 h-6`} />
          </div>
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          </div>
        </div>
        <div
          className={`flex items-center gap-1 ${trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-gray-600"}`}
        >
          {trend > 0 ? (
            <TrendingUp size={20} />
          ) : trend < 0 ? (
            <TrendingDown size={20} />
          ) : (
            <span className="text-gray-400">-</span>
          )}
          <span className="text-sm font-semibold">{Math.abs(trend)}%</span>
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-orange-200 to-orange-300 rounded-full"></div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="layout-wrap">
      <Sidebar />
      <div className="section-content-right">
        <Header />
        <main className="main-content">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
            <p className="text-gray-600">Bienvenido a tu panel administrativo de Rot Pet Shop</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((card) => (
              <StatsCard key={card.title} {...card} />
            ))}
          </div>

          {/* Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Selling Products */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Productos Más Vendidos</h2>
                <a href="/products" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                  Ver todo
                </a>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-300 to-orange-400 rounded-lg"></div>
                      <div>
                        <p className="font-semibold text-gray-900">Alimento para Perros Premium</p>
                        <p className="text-xs text-gray-600">Categoría: Alimentos</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">$28,672</p>
                      <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                        En stock
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Countries */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Países Principales</h2>
              </div>
              <div className="space-y-3">
                {["Turquía", "Bélgica", "Suecia", "Vietnam", "Australia"].map((country) => (
                  <div key={country} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{country}</span>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  )
}
