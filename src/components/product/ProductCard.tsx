import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { OrderBookingModal } from '../checkout/OrderBookingModal';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(product.availableSizes[0] || '');
  const [justAdded, setJustAdded] = useState(false);
  const [isInstantBookingOpen, setIsInstantBookingOpen] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (addToCart(product, selectedSize, 1)) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1600);
    }
  };

  const handleQuickBook = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsInstantBookingOpen(true);
  };

  return (
    <>
      {/* Outer Card: rounded-2xl (16px), p-3 (12px) => Inner Image Radius = 16px - 12px = 4px (rounded) */}
      <div className="group bg-white rounded-2xl p-3 border border-gray-200/80 hover:border-gray-300 transition-all flex flex-col justify-between">
        
        {/* Product Visual - Clean, Uninhibited by Clutter */}
        <Link 
          to={`/product/${product.id}`} 
          className="relative block w-full aspect-[4/5] rounded bg-gray-100 overflow-hidden"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Content Grouped with Intentional Spacing */}
        <div className="pt-3 flex flex-col flex-grow justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>{product.ageRange}</span>
              <span className="capitalize">{product.gender}</span>
            </div>

            <Link to={`/product/${product.id}`} className="block">
              <h3 className="font-medium text-sm text-gray-900 group-hover:text-accent transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>

            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-base font-semibold text-gray-900 tabular-nums">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through tabular-nums">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Size Selector Strip */}
          <div className="mt-3 pt-2.5 border-t border-gray-100">
            <div className="flex flex-wrap gap-1">
              {product.availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSize(size);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                    selectedSize === size
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleQuickAdd}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                justAdded
                  ? 'bg-emerald-600 text-white animate-cart-pulse'
                  : 'bg-gray-900 text-white hover:bg-black active:scale-98'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Added
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
                </>
              )}
            </button>
            <button
              onClick={handleQuickBook}
              className="py-2 px-3 rounded-lg bg-accent text-white hover:bg-accent-hover text-xs font-semibold transition active:scale-98"
              title="Instant Order Booking"
            >
              Book
            </button>
          </div>

        </div>
      </div>

      {/* Instant Order Booking Modal */}
      {isInstantBookingOpen && (
        <OrderBookingModal
          cartItems={[{ product, selectedSize, quantity: 1 }]}
          subtotal={product.price}
          onClose={() => setIsInstantBookingOpen(false)}
        />
      )}
    </>
  );
};
