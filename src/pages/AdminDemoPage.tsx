import React, { useState } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  CheckCircle, 
  Package,
  Bell
} from 'lucide-react';
import { DEMO_PRODUCTS } from '../data/products';
import { formatPrice } from '../utils/formatters';

interface DemoOrder {
  id: string;
  customerName: string;
  phone: string;
  location: string;
  itemsSummary: string;
  total: number;
  status: 'In Gift Boxing' | 'Confirmed & Paid' | 'Dispatched with Courier';
  paymentMode: 'Pay on Delivery' | 'Bank Transfer' | 'Debit Card';
  time: string;
}

export const AdminDemoPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const demoOrders: DemoOrder[] = [
    {
      id: 'ORD-LN-9421',
      customerName: 'Mrs. Folake Adeleke',
      phone: '+234 803 *** 4129',
      location: 'Ikoyi, Lagos',
      itemsSummary: 'Blossom Petal Tulle Party Dress (Size: 5Y, Qty: 1)',
      total: 24500,
      status: 'In Gift Boxing',
      paymentMode: 'Pay on Delivery',
      time: '10 mins ago'
    },
    {
      id: 'ORD-LN-9422',
      customerName: 'Chidinma Eze',
      phone: '+234 812 *** 8803',
      location: 'Maitama, Abuja',
      itemsSummary: 'Little Gentleman Linen Vest Set (Size: 4Y) + Rose Gold Shoes (Size: EU 26)',
      total: 40500,
      status: 'Confirmed & Paid',
      paymentMode: 'Bank Transfer',
      time: '35 mins ago'
    },
    {
      id: 'ORD-LN-9423',
      customerName: 'Dr. Amina Bello',
      phone: '+234 706 *** 1920',
      location: 'Victoria Island, Lagos',
      itemsSummary: 'Brother & Sister Matching Olive Linen Duo (Size: 4Y-6Y)',
      total: 28500,
      status: 'Dispatched with Courier',
      paymentMode: 'Debit Card',
      time: '1 hour ago'
    },
    {
      id: 'ORD-LN-9424',
      customerName: 'Grace Obinna',
      phone: '+234 802 *** 9451',
      location: 'Lekki Phase 1, Lagos',
      itemsSummary: 'Golden Honey Birthday Gown (Size: 5Y) + Hair Bow Set (Pack of 3)',
      total: 36000,
      status: 'In Gift Boxing',
      paymentMode: 'Pay on Delivery',
      time: '3 hours ago'
    },
    {
      id: 'ORD-LN-9425',
      customerName: 'Kemi Sowemimo',
      phone: '+234 818 *** 3004',
      location: 'Ikeja GRA, Lagos',
      itemsSummary: 'Coastal Sailor Knit Polo Set (Size: 2T, Qty: 2)',
      total: 37000,
      status: 'Confirmed & Paid',
      paymentMode: 'Bank Transfer',
      time: 'Yesterday'
    }
  ];

  const filteredOrders = demoOrders.filter((ord) => {
    if (filterStatus === 'all') return true;
    return ord.status.toLowerCase().includes(filterStatus.toLowerCase());
  });

  const totalPipeline = demoOrders.reduce((sum, e) => sum + e.total, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-gray-900 text-white rounded-2xl p-6 sm:p-8 border border-gray-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              Store Order Management & Dispatch Hub
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
              Live log of incoming customer bookings, SMS dispatch alerts, and delivery statuses.
            </p>
          </div>
          <div className="bg-gray-800 p-3 rounded-xl border border-gray-700 text-xs">
            <span className="text-gray-400 block text-[11px]">System Status:</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <CheckCircle className="w-3.5 h-3.5" /> Live Automated Dispatch
            </span>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Order Volume
            </span>
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tabular-nums">
              {formatPrice(totalPipeline)}
            </span>
            <span className="block text-xs text-emerald-600 font-semibold mt-0.5">
              5 confirmed bookings
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              SMS Confirmations
            </span>
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tabular-nums">
              100%
            </span>
            <span className="block text-xs text-gray-500 mt-0.5">
              Instant alerts dispatched
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Active Styles
            </span>
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tabular-nums">
              {DEMO_PRODUCTS.length} Outfits
            </span>
            <span className="block text-xs text-gray-500 mt-0.5">
              Ages 1 to 13
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Preferred Payment
            </span>
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
              Pay on Delivery
            </span>
            <span className="block text-xs text-gray-500 mt-0.5">
              Lagos & Abuja Doorstep
            </span>
          </div>
        </div>

      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif font-bold text-base text-gray-900">
              Customer Orders Log
            </h3>
            <p className="text-xs text-gray-500">
              Real-time records from website checkout bookings
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {['all', 'boxing', 'confirmed', 'dispatched'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                  filterStatus === status
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[11px] uppercase tracking-wider font-semibold text-gray-500 border-b border-gray-100">
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Reserved Outfits</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-gray-900 tabular-nums">
                    {ord.id}
                    <span className="block font-sans text-[10px] text-gray-400 font-normal">
                      {ord.time}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-gray-900 block">
                      {ord.customerName}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      {ord.location} • {ord.phone}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs text-gray-700">
                    <p className="line-clamp-2">
                      {ord.itemsSummary}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-gray-900 tabular-nums">
                    {formatPrice(ord.total)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center text-[11px] font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                      {ord.paymentMode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        ord.status === 'Confirmed & Paid'
                          ? 'bg-emerald-50 text-emerald-700'
                          : ord.status === 'Dispatched with Courier'
                          ? 'bg-sky-50 text-sky-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
