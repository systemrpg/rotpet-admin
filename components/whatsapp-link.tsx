"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { MessageCircle } from "lucide-react"

export default function WhatsAppLink() {
  const [config, setConfig] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase.from("configuracion_whatsapp").select("*").maybeSingle()
      setConfig(data)
    }

    fetchConfig()
  }, [supabase])

  if (!config?.mensajes_habilitados) return null

  const numeroLimpio = config.numero_whatsapp.replace(/\D/g, "")

  return (
    <a
      href={`https://wa.me/${numeroLimpio}?text=Hola,%20quisiera%20conocer%20m%C3%A1s%20sobre%20tus%20productos`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-sm"
    >
      <MessageCircle className="w-4 h-4" />
      WhatsApp: {config.numero_whatsapp}
    </a>
  )
}
