"use client"

import Image from "next/image"
import { Search, Bell, MessageSquare, Moon } from 'lucide-react'
import { useState } from "react"
import Link from "next/link"

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  return (
    <header className="border-b border-zinc-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/logo-text.png" alt="Rot Pet Shop" width={240} height={64} className="h-14 w-auto" />
        </Link>

        {/* Search */}
        <div className="hidden flex-1 max-w-md md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar aquí..."
              className="w-full rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              onFocus={() => setIsSearchOpen(true)}
            />
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Language selector */}
          <select className="rounded-full border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-700">
            <option>ES</option>
            <option>EN</option>
          </select>

          {/* Dark mode */}
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="rounded-full border border-zinc-200 p-2 text-zinc-600 transition hover:border-black hover:text-black">
            <Moon size={20} />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button className="relative rounded-full border border-zinc-200 p-2 text-zinc-600 transition hover:border-black hover:text-black">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">
                1
              </span>
            </button>
          </div>

          {/* Messages */}
          <div className="relative">
            <button className="relative rounded-full border border-zinc-200 p-2 text-zinc-600 transition hover:border-black hover:text-black">
              <MessageSquare size={20} />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">
                1
              </span>
            </button>
          </div>

          {/* User profile dropdown */}
          <div className="flex items-center gap-3 border-l border-zinc-200 pl-4">
            <Image src="/logo-icon.png" alt="Avatar" width={32} height={32} className="rounded-full" />
            <div className="text-right">
              <div className="text-sm font-semibold text-zinc-950">Cesar Diaz</div>
              <div className="text-xs text-zinc-500">Admin</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
