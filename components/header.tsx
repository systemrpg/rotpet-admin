"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Search, Menu, X, User, Heart, Cat, Dog } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [user, setUser] = useState<any>(null)
  const { cartItems } = useCart()
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchTerm)}`)
      setIsSearchOpen(false)
      setSearchTerm("")
    }
  }

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Abrir menú</span>
          </Button>
        </div>

        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-text-fapdWSISs6QZa9IFHy4QlLEbREewfX.png"
              alt="ROT PET SHOP"
              className="h-10"
            />
          </Link>
        </div>

        <nav className="hidden md:flex mx-6 items-center space-x-4 lg:space-x-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Inicio
          </Link>
          <Link href="/tienda" className="text-sm font-medium transition-colors hover:text-primary">
            Tienda
          </Link>
          <Link
            href="/tienda?mascota=gato"
            className="text-sm font-medium transition-colors hover:text-primary flex items-center"
          >
            <Cat className="mr-1 h-4 w-4" /> Gatos
          </Link>
          <Link
            href="/tienda?mascota=perro"
            className="text-sm font-medium transition-colors hover:text-primary flex items-center"
          >
            <Dog className="mr-1 h-4 w-4" /> Perros
          </Link>
          <Link href="/nosotros" className="text-sm font-medium transition-colors hover:text-primary">
            Nosotros
          </Link>
        </nav>

        <div className={cn("transition-all duration-200 ease-in-out", isSearchOpen ? "flex-1" : "w-0 overflow-hidden")}>
          {isSearchOpen && (
            <form onSubmit={handleSearch} className="relative w-full max-w-md mx-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="w-full pl-8 rounded-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
                onClick={() => {
                  setIsSearchOpen(false)
                  setSearchTerm("")
                }}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Cerrar búsqueda</span>
              </Button>
            </form>
          )}
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {!isSearchOpen && (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Buscar</span>
            </Button>
          )}

          <Link href="/wishlist">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Favoritos</span>
            </Button>
          </Link>

          <div className="hidden md:flex gap-2">
            {user ? (
              <>
                <Link href="/cuenta">
                  <Button variant="ghost" size="sm">
                    Mi Cuenta
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/inicia-sesion">
                  <Button variant="ghost" size="sm">
                    Inicia Sesión
                  </Button>
                </Link>
                <Link href="/auth/registrate">
                  <Button variant="default" size="sm">
                    Regístrate
                  </Button>
                </Link>
              </>
            )}
          </div>
          <div className="md:hidden">
            <Link href={user ? "/cuenta" : "/auth/inicia-sesion"}>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Cuenta</span>
              </Button>
            </Link>
          </div>

          <Link href="/carrito">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                  {totalItems}
                </span>
              )}
              <span className="sr-only">Carrito</span>
            </Button>
          </Link>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background md:hidden">
          <nav className="container grid gap-6 p-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/tienda"
              className="flex items-center gap-2 text-lg font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              Tienda
            </Link>
            <Link
              href="/tienda?mascota=gato"
              className="flex items-center gap-2 text-lg font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              <Cat className="h-5 w-5" /> Gatos
            </Link>
            <Link
              href="/tienda?mascota=perro"
              className="flex items-center gap-2 text-lg font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              <Dog className="h-5 w-5" /> Perros
            </Link>
            <Link
              href="/nosotros"
              className="flex items-center gap-2 text-lg font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              Nosotros
            </Link>
            {!user && (
              <>
                <Link
                  href="/auth/inicia-sesion"
                  className="flex items-center gap-2 text-lg font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inicia Sesión
                </Link>
                <Link
                  href="/auth/registrate"
                  className="flex items-center gap-2 text-lg font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Regístrate
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
