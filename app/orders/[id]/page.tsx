import { notFound } from "next/navigation"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { requireAdmin } from "@/lib/auth-server"
import OrderStatusUpdater from "./order-status-updater"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { ArrowLeft, Download, Printer } from "lucide-react"

export const dynamic = 'force-dynamic'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: PageProps) {
    await requireAdmin()
    const { id } = await params

    const { data: order, error } = await supabaseAdmin
        .from('orders')
        .select('*, users(full_name, email), order_items(product_id, quantity, unit_price, products(name))')
        .eq('id', id)
        .single() as { data: any; error: any }

    if (error || !order) notFound()

    const items = order.order_items || []
    const subtotal = items.reduce((s: number, it: any) => s + (Number(it.unit_price) * Number(it.quantity)), 0)
    const orderNumber = order.id.split('-')[0].toUpperCase()

    return (
        <div className="layout-wrap">
            <Sidebar />
            <div className="section-content-right">
                <Header />
                <main className="main-content">
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/orders" className="p-2 hover:bg-gray-100 rounded">
                            <ArrowLeft size={20} className="text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Detalle de Orden #{orderNumber}</h1>
                            <p className="text-gray-600 mt-1">
                                {new Date(order.created_at).toLocaleString('es-VE')}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Productos</h2>
                                <div className="divide-y divide-gray-200">
                                    {items.length === 0 ? (
                                        <p className="text-gray-500 py-4">Sin items.</p>
                                    ) : items.map((it: any) => (
                                        <div key={it.product_id} className="flex items-center justify-between py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{it.products?.name || 'Producto'}</p>
                                                <p className="text-sm text-gray-600">Cantidad: {it.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-gray-900">${Number(it.unit_price).toFixed(2)}</p>
                                                <p className="text-sm text-gray-600">Subtotal: ${(Number(it.unit_price) * Number(it.quantity)).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal:</span><span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Envío:</span><span>${(Number(order.total_amount) - subtotal).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-lg text-gray-900 border-t border-gray-200 pt-2">
                                        <span>Total:</span><span>${Number(order.total_amount).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Cliente</h2>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-600">Nombre</p>
                                        <p className="font-medium text-gray-900">{order.users?.full_name || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-medium text-gray-900">{order.users?.email || '—'}</p>
                                    </div>
                                    {order.shipping_address && (
                                        <div>
                                            <p className="text-sm text-gray-600">Dirección de envío</p>
                                            <p className="font-medium text-gray-900">{order.shipping_address}</p>
                                        </div>
                                    )}
                                    {order.contact_phone && (
                                        <div>
                                            <p className="text-sm text-gray-600">Teléfono</p>
                                            <p className="font-medium text-gray-900">{order.contact_phone}</p>
                                        </div>
                                    )}
                                    {order.payment_method && (
                                        <div>
                                            <p className="text-sm text-gray-600">Método de pago</p>
                                            <p className="font-medium text-gray-900">{order.payment_method}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
                            <div className="flex flex-col gap-2">
                                <button className="tf-button w-full flex items-center justify-center gap-2">
                                    <Download size={20} />Descargar
                                </button>
                                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-900 flex items-center justify-center gap-2">
                                    <Printer size={20} />Imprimir
                                </button>
                            </div>
                        </div>
                    </div>

                    <Footer />
                </main>
            </div>
        </div>
    )
}
