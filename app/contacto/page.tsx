import Link from "next/link"

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-4 py-16">
        <div className="space-y-6 rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.25)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Rot Pet Shop</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight">Contacto</h1>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 p-4">
              <p className="text-sm font-semibold text-zinc-950">Email</p>
              <p className="mt-1 text-sm text-zinc-600">soporte@calupoh.media</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-4">
              <p className="text-sm font-semibold text-zinc-950">Teléfono</p>
              <p className="mt-1 text-sm text-zinc-600">+52 442 787 3954</p>
            </div>
          </div>
          <Link href="/tienda" className="tf-button inline-flex w-fit">
            Volver a la tienda
          </Link>
        </div>
      </main>
    </div>
  )
}