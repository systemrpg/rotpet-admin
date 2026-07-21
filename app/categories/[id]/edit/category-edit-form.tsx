"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, X } from "lucide-react"
import Link from "next/link"

interface Category {
    id: string
    name: string
    slug: string
    status: string
    image_url: string | null
    description?: string | null
}

export default function CategoryEditForm({ category }: { category: Category }) {
    const router = useRouter()
    const [form, setForm] = useState({
        name: category.name,
        slug: category.slug,
        status: category.status,
        image_url: category.image_url || "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            const res = await fetch(`/api/categories/${category.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    slug: form.slug,
                    status: form.status,
                    image_url: form.image_url || null,
                }),
            })
            const data = await res.json()
            if (!res.ok || !data.success) {
                setError(data.error || "Error al actualizar")
                setLoading(false)
                return
            }
            router.push("/categories")
        } catch (err: any) {
            setError(err?.message || "Error de red")
            setLoading(false)
        }
    }

    async function handleDelete() {
        if (!confirm("¿Eliminar esta categoría?")) return
        setLoading(true)
        try {
            const res = await fetch(`/api/categories/${category.id}`, { method: "DELETE" })
            if (res.status === 204 || res.ok) {
                router.push("/categories")
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
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                    <input type="text" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL de imagen</label>
                    <input type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="active" checked={form.status === "active"}
                        onChange={(e) => setForm({ ...form, status: e.target.checked ? "active" : "inactive" })}
                        className="w-4 h-4 text-orange-600 rounded" />
                    <label htmlFor="active" className="text-sm font-medium text-gray-700">Categoría Activa</label>
                </div>
                <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <button type="submit" disabled={loading} className="tf-button flex items-center gap-2 disabled:opacity-50">
                        <Save size={20} />{loading ? "Guardando..." : "Guardar Cambios"}
                    </button>
                    <Link href="/categories" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-900 flex items-center gap-2">
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
