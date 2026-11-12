import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, ShoppingBag, Check, MessageCircle, ExternalLink } from 'lucide-react';
import { AssistantMessage, parseCustomerQuery } from '../../utils/aiAssistant';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { STORE_CONFIG } from '../../data/products';

export const AIAssistantWidget: React.FC = () => {
  const { addToCart, isAIOpen, setIsAIOpen } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [addedItemMap, setAddedItemMap] = useState<{ [key: string]: boolean }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAIOpen) {
      setIsOpen(true);
    }
  }, [isAIOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setIsAIOpen(false);
  };

  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: "Hello! 👋 I'm your Little Nest shopping concierge.\n\nLooking for something specific? Ask me about children's sizes, age-appropriate picks, or budget recommendations (e.g. *'Birthday dress for a 5yo girl under ₦25,000'*).",
      suggestions: [
        "🎂 Birthday dress for 5yo girl",
        "🤵 Formal linen set for 6yo boy",
        "👫 Matching sibling outfits",
        "📏 Sizing & fit guide"
      ],
      timestamp: 'Just now'
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMessage: AssistantMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const parsed = parseCustomerQuery(query);

      const aiResponse: AssistantMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: parsed.responseMessage,
        matchedProducts: parsed.matchedProducts,
        isWhatsAppFallback: parsed.isWhatsAppFallback,
        suggestions: parsed.suggestions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 600);
  };

  const handleQuickAdd = (product: Product, size: string) => {
    if (addToCart(product, size, 1)) {
      setAddedItemMap((prev) => ({ ...prev, [product.id]: true }));
      setTimeout(() => {
        setAddedItemMap((prev) => ({ ...prev, [product.id]: false }));
      }, 2000);
    }
  };

  return (
    <>
      {/* Floating Button for Desktop Screens */}
      {!isOpen && (
        <div className="hidden lg:block fixed bottom-5 right-6 z-40">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/90 backdrop-blur-xl border border-white text-crystal-dark shadow-glass-card hover:shadow-glass-hover hover:scale-105 active:scale-95 transition-all duration-300"
            aria-label="Open AI Shopping Concierge"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-crystal-rose to-crystal-violet text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="text-left pr-1">
              <span className="block text-xs font-bold leading-tight text-crystal-dark">
                AI Stylist
              </span>
              <span className="block text-[10px] text-crystal-slate">
                Need fit help?
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 ring-2 ring-white" />
          </button>
        </div>
      )}

      {/* Floating Crystal Glass Chat Drawer - Responsive Mobile Sheet */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-5 sm:right-6 z-50 flex flex-col justify-end sm:justify-start bg-black/40 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none">
          <div className="w-full sm:w-[400px] h-[85vh] sm:h-[540px] max-h-[85vh] sm:max-h-[82vh] bg-white/95 backdrop-blur-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-white flex flex-col overflow-hidden animate-fadeIn">
            
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-crystal-canvas via-white to-crystal-rose-glow/60 border-b border-crystal-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-crystal-rose to-crystal-violet text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif font-bold text-xs text-crystal-dark">
                      Little Nest AI Concierge
                    </h3>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-[10px] text-crystal-muted">
                    Boutique Catalogue Assistant
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-xl text-crystal-muted hover:text-crystal-dark hover:bg-crystal-canvas transition"
                aria-label="Close assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-crystal-canvas/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-crystal-rose-glow text-crystal-rose flex items-center justify-center flex-shrink-0 shadow-2xs mt-1">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className="max-w-[85%] space-y-2">
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-crystal-dark text-white rounded-tr-xs shadow-xs'
                        : 'bg-white text-crystal-dark rounded-tl-xs shadow-sm border border-crystal-border'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Matched Product Cards */}
                  {msg.matchedProducts && msg.matchedProducts.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {msg.matchedProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className="p-2.5 bg-white rounded-2xl border border-crystal-border shadow-xs flex gap-2.5 items-center hover:border-crystal-rose/40 transition"
                        >
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-12 h-14 object-cover rounded-xl bg-crystal-canvas flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif text-[11px] font-bold text-crystal-dark truncate">
                              {prod.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-crystal-rose font-bold">
                                {formatPrice(prod.price)}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.5 bg-crystal-canvas text-crystal-slate rounded">
                                {prod.ageRange}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 mt-2">
                              <Link
                                to={`/product/${prod.id}`}
                                onClick={() => setIsOpen(false)}
                                className="px-2 py-0.5 rounded-lg bg-crystal-canvas hover:bg-white text-[10px] font-semibold text-crystal-dark border border-crystal-border transition"
                              >
                                View
                              </Link>
                              <button
                                onClick={() => handleQuickAdd(prod, prod.availableSizes[0])}
                                className="px-2 py-0.5 rounded-lg bg-crystal-dark hover:bg-crystal-rose text-white text-[10px] font-semibold transition flex items-center gap-1"
                              >
                                {addedItemMap[prod.id] ? (
                                  <>
                                    <Check className="w-2.5 h-2.5" /> Added!
                                  </>
                                ) : (
                                  <>
                                    <ShoppingBag className="w-2.5 h-2.5" /> Add ({prod.availableSizes[0]})
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* WhatsApp Direct Hand-off Card */}
                  {msg.isWhatsAppFallback && (
                    <div className="p-3 bg-emerald-50/90 rounded-2xl border border-emerald-200/80 space-y-2 text-left">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                          <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-[#25D366]" />
                          <span>WhatsApp Stylist (Demo)</span>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                          Demo Line
                        </span>
                      </div>
                      <p className="text-[10px] text-emerald-900/90 leading-tight">
                        Direct concierge assistance. Connects to the boutique's configured demo line (+234 800 000 0000).
                      </p>
                      <a
                        href={`https://wa.me/${STORE_CONFIG.demoWhatsAppNumber}?text=${encodeURIComponent("Hello Little Nest! I have a boutique styling enquiry from your website showcase.")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20BE5C] text-white text-[11px] font-bold shadow-2xs transition"
                      >
                        <MessageCircle className="w-3 h-3 fill-current" />
                        <span>Open Demo WhatsApp Chat</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                      </a>
                    </div>
                  )}

                  {/* Suggestions Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {msg.suggestions.map((sug) => (
                        <button
                          key={sug}
                          onClick={() => handleSend(sug)}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white hover:bg-crystal-rose-glow text-crystal-slate hover:text-crystal-rose border border-crystal-border shadow-2xs transition"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="block text-[9px] text-crystal-muted text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-crystal-muted">
                <div className="w-5 h-5 rounded-full bg-crystal-rose-glow flex items-center justify-center">
                  <Bot className="w-3 h-3 text-crystal-rose" />
                </div>
                <div className="p-2 bg-white rounded-2xl shadow-xs border border-crystal-border flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-crystal-rose rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-crystal-rose rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-crystal-rose rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-crystal-border flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about sizes, birthday gowns..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 px-3 py-2 bg-crystal-canvas focus:bg-white text-xs border border-crystal-border rounded-xl focus:outline-none focus:ring-2 focus:ring-crystal-rose/40 transition shadow-inner"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="p-2 rounded-xl crystal-btn-primary disabled:opacity-40 text-white transition shadow-sm active:scale-95"
              aria-label="Send query"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          </div>
        </div>
      )}
    </>
  );
};
