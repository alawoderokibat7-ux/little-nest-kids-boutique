import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Crown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { AtmosphereSwitcher } from './AtmosphereBackground';

export const Navbar: React.FC = () => {
  const { itemCount, setIsCartOpen, setIsSearchOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'All Collections', path: '/shop' },
    { label: 'Little Princesses', path: '/shop?gender=girls' },
    { label: 'Little Princes', path: '/shop?gender=boys' },
    { label: 'Sunday Best & Galas', path: '/shop?category=birthday' },
    { label: 'Royal Occasions', path: '/shop?category=dresses-partywear' },
    { label: 'Track Order', path: '/track' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full system-nav">
      {/* Top Luxury Announcement Strip */}
      <div className="bg-gradient-to-r from-[#06281E] via-[#0A3327] to-[#06281E] text-white text-[11px] py-2 px-4 text-center font-medium tracking-wide border-b border-accent/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between sm:justify-center gap-4">
          <span className="flex items-center gap-1.5 mx-auto">
            <Crown className="w-3.5 h-3.5 text-accent" />
            <span className="font-semibold text-accent">Crown & Coral Kids</span>
            <span className="text-white/40">•</span>
            <span>Heirloom Nigerian Occasionwear for Ages 1–13</span>
            <span className="hidden md:inline text-white/40">•</span>
            <span className="hidden md:inline text-amber-200">Express Lagos & Nationwide Courier</span>
            <span className="hidden lg:inline text-white/40">•</span>
            <span className="hidden lg:inline">Pay on Delivery Available</span>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-boutique-charcoal hover:bg-boutique-sand/50 rounded-xl transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo with Royal Crown & Coral Emblem */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0A3327] to-[#06281E] border border-accent/40 flex items-center justify-center text-accent group-hover:scale-105 transition-all shadow-emerald-card relative">
              <Crown className="w-5 h-5 text-accent" />
              <span className="w-2 h-2 rounded-full bg-coral absolute -top-0.5 -right-0.5 border border-white" title="Royal Coral Gem" />
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-boutique-charcoal block leading-none">
                Crown & Coral
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-accent font-bold block mt-0.5">
                Royal Children's Atelier
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname + location.search === link.path;
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`text-xs font-semibold uppercase tracking-wider transition-all relative py-1 ${
                    isActive
                      ? 'text-accent font-bold'
                      : 'text-boutique-taupe hover:text-boutique-charcoal'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Search & Cart */}
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="hidden sm:flex relative items-center">
              <input
                type="text"
                placeholder="Search royal attire..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-56 pl-9 pr-3 py-2 text-xs bg-white/80 border border-boutique-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent text-boutique-charcoal transition"
              />
              <Search className="w-4 h-4 text-boutique-taupe absolute left-3 pointer-events-none" />
            </form>

            {/* Atmosphere Background Switcher */}
            <AtmosphereSwitcher />

            <Link
              to="/admin"
              className="text-xs font-semibold text-boutique-charcoal hover:bg-white/80 px-3 py-2 rounded-xl border border-boutique-border hidden md:flex items-center gap-1.5 transition"
              title="Store Owner Admin Portal"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span>Admin Suite</span>
            </Link>

            {/* Mobile Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden p-2 text-boutique-charcoal hover:bg-boutique-sand/50 rounded-xl transition"
              aria-label="Open search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-boutique-charcoal hover:bg-white/80 rounded-xl transition border border-transparent hover:border-boutique-border"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-[#06281E] text-[10px] font-bold flex items-center justify-center tabular-nums shadow-xs">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Nav Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-boutique-border py-4 space-y-1 bg-white/95 backdrop-blur-xl rounded-b-2xl shadow-xl px-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-boutique-charcoal hover:bg-boutique-sand/50"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-boutique-border flex items-center justify-between px-3 py-2">
              <span className="text-xs font-semibold text-boutique-charcoal">3D Royal Atmosphere:</span>
              <AtmosphereSwitcher />
            </div>
            <div className="pt-1">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-bold text-accent"
              >
                Store Admin & Payment Ledger
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
