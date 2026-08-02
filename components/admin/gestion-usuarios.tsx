"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchUsuarios()
  }, [])

  const fetchUsuarios = async () => {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

    setUsuarios(data || [])
    setLoading(false)
  }

  const toggleAdmin = async (id: string, esAdmin: boolean) => {
    try {
      const { error } = await supabase.from("profiles").update({ es_admin: !esAdmin }).eq("id", id)

      if (error) throw error
      fetchUsuarios()
    } catch (error) {
      console.error("Error al actualizar usuario:", error)
    }
  }

  if (loading) return <div>Cargando usuarios...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuarios</CardTitle>
        <CardDescription>Total: {usuarios.length}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell className="font-medium">{usuario.nombre_completo || "Sin nombre"}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>{usuario.telefono || "-"}</TableCell>
                <TableCell>
                  <Badge variant={usuario.es_admin ? "default" : "secondary"}>
                    {usuario.es_admin ? "Administrador" : "Cliente"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => toggleAdmin(usuario.id, usuario.es_admin)}>
                    {usuario.es_admin ? "Quitar Admin" : "Hacer Admin"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
