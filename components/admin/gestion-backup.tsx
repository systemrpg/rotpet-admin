"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Download, Upload } from "lucide-react"
import { createDatabaseBackup, restoreDatabaseBackup } from "@/lib/supabase/backup"

export default function GestionBackup() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleBackup = async () => {
    try {
      setLoading(true)
      setMessage(null)

      const backup = await createDatabaseBackup()
      const dataStr = JSON.stringify(backup, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `rot-pet-shop-backup-${backup.timestamp.split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setMessage({ type: "success", text: "Backup descargado exitosamente" })
    } catch (error) {
      setMessage({ type: "error", text: "Error al crear el backup" })
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true)
      setMessage(null)

      const file = event.target.files?.[0]
      if (!file) return

      const text = await file.text()
      const backupData = JSON.parse(text)

      // Validate backup structure
      if (!backupData.data || backupData.version !== "1.0") {
        throw new Error("Formato de backup inválido")
      }

      await restoreDatabaseBackup(backupData)
      setMessage({ type: "success", text: "Base de datos restaurada exitosamente" })
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Error al restaurar la base de datos",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Gestión de Backup y Restauración
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Usa estas herramientas para hacer backup de tu base de datos antes de migrar a un nuevo servidor, o para
            restaurar un backup anterior.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-3">Crear Backup</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Descargar una copia completa de toda tu base de datos.
              </p>
              <Button onClick={handleBackup} disabled={loading} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Descargar Backup
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-3">Restaurar Backup</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Cargar un archivo de backup anterior (esto eliminará datos actuales).
              </p>
              <label>
                <input type="file" accept=".json" onChange={handleRestore} disabled={loading} className="hidden" />
                <Button asChild variant="outline" className="w-full cursor-pointer bg-transparent" disabled={loading}>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Cargar Backup
                  </span>
                </Button>
              </label>
            </div>
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm text-amber-800">
            <strong>Advertencia:</strong> La restauración eliminará todos los datos actuales y los reemplazará con los
            del backup. Asegúrate de haber descargado un backup reciente antes.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
