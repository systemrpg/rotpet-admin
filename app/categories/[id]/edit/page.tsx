import { notFound } from "next/navigation"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { requireAdmin } from "@/lib/auth-server"
import CategoryEditForm from "./category-edit-form"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const dynamic = 'force-dynamic'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EditCategoryPage({ params }: PageProps) {
    await requireAdmin()
    const { id } = await params

    const { data: category, error } = await supabaseAdmin
        .from('categories')
        .select('*')
        .eq('id', id)
        .single() as { data: any; error: any }

    if (error || !category) notFound()

    return (
        <div className="layout-wrap">
            <Sidebar />
            <div className="section-content-right">
                <Header />
                <main className="main-content">
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/categories" className="p-2 hover:bg-gray-100 rounded">
                            <ArrowLeft size={20} className="text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Editar Categoría</h1>
                            <p className="text-gray-600 mt-1">Modifica los datos de {category.name}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-2xl">
                        <CategoryEditForm category={category} />
                    </div>
                    <Footer />
                </main>
            </div>
        </div>
    )
}
