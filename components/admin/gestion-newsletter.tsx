"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function GestionNewsletter() {
  const [suscriptores, setSuscriptores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    asunto: "",
    contenido: "",
  })
  const [sending, setSending] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchSuscriptores()
  }, [])

  const fetchSuscriptores = async () => {
    const { data } = await supabase
      .from("newsletter_suscriptores")
      .select("*")
      .order("created_at", { ascending: false })

    setSuscriptores(data || [])
    setLoading(false)
  }

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)

    try {
      // En una aplicación real, aquí enviarías los correos usando un servicio como SendGrid, Mailgun, etc.
      // Por ahora solo registramos el envío
      const suscriptoresActivos = suscriptores.filter((s) => s.activo)
      console.log("Enviando newsletter a:", suscriptoresActivos.length, "suscriptores")
      console.log("Asunto:", formData.asunto)
      console.log("Contenido:", formData.contenido)

      alert(`Newsletter enviado a ${suscriptoresActivos.length} suscriptores`)
      setFormData({ asunto: "", contenido: "" })
      setShowForm(false)
    } catch (error) {
      console.error("Error al enviar newsletter:", error)
    } finally {
      setSending(false)
    }
  }

  const toggleSuscriptor = async (id: string, activo: boolean) => {
    try {
      const { error } = await supabase.from("newsletter_suscriptores").update({ activo: !activo }).eq("id", id)

      if (error) throw error
      fetchSuscriptores()
    } catch (error) {
      console.error("Error al actualizar suscriptor:", error)
    }
  }

  const deleteSuscriptor = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este suscriptor?")) return

    try {
      const { error } = await supabase.from("newsletter_suscriptores").delete().eq("id", id)

      if (error) throw error
      fetchSuscriptores()
    } catch (error) {
      console.error("Error al eliminar suscriptor:", error)
    }
  }

  if (loading) return <div>Cargando newsletter...</div>

  return (
    <div className="space-y-6">
      {!showForm && <Button onClick={() => setShowForm(true)}>+ Enviar Newsletter</Button>}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Enviar Newsletter</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendNewsletter} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="asunto">Asunto</Label>
                <Input
                  id="asunto"
                  value={formData.asunto}
                  onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                  placeholder="Ej: ¡Oferta especial para nuestros amigos peludos!"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contenido">Contenido</Label>
                <Textarea
                  id="contenido"
                  value={formData.contenido}
                  onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                  placeholder="Escribe el contenido de tu newsletter aquí..."
                  className="h-48"
                  required
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg text-sm">
                <p className="font-semibold">
                  Se enviará a {suscriptores.filter((s) => s.activo).length} suscriptor(es) activo(s)
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={sending}>
                  {sending ? "Enviando..." : "Enviar Newsletter"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Suscriptores del Newsletter</CardTitle>
          <CardDescription>
            Total: {suscriptores.length} | Activos: {suscriptores.filter((s) => s.activo).length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {suscriptores.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No hay suscriptores aún</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Correo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha de Registro</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suscriptores.map((suscriptor) => (
                  <TableRow key={suscriptor.id}>
                    <TableCell className="font-medium">{suscriptor.email}</TableCell>
                    <TableCell>
                      <Badge variant={suscriptor.activo ? "default" : "secondary"}>
                        {suscriptor.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(suscriptor.created_at).toLocaleDateString("es-MX")}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleSuscriptor(suscriptor.id, suscriptor.activo)}
                        >
                          {suscriptor.activo ? "Desactivar" : "Activar"}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteSuscriptor(suscriptor.id)}>
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
