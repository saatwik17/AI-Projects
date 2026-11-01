/**
 * Utility to map food item names to high-quality, authentic Indian food background images from Unsplash.
 */

const EXACT_FOOD_IMAGE_MAP: Record<string, string> = {
  // Breakfast
  'Poha with Peanuts & Moong Sprouts':
    'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
  'Steamed Idli with Vegetable Sambar & Coconut Chutney':
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
  'Oats & Vegetable Upma':
    'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=800&q=80',
  'Moong Dal Cheela with Grated Paneer':
    'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
  'Paneer Stuffed Multigrain Paratha with Curd':
    'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80',
  'Rava Vegetable Uttapam with Tomato Chutney':
    'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
  'Egg Bhurji (Scrambled Eggs) with 2 Whole Wheat Toast':
    'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',

  // Lunch & Dinner
  'Yellow Dal Tadka, Mix Veg Sabzi & 2 Whole Wheat Rotis':
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
  'Rajma Masala with Steamed Brown Rice & Cucumber Salad':
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
  'South Indian Thali (Sambar, Pepper Rasam, Curd Rice & Poriyal)':
    'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80',
  'Homestyle Chicken Curry & Whole Wheat Rotis':
    'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
  'East Indian Fish Curry with Steamed Rice':
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
  'Punjabi Chole with Multigrain Rotis & Onion Lemon Salad':
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
  'Traditional Kadhi Pakora with Basmati Rice':
    'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
  'Comfort Moong Dal Khichdi with Desi Ghee & Amla Pickle':
    'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
  'Palak Paneer with Missi Roti (Gram Flour Roti)':
    'https://images.unsplash.com/photo-1618449840665-9ed506d73a34?auto=format&fit=crop&w=800&q=80',
  'Paneer Bhurji & 2 Whole Wheat Phulkas':
    'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
  'Lauki (Bottle Gourd) Chana Dal Curry & 2 Phulkas':
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
  'Homestyle Egg Curry with 2 Whole Wheat Phulkas':
    'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80',
  'Bajra (Pearl Millet) Roti with Methi Garlic Sabzi & Fresh Curd':
    'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=800&q=80',
  'Soya Chunk & Green Peas Curry with Steamed Brown Rice':
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  'Tofu Spinach Saag with Jowar (Sorghum) Roti':
    'https://images.unsplash.com/photo-1618449840665-9ed506d73a34?auto=format&fit=crop&w=800&q=80',
  'Light Vegetable Dalia (Broken Wheat) Khichdi':
    'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',

  // Snacks & Beverages
  'Roasted Masala Chana & Green Tea':
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  'Sprouted Moong & Fresh Guava Chaat':
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  'Roasted Makhana (Fox Nuts) in Ghee with Black Pepper':
    'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80',
  'Spiced Steamed Kala Chana (Black Chickpea) Chaat':
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  'Sattu Namkeen Drink (Roasted Gram Protein Sharbat)':
    'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
  'Golden Turmeric Milk (Haldi Doodh with Pepper & Almonds)':
    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
  'Fresh Amla & Ginger Citrus Elixir':
    'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80',
  'Refreshing Masala Buttermilk (Chaas with Cumin & Mint)':
    'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
  'Masala Buttermilk (Chaas with Cumin & Mint)':
    'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
  'Masala Buttermilk':
    'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
  'Chaas with Cumin & Mint':
    'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
  'Fresh Tender Coconut Water with Malai':
    'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=800&q=80',
};

// Keyword-based fallback matching for any general dish or dynamic custom food item
// Note: Specific items like Paneer, Palak Paneer are evaluated before broader keywords
const KEYWORD_IMAGE_MAP: { keywords: string[]; url: string }[] = [
  {
    keywords: ['palak paneer', 'saag paneer', 'spinach paneer', 'spinach saag'],
    url: 'https://images.unsplash.com/photo-1618449840665-9ed506d73a34?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['paneer bhurji', 'paneer tikka', 'shahi paneer', 'matar paneer', 'kadai paneer', 'paneer butter masala', 'paneer'],
    url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['paratha', 'stuffed paratha', 'aloo paratha', 'paneer paratha'],
    url: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['biryani', 'pulao', 'hyderabadi', 'biriyani'],
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['dosa', 'dosai', 'uttapam', 'masala dosa'],
    url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['idli', 'sambar', 'vada', 'medu vada'],
    url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['poha', 'flattened rice'],
    url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['samosa', 'pakora', 'bhajji', 'kachori'],
    url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['pani puri', 'golgappa', 'sev puri', 'bhel', 'chaat'],
    url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['butter chicken', 'chicken tikka', 'chicken curry', 'chicken'],
    url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['fish', 'prawn', 'seafood', 'fish curry'],
    url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['egg', 'bhurji', 'egg curry', 'omelette'],
    url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['dal', 'dal tadka', 'dal makhani', 'toor dal', 'moong dal'],
    url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['rajma', 'chole', 'chana', 'chickpea'],
    url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['roti', 'phulka', 'naan', 'puri', 'chapati', 'bajra'],
    url: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['thali', 'meals', 'south indian', 'platter'],
    url: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['khichdi', 'pongal', 'dalia'],
    url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['kadhi', 'curry'],
    url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['upma', 'oats'],
    url: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['makhana', 'foxnut', 'nuts', 'snack'],
    url: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['buttermilk', 'chaas', 'masala chaas', 'lassi', 'curd', 'yogurt', 'cumin & mint'],
    url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['turmeric', 'milk', 'haldi', 'almond milk'],
    url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['amla', 'juice', 'citrus', 'elixir', 'lemonade', 'sharbat'],
    url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['coconut', 'coconut water'],
    url: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['sweet', 'gulab jamun', 'jalebi', 'kheer', 'halwa', 'kulfi'],
    url: 'https://images.unsplash.com/photo-1605197586548-0284d72d2426?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['pav bhaji', 'bhaji'],
    url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
  },
];

const DEFAULT_FOOD_IMAGE =
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80';

/**
 * Returns a realistic, high-quality Unsplash image URL matching the exact food name or keywords.
 */
export function getFoodImage(foodName?: string): string {
  if (!foodName) return DEFAULT_FOOD_IMAGE;

  // 1. Direct match
  if (EXACT_FOOD_IMAGE_MAP[foodName]) {
    return EXACT_FOOD_IMAGE_MAP[foodName];
  }

  // 2. Case-insensitive exact check
  const lowerName = foodName.toLowerCase().trim();
  for (const [key, url] of Object.entries(EXACT_FOOD_IMAGE_MAP)) {
    if (key.toLowerCase() === lowerName) {
      return url;
    }
  }

  // 3. Keyword match (evaluated in top-down order)
  for (const item of KEYWORD_IMAGE_MAP) {
    if (item.keywords.some((kw) => lowerName.includes(kw))) {
      return item.url;
    }
  }

  // 4. Default fallback
  return DEFAULT_FOOD_IMAGE;
}
