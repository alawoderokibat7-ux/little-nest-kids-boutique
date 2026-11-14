import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-transparent via-[#F7F2EB] to-[#EFE7DC] border-t border-boutique-border mt-20 pt-16 pb-12 text-boutique-taupe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-boutique-border/70">
          
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-boutique-rose-light border border-boutique-rose/20 flex items-center justify-center text-boutique-rose font-bold text-xs font-serif">
                LN
              </div>
              <span className="font-serif text-xl font-bold text-boutique-charcoal block">
                Little Nest
              </span>
            </div>
            <p className="text-xs text-boutique-taupe leading-relaxed">
              Curated occasionwear, birthday gowns, and tailored French linen sets for children aged 1 to 13.
            </p>
          </div>

          <div>
            <h5 className="text-[11px] font-bold uppercase tracking-[0.2em] text-boutique-charcoal mb-4">
              Shop Collections
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/shop?gender=girls" className="hover:text-boutique-rose transition">Girls' Occasionwear</Link></li>
              <li><Link to="/shop?gender=boys" className="hover:text-boutique-rose transition">Boys' Linen & Blazers</Link></li>
              <li><Link to="/shop?category=birthday" className="hover:text-boutique-rose transition">Milestone Birthday Gowns</Link></li>
              <li><Link to="/shop?category=baby" className="hover:text-boutique-rose transition">Baby & Toddler (1–3y)</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-[11px] font-bold uppercase tracking-[0.2em] text-boutique-charcoal mb-4">
              Boutique Care
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/shop" className="hover:text-boutique-rose transition">Full Atelier Catalogue</Link></li>
              <li><Link to="/cart" className="hover:text-boutique-rose transition">Shopping Bag</Link></li>
              <li><Link to="/track" className="hover:text-boutique-rose transition">Track Your Parcel</Link></li>
              <li><Link to="/admin" className="hover:text-boutique-rose transition">Store Owner Admin Portal</Link></li>
              <li><span className="text-boutique-muted">Dispatch: Mon – Sat • Lagos & Nationwide</span></li>
            </ul>
          </div>

          <div>
            <h5 className="text-[11px] font-bold uppercase tracking-[0.2em] text-boutique-charcoal mb-4">
              Doorstep Promise
            </h5>
            <p className="text-xs text-boutique-taupe leading-relaxed">
              Express 24–48h doorstep delivery across Lagos and nationwide courier. Pay on Delivery available via POS, bank transfer, or cash on arrival.
            </p>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-boutique-muted">
          <p>© {new Date().getFullYear()} Little Nest Children's Atelier Ltd. (RC: 1894201). All rights reserved.</p>
          <p className="font-medium text-boutique-charcoal">Handcrafted Luxury Occasionwear • Lagos, Nigeria</p>
        </div>

      </div>
    </footer>
  );
};
