import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Clock, AlertCircle, Info } from 'lucide-react';
import { CartItem } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrdersContext';

interface OrderBookingModalProps {
  cartItems: CartItem[];
  subtotal: number;
  onClose: () => void;
  clearCartOnSuccess?: boolean;
}

export interface PlacedOrder {
  orderId: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  paymentMethod: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  orderDate: string;
  estDelivery: string;
}

export const OrderBookingModal: React.FC<OrderBookingModalProps> = ({
  cartItems,
  subtotal,
  onClose,
  clearCartOnSuccess = false,
}) => {
  const { clearCart } = useCart();
  const { addOrder } = useOrders();
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Lagos - Island (Lekki, Ikoyi, VI)');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pod' | 'transfer' | 'card'>('pod');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<PlacedOrder | null>(null);

  const deliveryFee = subtotal >= 50000 ? 0 : 2500;
  const grandTotal = subtotal + deliveryFee;

  // Keyboard accessibility: Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      alert('Please fill in your name, phone number, and delivery address.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const now = new Date();
      const estDate = new Date();
      estDate.setDate(now.getDate() + (city.includes('Lagos') ? 1 : 3));

      // Persist order to Store Orders Store for Admin Access
      const savedStoreOrder = addOrder({
        customerName,
        phone,
        city,
        address,
        items: [...cartItems],
        subtotal,
        deliveryFee,
        total: grandTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'pod' ? 'pending' : 'paid',
        fulfillmentStatus: 'new',
      });

      const newOrder: PlacedOrder = {
        orderId: savedStoreOrder.id,
        customerName,
        phone,
        city,
        address,
        paymentMethod: 
          paymentMethod === 'pod' ? 'Pay on Delivery (Simulated Cash/POS)' :
          paymentMethod === 'transfer' ? 'Bank Transfer (Simulated)' : 'Debit Card (Simulated)',
        items: [...cartItems],
        subtotal,
        deliveryFee,
        total: grandTotal,
        orderDate: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        estDelivery: estDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
      };

      setConfirmedOrder(newOrder);
      setIsSubmitting(false);

      // Only clear cart if this checkout session originated from the full shopping bag
      if (clearCartOnSuccess) {
        clearCart();
      }
    }, 800);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
    >
      {/* Outer Modal Container */}
      <div 
        className="relative w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-xl border border-gray-200 overflow-y-auto max-h-[94vh] sm:max-h-[90vh] my-0 sm:my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {!confirmedOrder ? (
          <div>
            {/* Header with Demo Badge */}
            <div className="p-5 border-b border-gray-100 flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Sample Demo Checkout · Test Details Only
                </div>
                <h3 id="checkout-modal-title" className="font-serif font-bold text-lg text-gray-900">
                  Express Order Booking
                </h3>
                <p className="text-xs text-gray-500">
                  Doorstep Delivery Across Lagos & Nationwide Nigeria
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg transition"
                aria-label="Close checkout modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Demo Notice Banner */}
            <div className="mx-5 mt-4 p-3 rounded-xl bg-blue-50/70 border border-blue-200/60 text-xs text-blue-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong>Client Showcase Demo:</strong> Real payment processing and courier dispatch are simulated. You can safely enter test contact info to experience the customer booking and receipt flow.
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitOrder} className="p-5 space-y-4">
              
              <div className="space-y-3">
                <div>
                  <label htmlFor="customer-name" className="block text-xs font-semibold text-gray-900 mb-1">
                    Full Name *
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    required
                    placeholder="e.g. Mrs. Folake Adeleke (Test)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent text-gray-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="customer-phone" className="block text-xs font-semibold text-gray-900 mb-1">
                      Phone Number *
                    </label>
                    <input
                      id="customer-phone"
                      type="tel"
                      required
                      placeholder="0803 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent text-gray-900 tabular-nums"
                    />
                  </div>

                  <div>
                    <label htmlFor="customer-city" className="block text-xs font-semibold text-gray-900 mb-1">
                      Delivery Region *
                    </label>
                    <select
                      id="customer-city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent text-gray-900"
                    >
                      <option value="Lagos - Island (Lekki, Ikoyi, VI)">Lagos - Island (Lekki / Ikoyi)</option>
                      <option value="Lagos - Mainland (Ikeja, Surulere)">Lagos - Mainland (Ikeja / Surulere)</option>
                      <option value="Abuja FCT">Abuja FCT</option>
                      <option value="Port Harcourt, Rivers">Port Harcourt</option>
                      <option value="Other States (Nationwide Courier)">Other States</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="customer-address" className="block text-xs font-semibold text-gray-900 mb-1">
                    Street Address & Apartment *
                  </label>
                  <input
                    id="customer-address"
                    type="text"
                    required
                    placeholder="e.g. 14 Admiralty Way, Lekki Phase 1"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent text-gray-900"
                  />
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-900">
                    Payment Option (Demo)
                  </label>
                  <span className="text-[10px] text-gray-400">Select preference</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'pod', label: 'Pay on Delivery', note: 'Cash/POS' },
                    { id: 'transfer', label: 'Bank Transfer', note: 'Simulated' },
                    { id: 'card', label: 'Debit Card', note: 'Simulated' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaymentMethod(p.id as any)}
                      className={`p-2 rounded-lg border text-center transition flex flex-col items-center justify-center ${
                        paymentMethod === p.id
                          ? 'border-gray-900 bg-gray-900 text-white shadow-xs'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-xs font-medium">{p.label}</span>
                      <span className={`text-[9px] mt-0.5 ${paymentMethod === p.id ? 'text-gray-300' : 'text-gray-400'}`}>
                        {p.note}
                      </span>
                    </button>
                  ))}
                </div>
                {paymentMethod !== 'pod' && (
                  <p className="mt-2 text-[10px] text-gray-500 bg-gray-50 p-2 rounded-md border border-gray-200">
                    ℹ️ For live production, Card & Transfer payments are processed through verified payment gateway webhooks (e.g. Paystack / Flutterwave) before order confirmation.
                  </p>
                )}
              </div>

              {/* Pricing Breakdown with Tabular Nums */}
              <div className="p-3.5 bg-gray-50 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                  <span className="font-semibold text-gray-900 tabular-nums">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery:</span>
                  <span className="font-semibold text-gray-900 tabular-nums">
                    {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-sm text-gray-900">
                  <span>Estimated Total:</span>
                  <span className="text-accent tabular-nums">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* CTA with Loading State */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-accent-primary py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating Sample Booking...
                    </span>
                  ) : (
                    <span>Confirm Sample Order & View Receipt</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* Live Confirmation Screen */
          <div className="p-6 space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                Sample Order Confirmation · Demo Showcase
              </div>
              <h3 className="font-serif font-bold text-xl text-gray-900">
                Order Booking Recorded
              </h3>
              <p className="text-xs text-gray-600">
                Sample Order Reference: <strong className="font-mono text-gray-900 tabular-nums">{confirmedOrder.orderId}</strong>
              </p>
            </div>

            {/* Notification alert / Demo disclaimer */}
            <div className="p-3.5 bg-amber-50/60 rounded-xl text-xs text-amber-900 border border-amber-200/80 space-y-1">
              <div className="font-semibold flex items-center gap-1 text-[11px] text-amber-800">
                <AlertCircle className="w-3.5 h-3.5" /> Demo Showcase Mode
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800/90">
                This is a simulated confirmation. In live production, an automated SMS alert is dispatched to <strong>{confirmedOrder.phone}</strong> and a persistent order record is created in the store's dispatch queue.
              </p>
            </div>

            {/* 4-Step Tracker */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-900">
                <span>Simulated Dispatch Tracker</span>
                <span className="text-emerald-700 flex items-center gap-1 text-[11px]">
                  <Clock className="w-3.5 h-3.5" /> Est. Arrival: {confirmedOrder.estDelivery}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 pt-1 text-center text-[10px]">
                <div className="space-y-1">
                  <div className="w-6 h-6 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">✓</div>
                  <span className="font-semibold text-emerald-700">Placed</span>
                </div>
                <div className="space-y-1">
                  <div className="w-6 h-6 mx-auto rounded-full bg-accent text-white flex items-center justify-center font-bold">2</div>
                  <span className="font-semibold text-accent">Boxing</span>
                </div>
                <div className="space-y-1">
                  <div className="w-6 h-6 mx-auto rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">3</div>
                  <span className="text-gray-400">Courier</span>
                </div>
                <div className="space-y-1">
                  <div className="w-6 h-6 mx-auto rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">4</div>
                  <span className="text-gray-400">Delivered</span>
                </div>
              </div>
            </div>

            {/* Receipt Summary */}
            <div className="border border-gray-200 rounded-xl p-3.5 bg-gray-50 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Recipient:</span>
                <span className="font-medium text-gray-900">{confirmedOrder.customerName}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Destination:</span>
                <span className="font-medium text-gray-900 truncate max-w-[200px]">{confirmedOrder.city}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Payment Mode:</span>
                <span className="font-medium text-gray-900">{confirmedOrder.paymentMethod}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-gray-900">
                <span>Sample Order Total:</span>
                <span className="text-accent tabular-nums">{formatPrice(confirmedOrder.total)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Print Receipt
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-accent-primary py-2.5 px-4 rounded-xl text-xs font-semibold transition"
              >
                Return to Store
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
