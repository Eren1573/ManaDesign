// Convex orders queries and mutations
import { OrderDoc } from './schema';

export async function startCheckout(
  ctx: any,
  args: {
    userId: string;
    templateId: string;
    templateSlug: string;
    amountCents: number;
    provider?: 'demo' | 'stripe' | 'vly';
  }
): Promise<string> {
  const db = ctx.db;
  const existing = await db
    .query('orders')
    .withIndex('by_user_template', (q: any) =>
      q.eq('userId', args.userId).eq('templateSlug', args.templateSlug)
    )
    .first();

  if (existing) {
    return existing._id;
  }

  return await db.insert('orders', {
    userId: args.userId,
    templateId: args.templateId,
    templateSlug: args.templateSlug,
    status: 'pending',
    amountCents: args.amountCents,
    provider: args.provider || 'demo',
    createdAt: Date.now(),
  });
}

export async function markPaid(
  ctx: any,
  args: { orderId: string; userId: string }
): Promise<boolean> {
  const db = ctx.db;
  const order = await db.get(args.orderId);
  if (!order || order.userId !== args.userId) {
    throw new Error('Unauthorized or order not found');
  }
  await db.patch(args.orderId, {
    status: 'paid',
    paidAt: Date.now(),
  });
  return true;
}

export async function getOwn(
  ctx: any,
  args: { orderId: string; userId: string }
): Promise<OrderDoc | null> {
  const db = ctx.db;
  const order = await db.get(args.orderId);
  if (!order || order.userId !== args.userId) {
    return null;
  }
  return order;
}

export async function listMine(
  ctx: any,
  args: { userId: string }
): Promise<OrderDoc[]> {
  const db = ctx.db;
  if (!db || !args.userId) return [];
  return await db
    .query('orders')
    .withIndex('by_user', (q: any) => q.eq('userId', args.userId))
    .order('desc')
    .collect();
}
