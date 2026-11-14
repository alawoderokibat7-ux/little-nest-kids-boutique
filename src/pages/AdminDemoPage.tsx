import React, { useState, useMemo, useRef } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Clock, 
  Search, 
  Lock, 
  Unlock, 
  CheckCircle, 
  AlertCircle, 
  Trash2, 
  MessageCircle, 
  Phone, 
  MapPin, 
  Plus, 
  Eye, 
  X,
  CreditCard,
  Banknote,
  Truck,
  Printer,
  Sparkles,
  ShieldCheck,
  Award,
  FileText,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useOrders, StoreOrder, PaymentStatus, FulfillmentStatus } from '../context/OrdersContext';
import { formatPrice } from '../utils/formatters';
import { DEMO_PRODUCTS } from '../data/products';
import SpotlightCard from '../components/ui/SpotlightCard';

export const AdminDemoPage: React.FC = () => {
  const { 
    orders, 
    updatePaymentStatus, 
    updateFulfillmentStatus, 
    deleteOrder, 
    addOrder 
  } = useOrders();

  // Admin Passcode Protection (Default PIN: 1234 or Rocky)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('little_nest_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active View Tab: 'orders' | 'financials' | 'dispatch'
  const [activeTab, setActiveTab] = useState<'orders' | 'financials' | 'dispatch'>('orders');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'gift_boxing' | 'dispatched' | 'delivered'>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<'all' | 'card' | 'transfer' | 'pod'>('all');
  
  // Modals
  const [selectedOrder, setSelectedOrder] = useState<StoreOrder | null>(null);
  const [waybillOrder, setWaybillOrder] = useState<StoreOrder | null>(null);
  const [verifySlipOrder, setVerifySlipOrder] = useState<StoreOrder | null>(null);
  const [isManualOrderOpen, setIsManualOrderOpen] = useState(false);

  // Manual Order Form State
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualCity, setManualCity] = useState('Lagos - Island (Lekki, Ikoyi, VI)');
  const [manualAddress, setManualAddress] = useState('');
  const [manualProductId, setManualProductId] = useState(DEMO_PRODUCTS[0]?.id || '');
  const [manualSize, setManualSize] = useState('4Y');
  const [manualPaymentMethod, setManualPaymentMethod] = useState<'pod' | 'transfer' | 'card'>('transfer');
  const [manualPaymentStatus, setManualPaymentStatus] = useState<PaymentStatus>('paid');
  const [manualClientTier, setManualClientTier] = useState<'Crown VIP' | 'Atelier Member' | 'First-Time Client'>('Atelier Member');
  const [manualGiftWrapping, setManualGiftWrapping] = useState('Signature Blush Silk Box & Gold Ribbon');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput.toLowerCase() === 'rocky') {
      setIsAuthenticated(true);
      localStorage.setItem('little_nest_admin_auth', 'true');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('little_nest_admin_auth');
  };

  // Filtered orders computation
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (statusFilter === 'paid' && order.paymentStatus !== 'paid') return false;
      if (statusFilter === 'pending' && order.paymentStatus !== 'pending') return false;
      if (statusFilter === 'gift_boxing' && order.fulfillmentStatus !== 'gift_boxing') return false;
      if (statusFilter === 'dispatched' && order.fulfillmentStatus !== 'dispatched') return false;
      if (statusFilter === 'delivered' && order.fulfillmentStatus !== 'delivered') return false;

      // Payment method filter
      if (paymentMethodFilter !== 'all' && order.paymentMethod !== paymentMethodFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = order.customerName.toLowerCase().includes(query);
        const matchesPhone = order.phone.toLowerCase().includes(query);
        const matchesId = order.id.toLowerCase().includes(query);
        const matchesCity = order.city.toLowerCase().includes(query);
        const matchesRef = order.paymentReference?.toLowerCase().includes(query);
        return matchesName || matchesPhone || matchesId || matchesCity || !!matchesRef;
      }
      return true;
    });
  }, [orders, statusFilter, paymentMethodFilter, searchQuery]);

  // Financial Metrics
  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + o.total, 0), [orders]);
  const paidRevenue = useMemo(() => orders.filter((o) => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0), [orders]);
  const pendingRevenue = useMemo(() => orders.filter((o) => o.paymentStatus === 'pending').reduce((sum, o) => sum + o.total, 0), [orders]);
  const avgOrderValue = useMemo(() => orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0, [orders, totalRevenue]);

  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = DEMO_PRODUCTS.find((p) => p.id === manualProductId) || DEMO_PRODUCTS[0];
    if (!prod) return;

    addOrder({
      customerName: manualName || 'Walk-in Boutique Client',
      phone: manualPhone || '+234 800 000 0000',
      city: manualCity,
      address: manualAddress || 'In-Store Atelier Collection',
      items: [{ product: prod, selectedSize: manualSize, quantity: 1 }],
      subtotal: prod.price,
      deliveryFee: manualCity.includes('In-Store') ? 0 : 2500,
      total: prod.price + (manualCity.includes('In-Store') ? 0 : 2500),
      paymentMethod: manualPaymentMethod,
      paymentStatus: manualPaymentStatus,
      fulfillmentStatus: 'new',
      clientTier: manualClientTier,
      giftWrapping: manualGiftWrapping,
      notes: 'Recorded via Store Admin Operations',
    });

    setIsManualOrderOpen(false);
    setManualName('');
    setManualPhone('');
    setManualAddress('');
  };

  const openWhatsAppCustomer = (order: StoreOrder) => {
    const cleanPhone = order.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${order.customerName},\nThis is Little Nest Children's Atelier regarding your order #${order.id}.\n• Amount: ₦${order.total.toLocaleString()}\n• Payment: ${order.paymentStatus === 'paid' ? 'PAID & VERIFIED (' + (order.paymentGateway || 'Bank Settlement') + ')' : 'PAYMENT PENDING'}\n• Waybill: ${order.waybillNumber || 'Assigned to Courier'}\n• Packaging: ${order.giftWrapping || 'Silk Gift Box'}\n\nOur concierge is overseeing your luxury preparation. Thank you for dressing with Little Nest!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const printWaybill = () => {
    window.print();
  };

  // If not authenticated, render Owner Login Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <SpotlightCard
          theme="light"
          spotlightColor="#D46A7E"
          intensity={0.25}
          spotlightSize={320}
          className="w-full max-w-md p-8 glass-panel rounded-3xl text-center space-y-6 relative border border-white/80 shadow-2xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-boutique-charcoal text-amber-300 mx-auto flex items-center justify-center shadow-md">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-boutique-rose-light text-boutique-rose text-[10px] font-bold tracking-widest uppercase mb-2">
              <Sparkles className="w-3 h-3 text-boutique-rose" />
              <span>Executive Atelier Management</span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-boutique-charcoal">
              Little Nest · Executive Portal
            </h1>
            <p className="text-xs text-boutique-taupe mt-1.5 max-w-xs mx-auto">
              Secure access to incoming VIP client bookings, payment gateway settlements, and dispatch logistics.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-boutique-charcoal uppercase tracking-wider mb-1.5">
                Atelier Master PIN / Passcode
              </label>
              <input
                type="password"
                placeholder="Enter PIN (e.g. 1234 or Rocky)"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                className={`w-full px-4 py-3 rounded-xl text-sm bg-white/90 border ${
                  pinError ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-boutique-rose'
                } focus:outline-none focus:ring-2`}
                autoFocus
              />
              {pinError && (
                <span className="text-[11px] text-red-500 font-medium block mt-1">
                  Incorrect PIN. Try 1234 or Rocky
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full btn-accent-primary py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Executive Dashboard</span>
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setIsAuthenticated(true);
                localStorage.setItem('little_nest_admin_auth', 'true');
              }}
              className="text-[11px] font-semibold text-boutique-taupe hover:text-boutique-rose underline underline-offset-2"
            >
              Quick Unlock (1-Click Owner Sign In)
            </button>
          </div>
        </SpotlightCard>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Admin Navigation Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/80 shadow-xl relative overflow-hidden">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-800 text-[11px] font-bold border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Atelier Operations Live</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-boutique-rose-light text-boutique-rose text-[10px] font-bold uppercase tracking-wider">
              RC: 1894201
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-boutique-charcoal">
            Little Nest Children's Atelier · Operations Suite
          </h1>
          <p className="text-xs sm:text-sm text-boutique-taupe">
            Benchmarked against Parisian couture standards (Bonpoint, Jacadi Paris) for client orders, payment reconciliations, and white-glove dispatch.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsManualOrderOpen(true)}
            className="btn-accent-primary px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>New Atelier Booking</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2.5 rounded-xl bg-white/70 hover:bg-white text-boutique-charcoal text-xs font-bold border border-gray-200 transition"
            title="Lock Portal"
          >
            <Lock className="w-4 h-4 inline mr-1" />
            Lock
          </button>
        </div>
      </div>

      {/* 3D KPI Metrics with React Bits SpotlightCard & Border Glow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Verified Paid Revenue */}
        <SpotlightCard
          theme="light"
          spotlightColor="#10b981"
          intensity={0.18}
          spotlightSize={260}
          className="rounded-2xl p-5 border border-emerald-500/25 bg-emerald-50/20 backdrop-blur-md"
        >
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-[11px] font-bold uppercase tracking-wider">Cleared Paid Revenue</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-emerald-950 tabular-nums">
              {formatPrice(paidRevenue)}
            </span>
            <span className="block text-[11px] text-emerald-700 font-semibold mt-0.5">
              Paystack 3D-Secure & Verified Transfers
            </span>
          </div>
        </SpotlightCard>

        {/* Pending Payment (POD) */}
        <SpotlightCard
          theme="light"
          spotlightColor="#f59e0b"
          intensity={0.18}
          spotlightSize={260}
          className="rounded-2xl p-5 border border-amber-500/25 bg-amber-50/20 backdrop-blur-md"
        >
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Settlement (POD)</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-950 tabular-nums">
              {formatPrice(pendingRevenue)}
            </span>
            <span className="block text-[11px] text-amber-700 font-semibold mt-0.5">
              Assigned to Moniepoint Courier POS
            </span>
          </div>
        </SpotlightCard>

        {/* Total Bookings */}
        <SpotlightCard
          theme="light"
          spotlightColor="#D46A7E"
          intensity={0.18}
          spotlightSize={260}
          className="rounded-2xl p-5 border border-white/80 glass-card"
        >
          <div className="flex items-center justify-between text-boutique-taupe">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Bookings</span>
            <ShoppingBag className="w-4 h-4 text-boutique-rose" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-boutique-charcoal tabular-nums">
              {orders.length}
            </span>
            <span className="block text-[11px] text-boutique-taupe mt-0.5">
              100% Luxury packaging requested
            </span>
          </div>
        </SpotlightCard>

        {/* Average Order Value (AOV) */}
        <SpotlightCard
          theme="light"
          spotlightColor="#a855f7"
          intensity={0.18}
          spotlightSize={260}
          className="rounded-2xl p-5 border border-white/80 glass-card"
        >
          <div className="flex items-center justify-between text-boutique-taupe">
            <span className="text-[11px] font-bold uppercase tracking-wider">Average Order Value</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-boutique-charcoal tabular-nums">
              {formatPrice(avgOrderValue)}
            </span>
            <span className="block text-[11px] text-boutique-taupe mt-0.5">
              Occasionwear & Heirloom Sets
            </span>
          </div>
        </SpotlightCard>

      </div>

      {/* Main Section Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200/80 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-boutique-charcoal text-white shadow-sm'
              : 'bg-white/60 text-boutique-taupe hover:bg-white'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Customer Orders & Status ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('financials')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'financials'
              ? 'bg-boutique-charcoal text-white shadow-sm'
              : 'bg-white/60 text-boutique-taupe hover:bg-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Payment & Bank Gateway Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab('dispatch')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'dispatch'
              ? 'bg-boutique-charcoal text-white shadow-sm'
              : 'bg-white/60 text-boutique-taupe hover:bg-white'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Dispatch & Waybills</span>
        </button>
      </div>

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          
          {/* Orders Filter & Search Toolbar */}
          <div className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border border-white/80">
            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {[
                { id: 'all', label: `All (${orders.length})` },
                { id: 'paid', label: `Paid (${orders.filter((o) => o.paymentStatus === 'paid').length})` },
                { id: 'pending', label: `Pending Payment (${orders.filter((o) => o.paymentStatus === 'pending').length})` },
                { id: 'gift_boxing', label: `Gift Boxing (${orders.filter((o) => o.fulfillmentStatus === 'gift_boxing').length})` },
                { id: 'dispatched', label: `Dispatched (${orders.filter((o) => o.fulfillmentStatus === 'dispatched').length})` },
                { id: 'delivered', label: `Delivered (${orders.filter((o) => o.fulfillmentStatus === 'delivered').length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    statusFilter === tab.id
                      ? 'bg-boutique-rose text-white shadow-xs'
                      : 'bg-white/60 text-boutique-taupe hover:bg-white hover:text-boutique-charcoal'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <input
                type="text"
                placeholder="Search name, phone, LN-#, or Reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white/80 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-boutique-rose/30"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Orders Table */}
          <div className="glass-panel rounded-3xl overflow-hidden border border-white/80 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200/80 bg-white/40 text-[10px] font-bold uppercase tracking-wider text-boutique-taupe">
                    <th className="py-3.5 px-4 sm:px-6">Booking Reference</th>
                    <th className="py-3.5 px-4 sm:px-6">Client Profile</th>
                    <th className="py-3.5 px-4 sm:px-6">Atelier Pieces</th>
                    <th className="py-3.5 px-4 sm:px-6">Payment Access</th>
                    <th className="py-3.5 px-4 sm:px-6">Fulfillment Stage</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/60 text-xs">
                  {filteredOrders.map((order) => {
                    const isPaid = order.paymentStatus === 'paid';

                    return (
                      <tr key={order.id} className="hover:bg-white/50 transition-colors">
                        
                        {/* Order ID & Time */}
                        <td className="py-4 px-4 sm:px-6 align-top">
                          <span className="font-mono font-bold text-boutique-charcoal block">
                            #{order.id}
                          </span>
                          <span className="text-[10px] font-mono text-boutique-taupe block mt-0.5">
                            {order.paymentReference || 'NO-REF'}
                          </span>
                          <span className="text-[11px] text-boutique-taupe block mt-1">
                            {new Date(order.createdAt).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </td>

                        {/* Customer & VIP Tier */}
                        <td className="py-4 px-4 sm:px-6 align-top">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-boutique-charcoal block">
                              {order.customerName}
                            </span>
                            {order.clientTier === 'Crown VIP' && (
                              <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[9px] font-bold flex items-center gap-0.5" title="Frequent Luxury Client">
                                👑 VIP
                              </span>
                            )}
                          </div>
                          <a 
                            href={`tel:${order.phone}`}
                            className="text-[11px] text-boutique-rose hover:underline font-medium block mt-0.5"
                          >
                            {order.phone}
                          </a>
                          <span className="text-[11px] text-boutique-taupe block mt-0.5 line-clamp-1">
                            {order.city}
                          </span>
                        </td>

                        {/* Outfits List */}
                        <td className="py-4 px-4 sm:px-6 align-top max-w-xs">
                          <div className="space-y-1">
                            {order.items.map((it, idx) => (
                              <div key={idx} className="text-[11px] text-boutique-charcoal">
                                <span className="font-semibold">{it.product.name}</span>
                                <span className="text-boutique-taupe"> ({it.selectedSize}) × {it.quantity}</span>
                              </div>
                            ))}
                          </div>
                          {order.giftWrapping && (
                            <div className="mt-1 text-[10px] text-purple-700 font-semibold flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-purple-500" />
                              <span>{order.giftWrapping}</span>
                            </div>
                          )}
                          {order.notes && (
                            <div className="mt-1 p-1 rounded-lg bg-amber-50/80 text-[10px] text-amber-900 border border-amber-200/60">
                              📝 {order.notes}
                            </div>
                          )}
                        </td>

                        {/* Payment Access & Quick Verification */}
                        <td className="py-4 px-4 sm:px-6 align-top">
                          <div className="space-y-1.5">
                            <div className="font-bold text-sm text-boutique-charcoal tabular-nums">
                              {formatPrice(order.total)}
                            </div>
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                isPaid
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : 'bg-amber-50 text-amber-800 border-amber-300'
                              }`}
                            >
                              {isPaid ? (
                                <>
                                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                                  <span>PAID & VERIFIED</span>
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3 text-amber-600" />
                                  <span>PAYMENT PENDING</span>
                                </>
                              )}
                            </span>
                            <div className="text-[10px] text-boutique-taupe">
                              {order.paymentGateway || (order.paymentMethod === 'card' ? 'Paystack' : 'Bank Transfer')}
                            </div>

                            {/* 1-Click Toggle Action */}
                            <div>
                              <button
                                onClick={() => updatePaymentStatus(order.id, isPaid ? 'pending' : 'paid')}
                                className="text-[10px] font-bold text-boutique-rose hover:underline"
                              >
                                Mark as {isPaid ? 'Unpaid' : 'Paid'}
                              </button>
                              {order.paymentMethod === 'transfer' && (
                                <button
                                  onClick={() => setVerifySlipOrder(order)}
                                  className="text-[10px] font-bold text-purple-700 hover:underline ml-2"
                                >
                                  View Transfer
                                </button>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Fulfillment Stage Selector */}
                        <td className="py-4 px-4 sm:px-6 align-top">
                          <div className="space-y-1.5">
                            <select
                              value={order.fulfillmentStatus}
                              onChange={(e) => updateFulfillmentStatus(order.id, e.target.value as FulfillmentStatus)}
                              className="text-[11px] font-semibold bg-white/90 border border-gray-200 rounded-lg px-2 py-1 text-boutique-charcoal focus:outline-none focus:ring-1 focus:ring-boutique-rose"
                            >
                              <option value="new">New Booking</option>
                              <option value="gift_boxing">In Gift Boxing</option>
                              <option value="dispatched">Dispatched (Courier)</option>
                              <option value="delivered">Delivered to Client</option>
                            </select>
                            <div className="text-[10px] text-boutique-taupe font-mono">
                              {order.waybillNumber}
                            </div>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 sm:px-6 align-top text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* WhatsApp Customer */}
                            <button
                              onClick={() => openWhatsAppCustomer(order)}
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition shadow-xs border border-emerald-200"
                              title="Message Client on WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>

                            {/* Printable Waybill */}
                            <button
                              onClick={() => setWaybillOrder(order)}
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition shadow-xs border border-blue-200"
                              title="Print Couture Waybill & Packing Slip"
                            >
                              <Printer className="w-4 h-4" />
                            </button>

                            {/* View Full 3D Details */}
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-1.5 rounded-lg bg-white/80 text-boutique-charcoal hover:bg-boutique-charcoal hover:text-white transition shadow-xs border border-gray-200"
                              title="View Full Order Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Delete Order */}
                            <button
                              onClick={() => {
                                if (confirm(`Delete order #${order.id}?`)) {
                                  deleteOrder(order.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition shadow-xs border border-red-200"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* FINANCIALS TAB (Gateway Reconciliation) */}
      {activeTab === 'financials' && (
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-white/80 space-y-4">
            <h3 className="font-serif text-lg font-bold text-boutique-charcoal flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-boutique-rose" />
              <span>Payment Gateway & Settlement Reconciliation</span>
            </h3>
            <p className="text-xs text-boutique-taupe">
              Automatic settlement audit logs across Nigerian payment channels (Paystack 3D-Secure, GTBank direct transfers, and Moniepoint POS).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/80 border border-gray-200">
                <span className="text-[10px] uppercase font-bold text-boutique-taupe block">Card Gateway (Paystack)</span>
                <span className="text-xl font-bold font-serif text-boutique-charcoal mt-1 block">
                  {formatPrice(orders.filter(o => o.paymentMethod === 'card' && o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0))}
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold block mt-1">✓ 100% 3D-Secure Authenticated</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 border border-gray-200">
                <span className="text-[10px] uppercase font-bold text-boutique-taupe block">Direct Atelier Transfers</span>
                <span className="text-xl font-bold font-serif text-boutique-charcoal mt-1 block">
                  {formatPrice(orders.filter(o => o.paymentMethod === 'transfer' && o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0))}
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold block mt-1">✓ GTBank 0192847291 Cleared</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 border border-gray-200">
                <span className="text-[10px] uppercase font-bold text-boutique-taupe block">Pay on Delivery Float</span>
                <span className="text-xl font-bold font-serif text-boutique-charcoal mt-1 block">
                  {formatPrice(orders.filter(o => o.paymentMethod === 'pod').reduce((s, o) => s + o.total, 0))}
                </span>
                <span className="text-[11px] text-amber-600 font-semibold block mt-1">⏳ Courier POS Collection in Transit</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl overflow-hidden border border-white/80 shadow-md">
            <div className="p-4 bg-white/50 border-b border-gray-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-boutique-charcoal">Gateway Transaction Log</span>
              <span className="text-[11px] text-boutique-taupe">{orders.length} transactions recorded</span>
            </div>
            <div className="divide-y divide-gray-200/60 text-xs">
              {orders.map((o) => (
                <div key={o.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/40">
                  <div>
                    <span className="font-mono font-bold text-boutique-charcoal block">#{o.id} · {o.customerName}</span>
                    <span className="text-[11px] text-boutique-taupe font-mono mt-0.5 block">{o.paymentReference} · {o.paymentGateway}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-sm tabular-nums text-boutique-charcoal">{formatPrice(o.total)}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      o.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}>
                      {o.paymentStatus === 'paid' ? 'SETTLED' : 'AWAITING COURIER'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DISPATCH & LOGISTICS TAB */}
      {activeTab === 'dispatch' && (
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-white/80 space-y-3">
            <h3 className="font-serif text-lg font-bold text-boutique-charcoal flex items-center gap-2">
              <Truck className="w-5 h-5 text-boutique-rose" />
              <span>Courier Fleet & Waybill Logistics</span>
            </h3>
            <p className="text-xs text-boutique-taupe">
              Manage local dispatch riders (Lagos Island, Ikeja GRA, Maitama Abuja) and print official packing waybills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((o) => (
              <div key={o.id} className="glass-card rounded-2xl p-5 border border-white/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-boutique-charcoal">#{o.id}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-blue-50 text-blue-800 border border-blue-200">
                    {o.waybillNumber}
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <div className="font-bold text-boutique-charcoal">{o.customerName}</div>
                  <div className="text-boutique-taupe flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-boutique-rose flex-shrink-0 mt-0.5" />
                    <span>{o.address}, {o.city}</span>
                  </div>
                  <div className="text-[11px] text-purple-700 font-semibold pt-1">
                    Partner: {o.courierPartner}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between">
                  <span className="text-[11px] font-bold capitalize text-boutique-charcoal">
                    Status: {o.fulfillmentStatus.replace('_', ' ')}
                  </span>
                  <button
                    onClick={() => setWaybillOrder(o)}
                    className="px-3 py-1.5 rounded-lg bg-boutique-charcoal text-white text-[11px] font-semibold hover:bg-black transition flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Slip</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRINTABLE WAYBILL MODAL */}
      {waybillOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-8 shadow-2xl border border-gray-200 space-y-6 relative max-h-[92vh] overflow-y-auto text-boutique-charcoal">
            
            {/* Waybill Header */}
            <div className="border-b-2 border-boutique-charcoal pb-4 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-boutique-rose-light text-boutique-rose font-serif font-bold flex items-center justify-center text-sm">
                    LN
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold tracking-tight">Little Nest Children's Atelier</h2>
                    <span className="text-[9px] uppercase tracking-widest text-boutique-taupe">Official Dispatch Manifest & Waybill</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-sm font-bold text-boutique-rose block">{waybillOrder.waybillNumber}</span>
                <span className="text-[10px] text-boutique-taupe">Date: {new Date().toLocaleDateString('en-GB')}</span>
              </div>
            </div>

            {/* Recipient & Courier Block */}
            <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-boutique-taupe block mb-1">Deliver To:</span>
                <div className="font-bold text-sm text-boutique-charcoal">{waybillOrder.customerName}</div>
                <div className="text-boutique-taupe mt-0.5">{waybillOrder.address}</div>
                <div className="text-boutique-taupe font-semibold">{waybillOrder.city}</div>
                <div className="text-boutique-rose font-bold mt-1">Tel: {waybillOrder.phone}</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-boutique-taupe block mb-1">Dispatch Partner:</span>
                <div className="font-bold text-boutique-charcoal">{waybillOrder.courierPartner}</div>
                <div className="text-boutique-taupe mt-1">Payment Method: <span className="font-bold">{waybillOrder.paymentMethod.toUpperCase()}</span></div>
                <div className="text-boutique-taupe">Settlement: <span className="font-bold text-emerald-700">{waybillOrder.paymentStatus.toUpperCase()}</span></div>
                <div className="text-boutique-taupe">Packaging: {waybillOrder.giftWrapping}</div>
              </div>
            </div>

            {/* Manifest Items */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-boutique-taupe block mb-2">Package Contents</span>
              <table className="w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-[10px] font-bold uppercase">
                  <tr>
                    <th className="p-2 text-left">Garment / Outfit</th>
                    <th className="p-2 text-center">Size</th>
                    <th className="p-2 text-center">Qty</th>
                    <th className="p-2 text-right">Unit Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {waybillOrder.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-2 font-semibold">{it.product.name}</td>
                      <td className="p-2 text-center">{it.selectedSize}</td>
                      <td className="p-2 text-center">{it.quantity}</td>
                      <td className="p-2 text-right tabular-nums">{formatPrice(it.product.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Footer */}
            <div className="border-t border-gray-200 pt-3 flex justify-between items-center text-xs">
              <span className="text-boutique-taupe font-mono">RC: 1894201 · Little Nest Boutique Lagos</span>
              <div className="text-right">
                <span className="text-[11px] text-boutique-taupe block">Declared Parcel Total</span>
                <span className="text-lg font-serif font-bold text-boutique-charcoal tabular-nums">{formatPrice(waybillOrder.total)}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-2 flex gap-3 print:hidden">
              <button
                onClick={printWaybill}
                className="flex-1 py-3 rounded-xl btn-accent-primary text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Slip (A4 / Thermal)</span>
              </button>
              <button
                onClick={() => setWaybillOrder(null)}
                className="py-3 px-6 rounded-xl bg-gray-100 text-boutique-charcoal text-xs font-bold hover:bg-gray-200"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* BANK TRANSFER VERIFICATION SLIP MODAL */}
      {verifySlipOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-200 space-y-5">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Electronic Bank Transfer</span>
                <h3 className="font-serif text-lg font-bold text-boutique-charcoal">Transfer Verification Slip</h3>
              </div>
              <button onClick={() => setVerifySlipOrder(null)} className="p-1 rounded-full text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-boutique-taupe">Beneficiary:</span>
                <span className="font-bold text-boutique-charcoal">Little Nest Kids Boutique Ltd</span>
              </div>
              <div className="flex justify-between">
                <span className="text-boutique-taupe">Bank & Account:</span>
                <span className="font-mono font-bold text-boutique-charcoal">GTBank · 0192847291</span>
              </div>
              <div className="flex justify-between">
                <span className="text-boutique-taupe">Reference Code:</span>
                <span className="font-mono font-bold text-purple-800">{verifySlipOrder.paymentReference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-boutique-taupe">Amount Expected:</span>
                <span className="font-bold text-sm text-boutique-rose tabular-nums">{formatPrice(verifySlipOrder.total)}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  updatePaymentStatus(verifySlipOrder.id, 'paid');
                  setVerifySlipOrder(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve & Verify Funds</span>
              </button>
              <button
                onClick={() => setVerifySlipOrder(null)}
                className="py-2.5 px-4 rounded-xl bg-gray-100 text-boutique-charcoal font-bold text-xs"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3D ORDER DETAIL INSPECTOR MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-gray-200 space-y-5 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-boutique-rose tracking-wider block">
                  3D Atelier Order Inspection
                </span>
                <h3 className="font-serif text-xl font-bold text-boutique-charcoal">
                  #{selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details Card */}
            <div className="p-4 rounded-2xl bg-boutique-sand/30 border border-boutique-border space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-boutique-charcoal">{selectedOrder.customerName}</span>
                <span className="text-boutique-taupe">{selectedOrder.phone}</span>
              </div>
              <div className="text-boutique-charcoal flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-boutique-rose flex-shrink-0 mt-0.5" />
                <span>{selectedOrder.address}, {selectedOrder.city}</span>
              </div>
            </div>

            {/* Outfits List */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-boutique-taupe block mb-2">
                Purchased Pieces ({selectedOrder.items.length})
              </span>
              <div className="space-y-2">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 bg-gray-50/50">
                    <img
                      src={it.product.images[0]}
                      alt={it.product.name}
                      className="w-12 h-14 object-cover rounded-lg"
                    />
                    <div className="flex-1 text-xs">
                      <span className="font-bold text-boutique-charcoal block">{it.product.name}</span>
                      <span className="text-boutique-taupe text-[11px]">Size: {it.selectedSize} · Qty: {it.quantity}</span>
                    </div>
                    <span className="font-bold text-xs tabular-nums text-boutique-charcoal">
                      {formatPrice(it.product.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="pt-3 border-t border-gray-100 space-y-1.5 text-xs">
              <div className="flex justify-between text-boutique-taupe">
                <span>Subtotal</span>
                <span className="tabular-nums font-semibold">{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-boutique-taupe">
                <span>Delivery Dispatch</span>
                <span className="tabular-nums font-semibold">{formatPrice(selectedOrder.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-boutique-charcoal pt-1 border-t border-gray-100">
                <span>Total Amount</span>
                <span className="tabular-nums text-boutique-rose">{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex gap-3">
              <button
                onClick={() => openWhatsAppCustomer(selectedOrder)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-700 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Client</span>
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="py-2.5 px-5 rounded-xl bg-gray-100 text-boutique-charcoal font-bold text-xs hover:bg-gray-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL ORDER MODAL */}
      {isManualOrderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-gray-200 space-y-5 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-boutique-rose tracking-wider block">
                  Direct Atelier Entry
                </span>
                <h3 className="font-serif text-xl font-bold text-boutique-charcoal">
                  Create Manual / Phone Booking
                </h3>
              </div>
              <button
                onClick={() => setIsManualOrderOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-boutique-charcoal mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mrs. Ngozi Adeleke"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-boutique-rose"
                  />
                </div>
                <div>
                  <label className="block font-bold text-boutique-charcoal mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 800 000 0000"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-boutique-rose"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-boutique-charcoal mb-1">Delivery Destination</label>
                <select
                  value={manualCity}
                  onChange={(e) => setManualCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-boutique-rose"
                >
                  <option value="Lagos - Island (Lekki, Ikoyi, VI)">Lagos - Island (Lekki, Ikoyi, VI)</option>
                  <option value="Lagos - Mainland (Ikeja, Surulere, Yaba)">Lagos - Mainland (Ikeja, Surulere, Yaba)</option>
                  <option value="Abuja & Nationwide Priority Express">Abuja & Nationwide Priority Express</option>
                  <option value="In-Store Boutique Collection">In-Store Boutique Collection</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-boutique-charcoal mb-1">Full Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="Street name, house number, estate"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-boutique-rose"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-boutique-charcoal mb-1">Select Outfit</label>
                  <select
                    value={manualProductId}
                    onChange={(e) => setManualProductId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-boutique-rose"
                  >
                    {DEMO_PRODUCTS.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name} ({formatPrice(prod.price)})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-boutique-charcoal mb-1">Size</label>
                  <input
                    type="text"
                    value={manualSize}
                    onChange={(e) => setManualSize(e.target.value)}
                    placeholder="e.g. 4Y, 5Y, EU 26"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-boutique-rose"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-boutique-charcoal mb-1">Payment Method</label>
                  <select
                    value={manualPaymentMethod}
                    onChange={(e) => setManualPaymentMethod(e.target.value as 'pod' | 'transfer' | 'card')}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-boutique-rose"
                  >
                    <option value="transfer">Direct Bank Transfer (GTBank)</option>
                    <option value="card">Debit Card (Paystack/POS)</option>
                    <option value="pod">Pay on Delivery</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-boutique-charcoal mb-1">Payment Status</label>
                  <select
                    value={manualPaymentStatus}
                    onChange={(e) => setManualPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-boutique-rose"
                  >
                    <option value="paid">Paid & Confirmed</option>
                    <option value="pending">Pending Payment</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 btn-accent-primary py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md"
                >
                  Record Atelier Booking
                </button>
                <button
                  type="button"
                  onClick={() => setIsManualOrderOpen(false)}
                  className="py-2.5 px-5 rounded-xl bg-gray-100 text-boutique-charcoal font-bold text-xs hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Atelier Copyright & Corporate Verification Strip */}
      <div className="p-4 rounded-2xl glass-panel text-center text-xs text-boutique-taupe border border-white/80 space-y-1">
        <p className="font-semibold text-boutique-charcoal">
          © 2026 Little Nest Children's Atelier Ltd. (RC: 1894201). All rights reserved.
        </p>
        <p className="text-[11px]">
          Compliant with Nigerian Data Protection Regulation (NDPR) & Global E-Commerce Authenticity Standards.
        </p>
      </div>

    </div>
  );
};
