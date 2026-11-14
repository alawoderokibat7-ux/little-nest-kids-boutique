import React from 'react';
import { Link } from 'react-router-dom';
import { Crown } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-transparent via-[#06281E]/5 to-[#06281E]/15 border-t border-accent/20 mt-20 pt-16 pb-12 text-boutique-taupe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-boutique-border/70">
          
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0A3327] to-[#06281E] border border-accent/40 flex items-center justify-center text-accent shadow-xs">
                <Crown className="w-4 h-4 text-accent" />
              </div>
              <span className="font-serif text-xl font-bold text-boutique-charcoal block">
                Crown & Coral
              </span>
            </div>
            <p className="text-xs text-boutique-taupe leading-relaxed">
              Curated royal Nigerian occasionwear, Sunday best dresses, and tailored linen suits for children aged 1 to 13.
            </p>
          </div>

          <div>
            <h5 className="text-[11px] font-bold uppercase tracking-[0.2em] text-boutique-charcoal mb-4 flex items-center gap-1.5">
              <Crown className="w-3 h-3 text-accent" />
              <span>Royal Collections</span>
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/shop?gender=girls" className="hover:text-accent transition">Little Princesses (Gowns & Sets)</Link></li>
              <li><Link to="/shop?gender=boys" className="hover:text-accent transition">Little Princes (Blazers & Linens)</Link></li>
              <li><Link to="/shop?category=birthday" className="hover:text-accent transition">Sunday Best & Milestone Galas</Link></li>
              <li><Link to="/shop?category=baby" className="hover:text-accent transition">Royal Toddlers (1–3 yrs)</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-[11px] font-bold uppercase tracking-[0.2em] text-boutique-charcoal mb-4">
              Atelier Care & Support
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/shop" className="hover:text-accent transition">Full Royal Catalogue</Link></li>
              <li><Link to="/cart" className="hover:text-accent transition">Shopping Bag</Link></li>
              <li><Link to="/track" className="hover:text-accent transition">Track Your Parcel</Link></li>
              <li><Link to="/admin" className="hover:text-accent transition">Store Owner Admin Suite</Link></li>
              <li><span className="text-boutique-muted">Dispatch: Mon – Sat • Lagos & Nationwide</span></li>
            </ul>
          </div>

          <div>
            <h5 className="text-[11px] font-bold uppercase tracking-[0.2em] text-boutique-charcoal mb-4">
              White-Glove Promise
            </h5>
            <p className="text-xs text-boutique-taupe leading-relaxed">
              Express 24–48h doorstep delivery across Lagos and nationwide white-glove courier. Pay on Delivery available via POS, bank transfer, or cash on arrival.
            </p>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-boutique-muted">
          <p>© {new Date().getFullYear()} Crown & Coral Kids Atelier Ltd. (RC: 1894201). All rights reserved.</p>
          <p className="font-medium text-boutique-charcoal flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span>Handcrafted Royal Occasionwear • Lagos, Nigeria</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
