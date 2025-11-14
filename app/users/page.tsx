import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Edit, Trash2, Plus, Shield } from "lucide-react"
import Link from "next/link"

const users = [
  {
    id: 1,
    name: "Cesar Diaz",
    email: "cesar@example.com",
    role: "Administrador",
    status: "Activo",
    joinDate: "15 Oct 2024",
  },
  {
    id: 2,
    name: "Cameron Williamson",
    email: "cameron@example.com",
    role: "Vendedor",
    status: "Activo",
    joinDate: "10 Oct 2024",
  },
  {
    id: 3,
    name: "Ralph Edwards",
    email: "ralph@example.com",
    role: "Gerente",
    status: "Activo",
    joinDate: "05 Oct 2024",
  },
]

export default function UsersPage() {
  return (
    <div className="layout-wrap">
      <Sidebar />
      <div className="section-content-right">
        <Header />
        <main className="main-content">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
              <p className="text-gray-600 mt-1">Gestiona los usuarios del sistema</p>
            </div>
            <Link href="/users/new" className="tf-button flex items-center gap-2">
              <Plus size={20} />
              Agregar Usuario
            </Link>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rol</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fecha de Registro</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Shield size={14} className="text-orange-600" />
                          <span className="text-gray-900">{user.role}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.joinDate}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                            <Edit size={16} className="text-gray-600" />
                          </button>
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
