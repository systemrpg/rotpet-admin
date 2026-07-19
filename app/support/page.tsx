"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { MessageSquare, Mail, Phone, Clock, CheckCircle } from "lucide-react"

export default function SupportPage() {
  const [selectedCategory, setSelectedCategory] = useState("general")
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")

  const faqItems = [
    {
      id: 1,
      category: "general",
      question: "¿Cómo agregar un nuevo producto?",
      answer:
        "Para agregar un nuevo producto, ve a la sección de Productos y haz clic en 'Agregar Producto'. Completa todos los campos requeridos incluyendo nombre, categoría, precio e imágenes.",
    },
    {
      id: 2,
      category: "general",
      question: "¿Cómo editar un producto existente?",
      answer:
        "En la lista de productos, haz clic en el icono de editar junto al producto que deseas modificar. Podrás actualizar todos sus detalles.",
    },
    {
      id: 3,
      category: "general",
      question: "¿Cómo eliminar un producto?",
      answer:
        "En la lista de productos, haz clic en el icono de papelera roja para eliminar un producto. Esta acción no se puede deshacer.",
    },
    {
      id: 4,
      category: "inventory",
      question: "¿Cómo gestionar el inventario?",
      answer:
        "Puedes actualizar la cantidad en stock desde la página de editar producto. El sistema te alertará cuando el stock sea bajo.",
    },
    {
      id: 5,
      category: "inventory",
      question: "¿Cómo aplicar descuentos?",
      answer:
        "Al editar un producto, encontrarás una sección de descuentos. Puedes aplicar descuentos por porcentaje o valor fijo.",
    },
    {
      id: 6,
      category: "orders",
      question: "¿Cómo ver los detalles de una orden?",
      answer:
        "Ve a Órdenes y haz clic en cualquier orden para ver sus detalles completos incluyendo artículos, cliente y estado.",
    },
  ]

  const supportChannels = [
    {
      icon: Mail,
      title: "Email",
      description: "Contáctanos por correo electrónico",
      contact: "soporte@calupoh.media",
    },
    {
      icon: Phone,
      title: "Teléfono",
      description: "Llámanos durante horario de oficina",
      contact: "+52 442 787 3954",
    },
    {
      icon: MessageSquare,
      title: "Chat en Vivo",
      description: "Habla con nuestro equipo en tiempo real",
      contact: "Disponible 9 AM - 5 PM (Zona Horaria de México)",
    },
    {
      icon: Clock,
      title: "Horario de Atención",
      description: "Estamos aquí para ayudarte",
      contact: "Lunes a Viernes, 9 AM - 5 PM",
    },
  ]

  const filteredFAQ =
    selectedCategory === "all" ? faqItems : faqItems.filter((item) => item.category === selectedCategory)

  return (
    <div className="layout-wrap">
      <Sidebar />
      <div className="section-content-right min-w-0">
        <Header />
        <main className="main-content space-y-8">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Soporte</p>
            <h1 className="text-3xl font-black text-zinc-950">Centro de Soporte</h1>
            <p className="text-sm text-zinc-600">Encuentra ayuda y contacta con nuestro equipo.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {supportChannels.map((channel) => (
              <div key={channel.title} className="wg-box space-y-3">
                <channel.icon className="h-8 w-8 text-zinc-950" />
                <h3 className="font-semibold text-zinc-950">{channel.title}</h3>
                <p className="text-sm text-zinc-600">{channel.description}</p>
                <p className="text-sm font-medium text-zinc-950">{channel.contact}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="wg-box space-y-6">
                <h2 className="text-xl font-semibold text-zinc-950">Preguntas Frecuentes</h2>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${selectedCategory === "all" ? "bg-black text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setSelectedCategory("general")}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${selectedCategory === "general" ? "bg-black text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}
                  >
                    General
                  </button>
                  <button
                    onClick={() => setSelectedCategory("inventory")}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${selectedCategory === "inventory" ? "bg-black text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}
                  >
                    Inventario
                  </button>
                  <button
                    onClick={() => setSelectedCategory("orders")}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${selectedCategory === "orders" ? "bg-black text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}
                  >
                    Órdenes
                  </button>
                </div>

                <div className="space-y-4">
                  {filteredFAQ.map((item) => (
                    <details key={item.id} className="group rounded-2xl border border-zinc-200 p-4">
                      <summary className="flex cursor-pointer items-center justify-between">
                        <span className="flex items-center gap-2 font-medium text-zinc-950">
                          <CheckCircle size={16} className="text-zinc-950" />
                          {item.question}
                        </span>
                      </summary>
                      <p className="mt-4 text-sm text-zinc-600">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="wg-box">
                <h2 className="mb-6 text-xl font-semibold text-zinc-950">Contactar Soporte</h2>
                <form className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">Correo Electrónico</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      className="w-full rounded-xl border border-zinc-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">Categoría</label>
                    <select className="w-full rounded-xl border border-zinc-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black">
                      <option value="general">Pregunta General</option>
                      <option value="technical">Problema Técnico</option>
                      <option value="billing">Facturación</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">Mensaje</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Cuéntanos cómo podemos ayudarte..."
                      rows={5}
                      className="w-full rounded-xl border border-zinc-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <button type="submit" className="tf-button w-full">
                    Enviar Mensaje
                  </button>
                </form>
              </div>
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  )
}