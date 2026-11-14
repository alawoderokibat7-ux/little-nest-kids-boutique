import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Truck, 
  HelpCircle, 
  Phone, 
  ExternalLink,
  ChevronRight,
  Clock,
  Check
} from 'lucide-react';
import { useSupport } from '../../context/SupportContext';
import { useOrders } from '../../context/OrdersContext';
import { formatPrice } from '../../utils/formatters';
import { Link } from 'react-router-dom';

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  time: string;
  quickActions?: { label: string; action: () => void }[];
}

export const LiveSupportChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'ticket' | 'track'>('chat');
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { addTicket } = useSupport();
  const { orders } = useOrders();

  // Support Ticket Form State
  const [ticketName, setTicketName] = useState('');
  const [ticketPhone, setTicketPhone] = useState('');
  const [ticketQuestion, setTicketQuestion] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  // Quick Tracking state in widget
  const [trackCode, setTrackCode] = useState('');
  const [trackResult, setTrackResult] = useState<any>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: "Hello! Welcome to Crown & Coral Royal Children's Atelier 👋\n\nHow may our royal concierge assist you today? You can ask about sizes for ages 1–13, express Lagos delivery, or connect with our human stylist.",
      time: 'Just now',
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let replyText = '';

      if (lower.includes('deliver') || lower.includes('shipping') || lower.includes('lagos')) {
        replyText = "🚚 **Delivery Guidelines:**\n• Lagos Island (Lekki, Ikoyi, VI): Same-day / 24h dispatch (₦2,500)\n• Lagos Mainland (Ikeja, Surulere): 24–48h\n• Abuja & Nationwide: 2–3 days via priority courier.\n• Free shipping on orders over ₦50,000!";
      } else if (lower.includes('size') || lower.includes('age') || lower.includes('fit') || lower.includes('year')) {
        replyText = "📏 **Atelier Sizing:**\nOur pieces are tailored for ages 1 to 13. If your child is between sizes or taller than average, we recommend sizing up by 1 year. Every dress features adjustable sashes and soft 100% cotton linings.";
      } else if (lower.includes('payment') || lower.includes('transfer') || lower.includes('card') || lower.includes('pay on delivery')) {
        replyText = "💳 **Payment Options:**\n• **Direct Bank Transfer:** GTBank Atelier Account with instant confirmation.\n• **Debit Card:** Paystack 3D-Secure (Mastercard, Visa, Verve).\n• **Pay on Delivery:** Available with Moniepoint POS or cash on doorstep arrival.";
      } else if (lower.includes('whatsapp') || lower.includes('human') || lower.includes('call') || lower.includes('talk')) {
        replyText = "💬 **Connect with a Stylist:**\nOur concierge is active on WhatsApp! Click the button below to message our styling team directly.";
      } else {
        replyText = "Thank you for asking! Our boutique concierge is reviewing this. You can also leave your question in our Support Ticket tab, and our staff will message you back on WhatsApp within minutes!";
      }

      const botReply: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 700);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketName.trim() || !ticketPhone.trim() || !ticketQuestion.trim()) return;

    addTicket({
      customerName: ticketName,
      phone: ticketPhone,
      subject: 'Inquiry via Support Chat Box',
      message: ticketQuestion,
      channel: 'chat_widget',
    });

    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setTicketName('');
      setTicketPhone('');
      setTicketQuestion('');
      setActiveTab('chat');
      // Add confirmation message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: `tck-conf-${Date.now()}`,
          sender: 'assistant',
          text: `✅ Thank you, ${ticketName}! Your support ticket has been sent straight to our boutique owner & staff portal. We will contact you on ${ticketPhone} shortly.`,
          time: 'Just now',
        },
      ]);
    }, 1800);
  };

  const handleWidgetTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackCode.trim()) return;

    const cleaned = trackCode.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === cleaned ||
        o.phone.replace(/[^0-9]/g, '').includes(cleaned.replace(/[^0-9]/g, ''))
    );

    setTrackResult(found || 'not_found');
  };

  return (
    <>
      {/* Floating 3D Support Chat Trigger Button */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative p-3.5 sm:p-4 rounded-full bg-boutique-charcoal text-white hover:bg-black shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2.5 border border-white/30 backdrop-blur-md"
          aria-label="Open Boutique Support"
        >
          {/* Subtle pulsating live glow */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
          </span>

          {isOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <>
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-boutique-rose-light" />
              <span className="text-xs font-bold tracking-wide hidden sm:inline pr-1">
                Atelier Support
              </span>
            </>
          )}
        </button>
      </div>

      {/* Floating 3D Support Chat Box Window */}
      {isOpen && (
        <div className="fixed bottom-28 lg:bottom-24 right-4 sm:right-6 w-[94vw] sm:w-[410px] h-[540px] max-h-[82vh] bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/80 z-50 flex flex-col overflow-hidden animate-fadeIn text-boutique-charcoal">
          
          {/* Widget Header */}
          <div className="bg-gradient-to-r from-[#06281E] via-[#0A3327] to-[#06281E] text-white p-4 flex items-center justify-between flex-shrink-0 border-b border-accent/30">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-accent text-[#06281E] flex items-center justify-center font-serif font-bold text-sm shadow-inner">
                CC
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif font-bold text-sm leading-tight text-white">Crown & Coral Concierge</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <span className="text-[10px] text-accent/80 block">Royal Stylist · Online</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subheader Navigation Pills */}
          <div className="flex items-center justify-between p-1.5 bg-gray-50 border-b border-gray-100 text-[11px] font-bold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-1.5 rounded-xl transition ${
                activeTab === 'chat'
                  ? 'bg-white text-boutique-rose shadow-xs'
                  : 'text-boutique-taupe hover:text-boutique-charcoal'
              }`}
            >
              Live Chat
            </button>
            <button
              onClick={() => setActiveTab('ticket')}
              className={`flex-1 py-1.5 rounded-xl transition ${
                activeTab === 'ticket'
                  ? 'bg-white text-boutique-rose shadow-xs'
                  : 'text-boutique-taupe hover:text-boutique-charcoal'
              }`}
            >
              Ask Question
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`flex-1 py-1.5 rounded-xl transition ${
                activeTab === 'track'
                  ? 'bg-white text-boutique-rose shadow-xs'
                  : 'text-boutique-taupe hover:text-boutique-charcoal'
              }`}
            >
              Track Order
            </button>
          </div>

          {/* TAB 1: LIVE CHAT */}
          {activeTab === 'chat' && (
            <>
              {/* Message History */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl leading-relaxed whitespace-pre-line shadow-xs ${
                        m.sender === 'user'
                          ? 'bg-boutique-charcoal text-white rounded-tr-xs'
                          : 'bg-boutique-sand/40 text-boutique-charcoal border border-boutique-border/70 rounded-tl-xs'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[9px] text-boutique-muted mt-0.5 px-1">
                      {m.time}
                    </span>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-gray-50 max-w-[120px] text-boutique-taupe text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-boutique-rose animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-boutique-rose animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-boutique-rose animate-bounce [animation-delay:300ms]" />
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Pills */}
              <div className="px-3 py-1.5 bg-gray-50/70 border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto text-[10px]">
                <button
                  onClick={() => handleSendMessage("What sizes do you have for a 5-year-old girl?")}
                  className="px-2.5 py-1 rounded-full bg-white border border-gray-200 text-boutique-charcoal hover:border-boutique-rose hover:text-boutique-rose whitespace-nowrap"
                >
                  👗 5yo Girl Dress
                </button>
                <button
                  onClick={() => handleSendMessage("How fast is delivery to Lekki?")}
                  className="px-2.5 py-1 rounded-full bg-white border border-gray-200 text-boutique-charcoal hover:border-boutique-rose hover:text-boutique-rose whitespace-nowrap"
                >
                  🚚 Delivery to Lekki
                </button>
                <button
                  onClick={() => handleSendMessage("Can I pay via Bank Transfer?")}
                  className="px-2.5 py-1 rounded-full bg-white border border-gray-200 text-boutique-charcoal hover:border-boutique-rose hover:text-boutique-rose whitespace-nowrap"
                >
                  💳 Bank Transfer
                </button>
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-2.5 bg-white border-t border-gray-100 flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask any question about outfits, sizes..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-boutique-rose"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="p-2 rounded-xl bg-boutique-charcoal text-white hover:bg-black disabled:opacity-30 transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

          {/* TAB 2: ASK A DIRECT QUESTION (SAVES TO ADMIN INBOX) */}
          {activeTab === 'ticket' && (
            <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <h4 className="font-serif font-bold text-sm text-boutique-charcoal">
                  Direct Boutique Inquiry
                </h4>
                <p className="text-[11px] text-boutique-taupe mt-0.5">
                  Have a specific question about an outfit or customized gift package? Leave your details below and our team will respond on WhatsApp immediately.
                </p>
              </div>

              {ticketSubmitted ? (
                <div className="py-12 text-center space-y-2 animate-fadeIn">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-serif font-bold text-base text-boutique-charcoal">Inquiry Received!</h4>
                  <p className="text-xs text-boutique-taupe max-w-xs mx-auto">
                    Sent to our store management portal. We will message you on WhatsApp shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-boutique-charcoal mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mrs. Ngozi Adeleke"
                      value={ticketName}
                      onChange={(e) => setTicketName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-boutique-rose"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-boutique-charcoal mb-1">Phone Number (WhatsApp)</label>
                    <input
                      type="tel"
                      required
                      placeholder="+234 800 000 0000"
                      value={ticketPhone}
                      onChange={(e) => setTicketPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-boutique-rose"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-boutique-charcoal mb-1">Your Question or Note</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="e.g. Can you pack two dresses in a single luxury box for twins?"
                      value={ticketQuestion}
                      onChange={(e) => setTicketQuestion(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-boutique-rose"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-accent-primary py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send to Boutique Staff</span>
                  </button>
                </form>
              )}

              <div className="pt-2 border-t border-gray-100 text-center">
                <a
                  href="https://wa.me/2348000000000?text=Hello%20Little%20Nest%20Boutique%2C%20I%20have%20an%20urgent%20question."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold hover:underline"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Or Chat Instantly on WhatsApp</span>
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: TRACK ORDER QUICK LOOKUP */}
          {activeTab === 'track' && (
            <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <h4 className="font-serif font-bold text-sm text-boutique-charcoal">
                  Live Order Tracker
                </h4>
                <p className="text-[11px] text-boutique-taupe mt-0.5">
                  Enter your Order ID (e.g. <span className="font-mono font-bold">LN-942101</span>) or phone number.
                </p>
              </div>

              <form onSubmit={handleWidgetTrack} className="space-y-2">
                <input
                  type="text"
                  placeholder="e.g. LN-942101 or 08034129001"
                  value={trackCode}
                  onChange={(e) => setTrackCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-boutique-rose"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-boutique-charcoal text-white rounded-xl font-bold text-xs hover:bg-black transition"
                >
                  Track Parcel
                </button>
              </form>

              {trackResult && trackResult !== 'not_found' && (
                <div className="p-3 rounded-2xl bg-boutique-sand/40 border border-boutique-border space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-boutique-charcoal">#{trackResult.id}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {trackResult.fulfillmentStatus.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[11px] text-boutique-taupe">
                    Customer: <span className="font-bold text-boutique-charcoal">{trackResult.customerName}</span>
                  </div>
                  <div className="text-[11px] text-boutique-taupe">
                    Total: <span className="font-bold text-boutique-charcoal tabular-nums">{formatPrice(trackResult.total)}</span>
                  </div>
                  <div className="pt-1">
                    <Link
                      to={`/track?id=${trackResult.id}`}
                      onClick={() => setIsOpen(false)}
                      className="text-[11px] text-boutique-rose font-bold hover:underline flex items-center gap-0.5"
                    >
                      <span>Open Full Visual Timeline</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}

              {trackResult === 'not_found' && (
                <div className="p-3 rounded-2xl bg-amber-50 text-amber-900 text-[11px] border border-amber-200 text-center">
                  No matching parcel found for "{trackCode}". Please check your order confirmation.
                </div>
              )}

              <div className="pt-2 text-center">
                <Link
                  to="/track"
                  onClick={() => setIsOpen(false)}
                  className="text-[11px] text-boutique-taupe hover:text-boutique-rose font-semibold underline"
                >
                  Go to Dedicated Tracking Page
                </Link>
              </div>
            </div>
          )}

        </div>
      )}
    </>
  );
};
