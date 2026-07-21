import { handlers } from '@/auth'

// NextAuth v5 exporta GET y POST handlers para /api/auth/*
// Rutas cubiertas: /api/auth/signin, /api/auth/signout, /api/auth/session,
// /api/auth/callback/[provider], /api/auth/providers, etc.
export const { GET, POST } = handlers
