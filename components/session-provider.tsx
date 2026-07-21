"use client"

import { SessionProvider } from "next-auth/react"

/**
 * Provider de sesión de NextAuth. Envuelve la app en el root layout
 * para que useSession() funcione en client components.
 *
 * Server components pueden llamar auth() directamente desde @/auth
 * (sin necesidad del provider).
 */
export default function NextAuthSessionProvider({
    children,
}: {
    children: React.ReactNode
}) {
    return <SessionProvider>{children}</SessionProvider>
}
