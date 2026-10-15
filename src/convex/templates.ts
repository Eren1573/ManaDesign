// Convex templates queries and mutations
import { STORE_TEMPLATES, TemplateItem } from '../lib/store-catalog';
import { TemplateDoc } from './schema';

export async function list(ctx: any): Promise<TemplateDoc[]> {
  const db = ctx.db;
  if (!db) return STORE_TEMPLATES as any;
  const templates = await db.query('templates').collect();
  return templates.length > 0 ? templates : (STORE_TEMPLATES as any);
}

export async function get(ctx: any, args: { slug: string }): Promise<TemplateDoc | null> {
  const db = ctx.db;
  if (!db) {
    return (STORE_TEMPLATES.find((t) => t.slug === args.slug) as any) || null;
  }
  const tpl = await db
    .query('templates')
    .withIndex('by_slug', (q: any) => q.eq('slug', args.slug))
    .first();
  return tpl || (STORE_TEMPLATES.find((t) => t.slug === args.slug) as any) || null;
}

export async function hasPurchased(
  ctx: any,
  args: { userId: string; slug: string }
): Promise<boolean> {
  const db = ctx.db;
  if (!db || !args.userId) return false;
  const order = await db
    .query('orders')
    .withIndex('by_user_template', (q: any) =>
      q.eq('userId', args.userId).eq('templateSlug', args.slug)
    )
    .filter((q: any) => q.eq(q.field('status'), 'paid'))
    .first();
  return !!order;
}

export async function listPurchased(
  ctx: any,
  args: { userId: string }
): Promise<TemplateDoc[]> {
  const db = ctx.db;
  if (!db || !args.userId) return [];
  const paidOrders = await db
    .query('orders')
    .withIndex('by_user', (q: any) => q.eq('userId', args.userId))
    .filter((q: any) => q.eq(q.field('status'), 'paid'))
    .collect();

  const slugs = paidOrders.map((o: any) => o.templateSlug);
  return STORE_TEMPLATES.filter((t) => slugs.includes(t.slug)) as any;
}

export async function ensureSeeded(ctx: any): Promise<void> {
  const db = ctx.db;
  if (!db) return;
  const existing = await db.query('templates').first();
  if (!existing) {
    for (const t of STORE_TEMPLATES) {
      await db.insert('templates', {
        ...t,
      });
    }
  }
}
