// Convex prompts mutations and queries
import { PromptDoc } from './schema';

/**
 * Generate a temporary upload URL for file storage.
 * Uploaded files receive a `storageId` that is saved in prompts.
 */
export async function generateUploadUrl(ctx: any): Promise<string> {
  if (ctx.storage?.generateUploadUrl) {
    return await ctx.storage.generateUploadUrl();
  }
  return `/api/storage/upload?token=${Date.now()}`;
}

/**
 * List saved prompts for a user.
 * Resolves storageId to display URL while maintaining backward compatibility
 * for older rows that store raw data URLs or direct links.
 */
export async function list(ctx: any, args: { userId: string }): Promise<PromptDoc[]> {
  const db = ctx.db;
  if (!db) return [];
  const docs = await db
    .query('prompts')
    .withIndex('by_user', (q: any) => q.eq('userId', args.userId))
    .order('desc')
    .collect();

  return Promise.all(
    docs.map(async (doc: PromptDoc) => {
      // If doc has storageId and no thumbnail or needs resolving, fetch URL from storage
      if (doc.storageId && ctx.storage?.getUrl) {
        try {
          const resolved = await ctx.storage.getUrl(doc.storageId);
          if (resolved) {
            return { ...doc, thumbnail: resolved };
          }
        } catch {
          // Fall back to existing thumbnail if storage resolution fails
        }
      }
      return doc;
    })
  );
}

/**
 * Save prompt to library.
 * Accepts optional `storageId` from Convex file storage instead of storing large data URLs.
 * Stores `storageId` plus resolved display URL, while keeping backward compatibility for legacy callers.
 */
export async function save(
  ctx: any,
  args: {
    userId: string;
    storageId?: string;
    thumbnail?: string;
    prompt: string;
    subject?: string;
    lighting?: string;
    composition?: string;
    palette?: string;
    tags: string[];
  }
): Promise<string> {
  const db = ctx.db;

  let resolvedThumbnail = args.thumbnail;
  if (args.storageId && ctx.storage?.getUrl) {
    try {
      const storageUrl = await ctx.storage.getUrl(args.storageId);
      if (storageUrl) {
        resolvedThumbnail = storageUrl;
      }
    } catch {
      // Continue with provided thumbnail
    }
  }

  return await db.insert('prompts', {
    ...args,
    thumbnail: resolvedThumbnail,
    createdAt: Date.now(),
  });
}

export async function remove(ctx: any, args: { promptId: string; userId: string }): Promise<boolean> {
  const db = ctx.db;
  const prompt = await db.get(args.promptId);
  if (!prompt || prompt.userId !== args.userId) {
    throw new Error('Unauthorized or prompt not found');
  }
  // Optional: delete associated file from storage
  if (prompt.storageId && ctx.storage?.delete) {
    try {
      await ctx.storage.delete(prompt.storageId);
    } catch {
      // Ignore if file doesn't exist
    }
  }
  await db.delete(args.promptId);
  return true;
}
