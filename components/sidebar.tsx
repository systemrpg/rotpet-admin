"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import {
  Menu,
  X,
  Grid,
  ShoppingCart,
  Layers,
  FileText,
  Users,
  UserPlus,
  ImageIcon,
  PieChart,
  MapPin,
  Settings,
  Edit,
  MessageSquare,
} from "lucide-react"

const menuItems = [
  {
    heading: "Inicio",
    items: [
      {
        label: "Panel de Control",
        icon: Grid,
        href: "/admin",
      },
    ],
  },
  {
    heading: "Tienda",
    items: [
      {
        label: "Productos",
        icon: ShoppingCart,
        href: "/products",
      },
      {
        label: "Categorías",
        icon: Layers,
        href: "/categories",
      },
      {
        label: "Marcas",
        icon: ShoppingCart,
        href: "/brands",
      },
      {
        label: "Cupones",
        icon: FileText,
        href: "/coupons",
      },
      {
        label: "Órdenes",
        icon: FileText,
        href: "/orders",
      },
    ],
  },
  {
    heading: "Usuarios",
    items: [
      {
        label: "Usuarios",
        icon: Users,
        href: "/users",
      },
      {
        label: "Roles",
        icon: UserPlus,
        href: "/roles",
      },
    ],
  },
  {
    heading: "Contenido",
    items: [
      { label: "Galería", icon: ImageIcon, href: "/gallery" },
      { label: "Reportes", icon: PieChart, href: "/reports" },
      { label: "Soporte", icon: MessageSquare, href: "/support" },
    ],
  },
  {
    heading: "Configuración",
    items: [
      { label: "Ubicación", icon: MapPin, href: "/countries" },
      { label: "Estados", icon: MapPin, href: "/states" },
      { label: "Configuración", icon: Settings, href: "/settings" },
      { label: "Páginas", icon: Edit, href: "/pages" },
    ],
  },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div
      className={`${isOpen ? "w-72" : "w-20"} flex flex-col border-r border-zinc-800 bg-black text-white transition-all duration-300`}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 p-4">
        {isOpen && (
          <Link href="/admin" className="flex items-center gap-2">
            <Image src="/logo-text.png" alt="Rot Pet Shop" width={240} height={70} className="h-16 w-auto brightness-0 invert" />
          </Link>
        )}
        <button onClick={() => setIsOpen(!isOpen)} className="text-zinc-300 transition hover:text-white">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto">
        {menuItems.map((section) => (
          <div key={section.heading} className="mb-4">
            {isOpen && (
              <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {section.heading}
              </div>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {isOpen && <span className="flex-1">{item.label}</span>}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  )
}
