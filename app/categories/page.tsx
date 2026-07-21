import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Edit, Trash2, Plus } from "lucide-react"
import Link from "next/link"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { getAuthenticatedUser } from "@/lib/auth-server"

export const dynamic = 'force-dynamic'

interface Category {
    id: string
    name: string
    slug: string
    status: string
    image_url: string | null
    product_count?: number
}

async function getCategoriesWithCount(): Promise<{ data: Category[]; error: string | null }> {
    // Query categorías
    const { data, error } = await supabaseAdmin
        .from('categories')
        .select('id, name, slug, status, image_url') as { data: Category[] | null; error: any }

    if (error) return { data: [], error: error.message }
    if (!data) return { data: [], error: null }

    // Conteo manual de productos por categoría (más confiable que el join products(count) en el adapter)
    const { data: products, error: prodError } = await supabaseAdmin
        .from('products')
        .select('id, category_id') as { data: { id: string; category_id: string }[] | null; error: any }

    if (prodError) return { data, error: null }

    const counts = new Map<string, number>()
    for (const p of products || []) {
        if (p.category_id) {
            counts.set(p.category_id, (counts.get(p.category_id) || 0) + 1)
        }
    }

    const enriched = data.map((c) => ({ ...c, product_count: counts.get(c.id) || 0 }))
    return { data: enriched, error: null }
}

export default async function CategoriesPage() {
    await getAuthenticatedUser()

    const { data: categories, error } = await getCategoriesWithCount()

    return (
        <div className="layout-wrap">
            <Sidebar />
            <div className="section-content-right">
                <Header />
                <main className="main-content">
                    {/* Page Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
                            <p className="text-gray-600 mt-1">
                                {categories.length > 0
                                    ? `${categories.length} categorías`
                                    : 'Gestiona las categorías de productos'}
                            </p>
                        </div>
                        <Link href="/categories/new" className="tf-button flex items-center gap-2">
                            <Plus size={20} />
                            Nueva Categoría
                        </Link>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                            Error: {error}
                        </div>
                    )}

                    {/* Categories Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/categories/${category.id}/edit`}
                                                className="p-2 hover:bg-gray-100 rounded transition-colors"
                                            >
                                                <Edit size={16} className="text-gray-600" />
                                            </Link>
                                            <button className="p-2 hover:bg-red-50 rounded transition-colors">
                                                <Trash2 size={16} className="text-red-600" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">{category.product_count}</span> productos
                                        </p>
                                        <span
                                            className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                                                category.status === 'active'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            {category.status === 'active' ? 'Activa' : 'Inactiva'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                No hay categorías aún. Crea la primera.
                            </div>
                        )}
                    </div>

                    <Footer />
                </main>
            </div>
        </div>
    )
}
