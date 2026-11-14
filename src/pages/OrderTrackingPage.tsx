import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  MapPin, 
  Phone, 
  ArrowRight, 
  MessageCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { useOrders, StoreOrder } from '../context/OrdersContext';
import { formatPrice } from '../utils/formatters';

export const OrderTrackingPage: React.FC = () => {
  const { orders } = useOrders();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('id') || '';

  const [inputCode, setInputCode] = useState(initialQuery);
  const [searchedOrder, setSearchedOrder] = useState<StoreOrder | null>(() => {
    if (!initialQuery) return null;
    return (
      orders.find(
        (o) =>
          o.id.toLowerCase() === initialQuery.toLowerCase() ||
          o.phone.replace(/[^0-9]/g, '').includes(initialQuery.replace(/[^0-9]/g, ''))
      ) || null
    );
  });
  const [hasSearched, setHasSearched] = useState(!!initialQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    setHasSearched(true);
    const cleaned = inputCode.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === cleaned ||
        o.phone.replace(/[^0-9]/g, '').includes(cleaned.replace(/[^0-9]/g, '')) ||
        (o.waybillNumber && o.waybillNumber.toLowerCase().includes(cleaned))
    );

    setSearchedOrder(found || null);
    if (found) {
      setSearchParams({ id: found.id });
    }
  };

  const getStepProgress = (status: StoreOrder['fulfillmentStatus']) => {
    switch (status) {
      case 'new':
        return 1;
      case 'gift_boxing':
        return 2;
      case 'dispatched':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 1;
    }
  };

  const steps = [
    { num: 1, title: 'Order Confirmed', desc: 'Payment cleared & sent to atelier' },
    { num: 2, title: 'Atelier Gift Boxing', desc: 'Hand-tied with signature silk ribbon' },
    { num: 3, title: 'Dispatched with Courier', desc: 'En route with priority dispatch rider' },
    { num: 4, title: 'Delivered', desc: 'Delivered safely to your doorstep' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10 animate-fadeIn">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-boutique-rose-light text-boutique-rose text-[11px] font-bold tracking-widest uppercase border border-boutique-rose/25">
          <Truck className="w-3.5 h-3.5 text-boutique-rose" />
          <span>Priority Doorstep Tracking</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-boutique-charcoal">
          Track Your Crown & Coral Parcel
        </h1>
        <p className="text-xs sm:text-sm text-boutique-taupe max-w-md mx-auto">
          Enter your Order ID (e.g. <span className="font-mono font-bold text-boutique-charcoal">CC-942101</span>) or phone number to see live fulfillment and courier updates.
        </p>
      </div>

      {/* Tracking Search Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/80 shadow-xl max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. LN-942101 or 08034129001"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 text-sm bg-white/90 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-boutique-rose/30 focus:border-boutique-rose text-boutique-charcoal font-medium shadow-xs"
              autoFocus
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5 pointer-events-none" />
          </div>

          <button
            type="submit"
            className="w-full btn-accent-primary py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
          >
            <Package className="w-4 h-4" />
            <span>Locate Order</span>
          </button>
        </form>

        {/* Quick Sample Tracking IDs */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-center gap-2 text-[11px] text-boutique-taupe">
          <span>Recent sample tracking:</span>
          {orders.slice(0, 3).map((ord) => (
            <button
              key={ord.id}
              onClick={() => {
                setInputCode(ord.id);
                setSearchedOrder(ord);
                setHasSearched(true);
                setSearchParams({ id: ord.id });
              }}
              className="font-mono font-semibold text-boutique-rose hover:underline bg-white/60 px-2 py-0.5 rounded-md border border-gray-100"
            >
              #{ord.id}
            </button>
          ))}
        </div>
      </div>

      {/* TRACKING RESULTS */}
      {hasSearched && (
        <>
          {searchedOrder ? (
            <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/80 shadow-2xl space-y-8 animate-fadeIn">
              
              {/* Order Meta Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-lg sm:text-xl text-boutique-charcoal">
                      Order #{searchedOrder.id}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      searchedOrder.paymentStatus === 'paid'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}>
                      {searchedOrder.paymentStatus === 'paid' ? 'PAID & VERIFIED' : 'PAYMENT DUE ON ARRIVAL'}
                    </span>
                  </div>
                  <span className="text-xs text-boutique-taupe mt-1 block">
                    Booked by {searchedOrder.customerName} on {new Date(searchedOrder.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-boutique-taupe tracking-wider block">Waybill Tracking</span>
                  <span className="font-mono text-xs font-bold text-boutique-rose block">{searchedOrder.waybillNumber || 'ASSIGNING-RIDER'}</span>
                  <span className="text-[11px] text-boutique-taupe">{searchedOrder.courierPartner || 'Fez Priority Courier'}</span>
                </div>
              </div>

              {/* Visual Multi-step Timeline */}
              <div className="py-4">
                <div className="relative">
                  {/* Step Indicators */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
                    {steps.map((st) => {
                      const activeStep = getStepProgress(searchedOrder.fulfillmentStatus);
                      const isComplete = st.num <= activeStep;
                      const isCurrent = st.num === activeStep;

                      return (
                        <div key={st.num} className="flex flex-col items-start space-y-2">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isComplete
                              ? 'bg-boutique-rose text-white shadow-md'
                              : 'bg-white border-2 border-gray-200 text-gray-400'
                          }`}>
                            {isComplete ? <CheckCircle2 className="w-5 h-5" /> : st.num}
                          </div>
                          <div>
                            <span className={`text-xs font-bold block ${isCurrent ? 'text-boutique-rose' : 'text-boutique-charcoal'}`}>
                              {st.title}
                            </span>
                            <span className="text-[10px] text-boutique-taupe block mt-0.5 leading-snug">
                              {st.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Delivery Destination & Outfits Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200/80">
                {/* Destination */}
                <div className="p-4 rounded-2xl bg-white/70 border border-gray-100 space-y-2 text-xs">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-boutique-taupe block">
                    Delivery Address
                  </span>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-boutique-rose flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-boutique-charcoal block">{searchedOrder.address}</span>
                      <span className="text-boutique-taupe block">{searchedOrder.city}</span>
                      <span className="text-boutique-rose font-medium block mt-1">{searchedOrder.phone}</span>
                    </div>
                  </div>
                  {searchedOrder.notes && (
                    <div className="mt-2 p-2 rounded-xl bg-amber-50 text-[11px] text-amber-900 border border-amber-200">
                      📝 Gift Note: "{searchedOrder.notes}"
                    </div>
                  )}
                </div>

                {/* Items in Parcel */}
                <div className="p-4 rounded-2xl bg-white/70 border border-gray-100 space-y-2 text-xs">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-boutique-taupe block">
                    Parcel Contents ({searchedOrder.items.length})
                  </span>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {searchedOrder.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-3 pb-2 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={it.product.images[0]}
                            alt={it.product.name}
                            className="w-9 h-11 object-cover rounded-md"
                          />
                          <div>
                            <span className="font-semibold text-boutique-charcoal block line-clamp-1">{it.product.name}</span>
                            <span className="text-[11px] text-boutique-taupe">Size: {it.selectedSize} · Qty: {it.quantity}</span>
                          </div>
                        </div>
                        <span className="font-bold tabular-nums text-boutique-charcoal">
                          {formatPrice(it.product.price * it.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-xs font-bold">
                    <span>Total Amount</span>
                    <span className="text-sm font-bold text-boutique-rose tabular-nums">{formatPrice(searchedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <a
                  href={`https://wa.me/2348000000000?text=${encodeURIComponent(`Hello Crown & Coral Concierge, I am checking on my order #${searchedOrder.id}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact Atelier Dispatch on WhatsApp</span>
                </a>

                <Link
                  to="/shop"
                  className="text-xs font-bold text-boutique-charcoal hover:text-boutique-rose flex items-center gap-1"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ) : (
            <div className="p-8 rounded-3xl glass-panel text-center space-y-3 border border-white/80 max-w-xl mx-auto">
              <Clock className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-boutique-charcoal">
                No Record Found for "{inputCode}"
              </h3>
              <p className="text-xs text-boutique-taupe max-w-sm mx-auto">
                Please double-check your Order ID number (e.g. <span className="font-mono font-bold">CC-942101</span>) from your checkout receipt or SMS, or contact our concierge.
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/2348000000000?text=Hello%20Crown%20%26%20Coral%20Concierge%2C%20I%20need%20help%20locating%20my%20order."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-boutique-charcoal hover:text-accent transition"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ask Concierge on WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </>
      )}

      {/* Assurance Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center max-w-3xl mx-auto pt-6 text-xs text-boutique-taupe">
        <div className="p-4 rounded-2xl glass-card border border-white/80 space-y-1">
          <Truck className="w-5 h-5 text-boutique-rose mx-auto" />
          <h4 className="font-bold text-boutique-charcoal text-[11px]">24–48h Lagos Dispatch</h4>
          <p className="text-[10px]">Priority doorstep riders across Island & Mainland</p>
        </div>
        <div className="p-4 rounded-2xl glass-card border border-white/80 space-y-1">
          <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto" />
          <h4 className="font-bold text-boutique-charcoal text-[11px]">Inspected Delivery</h4>
          <p className="text-[10px]">Check fit & quality upon arrival before acceptance</p>
        </div>
        <div className="p-4 rounded-2xl glass-card border border-white/80 space-y-1">
          <Sparkles className="w-5 h-5 text-amber-500 mx-auto" />
          <h4 className="font-bold text-boutique-charcoal text-[11px]">Luxury Ribbon Packaging</h4>
          <p className="text-[10px]">Every order hand-boxed ready for gifting</p>
        </div>
      </div>

    </div>
  );
};
