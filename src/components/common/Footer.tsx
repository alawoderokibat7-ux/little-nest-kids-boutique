import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20 pt-12 pb-10 text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-gray-100">
          
          <div className="md:col-span-1 space-y-3">
            <span className="font-serif text-xl font-bold text-gray-900 block">
              Little Nest
            </span>
            <p className="text-xs text-gray-500 leading-relaxed">
              Curated clothing, birthday dresses, and tailored linen sets for children aged 1 to 13.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-3">
              Shop Collections
            </h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/shop?gender=girls" className="hover:text-gray-900 transition">Girls' Collection</Link></li>
              <li><Link to="/shop?gender=boys" className="hover:text-gray-900 transition">Boys' Collection</Link></li>
              <li><Link to="/shop?category=birthday" className="hover:text-gray-900 transition">Birthday Outfits</Link></li>
              <li><Link to="/shop?category=baby" className="hover:text-gray-900 transition">Baby & Toddler (1–3y)</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-3">
              Customer Care
            </h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/shop" className="hover:text-gray-900 transition">Catalogue</Link></li>
              <li><Link to="/cart" className="hover:text-gray-900 transition">Shopping Bag</Link></li>
              <li><Link to="/admin-demo" className="hover:text-gray-900 transition">Orders Hub</Link></li>
              <li><span className="text-gray-400">Dispatch: Monday to Saturday</span></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-3">
              Delivery & Support
            </h5>
            <p className="text-xs text-gray-500 leading-relaxed">
              Fast doorstep delivery across Lagos and nationwide express courier. Pay on Delivery available on all orders.
            </p>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Little Nest Kids Boutique. All rights reserved.</p>
          <p>Lagos & Nationwide Doorstep Delivery</p>
        </div>

      </div>
    </footer>
  );
};
