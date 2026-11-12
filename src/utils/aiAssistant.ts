import { Product } from '../types';
import { DEMO_PRODUCTS } from '../data/products';
import { formatPrice } from './formatters';

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  matchedProducts?: Product[];
  suggestions?: string[];
  isWhatsAppFallback?: boolean;
  timestamp: string;
}

export function parseCustomerQuery(query: string): {
  matchedProducts: Product[];
  responseMessage: string;
  isWhatsAppFallback: boolean;
  suggestions: string[];
} {
  const q = query.toLowerCase().trim();

  // 1. Sizing Guide Enquiry
  if (q.includes('size') || q.includes('sizing') || q.includes('measurement') || q.includes('fit')) {
    return {
      matchedProducts: [],
      responseMessage: "Our children's sizing runs true to standard European/UK ages. For fast-growing kids or between sizes, we recommend sizing up one year for comfort. Here are our standard guidelines:\n\n• Toddlers (18M - 3T): Roomy diaper cut\n• 4Y - 6Y: Fits height 104cm - 116cm\n• 7Y - 9Y: Fits height 122cm - 134cm\n• 10Y - 13Y: Tailored pre-teen cuts\n\nWould you like recommendations for a specific age or child?",
      isWhatsAppFallback: false,
      suggestions: [
        "Find dresses for 5-year-old",
        "Outfits for 7-year-old boy",
        "Baby gifts under ₦20,000"
      ]
    };
  }

  // 2. Delivery & Location Enquiry
  if (q.includes('delivery') || q.includes('shipping') || q.includes('lagos') || q.includes('abuja') || q.includes('dispatch') || q.includes('where are you')) {
    return {
      matchedProducts: [],
      responseMessage: "In this boutique showcase, we support fast doorstep delivery across Lagos (1-2 business days) and nationwide dispatch via registered courier (2-4 business days). Orders over ₦50,000 qualify for complimentary delivery! You can also finalize express dispatch directly through our WhatsApp hotline.",
      isWhatsAppFallback: false,
      suggestions: [
        "View featured partywear",
        "Chat with boutique on WhatsApp",
        "Show gifts under ₦15,000"
      ]
    };
  }

  // 3. Human WhatsApp / Talk to representative
  if (q.includes('human') || q.includes('real person') || q.includes('speak') || q.includes('call') || q.includes('whatsapp') || q.includes('talk to someone')) {
    return {
      matchedProducts: [],
      responseMessage: "You can connect directly with our head boutique stylist right on WhatsApp! We can verify exact measurements, arrange bespoke gift wrapping, or send live video previews of the outfits.",
      isWhatsAppFallback: true,
      suggestions: [
        "🎂 Birthday dress for 5yo girl",
        "🤵 Formal boys outfits",
        "Browse full collection"
      ]
    };
  }

  // 4. Extraction of constraints
  // Budget
  let budgetLimit: number | null = null;
  const budgetKMatch = q.match(/(?:under|below|less than|budget of|max|within)\s*(?:₦|ngn)?\s*(\d+)(?:\s*k\b|\s*,?000\b)/i);
  if (budgetKMatch) {
    const val = parseInt(budgetKMatch[1], 10);
    budgetLimit = val < 1000 ? val * 1000 : val;
  } else {
    const plainNumMatch = q.match(/(?:under|below|budget of|max)\s*(?:₦|ngn)?\s*(\d{4,6})/i);
    if (plainNumMatch) {
      budgetLimit = parseInt(plainNumMatch[1], 10);
    }
  }

  // Age extraction
  let targetAge: number | null = null;
  const ageMatch = q.match(/(\d{1,2})\s*(?:years?|yrs?|yr|yo|year old|yr old)/i);
  if (ageMatch) {
    targetAge = parseInt(ageMatch[1], 10);
  } else if (q.includes('toddler') || q.includes('baby') || q.includes('infant') || q.includes('1 year') || q.includes('2 year')) {
    targetAge = 2;
  } else if (q.includes('pre-teen') || q.includes('teen') || q.includes('11') || q.includes('12') || q.includes('13')) {
    targetAge = 11;
  }

  // Gender extraction
  let targetGender: 'girls' | 'boys' | 'all' = 'all';
  if (q.includes('girl') || q.includes('daughter') || q.includes('niece') || q.includes('princess') || q.includes('dress') || q.includes('skirt') || q.includes('tutu')) {
    targetGender = 'girls';
  } else if (q.includes('boy') || q.includes('son') || q.includes('nephew') || q.includes('gentleman') || q.includes('blazer') || q.includes('vest') || q.includes('chinos')) {
    targetGender = 'boys';
  } else if (q.includes('sibling') || q.includes('twins') || q.includes('brother and sister') || q.includes('matching')) {
    targetGender = 'all';
  }

  // Category & Keywords
  const isBirthday = q.includes('birthday') || q.includes('bday') || q.includes('party') || q.includes('gown');
  const isMatching = q.includes('matching') || q.includes('sibling') || q.includes('set') || q.includes('duo');
  const isShoes = q.includes('shoe') || q.includes('hair') || q.includes('bow') || q.includes('accessory') || q.includes('accessories');
  const isBaby = q.includes('baby') || q.includes('romper') || q.includes('toddler');

  // Grounded Filter against real catalogue
  let results = DEMO_PRODUCTS.filter((product) => {
    // Budget check
    if (budgetLimit !== null && product.price > budgetLimit) {
      return false;
    }

    // Age check
    if (targetAge !== null) {
      if (targetAge < product.ageMin || targetAge > product.ageMax) {
        return false;
      }
    }

    // Gender check
    if (targetGender === 'girls' && product.gender === 'boys') return false;
    if (targetGender === 'boys' && product.gender === 'girls') return false;

    // Specific category keywords if explicitly present
    if (isBirthday && !product.tags.includes('birthday') && !product.tags.includes('partywear')) {
      return false;
    }
    if (isMatching && product.category !== 'matching-sets') {
      return false;
    }
    if (isShoes && product.category !== 'shoes-accessories') {
      return false;
    }
    if (isBaby && product.category !== 'baby' && product.ageMin > 3) {
      return false;
    }

    return true;
  });

  // Fallback relaxation if no strict match
  if (results.length === 0 && (budgetLimit || targetAge || targetGender !== 'all')) {
    results = DEMO_PRODUCTS.filter((product) => {
      if (budgetLimit && product.price <= budgetLimit) return true;
      if (targetAge && targetAge >= product.ageMin && targetAge <= product.ageMax) return true;
      if (targetGender !== 'all' && product.gender === targetGender) return true;
      return false;
    }).slice(0, 3);
  }

  // Format tailored response text
  if (results.length > 0) {
    let intro = "Delighted to help you! ✨ ";
    if (targetAge && targetGender !== 'all' && isBirthday) {
      intro += `Here are stunning birthday and celebration picks curated for a ${targetAge}-year-old ${targetGender === 'girls' ? 'girl' : 'boy'}`;
    } else if (targetAge && targetGender !== 'all') {
      intro += `Here are handpicked styles perfect for a ${targetAge}-year-old ${targetGender === 'girls' ? 'little lady' : 'young gentleman'}`;
    } else if (isMatching) {
      intro += "Here are our most beloved matching sibling and coordinated outfits:";
    } else if (budgetLimit) {
      intro += `Here are exquisite pieces fitting comfortably within your ${formatPrice(budgetLimit)} budget:`;
    } else {
      intro += "Here are curated pieces from our boutique catalogue matching your request:";
    }

    if (budgetLimit) {
      intro += ` (all under ${formatPrice(budgetLimit)})`;
    }
    intro += ":";

    return {
      matchedProducts: results.slice(0, 3),
      responseMessage: intro,
      isWhatsAppFallback: false,
      suggestions: [
        "Tell me about sizing for these",
        "Do you have matching accessories?",
        "Chat with boutique on WhatsApp"
      ]
    };
  }

  // Generic / Unsupported question fallback
  return {
    matchedProducts: DEMO_PRODUCTS.filter(p => p.isFeatured).slice(0, 2),
    responseMessage: "I want to make sure you get the exact pieces you're picturing! I couldn't find an exact match for those specific terms in our sample catalogue, but here are our most popular featured items. You can also chat directly with our stylist on WhatsApp for bespoke assistance.",
    isWhatsAppFallback: true,
    suggestions: [
      "🎂 Birthday dress for 5yo girl",
      "🤵 3-piece linen vest for boys",
      "👫 Brother & Sister matching set"
    ]
  };
}
