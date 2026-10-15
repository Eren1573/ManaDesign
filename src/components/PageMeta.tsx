/**
 * PageMeta — injects <title>, meta description, and Open Graph tags
 * into the document <head> for per-page SEO.
 *
 * Usage:
 *   <PageMeta
 *     title="Studio | ManaDesign"
 *     description="AI-powered image prompt studio..."
 *     image="/og-studio.png"   // optional; falls back to site default
 *   />
 *
 * Works without a server (SPA) — tags are set on navigation. For full
 * crawlability, consider adding SSR/prerendering later.
 */
import { useEffect } from 'react';

interface PageMetaProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

const SITE_NAME = 'ManaDesign';
const DEFAULT_IMAGE = 'https://manadesign.app/og-default.png'; // update with real domain

function setMeta(name: string, content: string, isProperty = false) {
  const attr = isProperty ? 'property' : 'name';
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

export function PageMeta({ title, description, image, url }: PageMetaProps) {
  useEffect(() => {
    // <title>
    document.title = title;

    // Standard meta
    setMeta('description', description);

    // Open Graph
    setMeta('og:type', 'website', true);
    setMeta('og:site_name', SITE_NAME, true);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:image', image ?? DEFAULT_IMAGE, true);
    setMeta('og:url', url ?? window.location.href, true);

    // Twitter / X Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image ?? DEFAULT_IMAGE);
  }, [title, description, image, url]);

  return null;
}
