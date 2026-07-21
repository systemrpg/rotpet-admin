/**
 * Servicio centralizado de envío de emails
 * Usa Resend como proveedor, con fallback graceful si no está configurado
 */

import { resend, FROM_EMAIL, isEmailConfigured } from './resend';
import { orderConfirmationEmail, orderStatusChangeEmail, welcomeEmail } from './templates';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Envía un email usando Resend
 * Si Resend no está configurado, logea el intento y retorna false
 */
async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  if (!isEmailConfigured() || !resend) {
    console.log(`[Email] Resend not configured. Would send to ${options.to}: ${options.subject}`);
    return false;
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error('[Email] Send error:', error);
      return false;
    }

    console.log(`[Email] Sent to ${options.to}: ${options.subject}`);
    return true;
  } catch (err) {
    console.error('[Email] Unexpected error:', err);
    return false;
  }
}

/**
 * Envía email de confirmación de pedido
 */
export async function sendOrderConfirmationEmail(
  email: string,
  data: {
    orderId: string;
    customerName: string;
    items: { name: string; quantity: number; unitPrice: number }[];
    subtotal: number;
    shipping: number;
    total: number;
    shippingAddress?: string;
    paymentMethod?: string;
  }
): Promise<boolean> {
  const { subject, html } = orderConfirmationEmail(data);
  return sendEmail({ to: email, subject, html });
}

/**
 * Envía email de cambio de estado de pedido
 */
export async function sendOrderStatusEmail(
  email: string,
  data: {
    orderId: string;
    customerName: string;
    newStatus: string;
    total: number;
  }
): Promise<boolean> {
  const { subject, html } = orderStatusChangeEmail(data);
  return sendEmail({ to: email, subject, html });
}

/**
 * Envía email de bienvenida
 */
export async function sendWelcomeEmail(
  email: string,
  customerName: string
): Promise<boolean> {
  const { subject, html } = welcomeEmail(customerName);
  return sendEmail({ to: email, subject, html });
}
