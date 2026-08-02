"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrdenes: 0,
    ventasTotal: 0,
    productosTotal: 0,
    usuariosTotal: 0,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      const { data: ordenes } = await supabase.from("ordenes").select("total")
      const { data: productos } = await supabase.from("productos").select("id")
      const { data: usuarios } = await supabase.from("profiles").select("id")

      const ventasTotal = ordenes?.reduce((sum, ord) => sum + (ord.total || 0), 0) || 0

      setStats({
        totalOrdenes: ordenes?.length || 0,
        ventasTotal,
        productosTotal: productos?.length || 0,
        usuariosTotal: usuarios?.length || 0,
      })
      setLoading(false)
    }

    fetchStats()
  }, [supabase])

  if (loading) return <div>Cargando datos...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total de Órdenes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalOrdenes}</div>
          <p className="text-xs text-muted-foreground">órdenes procesadas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Ventas Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">${stats.ventasTotal.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">en ventas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.productosTotal}</div>
          <p className="text-xs text-muted-foreground">en catálogo</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.usuariosTotal}</div>
          <p className="text-xs text-muted-foreground">registrados</p>
        </CardContent>
      </Card>
    </div>
  )
}
