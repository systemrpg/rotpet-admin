import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Edit, Trash2, Plus } from "lucide-react"
import Link from "next/link"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { getAuthenticatedUser } from "@/lib/auth-server"

export const dynamic = 'force-dynamic'

interface Product {
    id: string
    name: string
    sku: string
    price: string | number
    quantity: number
    status: string
    image_url: string | null
    category: { id: string; name: string } | null
    pet_type: { id: string; name: string; slug: string } | null
}

export default async function ProductsPage() {
    // Requiere sesión (en local siempre pasa; en prod requiere cookie)
    await getAuthenticatedUser()

    const { data: products, error } = await supabaseAdmin
        .from('products')
        .select(`
            id, name, sku, price, quantity, status, image_url, category_id, pet_type_id,
            category:categories(id, name),
            pet_type:pet_types(id, name, slug)
        `)
        .order('created_at', { ascending: false })
        .limit(100) as { data: Product[] | null; error: any }

    return (
        <div className="layout-wrap">
            <Sidebar />
            <div className="section-content-right">
                <Header />
                <main className="main-content">
                    {/* Page Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
                            <p className="text-gray-600 mt-1">
                                {products ? `${products.length} productos en el catálogo` : 'Gestiona tu catálogo de productos para Rot Pet'}
                            </p>
                        </div>
                        <Link href="/products/new" className="tf-button flex items-center gap-2">
                            <Plus size={20} />
                            Agregar Producto
                        </Link>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                            Error al cargar productos: {error.message}
                        </div>
                    )}

                    {/* Products Table */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">SKU</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Categoría</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Precio</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {products && products.length > 0 ? (
                                        products.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{product.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{product.sku || '—'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {product.category?.name || '—'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                    ${product.price}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{product.quantity}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span
                                                        className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                                                            product.status === 'active'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-red-100 text-red-700'
                                                        }`}
                                                    >
                                                        {product.status === 'active' ? 'Disponible' : 'No Disponible'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            href={`/products/${product.id}/edit`}
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
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                                {error ? 'Error al cargar productos' : 'No hay productos aún. Crea el primero.'}
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
