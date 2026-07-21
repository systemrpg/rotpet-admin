"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const returnTo = searchParams.get("returnTo") || "/"

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok || !data.success) {
                setError(data.error || "Error al iniciar sesión")
                setLoading(false)
                return
            }

            const token = data.session?.access_token
            if (token) {
                document.cookie = `auth_token=${token}; path=/; max-age=604800; SameSite=Lax`
            }

            router.push(returnTo)
        } catch (err: any) {
            setError(err?.message || "Error de red")
            setLoading(false)
        }
    }

    async function handleForgotPassword() {
        if (!email) {
            setError("Ingresa tu email primero")
            return
        }
        setError(null)
        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            const data = await res.json()
            if (res.ok) {
                setError(null)
                alert(data.message || "Si el email existe, recibirás un enlace de recuperación.")
            } else {
                setError(data.error || "Error al procesar la solicitud")
            }
        } catch (err: any) {
            setError(err?.message || "Error de red")
        }
    }

    return (
        <>
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                    {error}
                </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        required
                        autoComplete="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        autoComplete="current-password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4 text-orange-600 rounded" />
                        <span className="text-sm text-gray-600">Recuérdame</span>
                    </label>
                    <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-sm text-orange-600 hover:text-orange-700"
                    >
                        Olvidé mi contraseña
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="tf-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Ingresando..." : "Iniciar Sesión"}
                </button>
            </form>
        </>
    )
}

function LoginFormFallback() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-10 bg-gray-200 rounded-lg" />
            <div className="h-10 bg-gray-200 rounded-lg" />
            <div className="h-10 bg-gray-200 rounded-lg" />
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <Image src="/logo-icon.png" alt="Rot Pet" width={64} height={64} />
                    </div>
                    <Image src="/logo-text.png" alt="Rot Pet Shop" width={200} height={60} className="h-12 w-auto mx-auto" />
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Iniciar Sesión</h1>
                    <p className="text-gray-600 mb-6">Panel Administrativo de Rot Pet</p>

                    <Suspense fallback={<LoginFormFallback />}>
                        <LoginForm />
                    </Suspense>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        <p>
                            Diseñado por{" "}
                            <a
                                href="https://calupoh.media"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-600 hover:text-orange-700 font-semibold"
                            >
                                Calupoh Media
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
