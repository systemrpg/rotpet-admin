import { Resend } from 'resend';

// Resend client - requiere RESEND_API_KEY en .env.local
const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Email remitente por defecto
export const FROM_EMAIL = process.env.EMAIL_FROM || 'Rot Pet Shop <noreply@rot.pet>';
export const STORE_NAME = 'Rot Pet Shop';
export const STORE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://rot.pet';
export const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'info@rot.pet';
export const WHATSAPP_NUMBER = '+52 4121342478';

/**
 * Verifica si el servicio de email está configurado
 */
export function isEmailConfigured(): boolean {
  return resend !== null;
}
