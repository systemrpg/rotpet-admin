import Link from "next/link"

export default function AcercaDePage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-4 py-16">
        <div className="space-y-4 rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.25)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Rot Pet Shop</p>
          <h1 className="text-4xl font-black tracking-tight">Acerca de</h1>
          <p className="max-w-2xl text-sm text-zinc-600">
            Tienda creada para mostrar el catálogo de Rot Pet con un diseño limpio, negro y blanco,
            optimizado para mobile y desktop.
          </p>
          <Link href="/tienda" className="tf-button inline-flex w-fit">
            Volver a la tienda
          </Link>
        </div>
      </main>
    </div>
  )
}