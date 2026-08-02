"use client"

import { useEffect, useState } from "react"
import Script from "next/script"
import { createBrowserClient } from "@/lib/supabase/client"

export default function GoogleAnalytics() {
  const [gaId, setGaId] = useState<string | null>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const supabase = createBrowserClient()
        const { data, error } = await supabase
          .from("configuracion_analytics")
          .select("google_analytics_id, habilitado")
          .single()

        if (error) {
          console.log("[v0] Google Analytics no configurado")
          return
        }

        if (data?.habilitado && data?.google_analytics_id) {
          setGaId(data.google_analytics_id)
          setEnabled(true)
          console.log("[v0] Google Analytics habilitado:", data.google_analytics_id)
        }
      } catch (error) {
        console.error("[v0] Error cargando configuración de Analytics:", error)
      }
    }

    loadConfig()
  }, [])

  if (!enabled || !gaId) {
    return null
  }

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  )
}
