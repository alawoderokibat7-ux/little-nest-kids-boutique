import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { DEMO_PRODUCTS } from '../../data/products';
import { formatPrice } from '../../utils/formatters';

export const MobileSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen } = useCart();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filtered = query.trim()
    ? DEMO_PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase().trim()) ||
        p.description.toLowerCase().includes(query.toLowerCase().trim()) ||
        p.categoryLabel.toLowerCase().includes(query.toLowerCase().trim()) ||
        p.gender.toLowerCase().includes(query.toLowerCase().trim()) ||
        p.ageRange.toLowerCase().includes(query.toLowerCase().trim())
      ).slice(0, 5)
    : [];

  const handleSelectProduct = (productId: string) => {
    setIsSearchOpen(false);
    navigate(`/product/${productId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSearchOpen(false);
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleQuickFilter = (param: string) => {
    setIsSearchOpen(false);
    navigate(`/shop?${param}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex flex-col justify-start">
      <div 
        className="w-full bg-white rounded-b-2xl shadow-2xl border-b border-gray-200 p-4 pt-6 space-y-4 max-h-[85vh] flex flex-col animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search dresses, boys suits, linen sets..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent text-gray-900"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 p-0.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-2 text-gray-500 hover:text-gray-900 text-xs font-semibold"
          >
            Cancel
          </button>
        </div>

        {/* Quick Trending Searches & Categories */}
        {!query.trim() && (
          <div className="space-y-4 py-2 overflow-y-auto">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                Quick Category Shortcuts
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleQuickFilter('gender=girls')}
                  className="px-3 py-1.5 rounded-lg bg-pink-50 text-pink-700 hover:bg-pink-100 text-xs font-medium"
                >
                  👧 Girls' Collection
                </button>
                <button
                  onClick={() => handleQuickFilter('gender=boys')}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium"
                >
                  👦 Boys' Collection
                </button>
                <button
                  onClick={() => handleQuickFilter('category=dresses-partywear')}
                  className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-medium"
                >
                  ✨ Party & Occasionwear
                </button>
                <button
                  onClick={() => handleQuickFilter('category=baby')}
                  className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-medium"
                >
                  👶 Baby & Toddler (1–3y)
                </button>
                <button
                  onClick={() => handleQuickFilter('category=matching-sets')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-medium"
                >
                  👫 Sibling Matching Sets
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                Shop By Age Range
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleQuickFilter('age=1-3')}
                  className="p-2.5 rounded-xl border border-gray-200 text-left hover:border-gray-900 transition"
                >
                  <strong className="block text-gray-900">1–3 Years</strong>
                  <span className="text-gray-500 text-[10px]">Rompers & Playwear</span>
                </button>
                <button
                  onClick={() => handleQuickFilter('age=4-6')}
                  className="p-2.5 rounded-xl border border-gray-200 text-left hover:border-gray-900 transition"
                >
                  <strong className="block text-gray-900">4–6 Years</strong>
                  <span className="text-gray-500 text-[10px]">Party Dresses & Linen</span>
                </button>
                <button
                  onClick={() => handleQuickFilter('age=7-9')}
                  className="p-2.5 rounded-xl border border-gray-200 text-left hover:border-gray-900 transition"
                >
                  <strong className="block text-gray-900">7–9 Years</strong>
                  <span className="text-gray-500 text-[10px]">Occasionwear & Blazers</span>
                </button>
                <button
                  onClick={() => handleQuickFilter('age=10-13')}
                  className="p-2.5 rounded-xl border border-gray-200 text-left hover:border-gray-900 transition"
                >
                  <strong className="block text-gray-900">10–13 Years</strong>
                  <span className="text-gray-500 text-[10px]">Tailored Coats & Sets</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Live Search Results */}
        {query.trim() && (
          <div className="overflow-y-auto space-y-2 py-1 max-h-[60vh]">
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-xs">
                No outfits found matching "{query}". Try checking other categories or asking the AI Stylist.
              </div>
            ) : (
              filtered.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product.id)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition border border-transparent hover:border-gray-200"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-14 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-gray-900 truncate">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                      <span className="font-bold text-gray-900 tabular-nums">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 capitalize">{product.gender} ({product.ageRange})</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
              ))
            )}

            {filtered.length > 0 && (
              <button
                onClick={handleSearchSubmit}
                className="w-full mt-2 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <span>View all results for "{query}"</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};