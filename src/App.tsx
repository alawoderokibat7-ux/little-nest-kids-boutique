import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { AIAssistantWidget } from './components/ai/AIAssistantWidget';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { MobileSearchModal } from './components/common/MobileSearchModal';
import { LiveActivityToast } from './components/common/LiveActivityToast';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { AdminDemoPage } from './pages/AdminDemoPage';

const GlobalToast: React.FC = () => {
  const { toastMessage, clearToast } = useCart();
  if (!toastMessage) return null;

  return (
    <div className="fixed top-14 sm:top-16 left-1/2 -translate-x-1/2 z-50 animate-fadeIn">
      <div 
        onClick={clearToast}
        className="px-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-semibold shadow-xl flex items-center gap-2 cursor-pointer"
      >
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};

export const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-boutique-charcoal font-sans selection:bg-accent/20 selection:text-accent relative">
      {/* Ambient Glassmorphic Glowing Orbs in Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-pink-200/55 rounded-full blur-[140px] animate-pulse [animation-duration:8s]" />
        <div className="absolute top-1/4 -right-40 w-[550px] h-[550px] bg-purple-200/45 rounded-full blur-[140px] animate-pulse [animation-duration:10s]" />
        <div className="absolute top-2/3 -left-20 w-[500px] h-[500px] bg-amber-100/60 rounded-full blur-[130px] animate-pulse [animation-duration:9s]" />
        <div className="absolute -bottom-32 right-1/4 w-[600px] h-[600px] bg-blue-100/55 rounded-full blur-[140px] animate-pulse [animation-duration:11s]" />
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Global Toast */}
      <GlobalToast />

      {/* Pages */}
      <main className="flex-grow pb-16 lg:pb-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin-demo" element={<AdminDemoPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Concierge Widget */}
      <AIAssistantWidget />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Mobile Search Modal */}
      <MobileSearchModal />

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav />

      {/* Live Social Proof Activity Toast */}
      <LiveActivityToast />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </BrowserRouter>
  );
}
