import Image from "next/image"
import Link from "next/link"

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

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                placeholder="tu@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 text-orange-600 rounded" />
                <span className="text-sm text-gray-600">Recuérdame</span>
              </label>
              <Link href="#" className="text-sm text-orange-600 hover:text-orange-700">
                Olvidé mi contraseña
              </Link>
            </div>

            <button type="submit" className="tf-button w-full">
              Iniciar Sesión
            </button>
          </form>

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
