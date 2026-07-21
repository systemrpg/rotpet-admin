import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Edit, Trash2, Plus, Shield } from "lucide-react"
import Link from "next/link"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { requireAdmin } from "@/lib/auth-server"

export const dynamic = 'force-dynamic'

interface User {
    id: string
    email: string
    full_name: string | null
    status: string
    created_at: string
    role_id: string | null
    roles: { name: string } | null
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
    active: { label: 'Activo', color: 'bg-green-100 text-green-700' },
    inactive: { label: 'Inactivo', color: 'bg-gray-100 text-gray-700' },
    pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default async function UsersPage() {
    await requireAdmin()

    const { data: users, error } = await supabaseAdmin
        .from('users')
        .select('id, email, full_name, status, created_at, role_id, roles(name)')
        .neq('status', 'inactive')
        .order('created_at', { ascending: false })
        .limit(200) as { data: User[] | null; error: any }

    return (
        <div className="layout-wrap">
            <Sidebar />
            <div className="section-content-right">
                <Header />
                <main className="main-content">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
                            <p className="text-gray-600 mt-1">
                                {users ? `${users.length} usuarios` : 'Gestiona los usuarios del sistema'}
                            </p>
                        </div>
                        <Link href="/users/new" className="tf-button flex items-center gap-2">
                            <Plus size={20} />
                            Agregar Usuario
                        </Link>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                            Error: {error.message}
                        </div>
                    )}

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
                                    {users && users.length > 0 ? (
                                        users.map((user) => {
                                            const statusInfo = STATUS_LABEL[user.status] || { label: user.status, color: 'bg-gray-100 text-gray-700' }
                                            return (
                                                <tr key={user.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.full_name || '—'}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <Shield size={14} className="text-orange-600" />
                                                            <span className="text-gray-900 capitalize">{user.roles?.name || '—'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${statusInfo.color}`}>
                                                            {statusInfo.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(user.created_at)}</td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <Link
                                                                href={`/users/${user.id}/edit`}
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
                                            )
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                                {error ? 'Error al cargar usuarios' : 'No hay usuarios aún.'}
                                            </td>
                                        </tr>
                                    )}
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
