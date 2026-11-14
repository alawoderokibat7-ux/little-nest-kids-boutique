import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check, Heart } from 'lucide-react';
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
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

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

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <>
      {/* Outer Card with Frosted Glassmorphism & Translucent Glow */}
      <div className="group glass-card rounded-3xl p-3 sm:p-3.5 flex flex-col justify-between relative">
        
        {/* Product Visual Container - Geometrically harmonious corners: inner (12px) = outer (24px) - padding (12px) */}
        <Link 
          to={`/product/${product.id}`} 
          className="relative block w-full aspect-[4/5] rounded-xl bg-white/40 backdrop-blur-md overflow-hidden image-shine-wrapper shadow-xs border border-white/70 group-hover:border-white transition-all duration-500"
        >
          {/* Skeleton Shimmer */}
          {!isImgLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-boutique-sand/60 via-boutique-rose-light/40 to-boutique-sand/60 animate-pulse" />
          )}

          <img
            src={product.images[currentImgIndex] || product.images[0]}
            alt={product.name}
            onLoad={() => setIsImgLoaded(true)}
            onError={() => {
              if (currentImgIndex + 1 < product.images.length) {
                setCurrentImgIndex((prev) => prev + 1);
              } else {
                setIsImgLoaded(true);
              }
            }}
            className={`w-full h-full object-cover object-center group-hover:scale-108 group-hover:brightness-[1.03] transition-all duration-700 ease-out ${
              isImgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
          />

          {/* Top Floating Badges */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
            {product.isNewArrival ? (
              <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-boutique-rose shadow-xs border border-white/60">
                New Atelier
              </span>
            ) : product.price < 20000 ? (
              <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-50/90 backdrop-blur-md text-amber-800 shadow-xs border border-amber-200/60">
                Essential
              </span>
            ) : (
              <span />
            )}

            {/* Favorite Heart Button */}
            <button
              onClick={toggleFavorite}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all pointer-events-auto backdrop-blur-md shadow-xs ${
                isFavorite
                  ? 'bg-boutique-rose text-white'
                  : 'bg-white/80 text-boutique-taupe hover:text-boutique-rose hover:bg-white'
              }`}
              aria-label="Add to wishlist"
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </Link>

        {/* Content Grouped with Intentional Spacing */}
        <div className="pt-2 sm:pt-3 flex flex-col flex-grow justify-between">
          <div>
            <div className="flex items-center justify-between text-[10px] sm:text-xs text-boutique-taupe mb-1 font-medium">
              <span>{product.ageRange}</span>
              <span className="capitalize">{product.gender}</span>
            </div>

            <Link to={`/product/${product.id}`} className="block">
              <h3 className="font-serif font-bold text-xs sm:text-sm text-boutique-charcoal group-hover:text-boutique-rose transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>

            <div className="mt-1 flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-xs sm:text-base font-bold text-boutique-charcoal tabular-nums">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-[10px] sm:text-xs text-boutique-muted line-through tabular-nums">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Size Selector Strip */}
          <div className="mt-2 sm:mt-2.5 pt-2 border-t border-boutique-border/70">
            <div className="flex flex-wrap gap-1">
              {product.availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSize(size);
                  }}
                  className={`px-1.5 sm:px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-semibold transition ${
                    selectedSize === size
                      ? 'bg-boutique-charcoal text-white shadow-xs'
                      : 'bg-white/60 backdrop-blur-xs text-boutique-taupe hover:bg-white border border-white/70'
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
              className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                justAdded
                  ? 'bg-emerald-600 text-white animate-cart-pulse'
                  : 'bg-boutique-charcoal text-white hover:bg-black active:scale-98 shadow-xs'
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
              className="btn-accent-primary py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition active:scale-98 shadow-clay-pill"
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
          clearCartOnSuccess={false}
          onClose={() => setIsInstantBookingOpen(false)}
        />
      )}
    </>
  );
};