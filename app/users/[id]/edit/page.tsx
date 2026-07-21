import { notFound } from "next/navigation"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { requireAdmin } from "@/lib/auth-server"
import UserEditForm from "./user-edit-form"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const dynamic = 'force-dynamic'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EditUserPage({ params }: PageProps) {
    await requireAdmin()
    const { id } = await params

    const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', id)
        .single() as { data: any; error: any }

    if (error || !user) notFound()

    const { data: rolesData } = await supabaseAdmin.from('roles').select('id, name').order('name')
    const roles = rolesData || []

    return (
        <div className="layout-wrap">
            <Sidebar />
            <div className="section-content-right">
                <Header />
                <main className="main-content">
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/users" className="p-2 hover:bg-gray-100 rounded">
                            <ArrowLeft size={20} className="text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Editar Usuario</h1>
                            <p className="text-gray-600 mt-1">{user.email}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-2xl">
                        <UserEditForm user={user} roles={roles} />
                    </div>
                    <Footer />
                </main>
            </div>
        </div>
    )
}
