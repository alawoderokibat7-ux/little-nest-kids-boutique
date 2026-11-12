import React, { useState } from 'react';
import { X, MessageCircle, Copy, Check, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { CartItem, Product } from '../../types';
import { generateSingleProductWhatsAppMessage, generateCartWhatsAppMessage } from '../../utils/formatters';

interface WhatsAppModalProps {
  product?: Product;
  selectedSize?: string;
  quantity?: number;
  cartItems?: CartItem[];
  cartSubtotal?: number;
  onClose: () => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  product,
  selectedSize = '',
  quantity = 1,
  cartItems,
  cartSubtotal = 0,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  // Generate appropriate message based on single product or entire cart
  const { text: messageText, url: whatsAppUrl } = cartItems
    ? generateCartWhatsAppMessage(cartItems, cartSubtotal)
    : product
    ? generateSingleProductWhatsAppMessage(product, selectedSize, quantity)
    : { text: '', url: '' };

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-white/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-boutique-border/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shadow-xs">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-boutique-charcoal">
                WhatsApp Order Enquiry
              </h3>
              <p className="text-xs text-boutique-taupe">
                {cartItems ? 'Full Cart Order Breakdown' : 'Single Item Availability Check'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-boutique-muted hover:text-boutique-charcoal rounded-xl hover:bg-boutique-sand transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-4">
          {/* Client Explainer Card */}
          <div className="p-3 bg-boutique-blush/60 rounded-2xl border border-boutique-border/60 text-xs text-boutique-taupe flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-boutique-rose flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-boutique-charcoal">Why your client will love this:</span>
              <p className="mt-0.5 text-[11px] leading-relaxed">
                Parents don't like friction. In Nigeria and modern retail, tapping this automatically formats all product names, selected sizes, quantities, and totals into WhatsApp so the boutique owner can close sales in minutes without back-and-forth questions.
              </p>
            </div>
          </div>

          {/* Formatted Message Preview Box */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-boutique-charcoal mb-1.5">
              <span>Generated Message Preview:</span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] text-boutique-rose hover:text-boutique-rose-hover font-bold"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Text
                  </>
                )}
              </button>
            </div>
            <div className="bg-[#EFEAE2] p-3.5 rounded-2xl border border-[#DFD7CC] text-xs font-mono text-stone-800 whitespace-pre-wrap max-h-48 overflow-y-auto shadow-inner leading-relaxed select-all">
              {messageText}
            </div>
          </div>

          {/* Demonstration Notice */}
          <div className="flex items-start gap-2 text-[11px] text-boutique-taupe bg-amber-50/70 p-3 rounded-xl border border-amber-200/80">
            <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="leading-tight space-y-0.5">
              <span className="font-bold text-amber-950 block">Demo Message Preview Mode:</span>
              <span>
                Formatted for testing with demo placeholder recipient (+234 800 000 0000). For live boutique launch, configure the owner's verified WhatsApp Business number in store settings.
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-3 border-t border-boutique-border/60">
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BE5C] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98"
          >
            <MessageCircle className="w-4 h-4 fill-current" /> Send Directly via WhatsApp
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-boutique-sand hover:bg-white text-boutique-charcoal font-semibold text-xs border border-boutique-border transition shadow-xs"
          >
            {copied ? 'Copied!' : 'Copy Text Only'}
          </button>
        </div>
      </div>
    </div>
  );
};
