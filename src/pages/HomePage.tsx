import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { DEMO_PRODUCTS } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';

export const HomePage: React.FC = () => {
  const featuredProducts = DEMO_PRODUCTS.filter((p) => p.isFeatured).slice(0, 4);
  const newArrivals = DEMO_PRODUCTS.filter((p) => p.isNewArrival).slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="pt-6 sm:pt-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Outer Hero Box: rounded-3xl (24px), p-8 (32px) => Inner element radius = 0 / clean */}
          <div className="bg-white rounded-3xl p-6 sm:p-12 lg:p-16 border border-gray-200">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Specific, Well-wrapped Headline & Strong CTA */}
              <div className="lg:col-span-7 space-y-6">
                
                <span className="text-xs font-semibold uppercase tracking-wider text-accent block">
                  New Spring & Summer Collection
                </span>

                {/* Specific, Unitalicized, Well-wrapped Headline */}
                <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 text-balance leading-tight">
                  Occasionwear and Breathable Linen for Children Aged 1 to 13
                </h1>

                <p className="text-base text-gray-600 max-w-xl leading-relaxed">
                  Carefully tailored birthday dresses, organic cotton sets, and celebration outfits. Doorstep delivery across Lagos and nationwide with pay-on-delivery options.
                </p>

                {/* Emphasized Primary & Secondary CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    to="/shop?gender=girls"
                    className="btn-accent-primary px-7 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-sm"
                  >
                    <span>Shop Girls</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/shop?gender=boys"
                    className="px-7 py-3.5 rounded-xl bg-gray-900 text-white hover:bg-black font-semibold text-sm transition"
                  >
                    <span>Shop Boys</span>
                  </Link>
                </div>

                {/* Specific Numeric Details with Tabular Nums */}
                <div className="pt-6 grid grid-cols-3 gap-6 border-t border-gray-100 max-w-md">
                  <div>
                    <span className="block text-2xl font-bold text-gray-900 tabular-nums">100%</span>
                    <span className="text-xs text-gray-500">Organic Cotton</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-bold text-gray-900 tabular-nums">1–13y</span>
                    <span className="text-xs text-gray-500">Standard Sizes</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-bold text-gray-900 tabular-nums">48h</span>
                    <span className="text-xs text-gray-500">Doorstep Delivery</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Enlarged Main Feature Photo (Clean, Product-focused) */}
              <div className="lg:col-span-5">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                  <img
                    src="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1000&auto=format&fit=crop"
                    alt="Blossom Petal Tulle Party Dress"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Shop by Stage of Growth */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent block mb-1">
              Age Categories
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
              Shop by Age Range
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
          >
            View All Collection <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: 'Toddlers', age: '1–3 Years', path: '/shop?age=1-3', desc: 'Rompers and playwear' },
            { label: 'Little Kids', age: '4–6 Years', path: '/shop?age=4-6', desc: 'Party dresses and linen' },
            { label: 'Kids', age: '7–9 Years', path: '/shop?age=7-9', desc: 'Occasionwear and blazers' },
            { label: 'Pre-Teens', age: '10–13 Years', path: '/shop?age=10-13', desc: 'Tailored coats and sets' },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-gray-300 transition flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-accent tabular-nums">{item.age}</span>
                <h3 className="font-serif font-bold text-base text-gray-900 mt-1">{item.label}</h3>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              </div>
              <span className="mt-4 text-xs font-semibold text-gray-900 flex items-center gap-1">
                Explore <ChevronRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Pieces */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent block mb-1">
              Curated Picks
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
              Featured Outfits
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
          >
            Browse Catalogue <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Order Booking Process Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900 text-white rounded-3xl p-8 sm:p-12 border border-gray-800">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Doorstep Checkout
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold">
              Reserve Outfits with Direct Doorstep Delivery
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Order directly online in under 60 seconds. Choose Pay on Delivery with cash or card when your package arrives, or pay via instant bank transfer. Receive step-by-step SMS updates until delivery.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="btn-accent-primary px-6 py-3 rounded-xl font-semibold text-xs inline-flex items-center gap-2"
              >
                Browse Outfits & Book
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent block mb-1">
              This Week
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
          >
            View All ({DEMO_PRODUCTS.length}) Outfits <ArrowRight className="w-3.5 h-3.5" />
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
