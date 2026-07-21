/**
 * Templates de email HTML para Rot Pet Shop
 * Diseño limpio y responsive con la marca de la tienda
 */

import { STORE_NAME, STORE_URL, SUPPORT_EMAIL, WHATSAPP_NUMBER } from './resend';

interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

interface OrderEmailData {
  orderId: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress?: string;
  paymentMethod?: string;
}

const baseStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
  .container { max-width: 600px; margin: 0 auto; background: white; }
  .header { background: linear-gradient(135deg, #1f2937, #374151); padding: 32px; text-align: center; }
  .header h1 { color: #ff6b35; margin: 0; font-size: 28px; }
  .header p { color: #d1d5db; margin: 8px 0 0; font-size: 14px; }
  .content { padding: 32px; }
  .footer { background: #f9fafb; padding: 24px 32px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
  .btn { display: inline-block; background: #ff6b35; color: white !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; }
  .order-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
  .order-table th { text-align: left; padding: 8px 12px; background: #f9fafb; border-bottom: 2px solid #e5e7eb; font-size: 13px; color: #6b7280; }
  .order-table td { padding: 12px; border-bottom: 1px solid #f3f4f6; }
  .total-row { font-weight: bold; font-size: 18px; color: #1f2937; }
  .status-badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
  .status-pending { background: #fef3c7; color: #92400e; }
  .status-processing { background: #dbeafe; color: #1e40af; }
  .status-completed { background: #d1fae5; color: #065f46; }
  .status-cancelled { background: #fee2e2; color: #991b1b; }
  .info-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 16px 0; }
`;

function wrapTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🐾 ${STORE_NAME}</h1>
      <p>Productos premium para mascotas</p>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>${STORE_NAME} | <a href="${STORE_URL}" style="color: #ff6b35;">${STORE_URL}</a></p>
      <p>¿Necesitas ayuda? Escríbenos a <a href="mailto:${SUPPORT_EMAIL}" style="color: #ff6b35;">${SUPPORT_EMAIL}</a></p>
      <p>WhatsApp: ${WHATSAPP_NUMBER}</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Email de confirmación de pedido
 */
export function orderConfirmationEmail(data: OrderEmailData): { subject: string; html: string } {
  const itemsHtml = data.items.map(item => `
    <tr>
      <td>${item.name}</td>
      <td style="text-align: center;">${item.quantity}</td>
      <td style="text-align: right;">$${(item.unitPrice * item.quantity).toLocaleString()}</td>
    </tr>
  `).join('');

  const content = `
    <h2 style="color: #1f2937; margin: 0 0 8px;">¡Gracias por tu pedido, ${data.customerName}!</h2>
    <p style="color: #6b7280;">Tu pedido ha sido recibido y está siendo procesado.</p>
    
    <div class="info-box">
      <p style="margin: 0;"><strong>Número de pedido:</strong> #${data.orderId.substring(0, 8).toUpperCase()}</p>
      ${data.paymentMethod ? `<p style="margin: 8px 0 0;"><strong>Método de pago:</strong> ${data.paymentMethod === 'whatsapp' ? 'Pago por WhatsApp' : data.paymentMethod}</p>` : ''}
    </div>

    <h3 style="color: #1f2937;">Resumen del pedido</h3>
    <table class="order-table">
      <thead>
        <tr>
          <th>Producto</th>
          <th style="text-align: center;">Cant.</th>
          <th style="text-align: right;">Precio</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="text-align: right; padding-top: 16px;">Subtotal</td>
          <td style="text-align: right; padding-top: 16px;">$${data.subtotal.toLocaleString()}</td>
        </tr>
        <tr>
          <td colspan="2" style="text-align: right;">Envío</td>
          <td style="text-align: right;">${data.shipping === 0 ? '<span style="color: #059669;">Gratis</span>' : '$' + data.shipping.toLocaleString()}</td>
        </tr>
        <tr class="total-row">
          <td colspan="2" style="text-align: right; padding-top: 12px; border-top: 2px solid #e5e7eb;">Total</td>
          <td style="text-align: right; padding-top: 12px; border-top: 2px solid #e5e7eb;">$${data.total.toLocaleString()}</td>
        </tr>
      </tfoot>
    </table>

    ${data.shippingAddress ? `
    <h3 style="color: #1f2937;">Dirección de envío</h3>
    <p style="color: #4b5563;">${data.shippingAddress}</p>
    ` : ''}

    <div style="text-align: center; margin: 32px 0;">
      <a href="${STORE_URL}/cuenta" class="btn">Ver mis pedidos</a>
    </div>

    <p style="color: #6b7280; font-size: 14px;">
      Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos por WhatsApp al ${WHATSAPP_NUMBER} o por email a ${SUPPORT_EMAIL}.
    </p>
  `;

  return {
    subject: `Confirmación de pedido #${data.orderId.substring(0, 8).toUpperCase()} - ${STORE_NAME}`,
    html: wrapTemplate(content),
  };
}

/**
 * Email de cambio de estado de pedido
 */
export function orderStatusChangeEmail(data: {
  orderId: string;
  customerName: string;
  newStatus: string;
  total: number;
}): { subject: string; html: string } {
  const statusLabels: Record<string, { label: string; className: string; message: string }> = {
    pending: {
      label: 'Pendiente',
      className: 'status-pending',
      message: 'Tu pedido está pendiente de confirmación. Te notificaremos cuando sea procesado.',
    },
    processing: {
      label: 'En proceso',
      className: 'status-processing',
      message: '¡Buenas noticias! Tu pedido está siendo preparado y será enviado pronto.',
    },
    completed: {
      label: 'Completado',
      className: 'status-completed',
      message: '¡Tu pedido ha sido completado y está en camino! Esperamos que lo disfrutes.',
    },
    delivered: {
      label: 'Entregado',
      className: 'status-completed',
      message: 'Tu pedido ha sido entregado. ¡Gracias por comprar en Rot Pet Shop!',
    },
    cancelled: {
      label: 'Cancelado',
      className: 'status-cancelled',
      message: 'Tu pedido ha sido cancelado. Si tienes alguna pregunta, contáctanos.',
    },
  };

  const statusInfo = statusLabels[data.newStatus] || {
    label: data.newStatus,
    className: 'status-pending',
    message: 'El estado de tu pedido ha sido actualizado.',
  };

  const content = `
    <h2 style="color: #1f2937; margin: 0 0 8px;">Actualización de tu pedido</h2>
    <p style="color: #6b7280;">Hola ${data.customerName}, hay novedades sobre tu pedido.</p>
    
    <div class="info-box">
      <p style="margin: 0;"><strong>Pedido:</strong> #${data.orderId.substring(0, 8).toUpperCase()}</p>
      <p style="margin: 8px 0 0;"><strong>Total:</strong> $${data.total.toLocaleString()}</p>
      <p style="margin: 12px 0 0;">
        <strong>Estado:</strong> 
        <span class="${statusInfo.className}">${statusInfo.label}</span>
      </p>
    </div>

    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${statusInfo.message}</p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${STORE_URL}/cuenta" class="btn">Ver detalles del pedido</a>
    </div>
  `;

  return {
    subject: `Pedido #${data.orderId.substring(0, 8).toUpperCase()} - ${statusInfo.label} | ${STORE_NAME}`,
    html: wrapTemplate(content),
  };
}

/**
 * Email de bienvenida al registrarse
 */
export function welcomeEmail(customerName: string): { subject: string; html: string } {
  const content = `
    <h2 style="color: #1f2937; margin: 0 0 8px;">¡Bienvenido a ${STORE_NAME}! 🎉</h2>
    <p style="color: #6b7280;">Hola ${customerName}, gracias por registrarte.</p>
    
    <p style="color: #4b5563; line-height: 1.6;">
      Ahora puedes disfrutar de los mejores productos para tu mascota con entregas rápidas y atención personalizada.
    </p>

    <div class="info-box">
      <p style="margin: 0;"><strong>Lo que puedes hacer:</strong></p>
      <ul style="color: #4b5563; margin: 8px 0 0; padding-left: 20px;">
        <li>Explorar nuestro catálogo de productos premium</li>
        <li>Guardar tus productos favoritos en la lista de deseos</li>
        <li>Recibir notificaciones de ofertas exclusivas</li>
        <li>Seguir el estado de tus pedidos en tiempo real</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${STORE_URL}/tienda" class="btn">Explorar la tienda</a>
    </div>
  `;

  return {
    subject: `¡Bienvenido a ${STORE_NAME}! 🐾`,
    html: wrapTemplate(content),
  };
}
