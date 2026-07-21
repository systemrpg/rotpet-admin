import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
    // Borrar la cookie de sesión
    const cookieStore = await cookies()
    cookieStore.delete('auth_token')

    return NextResponse.json({ success: true })
}
