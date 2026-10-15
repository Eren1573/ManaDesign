/**
 * Simple in-memory per-user rate limiter for Convex AI actions.
 *
 * Limits:
 *  - Vision (photo → prompt): 10 requests / user / hour
 *  - Image generation:         5 requests / user / hour
 *
 * Uses a sliding-window counter stored in a module-level Map.
 * In a serverless environment each Convex node has its own Map, so
 * this is a *best-effort* guard—it stops accidental spam but not a
 * determined attacker. For production, use Convex's built-in rate
 * limiting tables or an external KV store.
 */

interface WindowEntry {
  count: number;
  windowStart: number;
}

const WINDOW_MS = 60 * 60 * 1000; // 1 hour

const visionCounts = new Map<string, WindowEntry>();
const imageCounts = new Map<string, WindowEntry>();

function checkLimit(
  map: Map<string, WindowEntry>,
  key: string,
  maxPerWindow: number
): void {
  const now = Date.now();
  const entry = map.get(key);

  if (!entry || now - entry.windowStart >= WINDOW_MS) {
    map.set(key, { count: 1, windowStart: now });
    return;
  }

  if (entry.count >= maxPerWindow) {
    const retrySecs = Math.ceil((WINDOW_MS - (now - entry.windowStart)) / 1000 / 60);
    throw new Error(
      `Rate limit reached. You can make ${maxPerWindow} AI requests per hour. ` +
        `Please try again in ~${retrySecs} minute${retrySecs !== 1 ? 's' : ''}.`
    );
  }

  entry.count += 1;
}

/** Call before geminiVision — throws a friendly error on limit. */
export function checkVisionLimit(userId: string): void {
  checkLimit(visionCounts, userId, 10);
}

/** Call before geminiGenerateImage — throws a friendly error on limit. */
export function checkImageLimit(userId: string): void {
  checkLimit(imageCounts, userId, 5);
}
