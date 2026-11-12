import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';
import { OrderBookingModal } from '../checkout/OrderBookingModal';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotal, itemCount, clearCart } = useCart();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 50000;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressToFreeShipping = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      >
        <div 
          className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
            
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-gray-900" />
                <h2 className="text-base font-semibold text-gray-900">
                  Shopping Bag
                </h2>
                <span className="text-xs text-gray-500 tabular-nums">
                  ({itemCount})
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Delivery Bar */}
            <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-100 text-xs text-gray-600">
              {remainingForFreeShipping > 0 ? (
                <p>
                  Add <strong className="text-gray-900 tabular-nums">{formatPrice(remainingForFreeShipping)}</strong> for free nationwide delivery
                </p>
              ) : (
                <p className="text-emerald-700 font-semibold">
                  You have unlocked complimentary nationwide delivery
                </p>
              )}
              <div className="w-full h-1 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
                <div 
                  className="h-full bg-accent rounded-full transition-all duration-300"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <ShoppingBag className="w-10 h-10 text-gray-300" />
                  <h3 className="font-medium text-sm text-gray-900">
                    Your shopping bag is empty
                  </h3>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-2 px-5 py-2 rounded-lg bg-gray-900 text-white text-xs font-semibold"
                  >
                    Explore Collection
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div 
                    key={`${item.product.id}-${item.selectedSize}`}
                    className="p-3 bg-white rounded-xl border border-gray-200 flex gap-3 items-center"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-20 object-cover rounded bg-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-gray-900 truncate">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                        <span>Size: {item.selectedSize}</span>
                        <span>•</span>
                        <span className="tabular-nums">{formatPrice(item.product.price)}</span>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-100">
                        <div className="flex items-center border border-gray-200 rounded bg-gray-50">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                            className="px-2 py-0.5 text-gray-600 hover:text-gray-900"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                            className="px-2 py-0.5 text-gray-600 hover:text-gray-900"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs font-bold text-gray-900 tabular-nums">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Summary & Checkout CTA */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-gray-200 bg-white space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Subtotal:</span>
                  <span className="text-base font-bold text-gray-900 tabular-nums">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => setIsCheckoutModalOpen(true)}
                    className="w-full btn-accent-primary py-3.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Proceed to Order Booking</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-between pt-1">
                    <Link
                      to="/cart"
                      onClick={() => setIsCartOpen(false)}
                      className="text-xs font-medium text-gray-600 hover:text-gray-900 underline"
                    >
                      View Cart Details
                    </Link>
                    <button
                      onClick={clearCart}
                      className="text-xs text-gray-400 hover:text-rose-600"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isCheckoutModalOpen && (
        <OrderBookingModal
          cartItems={cart}
          subtotal={subtotal}
          onClose={() => setIsCheckoutModalOpen(false)}
        />
      )}
    </>
  );
};
