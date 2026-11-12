import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, Search, Sparkles, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { itemCount, setIsCartOpen, setIsSearchOpen, setIsAIOpen } = useCart();

  const isHome = location.pathname === '/';
  const isShop = location.pathname === '/shop';

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/70 backdrop-blur-2xl border-t border-white/80 shadow-[0_-8px_30px_rgba(201,118,131,0.08)] px-2 py-1.5"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center">
        
        {/* 1. Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
            isHome ? 'text-accent font-semibold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </Link>

        {/* 2. Shop */}
        <Link
          to="/shop"
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
            isShop ? 'text-accent font-semibold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Shop</span>
        </Link>

        {/* 3. Search */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-gray-500 hover:text-gray-900 transition"
          aria-label="Search outfits"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Search</span>
        </button>

        {/* 4. AI Stylist */}
        <button
          onClick={() => setIsAIOpen(true)}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-gray-700 hover:text-gray-900 transition relative"
          aria-label="AI Concierge"
        >
          <div className="relative">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-accent to-pink-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <span className="text-[10px] mt-0.5 font-medium text-gray-800">AI Stylist</span>
        </button>

        {/* 5. Cart / Bag */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-gray-500 hover:text-gray-900 transition relative"
          aria-label="Shopping Bag"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Bag</span>
        </button>

      </div>
    </nav>
  );
};