/**
 * Extensión de tipos de NextAuth v5 (Auth.js) para incluir
 * id, role e isAdmin en el session.user y en el JWT.
 *
 * En v5, los tipos viven en @auth/core y se re-exportan desde
 * next-auth. Augmentamos el módulo original para que la extensión
 * se propague correctamente.
 */
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
    interface Session {
        user: {
            id: string
            role: string
            isAdmin: boolean
        } & DefaultSession['user']
    }
}

// v5: el JWT se exporta desde @auth/core/jwt (next-auth re-exporta pero
// los types originales viven ahí). Augmentamos ambos para cubrir los
// usos de `import type { JWT } from 'next-auth/jwt'` y desde el core.
declare module 'next-auth/jwt' {
    interface JWT {
        id?: string
        role?: string
        isAdmin?: boolean
    }
}

declare module '@auth/core/jwt' {
    interface JWT {
        id?: string
        role?: string
        isAdmin?: boolean
    }
}
