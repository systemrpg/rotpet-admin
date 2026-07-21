"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, X } from "lucide-react"
import Link from "next/link"

interface User {
    id: string
    email: string
    full_name: string | null
    role_id: string | null
    status: string
    balance: string | number
    internal_notes: string | null
    phone: string | null
}

interface Role {
    id: string
    name: string
}

export default function UserEditForm({ user, roles }: { user: User; roles: Role[] }) {
    const router = useRouter()
    const [form, setForm] = useState({
        full_name: user.full_name || "",
        email: user.email,
        role_id: user.role_id || "",
        status: user.status,
        balance: String(user.balance),
        internal_notes: user.internal_notes || "",
        phone: user.phone || "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            const res = await fetch(`/api/users/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    full_name: form.full_name,
                    email: form.email,
                    role_id: form.role_id || null,
                    status: form.status,
                    balance: parseFloat(form.balance) || 0,
                    internal_notes: form.internal_notes,
                    phone: form.phone || null,
                }),
            })
            const data = await res.json()
            if (!res.ok || !data.success) {
                setError(data.error || "Error al actualizar")
                setLoading(false)
                return
            }
            router.push("/users")
        } catch (err: any) {
            setError(err?.message || "Error de red")
            setLoading(false)
        }
    }

    async function handleDelete() {
        if (!confirm(`¿Eliminar (soft-delete) a ${user.email}?`)) return
        setLoading(true)
        try {
            const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" })
            if (res.status === 204 || res.ok) {
                router.push("/users")
            } else {
                const data = await res.json()
                setError(data.error || "Error al eliminar")
                setLoading(false)
            }
        } catch (err: any) {
            setError(err?.message || "Error de red")
            setLoading(false)
        }
    }

    return (
        <>
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                        <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                        <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Balance</label>
                        <input type="number" step="0.01" value={form.balance} onChange={(e) => setForm({ ...form, balance: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notas internas</label>
                    <textarea value={form.internal_notes} onChange={(e) => setForm({ ...form, internal_notes: e.target.value })} rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <button type="submit" disabled={loading} className="tf-button flex items-center gap-2 disabled:opacity-50">
                        <Save size={20} />{loading ? "Guardando..." : "Guardar Cambios"}
                    </button>
                    <Link href="/users" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-900 flex items-center gap-2">
                        <X size={20} />Cancelar
                    </Link>
                    <button type="button" onClick={handleDelete} disabled={loading} className="ml-auto px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 disabled:opacity-50">
                        Eliminar
                    </button>
                </div>
            </form>
        </>
    )
}
