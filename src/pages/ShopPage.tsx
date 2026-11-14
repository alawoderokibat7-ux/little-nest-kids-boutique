import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { DEMO_PRODUCTS, CATEGORIES_LIST, AGE_RANGES, SIZES_LIST, GENDER_FILTERS } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialGender = searchParams.get('gender') || (searchParams.get('category') === 'girls' ? 'girls' : searchParams.get('category') === 'boys' ? 'boys' : 'all');
  const initialCategory = searchParams.get('category') === 'girls' || searchParams.get('category') === 'boys' ? 'all' : (searchParams.get('category') || 'all');
  const initialAge = searchParams.get('age') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [selectedGender, setSelectedGender] = useState<'all' | 'girls' | 'boys'>(initialGender as any);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedAge, setSelectedAge] = useState(initialAge);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedSize, setSelectedSize] = useState('all');
  const [priceTier, setPriceTier] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category');
    const gen = searchParams.get('gender');
    
    if (cat === 'girls') {
      setSelectedGender('girls');
      setSelectedCategory('all');
    } else if (cat === 'boys') {
      setSelectedGender('boys');
      setSelectedCategory('all');
    } else if (cat) {
      setSelectedCategory(cat);
    }

    if (gen === 'girls' || gen === 'boys' || gen === 'all') {
      setSelectedGender(gen);
    }

    if (searchParams.has('age')) {
      setSelectedAge(searchParams.get('age') || 'all');
    }
    if (searchParams.has('search')) {
      setSearchQuery(searchParams.get('search') || '');
    }
  }, [searchParams]);

  const handleGenderChange = (gender: 'all' | 'girls' | 'boys') => {
    setSelectedGender(gender);
    const newParams = new URLSearchParams(searchParams);
    if (gender === 'all') {
      newParams.delete('gender');
      if (newParams.get('category') === 'girls' || newParams.get('category') === 'boys') {
        newParams.delete('category');
      }
    } else {
      newParams.set('gender', gender);
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    const newParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', catId);
    }
    setSearchParams(newParams);
  };

  const handleAgeChange = (ageId: string) => {
    setSelectedAge(ageId);
    const newParams = new URLSearchParams(searchParams);
    if (ageId === 'all') {
      newParams.delete('age');
    } else {
      newParams.set('age', ageId);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSelectedGender('all');
    setSelectedCategory('all');
    setSelectedAge('all');
    setSearchQuery('');
    setSelectedSize('all');
    setPriceTier('all');
    setSortBy('featured');
    setSearchParams({});
  };

  const filteredProducts = useMemo(() => {
    return DEMO_PRODUCTS.filter((product) => {
      // 1. Strict gender filter
      if (selectedGender === 'girls') {
        if (product.gender !== 'girls' && product.gender !== 'unisex') return false;
      } else if (selectedGender === 'boys') {
        if (product.gender !== 'boys' && product.gender !== 'unisex') return false;
      }

      // 2. Category Filter
      if (selectedCategory !== 'all') {
        if (product.category !== selectedCategory) return false;
      }

      // 3. Age Filter
      if (selectedAge !== 'all') {
        if (selectedAge === '1-3' && (product.ageMin > 3 || product.ageMax < 1)) return false;
        if (selectedAge === '4-6' && (product.ageMin > 6 || product.ageMax < 4)) return false;
        if (selectedAge === '7-9' && (product.ageMin > 9 || product.ageMax < 7)) return false;
        if (selectedAge === '10-13' && (product.ageMin > 13 || product.ageMax < 10)) return false;
      }

      // 4. Size Filter
      if (selectedSize !== 'all') {
        if (!product.availableSizes.includes(selectedSize)) return false;
      }

      // 5. Price Tier Filter
      if (priceTier === 'under20k' && product.price >= 20000) return false;
      if (priceTier === '20k-30k' && (product.price < 20000 || product.price > 30000)) return false;
      if (priceTier === 'above30k' && product.price <= 30000) return false;

      // 6. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesTag = product.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesTag) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return 0;
    });
  }, [selectedGender, selectedCategory, selectedAge, selectedSize, priceTier, searchQuery, sortBy]);

  const activeFiltersCount = (selectedGender !== 'all' ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedAge !== 'all' ? 1 : 0) +
    (selectedSize !== 'all' ? 1 : 0) +
    (priceTier !== 'all' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header with High-Contrast Typography & Gender Tabs */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent block mb-1">
              Crown & Coral Royal Catalogue
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-boutique-charcoal">
              {selectedGender === 'girls' ? "Princesses' Royal Outfits" : selectedGender === 'boys' ? "Princes' Royal Outfits" : "Royal Children's Occasionwear"}
            </h1>
            <p className="text-xs sm:text-sm text-boutique-taupe mt-1">
              Showing <span className="font-bold text-boutique-charcoal tabular-nums">{filteredProducts.length}</span> curated pieces across standard age sizes
            </p>
          </div>

          {/* Clean Segmented Control for Gender */}
          <div className="flex items-center p-1.5 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60">
            {GENDER_FILTERS.map((g) => (
              <button
                key={g.id}
                onClick={() => handleGenderChange(g.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
                  selectedGender === g.id
                    ? 'bg-white text-boutique-charcoal shadow-xs font-bold'
                    : 'text-boutique-taupe hover:text-boutique-charcoal'
                }`}
              >
                {g.id === 'all' ? 'All Kids' : g.id === 'girls' ? '👑 Princesses' : '👑 Princes'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-card">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-8 py-2 text-xs bg-white/60 backdrop-blur-xs border border-white/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-boutique-rose/30 text-boutique-charcoal w-48 sm:w-64 transition"
            />
            <Search className="w-4 h-4 text-boutique-taupe absolute left-2.5 top-2.5 pointer-events-none" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 text-boutique-taupe">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden px-3.5 py-2 bg-white/60 backdrop-blur-xs rounded-xl text-boutique-charcoal flex items-center gap-1.5 text-xs font-bold border border-white/80"
          >
            <SlidersHorizontal className="w-4 h-4 text-boutique-rose" />
            <span>Filters ({activeFiltersCount})</span>
          </button>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 bg-white/40 border border-white/70 rounded-xl px-3 py-1.5 text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-boutique-taupe" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent focus:outline-none text-boutique-charcoal font-semibold cursor-pointer"
          >
            <option value="featured">Featured Picks</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="newest">New Arrivals</option>
          </select>
        </div>
      </div>

      {/* Mobile Horizontal Quick-Category Pills */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
        {[
          { label: 'All Outfits', onClick: () => { handleGenderChange('all'); handleCategoryChange('all'); }, active: selectedGender === 'all' && selectedCategory === 'all' },
          { label: '👧 Girls', onClick: () => handleGenderChange('girls'), active: selectedGender === 'girls' },
          { label: '👦 Boys', onClick: () => handleGenderChange('boys'), active: selectedGender === 'boys' },
          { label: 'Partywear', onClick: () => handleCategoryChange('dresses-partywear'), active: selectedCategory === 'dresses-partywear' },
          { label: 'Matching Sets', onClick: () => handleCategoryChange('matching-sets'), active: selectedCategory === 'matching-sets' },
          { label: 'Baby 1–3y', onClick: () => handleCategoryChange('baby'), active: selectedCategory === 'baby' },
        ].map((chip) => (
          <button
            key={chip.label}
            onClick={chip.onClick}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              chip.active
                ? 'bg-gray-900 text-white shadow-xs'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Sidebar Filters */}
        <aside className={`lg:block ${mobileFilterOpen ? 'fixed inset-0 z-50 bg-black/50 p-0 sm:p-4 flex items-end sm:items-center justify-center' : 'hidden'}`}>
          <div className="bg-white rounded-t-3xl sm:rounded-2xl p-5 border border-gray-200 space-y-5 w-full max-w-sm max-h-[85vh] overflow-y-auto animate-fadeIn">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-semibold text-sm text-gray-900">
                Filter Outfits
              </h3>
              {activeFiltersCount > 0 && (
                <button onClick={clearAllFilters} className="text-xs text-accent font-semibold hover:underline">
                  Reset
                </button>
              )}
              {mobileFilterOpen && (
                <button onClick={() => setMobileFilterOpen(false)} className="lg:hidden text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-semibold text-gray-900 mb-2">Category</h4>
              <div className="space-y-1">
                {CATEGORIES_LIST.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      selectedCategory === cat.id
                        ? 'bg-gray-900 text-white font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Age Range */}
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-xs font-semibold text-gray-900 mb-2">Age</h4>
              <div className="space-y-1">
                {AGE_RANGES.map((age) => (
                  <button
                    key={age.id}
                    onClick={() => handleAgeChange(age.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      selectedAge === age.id
                        ? 'bg-gray-900 text-white font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {age.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Budget */}
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-xs font-semibold text-gray-900 mb-2">Price (₦)</h4>
              <div className="space-y-1 text-xs">
                {[
                  { id: 'all', label: 'All Budgets' },
                  { id: 'under20k', label: 'Under ₦20,000' },
                  { id: '20k-30k', label: '₦20,000 – ₦30,000' },
                  { id: 'above30k', label: 'Above ₦30,000' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setPriceTier(tier.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg transition ${
                      priceTier === tier.id
                        ? 'bg-accent-light text-accent font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-xs font-semibold text-gray-900 mb-2">Size</h4>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setSelectedSize('all')}
                  className={`px-2.5 py-1 rounded text-xs font-medium ${
                    selectedSize === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  All
                </button>
                {SIZES_LIST.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-2.5 py-1 rounded text-xs font-medium ${
                      selectedSize === sz ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {mobileFilterOpen && (
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 btn-accent-primary rounded-xl text-xs font-semibold mt-4 shadow-sm"
              >
                Show {filteredProducts.length} Outfits
              </button>
            )}

          </div>
        </aside>

        {/* Product Cards Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-gray-200 space-y-3">
              <h3 className="font-serif font-bold text-lg text-gray-900">
                No matching outfits found
              </h3>
              <p className="text-xs text-gray-500">
                Try widening your filters to see more pieces.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 rounded-lg bg-gray-900 text-white text-xs font-medium"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
