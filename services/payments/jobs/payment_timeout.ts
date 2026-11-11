import { db } from '../../db';

// Runs every 5 minutes.
export async function sweepUnpaidOrders() {
  await db.none(
    "UPDATE orders SET status = 'payment_failed' WHERE status = 'pending' AND created_at < now() - interval '15 minutes'",
  );
}
