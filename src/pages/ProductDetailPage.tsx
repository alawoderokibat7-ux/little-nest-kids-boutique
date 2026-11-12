import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, ChevronRight, Check } from 'lucide-react';
import { DEMO_PRODUCTS } from '../data/products';
import { formatPrice } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { OrderBookingModal } from '../components/checkout/OrderBookingModal';
import { ProductCard } from '../components/product/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const product = DEMO_PRODUCTS.find((p) => p.id === id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [addedSuccessfully, setAddedSuccessfully] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveImageIndex(0);
    setSelectedSize('');
    setSizeError(false);
    setAddedSuccessfully(false);
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-gray-900">Product Not Found</h2>
        <p className="text-sm text-gray-600">The requested outfit is not in the active catalogue.</p>
        <Link to="/shop" className="btn-accent-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold">
          <ArrowLeft className="w-4 h-4" /> Return to Catalogue
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    if (addToCart(product, selectedSize, quantity)) {
      setAddedSuccessfully(true);
      setTimeout(() => setAddedSuccessfully(false), 2000);
    }
  };

  const handleInstantBooking = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    setIsCheckoutModalOpen(true);
  };

  // Strictly gender-matched related items
  const relatedProducts = DEMO_PRODUCTS.filter(
    (p) => p.id !== product.id && 
           (p.gender === product.gender || p.gender === 'unisex') &&
           (p.category === product.category || p.ageRange === product.ageRange)
  ).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/" className="hover:text-gray-900 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link to="/shop" className="hover:text-gray-900 transition">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link to={`/shop?gender=${product.gender}`} className="hover:text-gray-900 transition capitalize">
          {product.gender}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Box: rounded-3xl (24px), p-6 (24px) => Inner elements = rounded-xl (12px) */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Enlarged Main Product Gallery with Interactive Zoom */}
          <div className="lg:col-span-6 space-y-4">
            <div className="group aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 relative image-shine-wrapper shadow-xs hover:shadow-lg transition-shadow duration-500 cursor-zoom-in">
              <img
                key={activeImageIndex}
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-108 transition-all duration-700 ease-out animate-fade-scale"
              />
              <span className="absolute bottom-3 right-3 text-[10px] font-semibold bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-full text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                Zoom details
              </span>
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-24 rounded-lg overflow-hidden border transition-all duration-300 transform hover:scale-105 ${
                      activeImageIndex === idx
                        ? 'border-accent ring-2 ring-accent/30 shadow-md scale-102'
                        : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-accent block">
                  {product.categoryLabel}
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-1">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {product.tagline}
                </p>
              </div>

              {/* Price with Tabular Nums */}
              <div className="flex items-baseline gap-3 pt-2 border-t border-gray-100">
                <span className="text-3xl font-bold text-gray-900 tabular-nums">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through tabular-nums">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded ml-auto">
                  In Stock • Lagos Delivery 24-48h
                </span>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed pt-2">
                {product.description}
              </p>

              {/* Size Selector with Clean Labels */}
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-gray-900">
                  <span>Size ({product.ageRange})</span>
                  {selectedSize && <span className="text-accent font-semibold">{selectedSize} selected</span>}
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeError(false);
                      }}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                        selectedSize === size
                          ? 'bg-gray-900 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {sizeError && (
                  <p className="text-xs font-semibold text-accent pt-1">
                    Please select a size to continue.
                  </p>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 pt-2">
                <span className="text-xs font-medium text-gray-900">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-gray-600 hover:text-gray-900 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-gray-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-gray-600 hover:text-gray-900 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Primary Emphasized CTAs */}
              <div className="pt-6 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className={`py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition active:scale-98 ${
                      addedSuccessfully
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-900 text-white hover:bg-black'
                    }`}
                  >
                    {addedSuccessfully ? (
                      <>
                        <Check className="w-4 h-4" /> Added to Bag
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleInstantBooking}
                    className="btn-accent-primary py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm"
                  >
                    Book Order Now
                  </button>
                </div>
              </div>

              {/* Product Specifications Grouped with Spacing */}
              <div className="pt-6 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                <div>
                  <strong className="text-gray-900">Fabric: </strong>
                  {product.fabricDetails}
                </div>
                <div>
                  <strong className="text-gray-900">Care: </strong>
                  {product.careInstructions.join(' • ')}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Strictly Same-Gender Related Outfits */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-gray-900">
              More {product.gender === 'girls' ? "Girls'" : "Boys'"} Outfits
            </h2>
            <Link to={`/shop?gender=${product.gender}`} className="text-xs font-semibold text-accent hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Purchase Bar */}
      <div className="lg:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200/90 p-2.5 px-4 flex items-center justify-between gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div>
          <span className="block text-[10px] text-gray-500 font-medium">
            {selectedSize ? `Size: ${selectedSize}` : 'Select a size'}
          </span>
          <span className="text-sm font-bold text-gray-900 tabular-nums">
            {formatPrice(product.price)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            className={`py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              addedSuccessfully
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-900 text-white'
            }`}
          >
            {addedSuccessfully ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
            <span>{addedSuccessfully ? 'Added' : 'Add to Bag'}</span>
          </button>
          <button
            onClick={handleInstantBooking}
            className="py-2 px-3.5 rounded-xl btn-accent-primary text-xs font-semibold shadow-xs"
          >
            Book
          </button>
        </div>
      </div>

      {/* Order Booking Modal */}
      {isCheckoutModalOpen && (
        <OrderBookingModal
          cartItems={[{ product, selectedSize, quantity }]}
          subtotal={product.price * quantity}
          onClose={() => setIsCheckoutModalOpen(false)}
        />
      )}

    </div>
  );
};
