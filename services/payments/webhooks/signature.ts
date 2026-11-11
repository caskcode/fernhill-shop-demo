import { createHmac, timingSafeEqual } from 'node:crypto';

export function verifySignature(rawBody: string, header: string): boolean {
  const [t, v1] = header.split(',').map((p) => p.split('=')[1]);
  const mac = createHmac('sha256', process.env.WEBHOOK_SECRET!).update(`${t}.${rawBody}`).digest('hex');
  return v1?.length === mac.length && timingSafeEqual(Buffer.from(v1), Buffer.from(mac));
}
