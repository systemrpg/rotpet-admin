/**
 * Configuración centralizada de envío
 * Se usa en checkout y pago para mantener consistencia
 */

export const SHIPPING_CONFIG = {
  /** Umbral de compra mínima para envío gratis (en moneda local MXN) */
  freeShippingThreshold: 500,
  /** Costo de envío estándar cuando no se alcanza el umbral */
  standardShippingCost: 99,
  /** Texto descriptivo del envío gratis */
  freeShippingMessage: '¡Envío gratis en compras mayores a $500!',
} as const;

/**
 * Calcula el costo de envío basado en el subtotal
 */
export function calculateShipping(subtotal: number): number {
  if (subtotal >= SHIPPING_CONFIG.freeShippingThreshold) {
    return 0;
  }
  return SHIPPING_CONFIG.standardShippingCost;
}

/**
 * Calcula el total del pedido (subtotal + envío)
 */
export function calculateOrderTotal(subtotal: number): {
  subtotal: number;
  shipping: number;
  total: number;
  isFreeShipping: boolean;
} {
  const shipping = calculateShipping(subtotal);
  return {
    subtotal,
    shipping,
    total: subtotal + shipping,
    isFreeShipping: shipping === 0,
  };
}
