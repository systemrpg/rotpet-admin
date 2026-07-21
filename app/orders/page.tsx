import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Eye, Download } from "lucide-react"
import Link from "next/link"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { requireAdmin } from "@/lib/auth-server"

export const dynamic = 'force-dynamic'

interface Order {
    id: string
    total_amount: string | number
    status: string
    created_at: string
    users: { full_name: string; email: string } | null
    order_items: {
        product_id: string
        quantity: number
        unit_price: number
        products: { name: string } | null
    }[]
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
    processing: { label: 'En proceso', color: 'bg-blue-100 text-blue-700' },
    completed: { label: 'Completado', color: 'bg-green-100 text-green-700' },
    delivered: { label: 'Entregado', color: 'bg-green-100 text-green-700' },
    shipped: { label: 'Enviado', color: 'bg-blue-100 text-blue-700' },
    cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-700' },
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default async function OrdersPage() {
    await requireAdmin()

    const { data: orders, error } = await supabaseAdmin
        .from('orders')
        .select('id, total_amount, status, created_at, users(full_name, email), order_items(product_id, quantity, unit_price, products(name))')
        .order('created_at', { ascending: false })
        .limit(200) as { data: Order[] | null; error: any }

    return (
        <div className="layout-wrap">
            <Sidebar />
            <div className="section-content-right">
                <Header />
                <main className="main-content">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Órdenes</h1>
                        <p className="text-gray-600 mt-1">
                            {orders ? `${orders.length} órdenes` : 'Gestiona todas las órdenes de Rot Pet Shop'}
                        </p>
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
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID Orden</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Producto</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cliente</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {orders && orders.length > 0 ? (
                                        orders.map((order) => {
                                            const firstItem = order.order_items?.[0]
                                            const productLabel = firstItem
                                                ? `${firstItem.products?.name || 'Producto'}${order.order_items.length > 1 ? ` +${order.order_items.length - 1}` : ''}`
                                                : '—'
                                            const statusInfo = STATUS_LABEL[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-700' }
                                            const orderNumber = order.id.split('-')[0].toUpperCase()
                                            return (
                                                <tr key={order.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-sm font-medium text-orange-600">#{orderNumber}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{productLabel}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {order.users?.full_name || order.users?.email || '—'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">${order.total_amount}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(order.created_at)}</td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${statusInfo.color}`}>
                                                            {statusInfo.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <Link
                                                                href={`/orders/${order.id}`}
                                                                className="p-2 hover:bg-gray-100 rounded transition-colors"
                                                                title="Ver detalle"
                                                            >
                                                                <Eye size={16} className="text-gray-600" />
                                                            </Link>
                                                            <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Descargar">
                                                                <Download size={16} className="text-gray-600" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                                {error ? 'Error al cargar órdenes' : 'No hay órdenes aún.'}
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
