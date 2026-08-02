"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ReseniasComponentProps {
  userId: string
}

export default function ReseniasComponent({ userId }: ReseniasComponentProps) {
  const [resenas, setResenas] = useState<any[]>([])
  const [productos, setProductos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    producto_id: "",
    calificacion: 5,
    comentario: "",
  })
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: reseniasData } = await supabase
        .from("resenas")
        .select("*, productos(nombre)")
        .eq("usuario_id", userId)
        .order("created_at", { ascending: false })

      const { data: productosData } = await supabase.from("productos").select("id, nombre")

      setResenas(reseniasData || [])
      setProductos(productosData || [])
      setLoading(false)
    }

    fetchData()
  }, [userId, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.producto_id) return

    setSaving(true)
    try {
      const { error } = await supabase.from("resenas").insert({
        usuario_id: userId,
        producto_id: formData.producto_id,
        calificacion: formData.calificacion,
        comentario: formData.comentario,
      })

      if (error) throw error

      setFormData({ producto_id: "", calificacion: 5, comentario: "" })
      setShowForm(false)
      // Refresh resenas
      const { data: nuevasResenas } = await supabase
        .from("resenas")
        .select("*, productos(nombre)")
        .eq("usuario_id", userId)
        .order("created_at", { ascending: false })
      setResenas(nuevasResenas || [])
    } catch (error) {
      console.error("Error al crear reseña:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Cargando reseñas...</div>

  return (
    <div className="space-y-6">
      {!showForm && <Button onClick={() => setShowForm(true)}>Escribir una Reseña</Button>}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nueva Reseña</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="producto">Producto</Label>
                <select
                  id="producto"
                  value={formData.producto_id}
                  onChange={(e) => setFormData({ ...formData, producto_id: e.target.value })}
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="">Selecciona un producto</option>
                  {productos.map((producto) => (
                    <option key={producto.id} value={producto.id}>
                      {producto.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="calificacion">Calificación</Label>
                <select
                  id="calificacion"
                  value={formData.calificacion}
                  onChange={(e) => setFormData({ ...formData, calificacion: Number(e.target.value) })}
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="1">1 estrella</option>
                  <option value="2">2 estrellas</option>
                  <option value="3">3 estrellas</option>
                  <option value="4">4 estrellas</option>
                  <option value="5">5 estrellas</option>
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="comentario">Comentario</Label>
                <Textarea
                  id="comentario"
                  placeholder="Comparte tu opinión sobre este producto..."
                  value={formData.comentario}
                  onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "Guardando..." : "Publicar Reseña"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {resenas.length === 0 && !showForm ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">No has escrito reseñas aún</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {resenas.map((resena) => (
            <Card key={resena.id}>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle className="text-base">{resena.productos?.nombre}</CardTitle>
                    <CardDescription>{resena.calificacion} ⭐</CardDescription>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(resena.created_at).toLocaleDateString("es-MX")}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p>{resena.comentario}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
