"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Save, X } from "lucide-react"
import Link from "next/link"

interface Role {
    id: string
    name: string
}

export default function NewUserPage() {
    const router = useRouter()
    const [roles, setRoles] = useState<Role[]>([])
    const [form, setForm] = useState({
        full_name: "",
        email: "",
        role_id: "",
        status: "active",
        internal_notes: "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetch("/api/roles")
            .then((r) => r.json())
            .then((j) => setRoles(j.data || []))
            .catch(() => setRoles([]))
    }, [])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    full_name: form.full_name,
                    email: form.email,
                    role_id: form.role_id || null,
                    status: form.status,
                    internal_notes: form.internal_notes,
                }),
            })
            const data = await res.json()
            if (!res.ok || !data.success) {
                setError(data.error || "Error al crear el usuario")
                setLoading(false)
                return
            }
            router.push("/users")
        } catch (err: any) {
            setError(err?.message || "Error de red")
            setLoading(false)
        }
    }

    return (
        <div className="layout-wrap">
            <Sidebar />
            <div className="section-content-right">
                <Header />
                <main className="main-content">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Agregar Usuario</h1>
                        <p className="text-gray-600 mt-1">Crea una nueva cuenta de usuario</p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-2xl">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>
                        )}
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo *</label>
                                    <input type="text" required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                                    <select value={form.role_id} onChange={(e) => setForm({ ...form, role_id: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                                        <option value="">— Sin rol —</option>
                                        {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                                        <option value="active">Activo</option>
                                        <option value="inactive">Inactivo</option>
                                        <option value="pending">Pendiente</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Notas internas</label>
                                <textarea value={form.internal_notes} onChange={(e) => setForm({ ...form, internal_notes: e.target.value })} rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            </div>
                            <p className="text-xs text-gray-500">
                                La contraseña se setea automáticamente en el primer login del usuario.
                            </p>
                            <div className="flex gap-4 pt-4 border-t border-gray-200">
                                <button type="submit" disabled={loading} className="tf-button flex items-center gap-2 disabled:opacity-50">
                                    <Save size={20} />{loading ? "Guardando..." : "Guardar Usuario"}
                                </button>
                                <Link href="/users" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-900 flex items-center gap-2">
                                    <X size={20} />Cancelar
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
