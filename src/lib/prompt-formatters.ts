/**
 * Prompt Formatting Helpers for AI Image Generation engines:
 * - Midjourney v6 (appends --ar and --v 6.0 --style raw)
 * - DALL·E 3 (natural language photographic prefix and quality cues)
 * - Stable Diffusion XL (positive photography quality tokens and tags)
 * - Ratio hint mapper (friendly display hints for social media dimensions)
 */

export function formatForMidjourney(prompt: string, aspectRatio: string = '4:5'): string {
  let p = prompt.trim();
  if (!p.includes('--ar')) {
    p = `${p} --ar ${aspectRatio}`;
  }
  if (!p.includes('--v 6')) {
    p = `${p} --v 6.0 --style raw`;
  }
  return p;
}

export function formatForDallE(prompt: string): string {
  const cleaned = prompt
    .replace(/--ar \S+/g, '')
    .replace(/--v \S+/g, '')
    .replace(/--style \S+/g, '')
    .trim();
  return `High-end commercial photograph: ${cleaned}. Rendered in ultra-high resolution with natural lighting balance.`;
}

export function formatForStableDiffusion(prompt: string): string {
  const cleaned = prompt
    .replace(/--ar \S+/g, '')
    .replace(/--v \S+/g, '')
    .replace(/--style \S+/g, '')
    .trim();
  return `masterpiece, 8k photo, ${cleaned}, photorealistic, professional color grading, studio lighting, highly detailed, sharp focus`;
}

/**
 * Aspect Ratio to Social Media & Camera Format mapping
 */
export const RATIO_HINTS: Record<string, string> = {
  '1:1': 'Instagram Square Post (1080×1080)',
  '4:5': 'Instagram Portrait Feed (1080×1350)',
  '9:16': 'Instagram Reels & Stories (1080×1920)',
  '16:9': 'YouTube & Web Hero (1920×1080)',
  '3:2': 'Classic 35mm DSLR Photography (3:2)',
  '2:3': 'Vertical Editorial Poster (2:3)',
  '21:9': 'Cinematic Ultrawide Banner (21:9)',
};

export function getRatioHint(ratio: string): string {
  return RATIO_HINTS[ratio] || `${ratio} Custom Aspect Ratio`;
}
