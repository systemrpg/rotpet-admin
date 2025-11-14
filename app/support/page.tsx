"use client"

import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { MessageSquare, Mail, Phone, Clock, CheckCircle } from "lucide-react"
import { useState } from "react"

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
      contact: "soporte@calupoh.info",
    },
    {
      icon: Phone,
      title: "Teléfono",
      description: "Llámanos durante horario de oficina",
      contact: "+52 (123) 456-7890",
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
      <div className="section-content-right">
        <Header />
        <main className="main-content">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Centro de Soporte</h1>
            <p className="text-gray-600 mt-1">¿Necesitas ayuda? Estamos aquí para ti</p>
          </div>

          {/* Support Channels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {supportChannels.map((channel) => (
              <div key={channel.title} className="bg-white rounded-lg border border-gray-200 p-6">
                <channel.icon className="w-8 h-8 text-orange-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">{channel.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{channel.description}</p>
                <p className="text-sm font-medium text-orange-600">{channel.contact}</p>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Envíanos un mensaje</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="general">Pregunta General</option>
                      <option value="technical">Problema Técnico</option>
                      <option value="billing">Facturación</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Cuéntanos cómo podemos ayudarte..."
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <button type="submit" className="tf-button w-full">
                    Enviar Mensaje
                  </button>
                </form>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Enlaces Rápidos</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                      Documentación
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                      Guías y Tutoriales
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                      Estado del Sistema
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                      Términos de Servicio
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                      Política de Privacidad
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Preguntas Frecuentes</h2>

            <div className="flex gap-2 mb-6 flex-wrap">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === "all"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setSelectedCategory("general")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === "general"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                General
              </button>
              <button
                onClick={() => setSelectedCategory("inventory")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === "inventory"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Inventario
              </button>
              <button
                onClick={() => setSelectedCategory("orders")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === "orders"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Órdenes
              </button>
            </div>

            <div className="space-y-4">
              {filteredFAQ.map((item) => (
                <details key={item.id} className="group border border-gray-200 rounded-lg p-4">
                  <summary className="flex items-center justify-between cursor-pointer">
                    <span className="font-medium text-gray-900 flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-600" />
                      {item.question}
                    </span>
                  </summary>
                  <p className="mt-4 text-gray-600 text-sm">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  )
}
