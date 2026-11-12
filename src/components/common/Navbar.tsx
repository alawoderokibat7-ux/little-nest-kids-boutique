import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

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
    { label: 'All Collection', path: '/shop' },
    { label: 'Girls', path: '/shop?gender=girls' },
    { label: 'Boys', path: '/shop?gender=boys' },
    { label: 'Occasionwear', path: '/shop?category=dresses-partywear' },
    { label: 'Matching Sets', path: '/shop?category=matching-sets' },
    { label: 'Baby & Toddler', path: '/shop?category=baby' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full system-nav">
      {/* Top Luxury Announcement Strip */}
      <div className="bg-gradient-to-r from-boutique-charcoal via-[#2A2421] to-boutique-charcoal text-white text-[11px] py-2 px-4 text-center font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between sm:justify-center gap-4">
          <span className="flex items-center gap-1.5 mx-auto">
            <span className="text-amber-300">✦</span>
            <span>Hand-tailored occasionwear for ages 1–13</span>
            <span className="hidden md:inline text-white/40">•</span>
            <span className="hidden md:inline text-amber-200">Express delivery across Lagos & nationwide</span>
            <span className="hidden lg:inline text-white/40">•</span>
            <span className="hidden lg:inline">Pay on Delivery available</span>
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

          {/* Logo with Boutique Emblem */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-boutique-rose-light border border-boutique-rose/20 flex items-center justify-center text-boutique-rose group-hover:scale-105 transition-transform">
              <span className="font-serif text-base font-bold">LN</span>
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-boutique-charcoal block leading-none">
                Little Nest
              </span>
              <span className="text-[9px] uppercase tracking-[0.22em] text-boutique-taupe font-semibold block mt-0.5">
                Children's Atelier
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = location.pathname + location.search === link.path;
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`text-xs font-semibold uppercase tracking-wider transition-all relative py-1 ${
                    isActive
                      ? 'text-boutique-rose font-bold'
                      : 'text-boutique-taupe hover:text-boutique-charcoal'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-boutique-rose rounded-full" />
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
                placeholder="Search outfits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-56 pl-9 pr-3 py-2 text-xs bg-boutique-warm-white border border-boutique-border rounded-xl focus:outline-none focus:ring-2 focus:ring-boutique-rose/30 focus:border-boutique-rose text-boutique-charcoal transition"
              />
              <Search className="w-4 h-4 text-boutique-taupe absolute left-3 pointer-events-none" />
            </form>

            <Link
              to="/admin-demo"
              className="text-xs font-semibold text-boutique-charcoal hover:bg-boutique-sand/60 px-3 py-2 rounded-xl border border-boutique-border hidden md:flex items-center gap-1.5 transition"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Orders Log</span>
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
              className="relative p-2.5 text-boutique-charcoal hover:bg-boutique-sand/60 rounded-xl transition border border-transparent hover:border-boutique-border"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-boutique-rose text-white text-[10px] font-bold flex items-center justify-center tabular-nums shadow-xs">
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
            <div className="pt-2 border-t border-boutique-border">
              <Link
                to="/admin-demo"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-bold text-boutique-rose"
              >
                Store Orders Log
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
