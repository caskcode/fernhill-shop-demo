import { db } from '../../db';
import type { WebhookEvent, HandlerResult } from './router';

export async function handlePaymentFailed(event: WebhookEvent): Promise<HandlerResult> {
  await db.none("UPDATE orders SET status = 'payment_failed' WHERE id = $1 AND status = 'pending'",
    [event.data.metadata?.order_id]);
  return { status: 200 };
}
