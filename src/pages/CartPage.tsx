import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';
import { OrderBookingModal } from '../components/checkout/OrderBookingModal';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, itemCount } = useCart();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutCartSnapshot, setCheckoutCartSnapshot] = useState(cart);
  const [checkoutSubtotalSnapshot, setCheckoutSubtotalSnapshot] = useState(subtotal);

  const handleOpenCheckout = () => {
    setCheckoutCartSnapshot([...cart]);
    setCheckoutSubtotalSnapshot(subtotal);
    setIsCheckoutModalOpen(true);
  };

  const FREE_SHIPPING_THRESHOLD = 50000;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  if (cart.length === 0 && !isCheckoutModalOpen) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-white mx-auto flex items-center justify-center text-gray-400 border border-gray-200">
          <ShoppingBag className="w-8 h-8 opacity-40" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-gray-900">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Explore our collection of girls' dresses, boys' linen sets, and baby outfits.
        </p>
        <div className="pt-2">
          <Link
            to="/shop"
            className="btn-accent-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Shopping Bag
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 tabular-nums">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your bag
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="p-4 bg-white rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1.5">
              <span>Nationwide Delivery:</span>
              <span className="font-semibold text-gray-900 tabular-nums">
                {remainingForFreeShipping > 0
                  ? `Add ${formatPrice(remainingForFreeShipping)} for free delivery`
                  : 'Free Delivery Active'}
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 divide-y divide-gray-100">
            {cart.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}`}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-24 object-cover rounded bg-gray-100 flex-shrink-0"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-medium text-sm sm:text-base text-gray-900 truncate">
                    {item.product.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Size: {item.selectedSize}</span>
                    <span>•</span>
                    <span className="tabular-nums">{formatPrice(item.product.price)} each</span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                  <div className="flex items-center border border-gray-200 rounded bg-gray-50">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                      className="px-2.5 py-1 text-gray-600 hover:text-gray-900"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2.5 text-xs font-bold text-gray-900 tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                      className="px-2.5 py-1 text-gray-600 hover:text-gray-900"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="text-sm font-bold text-gray-900 tabular-nums">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end px-1">
            <button
              onClick={clearCart}
              className="text-xs text-gray-500 hover:text-rose-600 font-medium"
            >
              Clear entire bag
            </button>
          </div>

        </div>

        {/* Right Summary Column */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4">
            <h3 className="font-semibold text-base text-gray-900 pb-3 border-b border-gray-100">
              Order Summary
            </h3>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-gray-900 tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span className="text-gray-900 font-medium tabular-nums">
                  {subtotal >= FREE_SHIPPING_THRESHOLD ? 'FREE' : '₦2,500'}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-100 flex justify-between text-sm font-bold text-gray-900">
                <span>Total:</span>
                <span className="text-accent tabular-nums">{formatPrice(subtotal + (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 2500))}</span>
              </div>
            </div>

            <button
              onClick={handleOpenCheckout}
              className="w-full btn-accent-primary py-3.5 px-6 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Proceed to Order Booking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {isCheckoutModalOpen && (
        <OrderBookingModal
          cartItems={checkoutCartSnapshot.length > 0 ? checkoutCartSnapshot : cart}
          subtotal={checkoutSubtotalSnapshot > 0 ? checkoutSubtotalSnapshot : subtotal}
          clearCartOnSuccess={true}
          onClose={() => setIsCheckoutModalOpen(false)}
        />
      )}

    </div>
  );
};
