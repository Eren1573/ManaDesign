export type PosterCategory = 'Festivals' | 'Birthdays' | 'Business';
export type PosterLanguage = 'English' | 'Hindi' | 'Telugu' | 'Tamil';

export interface TrendingPoster {
  id: string;
  slug: string;
  category: PosterCategory;
  title: string;
  greeting: string;
  greetingsByLang: Record<PosterLanguage, string>;
  subtitle: string;
  accent: string;
  gradient: string;
  iconName: string;
  ratio: '4:5';
  monthDay?: { month: number; day: number }; // 1-12, 1-31
  tags: string[];
  basePrompt: string;
  aliases?: string[];
}

export const TRENDING_POSTERS: TrendingPoster[] = [
  {
    id: 'navratri',
    slug: 'navratri-utsav',
    category: 'Festivals',
    title: 'Navratri Dandiya Nights',
    greeting: 'Happy Navratri',
    greetingsByLang: {
      English: 'Happy Navratri',
      Hindi: 'शुभ नवरात्रि',
      Telugu: 'నవరాత్రి శుభాకాంక్షలు',
      Tamil: 'நவராத்திரி நல்வாழ்த்துகள்'
    },
    subtitle: 'Garba rhythm & divine blessings',
    accent: '#f97316',
    gradient: 'from-amber-500 via-orange-600 to-rose-700',
    iconName: 'Flame',
    ratio: '4:5',
    monthDay: { month: 10, day: 12 },
    tags: ['Garba', 'Dandiya', 'Durga Puja', 'Festive Glow'],
    basePrompt: 'Hyper-detailed festive promotional social media poster with authentic Indian festival artwork. Elaborate traditional marigold and fresh green mango leaf garland/toran border running across the top edge. Warm amber diya lamps, soft golden bokeh sparkles, and intricate rangoli mandalas. High-contrast negative space dedicated on the right half framed with ornate golden arch specifically for a personal photo cutout. Crisp blank white rectangular name banner at the bottom for typography. 8k resolution, cinematic lighting, editorial poster aesthetics --ar 4:5 --style raw'
  },
  {
    id: 'ganesh-chaturthi',
    slug: 'ganesh-chaturthi',
    category: 'Festivals',
    title: 'Ganesh Chaturthi',
    greeting: 'Happy Ganesh Chaturthi',
    greetingsByLang: {
      English: 'Happy Ganesh Chaturthi',
      Hindi: 'गणेश चतुर्थी की हार्दिक शुभकामनाएं',
      Telugu: 'వినాయక చవితి శుభాకాంక్షలు',
      Tamil: 'விநாயகர் சதுர்த்தி நல்வாழ்த்துகள்'
    },
    subtitle: 'Lord Ganesha divine blessings',
    accent: '#ea580c',
    gradient: 'from-orange-500 via-amber-600 to-yellow-600',
    iconName: 'Sparkles',
    ratio: '4:5',
    monthDay: { month: 9, day: 7 },
    tags: ['Vinayaka', 'Bappa', 'Aarti', 'Modak'],
    basePrompt: 'Auspicious festival announcement poster with regal Lord Ganesha silhouette bathed in divine golden solar rays. Heavy fresh marigold and jasmine toran garland bordering the top ceiling frame. Subtle modak offerings, ceremonial brass pooja thali, and fragrant dhoop smoke. Clear unobstructed empty right side tailored for inserting a personal creator cutout photo. Clean blank pure white banner at the lower third for custom name and title. Hasselblad 50mm, vibrant Indian cultural palette --ar 4:5'
  },
  {
    id: 'raksha-bandhan',
    slug: 'raksha-bandhan',
    category: 'Festivals',
    title: 'Raksha Bandhan',
    greeting: 'Happy Raksha Bandhan',
    greetingsByLang: {
      English: 'Happy Raksha Bandhan',
      Hindi: 'रक्षाबंधन की हार्दिक शुभकामनाएं',
      Telugu: 'రాఖీ పౌర్ణమి శుభాకాంక్షలు',
      Tamil: 'ரக்ஷா பந்தன் நல்வாழ்த்துகள்'
    },
    subtitle: 'Celebrating sibling bonds',
    accent: '#ec4899',
    gradient: 'from-pink-500 via-rose-600 to-purple-700',
    iconName: 'Heart',
    ratio: '4:5',
    monthDay: { month: 8, day: 19 },
    tags: ['Rakhi', 'Brother & Sister', 'Festive Love'],
    basePrompt: 'Warm emotional festival poster celebrating brother and sister bonds. Elegant floral toran and silk ribbon garland across the upper perimeter. Intricate sacred zari rakhi threads resting on a polished silver plate with traditional sweets. Designated empty space on the right side reserved for personal portrait photo cutout. Clean white banner strip at the bottom for custom brother-sister name greetings. Studio portrait lighting, dreamy pastel gold background --ar 4:5'
  },
  {
    id: 'diwali',
    slug: 'happy-diwali',
    aliases: ['happy-diwali', 'diwali-celebration', 'diwali'],
    category: 'Festivals',
    title: 'Deepavali Light Festival',
    greeting: 'Happy Diwali',
    greetingsByLang: {
      English: 'Happy Diwali',
      Hindi: 'दीपावली की हार्दिक शुभकामनाएं',
      Telugu: 'దీపావళి శుభాకాంక్షలు',
      Tamil: 'தீபாவளி நல்வாழ்த்துகள்'
    },
    subtitle: 'Festival of lights & prosperity',
    accent: '#eab308',
    gradient: 'from-amber-400 via-orange-500 to-red-600',
    iconName: 'Sparkles',
    ratio: '4:5',
    monthDay: { month: 11, day: 1 },
    tags: ['Diyas', 'Fireworks', 'Laxmi Puja', 'Lights'],
    basePrompt: 'Luminous Deepavali celebratory poster featuring hundreds of gleaming clay oil diyas and glittering fairy lights. Traditional marigold and mango leaf toran garland framing the top header. Intricate powder rangoli patterns on polished marble with distant warm celebratory fireworks in a velvet night sky. Generous clear space on the right half specifically designed for personal photo insertion. Blank white footer banner for recipient name. Ultra-high definition, 8k --ar 4:5'
  },
  {
    id: 'holi',
    slug: 'holi-colors',
    category: 'Festivals',
    title: 'Holi Festival of Colors',
    greeting: 'Happy Holi',
    greetingsByLang: {
      English: 'Happy Holi',
      Hindi: 'होली की हार्दिक शुभकामनाएं',
      Telugu: 'హోలీ శుభాకాంక్షలు',
      Tamil: 'ஹோலி நல்வாழ்த்துகள்'
    },
    subtitle: 'Vibrant gulal & joyous celebrations',
    accent: '#06b6d4',
    gradient: 'from-cyan-400 via-fuchsia-500 to-amber-500',
    iconName: 'Palette',
    ratio: '4:5',
    monthDay: { month: 3, day: 25 },
    tags: ['Colors', 'Gulal', 'Spring', 'Joy'],
    basePrompt: 'Explosive high-energy Holi festival poster with hyper-vibrant dynamic splashes of organic gulal powders in magenta, cyan, and saffron. Ornate flower toran along the top edge with fresh petals. Cinematic freeze-frame powder clouds and water droplets catching bright morning sunlight. Clean empty zone on the right side dedicated for family/creator portrait cutout. Crisp solid white name banner at the bottom base. High-speed shutter aesthetic, commercial magazine grade --ar 4:5'
  },
  {
    id: 'independence-day',
    slug: 'independence-day',
    category: 'Festivals',
    title: 'Independence Day',
    greeting: 'Happy Independence Day',
    greetingsByLang: {
      English: 'Happy Independence Day',
      Hindi: 'स्वतंत्रता दिवस की शुभकामनाएं',
      Telugu: 'స్వాతంత్ర్య దినోత్సవ శుభాకాంక్షలు',
      Tamil: 'சுதந்திர தின நல்வாழ்த்துகள்'
    },
    subtitle: '78th Year of National Pride',
    accent: '#16a34a',
    gradient: 'from-orange-500 via-slate-100 to-green-600',
    iconName: 'Shield',
    ratio: '4:5',
    monthDay: { month: 8, day: 15 },
    tags: ['Tiranga', 'Patriotic', 'India', 'Freedom'],
    basePrompt: 'Inspiring patriotic Indian Independence Day social media banner. Indian tri-color saffron, pristine white, and emerald green gradient accents. Garland border of national marigold blossoms at the ceiling. Majestic Ashoka Chakra emblem subtly rendered with golden backlighting in dramatic clouds. Generous open space on the right side framed for soldier, citizen, or creator portrait cutout. Minimalist white banner at the lower section for custom name. Editorial patriotic quality --ar 4:5'
  },
  {
    id: 'republic-day',
    slug: 'republic-day',
    category: 'Festivals',
    title: 'Republic Day',
    greeting: 'Happy Republic Day',
    greetingsByLang: {
      English: 'Happy Republic Day',
      Hindi: 'गणतंत्र दिवस की शुभकामनाएं',
      Telugu: 'గణతంత్ర దినోత్సవ శుభాకాంక్షలు',
      Tamil: 'குடியரசு தின நல்வாழ்த்துகள்'
    },
    subtitle: 'Constitution & sovereign heritage',
    accent: '#0284c7',
    gradient: 'from-sky-500 via-indigo-600 to-emerald-700',
    iconName: 'Award',
    ratio: '4:5',
    monthDay: { month: 1, day: 26 },
    tags: ['Constitution', 'Rajpath', 'Republic', 'Pride'],
    basePrompt: 'Stately and dignified Republic Day commemorative poster with subtle architectural silhouette of India Gate under a patriotic saffron and green flypast sky. Ceremonial garland toran along the top edge. Gleaming brass lamps and laurel crests. Clean unoccupied open space on the right half tailored for individual or leadership cutout. Pure white ribbon banner at bottom for designation and name. Leica 35mm f/1.4 clarity --ar 4:5'
  },
  {
    id: 'pongal',
    slug: 'pongal-sankranti',
    category: 'Festivals',
    title: 'Pongal & Makar Sankranti',
    greeting: 'Happy Pongal & Sankranti',
    greetingsByLang: {
      English: 'Happy Pongal & Sankranti',
      Hindi: 'पोंगल एवं मकर संक्रांति की शुभकामनाएं',
      Telugu: 'సంక్రాంతి & పొంగల్ శుభాకాంక్షలు',
      Tamil: 'பொங்கல் நல்வாழ்த்துகள்'
    },
    subtitle: 'Harvest prosperity & golden sunshine',
    accent: '#ca8a04',
    gradient: 'from-yellow-500 via-amber-600 to-lime-700',
    iconName: 'Sun',
    ratio: '4:5',
    monthDay: { month: 1, day: 15 },
    tags: ['Harvest', 'Sankranti', 'Sugarcane', 'Kites'],
    basePrompt: 'Joyous South Indian harvest festival poster featuring an overflowing traditional earthen pot bubbling with freshly cooked sweet Pongal rice. Sugarcane stalks, banana leaves, and fresh mango-leaf toran lining the top border. Colorful kites soaring in a golden sunny sky over lush paddy fields. Clear empty right-side zone reserved for family or farmer photo cutout. Crisp white nameplate banner at the base. National Geographic aesthetic --ar 4:5'
  },
  {
    id: 'ugadi',
    slug: 'ugadi-gudi-padwa',
    category: 'Festivals',
    title: 'Ugadi & Gudi Padwa',
    greeting: 'Happy Ugadi & New Year',
    greetingsByLang: {
      English: 'Happy Ugadi & New Year',
      Hindi: 'उगादी एवं गुड़ी पड़वा की शुभकामनाएं',
      Telugu: 'ఉగాది పండుగ శుభాకాంక్షలు',
      Tamil: 'யுகாதி புத்தாண்டு நல்வாழ்த்துகள்'
    },
    subtitle: 'Flavors of life & auspicious beginnings',
    accent: '#10b981',
    gradient: 'from-emerald-500 via-teal-600 to-amber-600',
    iconName: 'Leaf',
    ratio: '4:5',
    monthDay: { month: 3, day: 30 },
    tags: ['New Year', 'Pachadi', 'Spring', 'Prosperity'],
    basePrompt: 'Auspicious Deccan New Year celebration poster with vibrant fresh green mango-leaf and yellow marigold toran border at the top. Traditional silver bowl of Ugadi Pachadi, neem flowers, tender raw mango, and jaggery pieces. Warm festive temple bell and soft incense ambience. Spacious empty region on the right side dedicated for personal photo cutout. Blank clean white banner at bottom for family name. 8k, Hasselblad macro lens --ar 4:5'
  },
  {
    id: 'onam',
    slug: 'onam-pookkalam',
    category: 'Festivals',
    title: 'Onam Grand Festival',
    greeting: 'Happy Onam',
    greetingsByLang: {
      English: 'Happy Onam',
      Hindi: 'ओणम की हार्दिक शुभकामनाएं',
      Telugu: 'ఓనం శుభాకాంక్షలు',
      Tamil: 'ஓணம் நல்வாழ்த்துகள்'
    },
    subtitle: 'King Mahabali & Pookkalam flowers',
    accent: '#059669',
    gradient: 'from-emerald-600 via-amber-500 to-yellow-400',
    iconName: 'Flower2',
    ratio: '4:5',
    monthDay: { month: 9, day: 15 },
    tags: ['Kerala', 'Pookkalam', 'Sadya', 'Boat Race'],
    basePrompt: 'Exquisite Kerala Onam festival greeting poster centered around an intricate circular fresh flower carpet (Pookkalam). Traditional coconut leaf and golden marigold toran across the top header. Subtle Kasavu saree golden zari texture and brass Nilavilakku lamp with gentle flame. Generous clear space on the right side designed for personal portrait cutout. Clean white banner strip at bottom for personalized name greeting. Pristine editorial lighting --ar 4:5'
  },
  {
    id: 'birthday',
    slug: 'birthday-celebration',
    category: 'Birthdays',
    title: 'Luxury Birthday Gala',
    greeting: 'Happy Birthday',
    greetingsByLang: {
      English: 'Happy Birthday',
      Hindi: 'जन्मदिन की हार्दिक बधाई',
      Telugu: 'పుట్టినరోజు శుభాకాంక్షలు',
      Tamil: 'இனிய பிறந்தநாள் வாழ்த்துகள்'
    },
    subtitle: 'Champagne gold balloon celebration',
    accent: '#a855f7',
    gradient: 'from-purple-600 via-pink-600 to-amber-500',
    iconName: 'Cake',
    ratio: '4:5',
    tags: ['Party', 'Celebration', 'VIP', 'Gold Confetti'],
    basePrompt: 'Ultra-luxurious birthday celebration backdrop poster. Sleek floating metallic chrome balloons, cascading gold foil garland and twinkling fairy lights along the top ceiling. Deep midnight blue velvet curtain backdrop with drifting golden bokeh circles. Large open clean space on the right side specially designated for high-resolution person portrait photo cutout. Modern minimalist white banner at the bottom for custom name and age wishes. Vogue magazine layout standard --ar 4:5'
  },
  {
    id: 'anniversary',
    slug: 'anniversary-milestone',
    category: 'Birthdays',
    title: 'Anniversary Milestone',
    greeting: 'Happy Anniversary',
    greetingsByLang: {
      English: 'Happy Anniversary',
      Hindi: 'विवाह वर्षगांठ की शुभकामनाएं',
      Telugu: 'వివాహ వార్షికోత్సవ శుభాకాంక్షలు',
      Tamil: 'திருமண நாள் நல்வாழ்த்துகள்'
    },
    subtitle: 'Years of love, laughter & memories',
    accent: '#f43f5e',
    gradient: 'from-rose-500 via-red-600 to-amber-600',
    iconName: 'Heart',
    ratio: '4:5',
    tags: ['Romance', 'Couple', 'Milestone', 'Elegance'],
    basePrompt: 'Romantic editorial wedding anniversary poster with cascading cream blush roses and eucalyptus leaf garland along the top border. Warm glowing candlelight, champagne flutes with sparkling effervescence, and subtle rose gold bokeh. Dedicated empty right side for couple photo cutout. Crisp pure white banner at the lower margin for couple names and year milestone. Soft romantic cinematic diffusion --ar 4:5'
  },
  {
    id: 'grand-opening',
    slug: 'business-grand-opening',
    category: 'Business',
    title: 'Grand Opening & Sale',
    greeting: 'Grand Opening Announcement',
    greetingsByLang: {
      English: 'Grand Opening Announcement',
      Hindi: 'भव्य शुभारंभ',
      Telugu: 'శుభ ప్రారంభం & ప్రత్యేక ఆఫర్',
      Tamil: 'பிரமாண்ட தொடக்க விழா'
    },
    subtitle: 'Special launch offers & brand debut',
    accent: '#2563eb',
    gradient: 'from-blue-600 via-indigo-700 to-sky-500',
    iconName: 'Store',
    ratio: '4:5',
    tags: ['Store Launch', 'Commercial', 'Discount', 'Retail'],
    basePrompt: 'Commercial high-conversion retail grand opening poster. Bold red silk ribbon and festive golden pennant garland strung across the top edge. Modern sleek architectural storefront entrance with spotlights and glossy reflective showroom floor. Unobstructed clear right-hand area designed for store owner or product hero cutout. Clean white banner block at the bottom for store name, address, and launch date. Commercial advertising agency grade --ar 4:5'
  }
];

