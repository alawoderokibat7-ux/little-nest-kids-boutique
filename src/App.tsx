import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import { OrdersProvider } from './context/OrdersContext';
import { SupportProvider } from './context/SupportContext';
import { AtmosphereProvider, AtmosphereBackground } from './components/common/AtmosphereBackground';
import { SmoothScrollProvider } from './components/common/SmoothScrollProvider';
import ClickSpark from './components/ui/ClickSpark';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { LiveSupportChat } from './components/support/LiveSupportChat';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { MobileSearchModal } from './components/common/MobileSearchModal';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
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
    <ClickSpark sparkColor={['#D46A7E', '#EBB2B2', '#E2D4C0', '#F8E8E8']} sparkSize={10} sparkRadius={18} sparkCount={7}>
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
            <Route path="/track" element={<OrderTrackingPage />} />
            <Route path="/admin" element={<AdminDemoPage />} />
            <Route path="/admin-demo" element={<AdminDemoPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Live Boutique Support & Concierge Chat Box */}
        <LiveSupportChat />

        {/* Cart Drawer */}
        <CartDrawer />

        {/* Mobile Search Modal */}
        <MobileSearchModal />

        {/* Mobile Sticky Bottom Navigation */}
        <MobileBottomNav />

        {/* Footer */}
        <Footer />
      </div>
    </ClickSpark>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScrollProvider>
        <AtmosphereProvider>
          <OrdersProvider>
            <SupportProvider>
              <CartProvider>
                <AppContent />
              </CartProvider>
            </SupportProvider>
          </OrdersProvider>
        </AtmosphereProvider>
      </SmoothScrollProvider>
    </BrowserRouter>
  );
}
