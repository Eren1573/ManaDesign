export interface TemplateItem {
  id: string;
  slug: string;
  title: string;
  category: 'Marketing' | 'Personal';
  priceCents: number;
  description: string;
  shortDescription: string;
  promptCount: number;
  tags: string[];
  gradientClass: string;
  accentColor: string;
  highlights: string[];
  samplePrompts: string[];
  recommendedModel: string;
  featured?: boolean;
}

export const STORE_TEMPLATES: TemplateItem[] = [
  {
    id: 'tpl_campaign_launch',
    slug: 'campaign-launch-suite',
    title: 'Campaign Launch Suite',
    category: 'Marketing',
    priceCents: 3900,
    shortDescription: '24 prompts · launches, ads, stories',
    description: 'A comprehensive visual system engineered specifically for product rollouts, high-conversion paid ads, and viral announcement carousels. Designed to keep every asset unmistakably premium and cohesive across Instagram, TikTok, and web headers.',
    promptCount: 24,
    tags: ['E-Commerce', 'Paid Ads', 'Product Launch', 'Carousels'],
    gradientClass: 'from-blue-600 via-indigo-600 to-sky-500',
    accentColor: '#3b82f6',
    featured: true,
    highlights: [
      '24 modular prompt structures engineered for commercial product hero shots',
      'Pre-calibrated lighting tokens for ultra-clean rim light & studio cyclorama',
      'Hero packaging, lifestyle action, flat-lays, and social carousel variations',
      'Cross-tested on Midjourney v6, DALL·E 3, and Stable Diffusion XL'
    ],
    samplePrompts: [
      'Commercial hero product shot of [PRODUCT], floating weightlessly above reflective satin surface, soft cyan and warm titanium rim lighting, 8k resolution, captured on Hasselblad H6D-100c, 100mm macro lens, f/4 --ar 16:9 --style raw',
      'Editorial flat-lay advertising spread featuring [PRODUCT] surrounded by subtle geometric stone props, dramatic natural morning window shadow, minimal luxury aesthetic, 35mm film grain, hyper-detailed --ar 4:5',
      'Dynamic in-motion lifestyle scene with female model interacting with [PRODUCT], sleek architectural concrete loft background, golden hour rim highlight, cinematic color grading, 85mm portrait f/1.8 --ar 9:16'
    ],
    recommendedModel: 'Midjourney v6 / Gemini Imagen 3'
  },
  {
    id: 'tpl_feed_consistency',
    slug: 'feed-consistency-system',
    title: 'Feed Consistency System',
    category: 'Marketing',
    priceCents: 2900,
    shortDescription: 'Grid-first prompts · locked lighting moods',
    description: 'Stop the patchy, mismatched Instagram grid. This suite locks in color temperatures, camera distances, and focal depths so that your 9-grid posts harmoniously sync together regardless of what subject matter you generate.',
    promptCount: 18,
    tags: ['Branding', 'Social Grid', 'Color Harmony', 'Agencies'],
    gradientClass: 'from-sky-500 via-teal-500 to-emerald-600',
    accentColor: '#0ea5e9',
    featured: true,
    highlights: [
      'Strict color gamut lock preserving brand neutrals and subtle accent tones',
      'Alternating focal distance formulas: 3 closeups, 3 medium spaces, 3 wides',
      'Seamless aesthetic rhythm across dark and light feed layouts',
      'Includes copyable negative prompt modifiers to banish clashing saturated tones'
    ],
    samplePrompts: [
      'Minimal architectural interior detail featuring muted travertine marble, warm afternoon shadow patterns, quiet luxury aesthetic, Kodak Portra 400 color profile, soft ambient daylight, perfectly balanced grid --ar 1:1',
      'Overhead coffee workspace vignette with matte ceramic cup, linen notebook, soft northern light diffused through linen curtains, warm taupe and bone color palette, hyper-clean commercial styling --ar 1:1',
      'Abstract architectural concrete curves meeting clear blue sky, geometric brutalism, subtle grain, harmonious tonal depth, high editorial standard --ar 1:1'
    ],
    recommendedModel: 'Midjourney v6 / DALL·E 3'
  },
  {
    id: 'tpl_editorial_portrait',
    slug: 'editorial-portrait-series',
    title: 'Editorial Portrait Series',
    category: 'Personal',
    priceCents: 1900,
    shortDescription: '10 portrait styles · profiles & press',
    description: 'Elevate personal branding, executive headshots, press kits, and author bios to the level of Vanity Fair and GQ magazine covers. Natural skin textures with zero plastic artificiality.',
    promptCount: 10,
    tags: ['Headshots', 'Executive', 'Portraits', 'Press Kit'],
    gradientClass: 'from-amber-500 via-orange-600 to-rose-600',
    accentColor: '#f97316',
    featured: true,
    highlights: [
      'Subsurface skin scattering parameters eliminating artificial smoothness',
      'Professional strobe setups: Profoto softbox, beauty dish, and split lighting',
      'Diverse modern wardrobe prompts (minimalist tailoring, relaxed linen, dark turtlenecks)',
      'High-dynamic-range black & white and warm editorial color calibrations'
    ],
    samplePrompts: [
      'Intimate editorial magazine portrait of [SUBJECT], dramatic split key light, deep charcoal seamless backdrop, sharp catchlights in eyes, authentic pores and natural skin texture, Leica SL2 90mm f/2 APO-Summicron, award-winning photography --ar 4:5',
      'Cinematic profile portrait in modern architectural glass boardroom, soft twilight cityscape reflections, subtle backlight rim, confident expression, editorial styling, 35mm film feel --ar 16:9',
      'Timeless black and white high-contrast studio headshot, Rembrandt lighting, deep blacks, rich silver highlights, Hasselblad 80mm lens, tactile texture --ar 1:1'
    ],
    recommendedModel: 'Midjourney v6 / FLUX.1'
  },
  {
    id: 'tpl_streetwear_lookbook',
    slug: 'streetwear-apparel-lookbook',
    title: 'Streetwear & Apparel Lookbook',
    category: 'Marketing',
    priceCents: 3400,
    shortDescription: 'Studio lighting, urban textures & model poses',
    description: 'Designed for independent apparel labels, sneaker brands, and street fashion creators. Captures gritty urban authentic backdrops, flash photography, and realistic fabric folds.',
    promptCount: 20,
    tags: ['Fashion', 'Apparel', 'Streetwear', 'Lookbook'],
    gradientClass: 'from-purple-600 via-pink-600 to-rose-500',
    accentColor: '#a855f7',
    highlights: [
      'Direct on-camera flash aesthetics with raw film grain emulation',
      'Intricate fabric rendering (heavyweight 400gsm cotton, ripstop nylon, raw denim)',
      'Urban brutalist and Tokyo/London alleyway location modifiers',
      'Dynamic candid movement and authentic streetwear pose library'
    ],
    samplePrompts: [
      'Fashion lookbook shot of model wearing oversized [GARMENT], brutalist concrete stairway backdrop, direct ring flash with stark shadows, 90s youth culture magazine aesthetic, 28mm wide angle lens, high grain --ar 4:5',
      'Moody nighttime street portrait, neon city reflections on wet asphalt, model showcasing [ACCESSORY], cinematic teal and magenta ambient glow, 50mm f/1.2 lens --ar 9:16'
    ],
    recommendedModel: 'Midjourney v6 / Gemini Imagen 3'
  },
  {
    id: 'tpl_minimalist_product',
    slug: 'minimalist-product-studio',
    title: 'Minimalist Product Studio',
    category: 'Marketing',
    priceCents: 2500,
    shortDescription: 'High-end Scandinavian studio aesthetic',
    description: 'Clean, serene, museum-grade product photography. Soft gradients, organic pedestal arrangements, and diffused daylight for skincare, perfume, ceramics, and lifestyle tech.',
    promptCount: 16,
    tags: ['Beauty', 'Cosmetics', 'Scandinavian', 'Minimalism'],
    gradientClass: 'from-stone-500 via-zinc-600 to-slate-700',
    accentColor: '#71717a',
    highlights: [
      'Organic podiums: micro-cement, honed limestone, and curved acrylic blocks',
      'Soft diffused skybox lighting with gentle caustic water & glass reflections',
      'Zero visual clutter — maximum negative space for brand typography placement',
      'Optimized for luxury wellness, clean beauty, and design tech'
    ],
    samplePrompts: [
      'Scandinavian minimalist product photography of [PRODUCT] resting on a sculptured sandstone plinth, delicate organic tree branch shadow projected onto off-white lime plaster wall, diffuse ambient light, medium format camera --ar 4:5',
      'Clear cosmetic bottle floating against serene water ripples, refraction caustic light patterns on smooth sandy bed, tranquil spa aesthetic, macro lens 100mm f/2.8 --ar 1:1'
    ],
    recommendedModel: 'Midjourney v6 / FLUX.1'
  },
  {
    id: 'tpl_culinary_beverage',
    slug: 'culinary-beverage-stories',
    title: 'Culinary & Beverage Stories',
    category: 'Personal',
    priceCents: 2200,
    shortDescription: 'Warm natural light & food styling',
    description: 'Mouthwatering culinary imagery for cafes, mixologists, restaurants, and food creators. Master condensation droplets, steam swirls, artisan plating, and rustic table settings.',
    promptCount: 15,
    tags: ['Food & Drink', 'Restaurant', 'Culinary', 'Beverage'],
    gradientClass: 'from-amber-600 via-red-600 to-yellow-600',
    accentColor: '#d97706',
    highlights: [
      'Physics-accurate liquid splash, condensation droplets, and steam parameters',
      'Warm golden hour window light simulating cozy Parisian or Tuscan bistros',
      'Artisanal textures: charred sourdough crumb, olive oil drizzles, crushed ice',
      'Tested across brunch menus, craft cocktail spreads, and dessert hero shots'
    ],
    samplePrompts: [
      'Close-up hero shot of artisanal [DISH/COCKTAIL] on rustic slate surface, tiny condensation droplets dripping down glass, warm afternoon sunbeam streaming through dust motes, shallow depth of field, 85mm f/1.4 --ar 4:5',
      'Overhead feast flat-lay on reclaimed dark wooden table, fresh herbs, scattered sea salt crystals, ceramic plates, candid culinary storytelling, Kinfolk magazine style --ar 16:9'
    ],
    recommendedModel: 'Midjourney v6 / DALL·E 3'
  }
];

export function formatPrice(priceCents: number): string {
  return `$${(priceCents / 100).toFixed(0)}`;
}
