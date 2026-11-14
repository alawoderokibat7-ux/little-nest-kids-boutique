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

  // 1. Returns, Exchanges & Store Policies (Direct Policy Route)
  if (
    q.includes('return') || 
    q.includes('refund') || 
    q.includes('exchange') || 
    q.includes('policy') || 
    q.includes('cancel') ||
    q.includes('damaged') ||
    q.includes('defect')
  ) {
    return {
      matchedProducts: [],
      responseMessage: 
`Crown & Coral Kids Royal Exchange & Return Guidelines:

• Size & Style Exchanges: We gladly accept size exchanges for unworn, unwashed pieces with all original tags attached within 3 business days of delivery in Lagos (5 business days for nationwide deliveries).
• Quality Guarantee: Every garment is hand-inspected before gift-boxing. If you receive an item with an unexpected defect, we arrange swift courier pickup and free replacement.
• Non-Returnable Items: For hygiene reasons, hair accessories, socks, and baby intimate sets cannot be returned once unsealed.
• Order Cancellations: Orders can be amended or cancelled prior to courier dispatch by contacting our team.

Would you like to speak directly with our boutique concierge on WhatsApp regarding an order?`,
      isWhatsAppFallback: true,
      suggestions: [
        "Chat with boutique on WhatsApp",
        "View Sizing Guide",
        "Delivery & Shipping Info"
      ]
    };
  }

  // 2. Sizing Guide Enquiry
  if (q.includes('size') || q.includes('sizing') || q.includes('measurement') || q.includes('fit') || q.includes('chart')) {
    return {
      matchedProducts: [],
      responseMessage: 
`Our children's sizing is tailored true to standard European/UK ages. For fast-growing kids or between sizes, we recommend sizing up one year for optimal comfort. Here are our standard guidelines:

• Toddlers (18M - 3T): Roomy diaper cut & elasticated waists
• Young Children (4Y - 6Y): Fits height 104cm - 116cm
• Older Kids (7Y - 9Y): Fits height 122cm - 134cm
• Pre-Teens (10Y - 13Y): Tailored adolescent silhouettes

Would you like recommendations for a specific age or child?`,
      isWhatsAppFallback: false,
      suggestions: [
        "Find dresses for 5-year-old girl",
        "Outfits for 8-year-old boy",
        "Baby gifts under ₦25,000"
      ]
    };
  }

  // 3. Delivery, Shipping & Dispatch Enquiry
  if (
    q.includes('delivery') || 
    q.includes('shipping') || 
    q.includes('dispatch') || 
    q.includes('lagos') || 
    q.includes('abuja') || 
    q.includes('where are you') || 
    q.includes('how long') || 
    q.includes('courier')
  ) {
    return {
      matchedProducts: [],
      responseMessage: 
`Delivery & Fulfillment Information (Demo Showcase):

• Lagos Doorstep Delivery: 1–2 business days via dedicated boutique courier.
• Nationwide Dispatch (Abuja, Port Harcourt, Other States): 2–4 business days via registered courier.
• Complimentary Delivery: Orders of ₦50,000 and above qualify for free delivery nationwide!
• Express Tracking: Simulated dispatch notifications keep you informed from gift boxing to final delivery.

Would you like to browse our collection or ask about a specific outfit?`,
      isWhatsAppFallback: false,
      suggestions: [
        "View featured partywear",
        "Chat with boutique on WhatsApp",
        "Browse dresses for girls"
      ]
    };
  }

  // 4. Payment & Checkout Enquiry
  if (q.includes('payment') || q.includes('how to pay') || q.includes('pay on delivery') || q.includes('pos') || q.includes('bank transfer')) {
    return {
      matchedProducts: [],
      responseMessage: 
`Payment Options at Crown & Coral Kids (The Royal Children's Atelier):

• Pay on Delivery: Cash or POS transfer upon doorstep delivery within covered Lagos zones.
• Bank Transfer: Direct transfer upon invoice confirmation.
• Online Debit Card: Secure checkout with instant receipt generation.

Note: In this client showcase demo, payment integrations and order confirmations are simulated without real financial charges.`,
      isWhatsAppFallback: false,
      suggestions: [
        "Start Shopping",
        "Chat with boutique on WhatsApp",
        "View Sizing Guide"
      ]
    };
  }

  // 5. Human Stylist / Direct WhatsApp Support
  if (
    q.includes('human') || 
    q.includes('real person') || 
    q.includes('speak') || 
    q.includes('call') || 
    q.includes('whatsapp') || 
    q.includes('talk to someone') ||
    q.includes('contact') ||
    q.includes('phone')
  ) {
    return {
      matchedProducts: [],
      responseMessage: 
`You can connect directly with our head boutique concierge on WhatsApp! We can verify exact measurements, arrange bespoke gift wrapping, or send real-time video previews of pieces before dispatch.

(Demo Notice: In this showcase, the WhatsApp link formats a prefilled order enquiry to the boutique's demo line).`,
      isWhatsAppFallback: true,
      suggestions: [
        "🎂 Birthday dress for 5yo girl",
        "🤵 Formal boys outfits",
        "Browse full catalogue"
      ]
    };
  }

  // 6. Extraction of Constraints
  // Budget limit extraction
  let budgetLimit: number | null = null;
  // Check for '5k', '20k' patterns
  const kMatch = q.match(/(?:under|below|less than|budget of|max|within|upto|up to)\s*(?:₦|ngn|naira)?\s*(\d+(?:\.\d+)?)\s*k\b/i);
  if (kMatch) {
    budgetLimit = parseFloat(kMatch[1]) * 1000;
  } else {
    // Check for standard numbers e.g. 5000, 5,000, 20000
    const numMatch = q.match(/(?:under|below|less than|budget of|max|within|upto|up to)\s*(?:₦|ngn|naira)?\s*(\d{1,3}(?:,\d{3})+|\d{3,6})/i);
    if (numMatch) {
      budgetLimit = parseInt(numMatch[1].replace(/,/g, ''), 10);
    }
  }

  // Age extraction
  let targetAge: number | null = null;
  const ageMatch = q.match(/(\d{1,2})\s*(?:years?\s*old|yrs?\s*old|yr\s*old|years?|yrs?|yr|yo)\b/i);
  if (ageMatch) {
    targetAge = parseInt(ageMatch[1], 10);
  } else if (q.includes('toddler') || q.includes('infant')) {
    targetAge = 2;
  } else if (q.includes('baby') || q.includes('newborn')) {
    targetAge = 1;
  } else if (q.includes('pre-teen') || q.includes('preteen') || q.includes('teen')) {
    targetAge = 11;
  }

  // Gender extraction
  let targetGender: 'girls' | 'boys' | 'all' = 'all';
  const isGirlQuery = /\b(girl|girls|daughter|daughters|niece|nieces|princess|princesses|dress|dresses|gown|gowns|skirt|skirts|tutu|tulle)\b/i.test(q);
  const isBoyQuery = /\b(boy|boys|son|sons|nephew|nephews|gentleman|blazer|blazers|vest|vests|chino|chinos|suspenders|oxford)\b/i.test(q);
  const isSiblingQuery = /\b(sibling|siblings|twins|twin|brother and sister|sister and brother|matching)\b/i.test(q);

  if (isSiblingQuery) {
    targetGender = 'all';
  } else if (isGirlQuery && !isBoyQuery) {
    targetGender = 'girls';
  } else if (isBoyQuery && !isGirlQuery) {
    targetGender = 'boys';
  }

  // Category and Keyword intents
  const isBirthday = /\b(birthday|bday|party|partywear|celebration|wedding|festive)\b/i.test(q);
  const isDress = /\b(dress|dresses|gown|gowns|skirt|skirts|tutu|tulle)\b/i.test(q);
  const isMatching = /\b(matching|sibling|duo|set|sets|coordinated)\b/i.test(q);
  const isShoesOrAcc = /\b(shoe|shoes|mary jane|accessory|accessories|bow|bows|ribbon|hair)\b/i.test(q);
  const isBaby = /\b(baby|infant|romper|cardigan|newborn)\b/i.test(q);

  // 7. Strict Catalogue Filtering (Never violate user constraints!)
  const strictlyMatched = DEMO_PRODUCTS.filter((product) => {
    // A. Strict Budget: Reject anything exceeding the budget
    if (budgetLimit !== null && product.price > budgetLimit) {
      return false;
    }

    // B. Strict Age: Product must accommodate the requested age
    if (targetAge !== null) {
      if (targetAge < product.ageMin || targetAge > product.ageMax) {
        return false;
      }
    }

    // C. Strict Gender: Reject opposite gender items
    if (targetGender === 'girls') {
      if (product.gender !== 'girls' && product.gender !== 'unisex') {
        return false;
      }
    } else if (targetGender === 'boys') {
      if (product.gender !== 'boys' && product.gender !== 'unisex') {
        return false;
      }
    }

    // D. Specific Category Filtering
    if (isDress) {
      const isDressProduct = 
        product.category === 'dresses-partywear' ||
        product.category === 'birthday' ||
        product.tags.includes('dresses') ||
        product.tags.includes('partywear') ||
        product.name.toLowerCase().includes('dress') ||
        product.name.toLowerCase().includes('gown') ||
        product.name.toLowerCase().includes('skirt');
      if (!isDressProduct) return false;
    }

    if (isBirthday) {
      const isPartyProduct = 
        product.category === 'birthday' ||
        product.category === 'dresses-partywear' ||
        product.tags.includes('birthday') ||
        product.tags.includes('partywear');
      if (!isPartyProduct) return false;
    }

    if (isMatching && product.category !== 'matching-sets') {
      return false;
    }

    if (isShoesOrAcc && product.category !== 'shoes-accessories') {
      return false;
    }

    if (isBaby && product.category !== 'baby' && product.ageMin > 2) {
      return false;
    }

    return true;
  });

  // 8. If strict matches are found, return them truthfully
  if (strictlyMatched.length > 0) {
    let intro = "Delighted to assist you! ✨ ";
    if (targetAge && targetGender === 'girls' && (isBirthday || isDress)) {
      intro += `Here are elegant birthday and celebration dresses curated for a ${targetAge}-year-old girl`;
    } else if (targetAge && targetGender === 'boys') {
      intro += `Here are tailored boutique outfits crafted for a ${targetAge}-year-old young gentleman`;
    } else if (targetAge && targetGender !== 'all') {
      intro += `Here are pieces selected for a ${targetAge}-year-old ${targetGender === 'girls' ? 'little lady' : 'young gentleman'}`;
    } else if (isMatching) {
      intro += "Here are our coordinated matching sets and sibling duos:";
    } else if (isBirthday) {
      intro += "Here are celebration and birthday pieces from our boutique:";
    } else {
      intro += "Here are pieces from our boutique catalogue matching your request:";
    }

    if (budgetLimit !== null) {
      intro += ` (all within your ${formatPrice(budgetLimit)} budget):`;
    } else {
      intro += ":";
    }

    return {
      matchedProducts: strictlyMatched.slice(0, 3),
      responseMessage: intro,
      isWhatsAppFallback: false,
      suggestions: [
        "Tell me about sizing for these",
        "Do you have matching accessories?",
        "Chat with boutique on WhatsApp"
      ]
    };
  }

  // 9. If ZERO matches found under the constraints:
  // Give an honest, transparent explanation without breaking budget or recommending wrong gender!
  if (budgetLimit !== null) {
    // Find relevant items for the requested category regardless of budget to inform the customer
    const sameCategoryCandidates = DEMO_PRODUCTS.filter((product) => {
      if (targetGender === 'girls' && product.gender === 'boys') return false;
      if (targetGender === 'boys' && product.gender === 'girls') return false;
      if (targetAge !== null && (targetAge < product.ageMin || targetAge > product.ageMax)) return false;
      if (isDress && !product.tags.includes('dresses') && product.category !== 'dresses-partywear' && product.category !== 'birthday') return false;
      return true;
    });

    const lowestPrice = sameCategoryCandidates.length > 0 
      ? Math.min(...sameCategoryCandidates.map((p) => p.price))
      : 8500;

    let response = `I searched our boutique collection, but we currently do not have any ${isDress || isBirthday ? 'celebration dresses' : 'outfits'}`;
    if (targetAge) {
      response += ` for a ${targetAge}-year-old`;
    }
    if (targetGender === 'girls') {
      response += ` girl`;
    } else if (targetGender === 'boys') {
      response += ` boy`;
    }
    response += ` under ${formatPrice(budgetLimit)}.`;

    response += `\n\nOur handcrafted ${targetGender === 'girls' ? "girls' dresses" : "boutique pieces"} in this category begin at ${formatPrice(lowestPrice)} (such as the ${sameCategoryCandidates[0]?.name || "Blossom Petal Tulle Party Dress"}). Accessories like our satin hair bow sets begin at ₦8,500.`;
    response += `\n\nWould you like to explore our available styles starting at ${formatPrice(lowestPrice)}, or consult with our stylist on WhatsApp?`;

    return {
      matchedProducts: [], // Strictly NO misleading results!
      responseMessage: response,
      isWhatsAppFallback: true,
      suggestions: [
        `Show pieces starting at ${formatPrice(lowestPrice)}`,
        "View Hair Accessories (₦8,500)",
        "Chat with boutique on WhatsApp"
      ]
    };
  }

  // Zero match due to age or category
  if (targetAge !== null || targetGender !== 'all' || isDress || isBirthday) {
    let msg = "I couldn't find an exact match for that combination in our current boutique inventory.";
    if (targetAge && targetAge > 13) {
      msg = `Crown & Coral specializes in children from newborn up to 13 years old. We do not currently carry collections for ages above 13.`;
    } else {
      msg = `We don't currently have an item matching those exact specifications in our sample catalogue. Would you like to view our full collection or chat with our stylist to check upcoming arrivals?`;
    }

    return {
      matchedProducts: [],
      responseMessage: msg,
      isWhatsAppFallback: true,
      suggestions: [
        "Browse all Girls dresses",
        "Browse all Boys outfits",
        "Chat on WhatsApp"
      ]
    };
  }

  // Generic fallback enquiry
  return {
    matchedProducts: DEMO_PRODUCTS.filter((p) => p.isFeatured).slice(0, 2),
    responseMessage: "I want to make sure you find the perfect outfit! Here are our most beloved featured pieces from the boutique showcase, or you can speak directly with our stylist on WhatsApp for personalized assistance.",
    isWhatsAppFallback: true,
    suggestions: [
      "🎂 Birthday dress for 5yo girl",
      "🤵 3-piece linen vest for boys",
      "👫 Brother & Sister matching set"
    ]
  };
}
