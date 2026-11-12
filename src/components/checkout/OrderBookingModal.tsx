import React, { useState } from 'react';
import { X, CheckCircle, Clock, Package } from 'lucide-react';
import { CartItem } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';

interface OrderBookingModalProps {
  cartItems: CartItem[];
  subtotal: number;
  onClose: () => void;
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
}) => {
  const { clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Lagos - Island (Lekki, Ikoyi, VI)');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pod' | 'transfer' | 'card'>('pod');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<PlacedOrder | null>(null);

  const deliveryFee = subtotal >= 50000 ? 0 : 2500;
  const grandTotal = subtotal + deliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      alert('Please fill in your name, phone number, and delivery address.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderNumber = `LN-${Math.floor(100000 + Math.random() * 900000)}`;
      const now = new Date();
      const estDate = new Date();
      estDate.setDate(now.getDate() + (city.includes('Lagos') ? 1 : 3));

      const newOrder: PlacedOrder = {
        orderId: orderNumber,
        customerName,
        phone,
        city,
        address,
        paymentMethod: 
          paymentMethod === 'pod' ? 'Pay on Delivery (Cash/POS)' :
          paymentMethod === 'transfer' ? 'Bank Transfer' : 'Debit Card',
        items: [...cartItems],
        subtotal,
        deliveryFee,
        total: grandTotal,
        orderDate: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        estDelivery: estDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
      };

      setConfirmedOrder(newOrder);
      setIsSubmitting(false);
      clearCart();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
      {/* Outer Modal: rounded-2xl (16px), p-6 (24px) */}
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {!confirmedOrder ? (
          <div>
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-gray-900">
                  Express Checkout
                </h3>
                <p className="text-xs text-gray-500">
                  Doorstep Delivery Across Lagos & Nigeria
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitOrder} className="p-5 space-y-4">
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mrs. Folake Adeleke"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent text-gray-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-900 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0803 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent text-gray-900 tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-900 mb-1">
                      Delivery Region *
                    </label>
                    <select
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
                  <label className="block text-xs font-semibold text-gray-900 mb-1">
                    Street Address & Apartment *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 14 Admiralty Way, Lekki Phase 1"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent text-gray-900"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-gray-900 mb-2">
                  Payment Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'pod', label: 'Pay on Delivery' },
                    { id: 'transfer', label: 'Bank Transfer' },
                    { id: 'card', label: 'Debit Card' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaymentMethod(p.id as any)}
                      className={`p-2.5 rounded-lg border text-center text-xs font-medium transition ${
                        paymentMethod === p.id
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing Breakdown with Tabular Nums */}
              <div className="p-3.5 bg-gray-50 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-gray-900 tabular-nums">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery:</span>
                  <span className="font-semibold text-gray-900 tabular-nums">
                    {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-sm text-gray-900">
                  <span>Total Amount:</span>
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
                      Confirming Order...
                    </span>
                  ) : (
                    <span>Confirm Order & Reserve Outfits</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* Live Confirmation Screen */
          <div className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-gray-900">
                Order Confirmed
              </h3>
              <p className="text-xs text-gray-600">
                Order reference: <strong className="font-mono text-gray-900 tabular-nums">{confirmedOrder.orderId}</strong>
              </p>
            </div>

            {/* Notification alert */}
            <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-700 border border-gray-200">
              SMS dispatch confirmation scheduled for <strong>{confirmedOrder.phone}</strong>. Expected delivery: <strong>{confirmedOrder.estDelivery}</strong>.
            </div>

            {/* 4-Step Tracker */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-900">
                <span>Dispatch Progress</span>
                <span className="text-emerald-700 flex items-center gap-1 text-[11px]">
                  <Clock className="w-3.5 h-3.5" /> ETA: {confirmedOrder.estDelivery}
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
                <span>Payment:</span>
                <span className="font-medium text-gray-900">{confirmedOrder.paymentMethod}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-gray-900">
                <span>Total Amount:</span>
                <span className="text-accent tabular-nums">{formatPrice(confirmedOrder.total)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Print Receipt
              </button>
              <button
                onClick={onClose}
                className="flex-1 btn-accent-primary py-2.5 px-4 rounded-xl text-xs font-semibold"
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
