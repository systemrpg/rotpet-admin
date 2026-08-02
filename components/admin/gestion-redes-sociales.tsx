"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Facebook, Instagram, Twitter, Youtube, AlertCircle } from "lucide-react"

export default function GestionRedesSociales() {
  const [config, setConfig] = useState({
    facebook_url: "",
    instagram_url: "",
    twitter_url: "",
    youtube_url: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch("/api/configuracion")

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()

        // Convertir array de objetos a un objeto con las claves correctas
        const configObj: any = {}
        if (Array.isArray(data)) {
          data.forEach((item: any) => {
            configObj[item.clave] = item.valor
          })
        }

        setConfig({
          facebook_url: configObj.facebook_url || "",
          instagram_url: configObj.instagram_url || "",
          twitter_url: configObj.twitter_url || "",
          youtube_url: configObj.youtube_url || "",
        })
      } catch (error) {
        console.error("Error cargando configuración:", error)
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({
      ...config,
      [e.target.name]: e.target.value,
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updates = [
        { clave: "facebook_url", valor: config.facebook_url },
        { clave: "instagram_url", valor: config.instagram_url },
        { clave: "twitter_url", valor: config.twitter_url },
        { clave: "youtube_url", valor: config.youtube_url },
      ]

      for (const item of updates) {
        const response = await fetch("/api/configuracion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        })

        if (!response.ok) throw new Error("Error saving")
      }

      setMessage("Configuración guardada correctamente")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      console.error("Error guardando configuración:", error)
      setMessage("Error al guardar la configuración")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Redes Sociales</CardTitle>
          <CardDescription>Configura los enlaces a tus redes sociales que aparecerán en el sitio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {[
              { name: "facebook_url", label: "Facebook", icon: Facebook },
              { name: "instagram_url", label: "Instagram", icon: Instagram },
              { name: "twitter_url", label: "Twitter/X", icon: Twitter },
              { name: "youtube_url", label: "YouTube", icon: Youtube },
            ].map(({ name, label, icon: Icon }) => (
              <div key={name} className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {label}
                </label>
                <Input
                  type="url"
                  name={name}
                  placeholder="https://..."
                  value={config[name as keyof typeof config]}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>

          {message && (
            <div className="p-3 rounded-md bg-green-50 text-green-800 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {message}
            </div>
          )}

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
