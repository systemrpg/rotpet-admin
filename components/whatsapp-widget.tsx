"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { MessageCircle, X } from "lucide-react"

const DEFAULT_WHATSAPP_NUMBER = "+52 4121342478"

export default function WhatsAppWidget() {
  const [config, setConfig] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchConfig = async () => {
      const { data, error } = await supabase.from("configuracion_whatsapp").select("*").maybeSingle()

      if (error) {
        console.error("[v0] Error fetching WhatsApp config:", error)
      }

      setConfig(data)
      setIsLoading(false)
    }

    fetchConfig()
  }, [supabase])

  if (isLoading) return null

  const numeroWhatsApp = config?.numero_whatsapp || DEFAULT_WHATSAPP_NUMBER
  const mensajesHabilitados = config?.mensajes_habilitados ?? true

  if (!mensajesHabilitados) return null

  const handleOpenWhatsApp = () => {
    const numeroLimpio = numeroWhatsApp.replace(/\D/g, "")
    const mensajeDefecto = message || "Hola, quisiera conocer más sobre tus productos."
    const url = `https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensajeDefecto)}`
    window.open(url, "_blank")
    setIsOpen(false)
    setMessage("")
  }

  return (
    <>
      {/* Botón flotante */}
      <div className="fixed bottom-6 right-6 z-40">
        {isOpen && (
          <div className="absolute bottom-20 right-0 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-green-600">¡Hola! ¿Cómo podemos ayudarte?</h3>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              className="w-full h-24 p-3 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleOpenWhatsApp}
              className="w-full mt-3 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 font-semibold"
            >
              Enviar por WhatsApp
            </button>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
          {!isOpen && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
              !
            </span>
          )}
        </button>
      </div>
    </>
  )
}
