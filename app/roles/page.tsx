import Link from "next/link"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Edit, Plus, Trash2 } from "lucide-react"

const roles = [
  { id: 1, name: "Administrador", members: 2, scope: "Acceso total" },
  { id: 2, name: "Editor", members: 5, scope: "Contenido y catálogo" },
  { id: 3, name: "Soporte", members: 3, scope: "Atención al cliente" },
]

export default function RolesPage() {
  return (
    <div className="layout-wrap">
      <Sidebar />
      <div className="section-content-right min-w-0">
        <Header />
        <main className="main-content space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Administración</p>
              <h1 className="text-3xl font-black text-zinc-950">Roles</h1>
              <p className="text-sm text-zinc-600">Gestiona los roles y permisos.</p>
            </div>
            <Link href="/roles/new" className="tf-button w-fit inline-flex items-center gap-2">
              <Plus size={18} />
              Nuevo Rol
            </Link>
          </div>

          <div className="wg-box overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className="border-b border-zinc-200 bg-zinc-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">Rol</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">Miembros</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">Permisos</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {roles.map((role) => (
                    <tr key={role.name} className="hover:bg-zinc-50">
                      <td className="px-6 py-4 font-medium text-zinc-950">{role.name}</td>
                      <td className="px-6 py-4 text-zinc-600">{role.members}</td>
                      <td className="px-6 py-4 text-zinc-600">{role.scope}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 text-zinc-500">
                          <Link href={`/roles/${role.id}/edit`} className="transition hover:text-zinc-950" title="Editar">
                            <Edit size={16} />
                          </Link>
                          <button className="transition hover:text-zinc-950" title="Eliminar">
                            <Trash2 size={16} />
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