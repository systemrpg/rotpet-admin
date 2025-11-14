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
} from "lucide-react"

const menuItems = [
  {
    heading: "Inicio",
    items: [
      {
        label: "Panel de Control",
        icon: Grid,
        href: "/",
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
    ],
  },
  {
    heading: "Configuración",
    items: [
      { label: "Ubicación", icon: MapPin, href: "/countries" },
      { label: "Configuración", icon: Settings, href: "/settings" },
      { label: "Páginas", icon: Edit, href: "/pages" },
    ],
  },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div
      className={`${isOpen ? "w-72" : "w-20"} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {isOpen && (
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo-text.png" alt="Rot Pet Shop" width={240} height={70} className="h-16 w-auto" />
          </Link>
        )}
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-900">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto">
        {menuItems.map((section) => (
          <div key={section.heading} className="mb-4">
            {isOpen && (
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.heading}
              </div>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors"
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
