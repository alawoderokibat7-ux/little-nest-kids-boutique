import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SupportTicket {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'new' | 'in_progress' | 'resolved';
  channel: 'chat_widget' | 'whatsapp';
  orderIdRef?: string;
}

interface SupportContextType {
  tickets: SupportTicket[];
  addTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => SupportTicket;
  updateTicketStatus: (id: string, status: 'new' | 'in_progress' | 'resolved') => void;
  deleteTicket: (id: string) => void;
  unreadCount: number;
}

const SupportContext = createContext<SupportContextType | undefined>(undefined);

const SUPPORT_STORAGE_KEY = 'little_nest_support_inbox_v1';

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-1041',
    customerName: 'Mrs. Bunmi Okonjo',
    phone: '+234 802 334 1920',
    subject: 'Sizing recommendation for 7th Birthday',
    message: 'Hello, my daughter is turning 7 next week. Is the Sage Garden Eyelet Midi Dress true to size, or should I take size 8Y?',
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    status: 'new',
    channel: 'chat_widget',
  },
  {
    id: 'TCK-1042',
    customerName: 'Tunde Bakare',
    phone: '+234 818 901 2234',
    subject: 'Pay on Delivery Confirmation - Lekki Phase 1',
    message: 'Can I pay with debit card POS when the dispatch rider gets to my office in Lekki?',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    status: 'in_progress',
    channel: 'chat_widget',
  },
];

export const SupportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    try {
      const saved = localStorage.getItem(SUPPORT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load support tickets from localStorage:', e);
    }
    return INITIAL_TICKETS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(SUPPORT_STORAGE_KEY, JSON.stringify(tickets));
    } catch (e) {
      console.warn('Failed to save support tickets to localStorage:', e);
    }
  }, [tickets]);

  const addTicket = (data: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>): SupportTicket => {
    const newTicket: SupportTicket = {
      ...data,
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    setTickets((prev) => [newTicket, ...prev]);
    return newTicket;
  };

  const updateTicketStatus = (id: string, status: 'new' | 'in_progress' | 'resolved') => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  };

  const deleteTicket = (id: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  const unreadCount = tickets.filter((t) => t.status === 'new').length;

  return (
    <SupportContext.Provider
      value={{
        tickets,
        addTicket,
        updateTicketStatus,
        deleteTicket,
        unreadCount,
      }}
    >
      {children}
    </SupportContext.Provider>
  );
};

export const useSupport = () => {
  const context = useContext(SupportContext);
  if (!context) {
    throw new Error('useSupport must be used within a SupportProvider');
  }
  return context;
};
