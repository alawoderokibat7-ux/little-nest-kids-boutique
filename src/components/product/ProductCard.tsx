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
  const [isImgLoaded, setIsImgLoaded] = useState(false);

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
      {/* Outer Card: rounded-2xl, p-2.5 on mobile, p-3 on desktop */}
      <div className="group bg-white rounded-2xl p-2.5 sm:p-3 border border-gray-200/80 hover:border-gray-300 transition-all flex flex-col justify-between">
        
        {/* Product Visual with Shimmer & Scale Animations */}
        <Link 
          to={`/product/${product.id}`} 
          className="relative block w-full aspect-[4/5] rounded bg-gray-100 overflow-hidden image-shine-wrapper shadow-2xs group-hover:shadow-md transition-shadow duration-500"
        >
          {/* Skeleton Shimmer */}
          {!isImgLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
          )}
          <img
            src={product.images[0]}
            alt={product.name}
            onLoad={() => setIsImgLoaded(true)}
            className={`w-full h-full object-cover object-center group-hover:scale-108 group-hover:brightness-[1.03] transition-all duration-700 ease-out ${
              isImgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
          />
        </Link>

        {/* Content Grouped with Intentional Spacing */}
        <div className="pt-2 sm:pt-3 flex flex-col flex-grow justify-between">
          <div>
            <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 mb-1">
              <span>{product.ageRange}</span>
              <span className="capitalize">{product.gender}</span>
            </div>

            <Link to={`/product/${product.id}`} className="block">
              <h3 className="font-medium text-xs sm:text-sm text-gray-900 group-hover:text-accent transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>

            <div className="mt-1 flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-xs sm:text-base font-bold text-gray-900 tabular-nums">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through tabular-nums">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Size Selector Strip */}
          <div className="mt-2 sm:mt-3 pt-2 border-t border-gray-100">
            <div className="flex flex-wrap gap-1">
              {product.availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSize(size);
                  }}
                  className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-medium transition ${
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
          <div className="mt-2.5 sm:mt-3 flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleQuickAdd}
              className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
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
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add<span className="hidden sm:inline"> to Bag</span></span>
                </>
              )}
            </button>
            <button
              onClick={handleQuickBook}
              className="py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-lg bg-accent text-white hover:bg-accent-hover text-xs font-semibold transition active:scale-98"
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
