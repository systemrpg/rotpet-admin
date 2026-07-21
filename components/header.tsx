"use client"

import Image from "next/image"
import { Search, Bell, MessageSquare, Moon, LogOut } from 'lucide-react'
import { useState } from "react"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { data: session } = useSession()
  const user = session?.user

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-text.png" alt="Rot Pet Shop" width={240} height={64} className="h-16 w-auto" />
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar aquí..."
              className="w-full px-4 py-2 pr-10 bg-gray-100 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              onFocus={() => setIsSearchOpen(true)}
            />
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          {/* Language selector */}
          <select className="text-sm bg-transparent border border-gray-300 rounded px-2 py-1">
            <option>ES</option>
            <option>EN</option>
          </select>

          {/* Dark mode */}
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-gray-600 hover:text-gray-900">
            <Moon size={20} />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button className="relative text-gray-600 hover:text-gray-900">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white text-xs rounded-full flex items-center justify-center">
                1
              </span>
            </button>
          </div>

          {/* Messages */}
          <div className="relative">
            <button className="relative text-gray-600 hover:text-gray-900">
              <MessageSquare size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white text-xs rounded-full flex items-center justify-center">
                1
              </span>
            </button>
          </div>

          {/* User profile + logout */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <Image src="/logo-icon.png" alt="Avatar" width={32} height={32} className="rounded-full" />
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">{user?.name || user?.email || 'Invitado'}</div>
              <div className="text-xs text-gray-600 capitalize">{user?.role || '—'}</div>
            </div>
            {user && (
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="ml-2 p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Cerrar sesión"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
