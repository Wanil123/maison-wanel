export const PROMO_CODES = Object.freeze({ LUXE10: 0.1, WELCOME: 0.15, VIP20: 0.2 });
export const TAX_RATE = 0.15;
export const FREE_SHIPPING_THRESHOLD = 100;
export const SHIPPING_COST = 15;

export function calculateCart(cart, promoCode = "") {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = Math.round(subtotal * (PROMO_CODES[promoCode] || 0) * 100) / 100;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;
  const tax = Math.round((subtotal - discount) * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal - discount + shipping + tax) * 100) / 100;
  return { subtotal, discount, shipping, tax, total };
}
