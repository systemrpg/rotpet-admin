"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Save, X } from "lucide-react"
import Link from "next/link"

export default function NewCategoryPage() {
    const router = useRouter()
    const [form, setForm] = useState({
        name: "",
        slug: "",
        status: "active",
        image_url: "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    function autoSlug(name: string) {
        return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    slug: form.slug || autoSlug(form.name),
                    status: form.status,
                    image_url: form.image_url || null,
                }),
            })
            const data = await res.json()
            if (!res.ok || !data.success) {
                setError(data.error || "Error al crear la categoría")
                setLoading(false)
                return
            }
            router.push("/categories")
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
                        <h1 className="text-3xl font-bold text-gray-900">Nueva Categoría</h1>
                        <p className="text-gray-600 mt-1">Crea una nueva categoría de productos</p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-2xl">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                                {error}
                            </div>
                        )}
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Categoría *</label>
                                <input type="text" required value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value, slug: form.slug || autoSlug(e.target.value) })}
                                    placeholder="Ej: Alimentos Secos"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL)</label>
                                <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                    placeholder="alimentos-secos"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                <p className="text-xs text-gray-500 mt-1">Auto-generado si se deja vacío. Solo letras, números y guiones.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">URL de imagen (opcional)</label>
                                <input type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="active" checked={form.status === "active"} onChange={(e) => setForm({ ...form, status: e.target.checked ? "active" : "inactive" })}
                                    className="w-4 h-4 text-orange-600 rounded" />
                                <label htmlFor="active" className="text-sm font-medium text-gray-700">Categoría Activa</label>
                            </div>
                            <div className="flex gap-4 pt-4 border-t border-gray-200">
                                <button type="submit" disabled={loading} className="tf-button flex items-center gap-2 disabled:opacity-50">
                                    <Save size={20} />{loading ? "Guardando..." : "Guardar Categoría"}
                                </button>
                                <Link href="/categories" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-900 flex items-center gap-2">
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
