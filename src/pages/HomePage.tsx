import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, ShieldCheck, Truck, Sparkles, Gift } from 'lucide-react';
import { DEMO_PRODUCTS } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';

export const HomePage: React.FC = () => {
  const featuredProducts = DEMO_PRODUCTS.filter((p) => p.isFeatured).slice(0, 4);
  const newArrivals = DEMO_PRODUCTS.filter((p) => p.isNewArrival).slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="pt-4 sm:pt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-gradient-to-br from-white/95 via-boutique-warm-white to-[#F9F4EC]/60 backdrop-blur-2xl rounded-3xl p-6 sm:p-12 lg:p-16 border border-boutique-border shadow-glass-card overflow-hidden">
            
            {/* Ambient Background Glow Accents */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-boutique-rose-light/60 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              
              {/* Left Column: Editorial Headline & Luxury CTAs */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-boutique-rose-light text-boutique-rose text-[11px] font-bold uppercase tracking-widest border border-boutique-rose/25">
                  <Sparkles className="w-3.5 h-3.5 text-boutique-rose" />
                  <span>Spring & Summer Atelier 2026</span>
                </div>

                {/* Elegant Editorial Headline */}
                <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-boutique-charcoal text-balance leading-[1.12]">
                  Occasionwear & Heirloom Linen for Children Aged 1 to 13
                </h1>

                <p className="text-sm sm:text-base text-boutique-taupe max-w-xl leading-relaxed">
                  Carefully tailored birthday dresses, organic cotton sets, and celebration outfits. Doorstep delivery across Lagos and nationwide with pay-on-delivery options.
                </p>

                {/* Refined CTAs */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <Link
                    to="/shop?gender=girls"
                    className="btn-accent-primary px-7 py-3.5 rounded-2xl font-semibold text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-clay-pill"
                  >
                    <span>Shop Girls' Atelier</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/shop?gender=boys"
                    className="px-7 py-3.5 rounded-2xl bg-boutique-charcoal text-white hover:bg-black font-semibold text-xs uppercase tracking-wider transition shadow-sm hover:shadow-md"
                  >
                    <span>Shop Boys' Collection</span>
                  </Link>
                </div>

                {/* Trust Highlights Strip with Tabular Nums */}
                <div className="pt-6 grid grid-cols-3 gap-6 border-t border-boutique-border/70 max-w-md">
                  <div>
                    <span className="block text-2xl font-serif font-bold text-boutique-charcoal tabular-nums">100%</span>
                    <span className="text-[11px] font-medium text-boutique-taupe">Organic Cottons</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-serif font-bold text-boutique-charcoal tabular-nums">1–13y</span>
                    <span className="text-[11px] font-medium text-boutique-taupe">Atelier Sizing</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-serif font-bold text-boutique-charcoal tabular-nums">48h</span>
                    <span className="text-[11px] font-medium text-boutique-taupe">Lagos Dispatch</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Hero Fashion Visual with Ambient Floating Animation */}
              <div className="lg:col-span-5 relative">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-boutique-sand/40 border border-boutique-border shadow-2xl group image-shine-wrapper animate-float-slow relative">
                  <img
                    src="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1000&auto=format&fit=crop"
                    alt="Blossom Petal Tulle Party Dress"
                    className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-1000 ease-out"
                  />

                  {/* Ambient Glass Floating Pill */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-xl p-3 sm:p-3.5 rounded-2xl border border-white/70 shadow-glass-card flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-boutique-rose tracking-wider block">
                        Signature Collection
                      </span>
                      <span className="text-xs font-bold text-boutique-charcoal">
                        Blossom Petal Party Gown
                      </span>
                    </div>
                    <Link
                      to="/product/ln-001"
                      className="px-3.5 py-1.5 rounded-xl bg-boutique-charcoal text-white text-[11px] font-semibold hover:bg-boutique-rose transition"
                    >
                      View Piece
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Boutique Pillars / Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-boutique-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-boutique-rose-light text-boutique-rose flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-boutique-charcoal">Pure Natural Fabrics</h4>
              <p className="text-[11px] text-boutique-taupe">Breathable French linen & cotton</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-boutique-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-boutique-charcoal">Express Lagos Delivery</h4>
              <p className="text-[11px] text-boutique-taupe">24–48h doorstep courier</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-boutique-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-boutique-charcoal">Pay on Delivery</h4>
              <p className="text-[11px] text-boutique-taupe">Cash or POS on arrival</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-boutique-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-boutique-charcoal">Gift Box Packaging</h4>
              <p className="text-[11px] text-boutique-taupe">Silk ribbons & presentation box</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Stage of Growth */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-boutique-rose block mb-1">
              Curated Age Collections
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-boutique-charcoal">
              Shop by Growth Stage
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-wider text-boutique-rose hover:text-boutique-rose-hover flex items-center gap-1.5"
          >
            <span>View All Outfits</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {[
            { label: 'Toddlers', age: '1–3 Years', path: '/shop?age=1-3', desc: 'Rompers, bloomers & playwear', bg: 'hover:border-pink-300' },
            { label: 'Little Kids', age: '4–6 Years', path: '/shop?age=4-6', desc: 'Birthday dresses & linen sets', bg: 'hover:border-amber-300' },
            { label: 'Kids', age: '7–9 Years', path: '/shop?age=7-9', desc: 'Partywear, blazers & smockings', bg: 'hover:border-emerald-300' },
            { label: 'Pre-Teens', age: '10–13 Years', path: '/shop?age=10-13', desc: 'Tailored jackets & occasionwear', bg: 'hover:border-blue-300' },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`boutique-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between group transition-all duration-300 ${item.bg}`}
            >
              <div>
                <span className="text-xs font-bold text-boutique-rose tabular-nums">{item.age}</span>
                <h3 className="font-serif font-bold text-base sm:text-lg text-boutique-charcoal mt-1 group-hover:text-boutique-rose transition-colors">
                  {item.label}
                </h3>
                <p className="text-xs text-boutique-taupe mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
              <span className="mt-5 text-xs font-bold text-boutique-charcoal flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Explore</span>
                <ChevronRight className="w-3.5 h-3.5 text-boutique-rose" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Pieces */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-boutique-rose block mb-1">
              Hand-Selected Pieces
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-boutique-charcoal">
              Featured Outfits
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-wider text-boutique-rose hover:text-boutique-rose-hover flex items-center gap-1.5"
          >
            <span>Browse Full Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Doorstep Booking Process Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#1E1B18] via-[#2A2421] to-[#1E1B18] text-white rounded-3xl p-8 sm:p-14 border border-boutique-border/20 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-boutique-rose/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-5">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">
              Doorstep Express Checkout
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight">
              Order Online in 60 Seconds • Pay When Delivered
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xl">
              Select your child's size, enter your address, and your order is booked immediately. Pay on arrival using cash, bank transfer, or card POS with live SMS tracking until delivery.
            </p>
            <div className="pt-3">
              <Link
                to="/shop"
                className="btn-accent-primary px-7 py-3.5 rounded-2xl font-semibold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-clay-pill"
              >
                <span>Browse Outfits & Reserve</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-boutique-rose block mb-1">
              Fresh Off The Atelier
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-boutique-charcoal">
              New Arrivals This Week
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-wider text-boutique-rose hover:text-boutique-rose-hover flex items-center gap-1.5"
          >
            <span>View All ({DEMO_PRODUCTS.length}) Outfits</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
};