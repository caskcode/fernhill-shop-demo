import { db } from '../db';
import { provider } from '../payments/provider';

// Called when the customer presses "Pay".
export async function placeOrder(cart: { id: string; customerId: string; totalMinor: number; currency: string }) {
  const orderId = crypto.randomUUID();
  // Confirm the payment with the provider first; the card may be charged immediately.
  const payment = await provider.confirmPayment({
    amount: cart.totalMinor, currency: cart.currency, metadata: { order_id: orderId },
  });
  await db.tx(async (t) => {
    await t.none('SELECT pg_advisory_xact_lock(hashtext($1))', [cart.id]);
    await t.none(
      "INSERT INTO orders (id, customer_id, cart_id, total_minor, currency, status, payment_id) VALUES ($1,$2,$3,$4,$5,'pending',$6)",
      [orderId, cart.customerId, cart.id, cart.totalMinor, cart.currency, payment.id],
    );
    await t.none('UPDATE carts SET status = $2 WHERE id = $1', [cart.id, 'ordered']);
    await reserveStock(t, cart.id); // can take seconds under load
  });
  return orderId;
}

async function reserveStock(t: any, cartId: string) {
  const lines = await t.many('SELECT sku, qty FROM cart_lines WHERE cart_id = $1', [cartId]);
  for (const l of lines) {
    await t.none('UPDATE stock SET reserved = reserved + $2 WHERE sku = $1', [l.sku, l.qty]);
  }
}
