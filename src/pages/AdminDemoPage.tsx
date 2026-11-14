import React, { useState, useMemo } from 'react';
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
  Truck
} from 'lucide-react';
import { useOrders, StoreOrder, PaymentStatus, FulfillmentStatus } from '../context/OrdersContext';
import { formatPrice } from '../utils/formatters';
import { DEMO_PRODUCTS } from '../data/products';

export const AdminDemoPage: React.FC = () => {
  const { 
    orders, 
    updatePaymentStatus, 
    updateFulfillmentStatus, 
    deleteOrder, 
    addOrder 
  } = useOrders();

  // Admin Passcode Protection (Default PIN: 1234)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('little_nest_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'gift_boxing' | 'dispatched' | 'delivered'>('all');
  
  // Selected Order for Modal View
  const [selectedOrder, setSelectedOrder] = useState<StoreOrder | null>(null);

  // New Manual Order Drawer / Modal
  const [isManualOrderOpen, setIsManualOrderOpen] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualCity, setManualCity] = useState('Lagos - Island (Lekki, Ikoyi, VI)');
  const [manualAddress, setManualAddress] = useState('');
  const [manualProductId, setManualProductId] = useState(DEMO_PRODUCTS[0]?.id || '');
  const [manualSize, setManualSize] = useState('4Y');
  const [manualPaymentMethod, setManualPaymentMethod] = useState<'pod' | 'transfer' | 'card'>('transfer');
  const [manualPaymentStatus, setManualPaymentStatus] = useState<PaymentStatus>('paid');

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

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = order.customerName.toLowerCase().includes(query);
        const matchesPhone = order.phone.toLowerCase().includes(query);
        const matchesId = order.id.toLowerCase().includes(query);
        const matchesCity = order.city.toLowerCase().includes(query);
        return matchesName || matchesPhone || matchesId || matchesCity;
      }
      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  // Financial Metrics
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const paidRevenue = useMemo(() => {
    return orders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const pendingRevenue = useMemo(() => {
    return orders
      .filter((o) => o.paymentStatus === 'pending')
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = DEMO_PRODUCTS.find((p) => p.id === manualProductId) || DEMO_PRODUCTS[0];
    if (!prod) return;

    addOrder({
      customerName: manualName || 'Direct Store Customer',
      phone: manualPhone || '+234 800 000 0000',
      city: manualCity,
      address: manualAddress || 'In-store pickup',
      items: [{ product: prod, selectedSize: manualSize, quantity: 1 }],
      subtotal: prod.price,
      deliveryFee: 0,
      total: prod.price,
      paymentMethod: manualPaymentMethod,
      paymentStatus: manualPaymentStatus,
      fulfillmentStatus: 'new',
      notes: 'Manual order created by Store Admin',
    });

    setIsManualOrderOpen(false);
    setManualName('');
    setManualPhone('');
    setManualAddress('');
  };

  const openWhatsAppCustomer = (order: StoreOrder) => {
    const cleanPhone = order.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${order.customerName},\nThis is Little Nest Kids Boutique regarding your order #${order.id}.\nTotal: ₦${order.total.toLocaleString()}\nPayment Status: ${order.paymentStatus === 'paid' ? 'PAID & VERIFIED' : 'PENDING'}.\nWe are preparing your items for delivery!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  // If not authenticated, render Owner Login Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md p-8 glass-panel rounded-3xl text-center space-y-6 relative border border-white/80 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-boutique-charcoal text-amber-300 mx-auto flex items-center justify-center shadow-md">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h1 className="font-serif text-2xl font-bold text-boutique-charcoal">
              Store Owner & Admin Portal
            </h1>
            <p className="text-xs text-boutique-taupe mt-1.5 max-w-xs mx-auto">
              Access live incoming customer orders, payment verification logs, and courier dispatch management.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-boutique-charcoal uppercase tracking-wider mb-1.5">
                Admin Passcode or PIN
              </label>
              <input
                type="password"
                placeholder="Enter PIN (e.g. 1234 or Rocky)"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                className={`w-full px-4 py-3 rounded-xl text-sm bg-white/80 border ${
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
              <span>Unlock Admin Dashboard</span>
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
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Admin Navigation Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-800 text-[11px] font-bold border border-emerald-500/30 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Store Owner Live Operations</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-boutique-charcoal">
            Little Nest · Orders & Payment Access
          </h1>
          <p className="text-xs sm:text-sm text-boutique-taupe mt-1">
            Real-time tracking of customer bookings, payment statuses, and fulfillment stages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsManualOrderOpen(true)}
            className="btn-accent-primary px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>New Manual Order</span>
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

      {/* Revenue & Operations Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Booked Volume */}
        <div className="glass-card rounded-2xl p-5 border border-white/80">
          <div className="flex items-center justify-between text-boutique-taupe">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-boutique-rose" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-boutique-charcoal tabular-nums">
              {orders.length}
            </span>
            <span className="block text-[11px] text-boutique-taupe mt-0.5">
              Across all channels
            </span>
          </div>
        </div>

        {/* Verified Paid Volume */}
        <div className="glass-card rounded-2xl p-5 border border-emerald-500/20 bg-emerald-50/30">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-[11px] font-bold uppercase tracking-wider">Verified Paid Revenue</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-emerald-950 tabular-nums">
              {formatPrice(paidRevenue)}
            </span>
            <span className="block text-[11px] text-emerald-700 font-semibold mt-0.5">
              Card & Bank Transfer cleared
            </span>
          </div>
        </div>

        {/* Pending Payment Volume */}
        <div className="glass-card rounded-2xl p-5 border border-amber-500/20 bg-amber-50/30">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Payment (POD)</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-950 tabular-nums">
              {formatPrice(pendingRevenue)}
            </span>
            <span className="block text-[11px] text-amber-700 font-semibold mt-0.5">
              Due upon courier arrival
            </span>
          </div>
        </div>

        {/* Pipeline Gross Volume */}
        <div className="glass-card rounded-2xl p-5 border border-white/80">
          <div className="flex items-center justify-between text-boutique-taupe">
            <span className="text-[11px] font-bold uppercase tracking-wider">Gross Pipeline Value</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-boutique-charcoal tabular-nums">
              {formatPrice(totalRevenue)}
            </span>
            <span className="block text-[11px] text-boutique-taupe mt-0.5">
              All bookings combined
            </span>
          </div>
        </div>

      </div>

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
                  ? 'bg-boutique-charcoal text-white shadow-xs'
                  : 'bg-white/60 text-boutique-taupe hover:bg-white hover:text-boutique-charcoal'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Search by customer, phone, or LN-#"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white/80 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-boutique-rose/30"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

      </div>

      {/* Live Orders Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/80 shadow-xl">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Package className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-boutique-charcoal">
              No Orders Found in This View
            </h3>
            <p className="text-xs text-boutique-taupe max-w-sm mx-auto">
              There are currently no customer bookings matching the selected filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200/80 bg-white/40 text-[10px] font-bold uppercase tracking-wider text-boutique-taupe">
                  <th className="py-3.5 px-4 sm:px-6">Order ID & Date</th>
                  <th className="py-3.5 px-4 sm:px-6">Customer & Contact</th>
                  <th className="py-3.5 px-4 sm:px-6">Ordered Outfits</th>
                  <th className="py-3.5 px-4 sm:px-6">Total Amount</th>
                  <th className="py-3.5 px-4 sm:px-6">Payment Access</th>
                  <th className="py-3.5 px-4 sm:px-6">Fulfillment</th>
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
                        <span className="text-[11px] text-boutique-taupe block mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td className="py-4 px-4 sm:px-6 align-top">
                        <span className="font-bold text-boutique-charcoal block">
                          {order.customerName}
                        </span>
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
                        {order.notes && (
                          <div className="mt-1.5 p-1.5 rounded-lg bg-amber-50/80 text-[10px] text-amber-900 border border-amber-200/60">
                            📝 {order.notes}
                          </div>
                        )}
                      </td>

                      {/* Total Amount */}
                      <td className="py-4 px-4 sm:px-6 align-top">
                        <span className="font-bold text-sm text-boutique-charcoal tabular-nums block">
                          {formatPrice(order.total)}
                        </span>
                        <span className="text-[10px] text-boutique-taupe uppercase tracking-wider block mt-0.5">
                          {order.paymentMethod === 'card' ? 'Debit Card' : order.paymentMethod === 'transfer' ? 'Bank Transfer' : 'Pay on Delivery'}
                        </span>
                      </td>

                      {/* Payment Status with 1-Click Toggle */}
                      <td className="py-4 px-4 sm:px-6 align-top">
                        <div className="space-y-1.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
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

                          {/* Quick Toggle Action */}
                          <div>
                            <button
                              onClick={() => updatePaymentStatus(order.id, isPaid ? 'pending' : 'paid')}
                              className="text-[10px] font-bold text-boutique-rose hover:underline"
                            >
                              Mark as {isPaid ? 'Unpaid' : 'Paid'}
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Fulfillment Stage Selector */}
                      <td className="py-4 px-4 sm:px-6 align-top">
                        <select
                          value={order.fulfillmentStatus}
                          onChange={(e) => updateFulfillmentStatus(order.id, e.target.value as FulfillmentStatus)}
                          className="text-[11px] font-semibold bg-white/80 border border-gray-200 rounded-lg px-2 py-1 text-boutique-charcoal focus:outline-none focus:ring-1 focus:ring-boutique-rose"
                        >
                          <option value="new">New Booking</option>
                          <option value="gift_boxing">In Gift Boxing</option>
                          <option value="dispatched">Dispatched (Courier)</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* WhatsApp Customer */}
                          <button
                            onClick={() => openWhatsAppCustomer(order)}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition shadow-xs border border-emerald-200"
                            title="Chat with Customer on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>

                          {/* View Full Details */}
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-lg bg-white/80 text-boutique-charcoal hover:bg-boutique-charcoal hover:text-white transition shadow-xs border border-gray-200"
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Delete Order */}
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete order #${order.id}?`)) {
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
        )}
      </div>

      {/* View Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-gray-200 space-y-5 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-boutique-rose tracking-wider block">
                  Order Details
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
                Purchased Items ({selectedOrder.items.length})
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
                <span>WhatsApp Customer</span>
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

      {/* Manual Order Creation Modal */}
      {isManualOrderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-gray-200 space-y-5 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-boutique-rose tracking-wider block">
                  Direct Store Entry
                </span>
                <h3 className="font-serif text-xl font-bold text-boutique-charcoal">
                  Create Manual / Phone Order
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
                  <label className="block font-bold text-boutique-charcoal mb-1">Customer Full Name</label>
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
                <label className="block font-bold text-boutique-charcoal mb-1">Delivery Destination / Region</label>
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
                    <option value="transfer">Direct Bank Transfer</option>
                    <option value="card">Debit Card (POS)</option>
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
                  Record Order
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

    </div>
  );
};
