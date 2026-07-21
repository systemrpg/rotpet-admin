"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Save, X } from "lucide-react"
import Link from "next/link"

interface Category {
    id: string
    name: string
}

export default function NewProductPage() {
    const router = useRouter()
    const [categories, setCategories] = useState<Category[]>([])
    const [form, setForm] = useState({
        name: "",
        sku: "",
        category_id: "",
        price: "",
        quantity: "0",
        status: "active",
        description: "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetch("/api/products/categories/list")
            .then((r) => r.json())
            .then((j) => setCategories(j.data || []))
            .catch(() => setCategories([]))
    }, [])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    sku: form.sku || null,
                    category_id: form.category_id || null,
                    price: parseFloat(form.price) || 0,
                    quantity: parseInt(form.quantity) || 0,
                    status: form.status,
                    description: form.description,
                }),
            })
            const data = await res.json()
            if (!res.ok || !data.success) {
                setError(data.error || "Error al crear el producto")
                setLoading(false)
                return
            }
            router.push("/products")
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
                        <h1 className="text-3xl font-bold text-gray-900">Agregar Producto</h1>
                        <p className="text-gray-600 mt-1">Crea un nuevo producto para Rot Pet</p>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-8">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                                {error}
                            </div>
                        )}
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Producto *</label>
                                    <input
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="Ej: Alimento Premium para Perros"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                                    <input
                                        type="text"
                                        value={form.sku}
                                        onChange={(e) => setForm({ ...form, sku: e.target.value })}
                                        placeholder="Ej: RC-ADM-15"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                                    <select
                                        value={form.category_id}
                                        onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="">Selecciona una categoría</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Precio *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                                        placeholder="0.00"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad en Stock</label>
                                    <input
                                        type="number"
                                        value={form.quantity}
                                        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                                    <select
                                        value={form.status}
                                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="active">Disponible</option>
                                        <option value="inactive">No Disponible</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div className="flex gap-4 pt-4 border-t border-gray-200">
                                <button type="submit" disabled={loading} className="tf-button flex items-center gap-2 disabled:opacity-50">
                                    <Save size={20} />
                                    {loading ? "Guardando..." : "Guardar Producto"}
                                </button>
                                <Link href="/products" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-900 flex items-center gap-2">
                                    <X size={20} />
                                    Cancelar
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
