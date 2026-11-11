import { db } from '../../db';
import { verifySignature } from './signature';
import { handlePaymentSucceeded } from './payment_succeeded';
import { handlePaymentFailed } from './payment_failed';
import { handleRefund } from './refund';

export type WebhookEvent = { id: string; type: string; created: number; data: any };
export type HandlerResult = { status: number; body?: string };

const handlers: Record<string, (e: WebhookEvent) => Promise<HandlerResult>> = {
  'payment.succeeded': handlePaymentSucceeded,
  'payment.failed': handlePaymentFailed,
  'refund.created': handleRefund,
  'refund.updated': handleRefund,
};

// POST /webhooks/provider
export async function route(rawBody: string, signatureHeader: string): Promise<HandlerResult> {
  if (!verifySignature(rawBody, signatureHeader)) return { status: 400, body: 'bad signature' };
  const event: WebhookEvent = JSON.parse(rawBody);

  const seen = await db.oneOrNone('SELECT 1 FROM processed_webhook_events WHERE event_id = $1', [event.id]);
  if (seen) return { status: 200, body: 'duplicate' };

  const handler = handlers[event.type];
  if (!handler) return { status: 200, body: 'ignored' };

  const result = await handler(event);
  if (result.status >= 200 && result.status < 300) {
    await db.none('INSERT INTO processed_webhook_events (event_id, type) VALUES ($1, $2) ON CONFLICT DO NOTHING', [event.id, event.type]);
  }
  return result;
}
