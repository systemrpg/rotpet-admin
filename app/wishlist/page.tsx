import Link from "next/link"

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 py-16">
        <div className="space-y-6 rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.25)]">
          <h1 className="text-4xl font-black tracking-tight">Wishlist</h1>
          <p className="text-sm text-zinc-600">Aún no has guardado productos favoritos.</p>
          <Link href="/tienda" className="tf-button inline-flex w-fit">
            Volver a la tienda
          </Link>
        </div>
      </main>
    </div>
  )
}