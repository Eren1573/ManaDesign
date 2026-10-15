/**
 * ManaDesign Analytics — Thin event wrapper.
 *
 * Dispatches a custom DOM event `mana:track` for every action.
 * To plug in a real provider, add a listener in main.tsx:
 *
 *   window.addEventListener('mana:track', (e: Event) => {
 *     const { name, props } = (e as CustomEvent).detail;
 *     gtag('event', name, props);   // GA4 example
 *   });
 *
 * All tracked event names and payloads are typed below.
 */

export type AnalyticsEvent =
  | { name: 'poster_clicked'; props: { slug: string; title: string } }
  | { name: 'prompt_generated'; props: { source: 'vision' | 'template' } }
  | { name: 'prompt_copied'; props: { target: 'generic' | 'midjourney' | 'dalle' | 'sd' } }
  | { name: 'template_viewed'; props: { slug: string; title: string } }
  | { name: 'checkout_started'; props: { slug: string; priceCents: number } }
  | { name: 'sign_in_completed'; props: { method: string } };

export function track(event: AnalyticsEvent): void {
  try {
    window.dispatchEvent(
      new CustomEvent('mana:track', { detail: event })
    );
    // Dev logging
    if (import.meta.env.DEV) {
      console.debug('[analytics]', event.name, event.props);
    }
  } catch {
    // Never throw — analytics must never break the app
  }
}