/**
 * Builds the complete ready-to-run prompt with live custom greeting, name, and language
 */
export function buildPosterPrompt(
  poster: TrendingPoster,
  options?: {
    customGreeting?: string;
    customName?: string;
    language?: PosterLanguage;
    hasPhoto?: boolean;
  }
): string {
  const lang = options?.language || 'English';
  const greetingText = options?.customGreeting || poster.greetingsByLang[lang] || poster.greeting;
  const nameText = options?.customName?.trim() || '[YOUR NAME / BRAND HERE]';

  return `${poster.basePrompt} [EMBEDDED TEXT SPECIFICATION: Prominently display greeting headline "${greetingText}" in bold elegant typography. Bottom white banner contains name: "${nameText}". Right photo area: ${
    options?.hasPhoto ? 'Cleanly blended with uploaded personal portrait subject' : 'Ready for personal portrait cutout'
  }].`;
}

/**
 * Order posters by upcoming-date relevance so the nearest festival appears first.
 * Non-dated posters (Birthday, Business) appear seamlessly following timely festivals.
 */
export function getSortedTrendingPosters(
  posters: TrendingPoster[] = TRENDING_POSTERS,
  referenceDate: Date = new Date()
): TrendingPoster[] {
  const currentMonth = referenceDate.getMonth() + 1; // 1-12
  const currentDay = referenceDate.getDate(); // 1-31

  // Day of year approximate calculation for current date
  const currentDayOfYear = currentMonth * 31 + currentDay;

  return [...posters].sort((a, b) => {
    if (a.monthDay && b.monthDay) {
      const dayOfYearA = a.monthDay.month * 31 + a.monthDay.day;
      const dayOfYearB = b.monthDay.month * 31 + b.monthDay.day;

      const diffA = dayOfYearA >= currentDayOfYear ? dayOfYearA - currentDayOfYear : dayOfYearA - currentDayOfYear + 372;
      const diffB = dayOfYearB >= currentDayOfYear ? dayOfYearB - currentDayOfYear : dayOfYearB - currentDayOfYear + 372;

      return diffA - diffB;
    }

    if (a.monthDay && !b.monthDay) return -1;
    if (!a.monthDay && b.monthDay) return 1;

    return 0;
  });
}
