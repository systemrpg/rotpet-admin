"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

interface PerfilComponentProps {
  userId: string
}

export default function PerfilComponent({ userId }: PerfilComponentProps) {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ nombre_completo: "", telefono: "", email: "" })
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", userId).single()

      setProfile(data)
      setFormData({
        nombre_completo: data?.nombre_completo || "",
        telefono: data?.telefono || "",
        email: data?.email || "",
      })
      setLoading(false)
    }

    fetchProfile()
  }, [userId, supabase])

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          nombre_completo: formData.nombre_completo,
          telefono: formData.telefono,
        })
        .eq("id", userId)

      if (error) throw error
      setIsEditing(false)
      router.refresh()
    } catch (error) {
      console.error("Error al actualizar perfil:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) return <div>Cargando...</div>

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>Actualiza tu información de perfil</CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input
                  id="nombre"
                  value={formData.nombre_completo}
                  onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Correo Electrónico (no editable)</Label>
                <Input id="email" value={formData.email} disabled />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? "Guardando..." : "Guardar Cambios"}
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nombre Completo</p>
                <p className="text-lg font-medium">{formData.nombre_completo || "No definido"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p className="text-lg font-medium">{formData.telefono || "No definido"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Correo Electrónico</p>
                <p className="text-lg font-medium">{formData.email}</p>
              </div>
              <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Seguridad</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
