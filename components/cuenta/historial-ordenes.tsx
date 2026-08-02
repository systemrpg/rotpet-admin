"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface HistorialOrdenesComponentProps {
  userId: string
}

const estadoColores: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-800",
  completada: "bg-blue-100 text-blue-800",
  entregada: "bg-green-100 text-green-800",
  cancelada: "bg-red-100 text-red-800",
}

export default function HistorialOrdenesComponent({ userId }: HistorialOrdenesComponentProps) {
  const [ordenes, setOrdenes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchOrdenes = async () => {
      const { data } = await supabase
        .from("ordenes")
        .select(`
          *,
          orden_items (
            *,
            productos (nombre, precio)
          )
        `)
        .eq("usuario_id", userId)
        .order("created_at", { ascending: false })

      setOrdenes(data || [])
      setLoading(false)
    }

    fetchOrdenes()
  }, [userId, supabase])

  if (loading) return <div>Cargando órdenes...</div>

  if (ordenes.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No tienes órdenes aún</p>
            <Button asChild>
              <Link href="/tienda">Ir a la tienda</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {ordenes.map((orden) => (
        <Card key={orden.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Orden #{orden.id.slice(0, 8)}</CardTitle>
                <CardDescription>{new Date(orden.created_at).toLocaleDateString("es-MX")}</CardDescription>
              </div>
              <Badge className={estadoColores[orden.estado]}>
                {orden.estado.charAt(0).toUpperCase() + orden.estado.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Productos</h4>
                <ul className="space-y-1">
                  {orden.orden_items?.map((item: any) => (
                    <li key={item.id} className="text-sm">
                      {item.productos?.nombre} x {item.cantidad} - ${item.precio_unitario * item.cantidad}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-2 border-t">
                <p className="font-semibold">Total: ${orden.total}</p>
              </div>
              {orden.numero_whatsapp && (
                <div className="bg-blue-50 p-3 rounded text-sm">
                  <p>
                    <strong>WhatsApp:</strong> {orden.numero_whatsapp}
                  </p>
                  {orden.mensaje_whatsapp && (
                    <p>
                      <strong>Mensaje:</strong> {orden.mensaje_whatsapp}
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
