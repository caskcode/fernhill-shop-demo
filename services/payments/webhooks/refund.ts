import { db } from '../../db';
import type { WebhookEvent, HandlerResult } from './router';

// Accepts refund.created and refund.updated in either order.
export async function handleRefund(event: WebhookEvent): Promise<HandlerResult> {
  const r = event.data;
  await db.none(
    `INSERT INTO refunds (refund_id, order_id, amount_minor, status, provider_updated_at)
     VALUES ($1, $2, $3, $4, to_timestamp($5))
     ON CONFLICT (refund_id) DO UPDATE SET status = EXCLUDED.status, provider_updated_at = EXCLUDED.provider_updated_at
     WHERE refunds.provider_updated_at < EXCLUDED.provider_updated_at`,
    [r.refund_id, r.metadata?.order_id, r.amount, r.status, event.created],
  );
  return { status: 200 };
}
