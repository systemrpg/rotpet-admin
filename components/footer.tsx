"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"
// import WhatsAppLink from "@/components/whatsapp-link" // Removed import for WhatsAppLink

export default function Footer() {
  const [year, setYear] = useState<number>()
  const [socialLinks, setSocialLinks] = useState({
    facebook_url: "#",
    instagram_url: "#",
    twitter_url: "#",
    youtube_url: "#",
  })

  useEffect(() => {
    setYear(new Date().getFullYear())

    const loadSocialLinks = async () => {
      try {
        const response = await fetch("/api/configuracion")

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()

        // Convertir array de objetos a un objeto con las claves correctas
        const config: any = {}
        if (Array.isArray(data)) {
          data.forEach((item: any) => {
            config[item.clave] = item.valor
          })
        }

        setSocialLinks({
          facebook_url: config.facebook_url || "#",
          instagram_url: config.instagram_url || "#",
          twitter_url: config.twitter_url || "#",
          youtube_url: config.youtube_url || "#",
        })
      } catch (error) {
        console.error("Error cargando redes sociales:", error)
      }
    }

    loadSocialLinks()
  }, [])

  return (
    <footer className="bg-muted">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center space-x-2">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-text-fapdWSISs6QZa9IFHy4QlLEbREewfX.png"
                alt="ROT PET SHOP"
                className="h-16"
              />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Lo que tu mascota necesita, cuando lo necesita. Productos premium para gatos y perros con entrega el mismo
              día.
            </p>
            <div className="flex mt-6 space-x-4">
              <Link
                href={socialLinks.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href={socialLinks.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href={socialLinks.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href={socialLinks.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Tienda</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/tienda?categoria=juguetes" className="text-sm text-muted-foreground hover:text-primary">
                  Juguetes
                </Link>
              </li>
              <li>
                <Link href="/tienda?categoria=alimento" className="text-sm text-muted-foreground hover:text-primary">
                  Alimentos
                </Link>
              </li>
              <li>
                <Link href="/tienda?categoria=accesorios" className="text-sm text-muted-foreground hover:text-primary">
                  Accesorios
                </Link>
              </li>
              <li>
                <Link href="/tienda?mascota=gato" className="text-sm text-muted-foreground hover:text-primary">
                  Productos para Gatos
                </Link>
              </li>
              <li>
                <Link href="/tienda?mascota=perro" className="text-sm text-muted-foreground hover:text-primary">
                  Productos para Perros
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Empresa</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/nosotros" className="text-sm text-muted-foreground hover:text-primary">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-sm text-muted-foreground hover:text-primary">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Atención al Cliente</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/ayuda" className="text-sm text-muted-foreground hover:text-primary">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href="/envios" className="text-sm text-muted-foreground hover:text-primary">
                  Envíos y Entregas
                </Link>
              </li>
              <li>
                <Link href="/devoluciones" className="text-sm text-muted-foreground hover:text-primary">
                  Devoluciones y Reembolsos
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-sm text-muted-foreground hover:text-primary">
                  Contáctanos
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-sm text-muted-foreground hover:text-primary">
                  Favoritos
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-sm text-muted-foreground hover:text-primary">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="text-sm text-muted-foreground hover:text-primary">
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {year ?? "—"} ROT PET SHOP. Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Sitio Creado Por:{" "}
            <Link href="https://calupoh.media" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              Calupoh Media
            </Link>
          </p>
          {/* WhatsAppLink removed to avoid excessive API requests */}
        </div>
      </div>
    </footer>
  )
}
