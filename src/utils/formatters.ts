import { CartItem, Product } from '../types';
import { STORE_CONFIG } from '../data/products';

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount).replace('NGN', '₦');
}

export function generateSingleProductWhatsAppMessage(
  product: Product,
  selectedSize: string,
  quantity: number
): { text: string; url: string } {
  const lineTotal = formatPrice(product.price * quantity);
  const text = 
`Hello ${STORE_CONFIG.brandName}! 👋

I am interested in ordering this piece from your online boutique showcase:

🛍️ *Product:* ${product.name}
🏷️ *ID:* ${product.id}
📏 *Selected Size:* ${selectedSize}
🔢 *Quantity:* ${quantity}
💰 *Price:* ${formatPrice(product.price)} each (Total: ${lineTotal})

Could you please confirm if this size is currently available and what the delivery options are? Thank you! ✨`;

  const encoded = encodeURIComponent(text);
  const url = `https://wa.me/${STORE_CONFIG.demoWhatsAppNumber}?text=${encoded}`;

  return { text, url };
}

export function generateCartWhatsAppMessage(
  items: CartItem[],
  subtotal: number
): { text: string; url: string } {
  let itemList = '';
  items.forEach((item, index) => {
    itemList += `${index + 1}. *${item.product.name}*\n   Size: ${item.selectedSize} | Qty: ${item.quantity} | ${formatPrice(item.product.price * item.quantity)}\n`;
  });

  const text = 
`Hello ${STORE_CONFIG.brandName}! 👋

I have assembled an order enquiry from your website catalogue:

📋 *MY ORDER SUMMARY:*
${itemList}
─────────────────────
💵 *ESTIMATED TOTAL:* ${formatPrice(subtotal)}

Could you please check availability for these items and advise on delivery fees and payment? Looking forward to your response! 💛`;

  const encoded = encodeURIComponent(text);
  const url = `https://wa.me/${STORE_CONFIG.demoWhatsAppNumber}?text=${encoded}`;

  return { text, url };
}
