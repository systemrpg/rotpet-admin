"use client"

import type React from "react"

import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({
    name: "Alimentos Secos",
    description: "Categoría de alimentos secos para mascotas",
    image: null as string | null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="layout-wrap">
      <Sidebar />
      <div className="section-content-right">
        <Header />
        <main className="main-content">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/categories" className="p-2 hover:bg-gray-100 rounded">
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Editar Categoría</h1>
              <p className="text-gray-600 mt-1">Modifica los datos de la categoría</p>
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Categoría</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Ej: Alimentos Secos"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Describe la categoría..."
                  />
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                  <button type="submit" className="tf-button">
                    Guardar Cambios
                  </button>
                  <Link href="/categories" className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Cancelar
                  </Link>
                </div>
              </form>
            </div>

            {/* Image Section */}
            <div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Imagen de la Categoría</h3>
                <div className="mb-4">
                  {formData.image ? (
                    <img
                      src={formData.image || "/placeholder.svg"}
                      alt="Categoría"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Sin imagen</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  )
}
