"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

interface NewsletterFormProps {
  className?: string
}

export default function NewsletterForm({ className = "" }: NewsletterFormProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from("newsletter_suscriptores").insert({ email })

      if (error) {
        if (error.code === "23505") {
          setSuccess(true)
          setEmail("")
        } else {
          throw error
        }
      } else {
        setSuccess(true)
        setEmail("")
      }
    } catch (error) {
      console.error("Error al suscribirse:", error)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return <div className={`text-green-600 font-semibold ${className}`}>¡Gracias por suscribirte! 🐾</div>
  }

  return (
    <form onSubmit={handleSubscribe} className={className}>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          placeholder="Tu correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 rounded-md flex-1 text-black bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <Button type="submit" disabled={loading} className="bg-white text-primary hover:bg-white/90">
          {loading ? "Suscribiendo..." : "Suscribirse"}
        </Button>
      </div>
    </form>
  )
}
