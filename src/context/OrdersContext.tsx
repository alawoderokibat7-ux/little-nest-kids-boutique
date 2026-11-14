import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../types';
import { DEMO_PRODUCTS } from '../data/products';

export type PaymentMethod = 'pod' | 'transfer' | 'card';
export type PaymentStatus = 'paid' | 'pending';
export type FulfillmentStatus = 'new' | 'gift_boxing' | 'dispatched' | 'delivered';

export interface StoreOrder {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  createdAt: string;
  notes?: string;
}

interface OrdersContextType {
  orders: StoreOrder[];
  addOrder: (order: Omit<StoreOrder, 'id' | 'createdAt'>) => StoreOrder;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  updateFulfillmentStatus: (orderId: string, status: FulfillmentStatus) => void;
  deleteOrder: (orderId: string) => void;
  clearAllOrders: () => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = 'little_nest_orders_v2';

const INITIAL_ORDERS: StoreOrder[] = [
  {
    id: 'LN-942101',
    customerName: 'Mrs. Folake Adeleke',
    phone: '+234 803 412 9001',
    city: 'Lagos - Island (Lekki, Ikoyi, VI)',
    address: 'Plot 14 Admiralty Way, Lekki Phase 1',
    items: [
      {
        product: DEMO_PRODUCTS[0],
        selectedSize: '5Y',
        quantity: 1,
      },
    ],
    subtotal: DEMO_PRODUCTS[0]?.price || 24500,
    deliveryFee: 2500,
    total: (DEMO_PRODUCTS[0]?.price || 24500) + 2500,
    paymentMethod: 'transfer',
    paymentStatus: 'paid',
    fulfillmentStatus: 'gift_boxing',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    notes: 'Please pack in luxury ribbon box for a 5th birthday gift.',
  },
  {
    id: 'LN-942102',
    customerName: 'Chidinma Eze',
    phone: '+234 812 880 3410',
    city: 'Abuja & Nationwide Priority Express',
    address: '8 Rhine Street, Maitama, Abuja',
    items: [
      {
        product: DEMO_PRODUCTS[1] || DEMO_PRODUCTS[0],
        selectedSize: '4Y',
        quantity: 1,
      },
    ],
    subtotal: (DEMO_PRODUCTS[1] || DEMO_PRODUCTS[0]).price,
    deliveryFee: 0,
    total: (DEMO_PRODUCTS[1] || DEMO_PRODUCTS[0]).price,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    fulfillmentStatus: 'dispatched',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    notes: 'Deliver before Friday wedding.',
  },
  {
    id: 'LN-942103',
    customerName: 'Dr. Amina Bello',
    phone: '+234 706 192 0344',
    city: 'Lagos - Mainland (Ikeja, Surulere, Yaba)',
    address: '15 Isaac John Street, GRA Ikeja',
    items: [
      {
        product: DEMO_PRODUCTS[2] || DEMO_PRODUCTS[0],
        selectedSize: '5Y',
        quantity: 1,
      },
    ],
    subtotal: (DEMO_PRODUCTS[2] || DEMO_PRODUCTS[0]).price,
    deliveryFee: 2500,
    total: (DEMO_PRODUCTS[2] || DEMO_PRODUCTS[0]).price + 2500,
    paymentMethod: 'pod',
    paymentStatus: 'pending',
    fulfillmentStatus: 'new',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
];

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<StoreOrder[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load orders from localStorage:', e);
    }
    return INITIAL_ORDERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to save orders to localStorage:', e);
    }
  }, [orders]);

  const addOrder = (orderData: Omit<StoreOrder, 'id' | 'createdAt'>): StoreOrder => {
    const newOrder: StoreOrder = {
      ...orderData,
      id: `LN-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updatePaymentStatus = (orderId: string, status: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, paymentStatus: status } : ord))
    );
  };

  const updateFulfillmentStatus = (orderId: string, status: FulfillmentStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, fulfillmentStatus: status } : ord))
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
  };

  const clearAllOrders = () => {
    setOrders([]);
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        updatePaymentStatus,
        updateFulfillmentStatus,
        deleteOrder,
        clearAllOrders,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};
