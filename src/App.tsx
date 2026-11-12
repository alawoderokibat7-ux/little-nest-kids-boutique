import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import { AtmosphereProvider, AtmosphereBackground } from './components/common/AtmosphereBackground';
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
      {/* Dynamic 3D / Canvas Animated Atmosphere Background */}
      <AtmosphereBackground />

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
      <AtmosphereProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AtmosphereProvider>
    </BrowserRouter>
  );
}
