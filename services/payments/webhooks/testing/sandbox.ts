// Helpers for replaying sandbox events in tests.
import { createHmac } from 'node:crypto';

export function signForSandbox(rawBody: string, t = Math.floor(Date.now() / 1000)): string {
  const secret = process.env.WEBHOOK_SECRET!;
  return `t=${t},v1=${createHmac('sha256', secret).update(`${t}.${rawBody}`).digest('hex')}`;
}
