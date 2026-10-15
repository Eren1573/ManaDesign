// Convex Actions: Gemini AI Integration
// Node.js environment actions for Vision, Imagen, Character Prompts, and Video Concepts

import { geminiVision, geminiGenerateImage, geminiText } from '../lib/gemini';
import { checkVisionLimit, checkImageLimit } from '../lib/rate-limit';

export async function generateImagePrompt(
  _ctx: any,
  args: { image: string; note?: string; userId?: string }
) {
  if (!args.image) {
    throw new Error('Image data is required');
  }
  // Rate-limit per authenticated user; fall back to a shared guest bucket
  checkVisionLimit(args.userId ?? 'guest');
  return await geminiVision({
    image: args.image,
    note: args.note,
  });
}

export async function generateImage(
  _ctx: any,
  args: { prompt: string; style: string; aspectRatio: string; count?: number; userId?: string }
) {
  if (!args.prompt) {
    throw new Error('Prompt is required');
  }
  checkImageLimit(args.userId ?? 'guest');
  return await geminiGenerateImage({
    prompt: args.prompt,
    style: args.style || 'Photorealistic',
    aspectRatio: args.aspectRatio || '1:1',
    count: args.count || 1,
  });
}

export async function generateCharacterPrompt(
  _ctx: any,
  args: { characterDescription: string; genre?: string }
) {
  const prompt = `Convert this character description into an ultra-detailed Midjourney/FLUX prompt with costume, materials, expression, and key lighting: "${args.characterDescription}"`;
  const system = `You are a character design prompt engineer. Produce a single comprehensive prompt.`;
  return await geminiText(prompt, system);
}

export async function generateVideoConcept(
  _ctx: any,
  args: { concept: string; platform?: 'reels' | 'tiktok' | 'youtube' }
) {
  const prompt = `Create a 3-scene video generation storyboard concept for: "${args.concept}". Include camera motion, pacing, visual cues, and audio suggestions.`;
  return await geminiText(prompt);
}

export async function generateConceptArt(
  _ctx: any,
  args: { description: string; mood: string }
) {
  return await geminiGenerateImage({
    prompt: `${args.description}, ${args.mood} mood, concept art, matte painting`,
    style: 'Cinematic',
    aspectRatio: '16:9',
  });
}
