"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const estadoColores: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-800",
  completada: "bg-blue-100 text-blue-800",
  entregada: "bg-green-100 text-green-800",
  cancelada: "bg-red-100 text-red-800",
}

export default function GestionOrdenes() {
  const [ordenes, setOrdenes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchOrdenes()
  }, [])

  const fetchOrdenes = async () => {
    const { data } = await supabase
      .from("ordenes")
      .select(`
        *,
        orden_items(*, productos(nombre)),
        profiles(nombre_completo, email)
      `)
      .order("created_at", { ascending: false })

    setOrdenes(data || [])
    setLoading(false)
  }

  const updateEstado = async (id: string, nuevoEstado: string) => {
    try {
      const { error } = await supabase.from("ordenes").update({ estado: nuevoEstado }).eq("id", id)

      if (error) throw error
      fetchOrdenes()
    } catch (error) {
      console.error("Error al actualizar orden:", error)
    }
  }

  if (loading) return <div>Cargando órdenes...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Órdenes</CardTitle>
        <CardDescription>Total: {ordenes.length}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {ordenes.map((orden) => (
            <Card key={orden.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">Orden #{orden.id.slice(0, 8)}</CardTitle>
                    <CardDescription>{orden.profiles?.nombre_completo}</CardDescription>
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
                    <ul className="text-sm space-y-1">
                      {orden.orden_items?.map((item: any) => (
                        <li key={item.id}>
                          {item.productos?.nombre} x {item.cantidad} - ${item.precio_unitario * item.cantidad}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">Total: ${orden.total}</p>
                    <select
                      value={orden.estado}
                      onChange={(e) => updateEstado(orden.id, e.target.value)}
                      className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="completada">Completada</option>
                      <option value="entregada">Entregada</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
