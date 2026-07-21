"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'processing', label: 'En proceso' },
    { value: 'shipped', label: 'Enviado' },
    { value: 'delivered', label: 'Entregado' },
    { value: 'completed', label: 'Completado' },
    { value: 'cancelled', label: 'Cancelado' },
]

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-blue-100 text-blue-700',
    delivered: 'bg-green-100 text-green-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
}

export default function OrderStatusUpdater({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
    const router = useRouter()
    const [status, setStatus] = useState(currentStatus)
    const [saving, setSaving] = useState(false)
    const [msg, setMsg] = useState<string | null>(null)

    async function handleUpdate() {
        if (status === currentStatus) return
        setSaving(true)
        setMsg(null)
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            })
            const data = await res.json()
            if (!res.ok) {
                setMsg(data.error || "Error")
                setSaving(false)
                return
            }
            setMsg("Estado actualizado")
            router.refresh()
        } catch (err: any) {
            setMsg(err?.message || "Error de red")
        }
        setSaving(false)
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de la Orden</h3>
            <div className="space-y-3">
                <select value={status} onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                    {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-700'}`}>
                    {STATUS_OPTIONS.find((o) => o.value === status)?.label || status}
                </span>
                <button onClick={handleUpdate} disabled={saving || status === currentStatus}
                    className="w-full tf-button disabled:opacity-50 disabled:cursor-not-allowed">
                    {saving ? "Actualizando..." : "Actualizar estado"}
                </button>
                {msg && <p className="text-xs text-gray-600">{msg}</p>}
            </div>
        </div>
    )
}
