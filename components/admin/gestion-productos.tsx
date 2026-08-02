"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function GestionProductos() {
  const [productos, setProductos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    precio_original: "",
    imagen_url: "",
    categoria: "",
    mascota: "gato",
    destacado: false,
    stock: "",
  })
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchProductos()
  }, [])

  const fetchProductos = async () => {
    const { data } = await supabase.from("productos").select("*").order("created_at", { ascending: false })
    setProductos(data || [])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (editingId) {
        const { error } = await supabase
          .from("productos")
          .update({
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            precio: Number.parseFloat(formData.precio),
            precio_original: formData.precio_original ? Number.parseFloat(formData.precio_original) : null,
            imagen_url: formData.imagen_url,
            categoria: formData.categoria,
            mascota: formData.mascota,
            destacado: formData.destacado,
            stock: Number.parseInt(formData.stock),
          })
          .eq("id", editingId)

        if (error) throw error
      } else {
        const { error } = await supabase.from("productos").insert({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          precio: Number.parseFloat(formData.precio),
          precio_original: formData.precio_original ? Number.parseFloat(formData.precio_original) : null,
          imagen_url: formData.imagen_url,
          categoria: formData.categoria,
          mascota: formData.mascota,
          destacado: formData.destacado,
          stock: Number.parseInt(formData.stock),
        })

        if (error) throw error
      }

      resetForm()
      setShowForm(false)
      fetchProductos()
    } catch (error) {
      console.error("Error al guardar producto:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) return

    try {
      const { error } = await supabase.from("productos").delete().eq("id", id)
      if (error) throw error
      fetchProductos()
    } catch (error) {
      console.error("Error al eliminar producto:", error)
    }
  }

  const handleEdit = (producto: any) => {
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || "",
      precio: producto.precio,
      precio_original: producto.precio_original || "",
      imagen_url: producto.imagen_url || "",
      categoria: producto.categoria || "",
      mascota: producto.mascota || "gato",
      destacado: producto.destacado || false,
      stock: producto.stock,
    })
    setEditingId(producto.id)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      precio_original: "",
      imagen_url: "",
      categoria: "",
      mascota: "gato",
      destacado: false,
      stock: "",
    })
    setEditingId(null)
  }

  if (loading) return <div>Cargando productos...</div>

  return (
    <div className="space-y-6">
      {!showForm && (
        <Button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
        >
          + Nuevo Producto
        </Button>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Editar Producto" : "Nuevo Producto"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="categoria">Categoría</Label>
                  <Input
                    id="categoria"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="precio">Precio</Label>
                  <Input
                    id="precio"
                    type="number"
                    step="0.01"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="precio_original">Precio Original</Label>
                  <Input
                    id="precio_original"
                    type="number"
                    step="0.01"
                    value={formData.precio_original}
                    onChange={(e) => setFormData({ ...formData, precio_original: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="mascota">Mascota</Label>
                  <select
                    id="mascota"
                    value={formData.mascota}
                    onChange={(e) => setFormData({ ...formData, mascota: e.target.value })}
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="gato">Gato</option>
                    <option value="perro">Perro</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.destacado}
                      onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })}
                    />
                    <span className="text-sm">Destacado</span>
                  </label>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="imagen_url">URL de Imagen</Label>
                <Input
                  id="imagen_url"
                  value={formData.imagen_url}
                  onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm()
                    setShowForm(false)
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
          <CardDescription>Total: {productos.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productos.map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell className="font-medium">{producto.nombre}</TableCell>
                  <TableCell>{producto.categoria}</TableCell>
                  <TableCell>${producto.precio}</TableCell>
                  <TableCell>{producto.stock}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(producto)}>
                        Editar
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(producto.id)}>
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
