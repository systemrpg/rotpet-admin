import Link from "next/link"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Eye, Edit, Plus, Trash2 } from "lucide-react"

const pages = [
  { id: 1, title: "Inicio", slug: "inicio", status: "published" },
  { id: 2, title: "Nosotros", slug: "nosotros", status: "published" },
  { id: 3, title: "Envíos", slug: "envios", status: "draft" },
  { id: 4, title: "Políticas", slug: "politicas", status: "published" },
  { id: 5, title: "Contacto", slug: "contacto", status: "draft" },
]

export default function PagesPage() {
  return (
    <div className="layout-wrap">
      <Sidebar />
      <div className="section-content-right min-w-0">
        <Header />
        <main className="main-content space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Contenido</p>
              <h1 className="text-3xl font-black text-zinc-950">Páginas</h1>
              <p className="text-sm text-zinc-600">Administra las páginas estáticas del sitio.</p>
            </div>
            <Link href="/pages/new" className="tf-button inline-flex items-center gap-2">
              <Plus size={18} />
              Nueva Página
            </Link>
          </div>

          <div className="wg-box overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead className="border-b border-zinc-200 bg-zinc-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">Título</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">Slug</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">Estado</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {pages.map((page) => (
                    <tr key={page.id} className="hover:bg-zinc-50">
                      <td className="px-6 py-4 font-medium text-zinc-950">{page.title}</td>
                      <td className="px-6 py-4 text-zinc-600">{page.slug}</td>
                      <td className="px-6 py-4 text-zinc-600">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${page.status === "published" ? "bg-black text-white" : "bg-zinc-100 text-zinc-700"}`}>
                          {page.status === "published" ? "Publicado" : "Borrador"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 text-zinc-500">
                          <Link href={`/p/${page.slug}`} target="_blank" className="transition hover:text-zinc-950" title="Vista previa">
                            <Eye size={16} />
                          </Link>
                          <Link href={`/pages/${page.id}/edit`} className="transition hover:text-zinc-950" title="Editar">
                            <Edit size={16} />
                          </Link>
                          <button className="transition hover:text-zinc-950" title="Eliminar">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="sm:hidden">
            {pages.map((page) => (
              <article key={page.id} className="wg-box flex items-center justify-between">
                <span className="font-medium text-zinc-950">{page.title}</span>
                <span className="text-sm text-zinc-500">{page.status === "published" ? "Publicado" : "Borrador"}</span>
              </article>
            ))}
          </div>

          <Footer />
        </main>
      </div>
    </div>
  )
}