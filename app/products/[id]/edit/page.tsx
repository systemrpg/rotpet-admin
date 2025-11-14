"use client"

import type React from "react"

import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Save, X, Upload, Percent } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useParams } from "next/navigation"

export default function EditProductPage() {
  const params = useParams()
  const productId = params.id
  const [images, setImages] = useState<File[]>([])
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage")
  const [discountValue, setDiscountValue] = useState("")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setImages((prev) => [...prev, ...Array.from(files)])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="layout-wrap">
      <Sidebar />
      <div className="section-content-right">
        <Header />
        <main className="main-content">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Editar Producto</h1>
            <p className="text-gray-600 mt-1">Actualiza los detalles del producto #{productId}</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Producto</label>
                  <input
                    type="text"
                    placeholder="Ej: Alimento Premium para Perros"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    defaultValue="Alimento Premium para Perros"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                  <input
                    type="text"
                    placeholder="Ej: #12345"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    defaultValue="#70668"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option>Alimentos Secos</option>
                    <option>Golosinas y Snacks</option>
                    <option>Juguetes</option>
                    <option>Camas y Colchones</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio</label>
                  <input
                    type="number"
                    placeholder="$0.00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    defaultValue="450"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad en Stock</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    defaultValue="403"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option>Disponible</option>
                    <option>No Disponible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  placeholder="Describe el producto aquí..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  defaultValue="Alimento premium de alta calidad para perros"
                />
              </div>

              {/* Discount Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Percent size={20} className="text-orange-600" />
                  Descuento
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Descuento</label>
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as "percentage" | "fixed")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="percentage">Porcentaje (%)</option>
                      <option value="fixed">Valor Fijo ($)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor del Descuento {discountType === "percentage" ? "(%)" : "($)"}
                    </label>
                    <input
                      type="number"
                      placeholder={discountType === "percentage" ? "Ej: 10" : "Ej: 50"}
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {discountValue && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      {discountType === "percentage"
                        ? `Descuento: ${discountValue}% (Precio final: $${(450 * (1 - Number.parseInt(discountValue) / 100)).toFixed(2)})`
                        : `Descuento: $${discountValue} (Precio final: $${(450 - Number.parseInt(discountValue)).toFixed(2)})`}
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">Imágenes del Producto</label>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={URL.createObjectURL(image) || "/placeholder.svg"}
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload size={32} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Arrastra imágenes aquí o{" "}
                      <span className="text-orange-600 font-medium">haz clic para seleccionar</span>
                    </span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">Formatos: JPG, PNG, WebP</p>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button type="submit" className="tf-button flex items-center gap-2">
                  <Save size={20} />
                  Guardar Cambios
                </button>
                <Link
                  href="/products"
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-900 flex items-center gap-2"
                >
                  <X size={20} />
                  Cancelar
                </Link>
              </div>
            </form>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  )
}
