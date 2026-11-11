import { db } from '../../db';
import { log } from '../../log';
import type { WebhookEvent, HandlerResult } from './router';

export async function handlePaymentSucceeded(event: WebhookEvent): Promise<HandlerResult> {
  const orderId = event.data.metadata?.order_id;
  const order = await db.oneOrNone('SELECT id, status FROM orders WHERE id = $1', [orderId]);
  if (!order) {
    log.warn('payment.succeeded for unknown order', { orderId, eventId: event.id });
    return { status: 200, body: 'unknown order' };
  }
  if (order.status === 'paid') return { status: 200, body: 'already paid' };
  await db.none(
    "UPDATE orders SET status = 'paid', paid_at = now(), payment_id = $2 WHERE id = $1",
    [order.id, event.data.payment_id],
  );
  return { status: 200 };
}
