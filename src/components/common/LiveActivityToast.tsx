import React, { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

interface LiveEvent {
  customer: string;
  location: string;
  item: string;
  price: number;
  timeAgo: string;
}

const RECENT_BOOKINGS: LiveEvent[] = [
  { customer: 'Chioma E.', location: 'Lekki Phase 1, Lagos', item: 'Blossom Petal Tulle Party Dress (5Y)', price: 24500, timeAgo: '2 mins ago' },
  { customer: 'Amina B.', location: 'Victoria Island, Lagos', item: 'Little Gentleman Linen Vest Set (6Y)', price: 26000, timeAgo: '5 mins ago' },
  { customer: 'Ngozi K.', location: 'Ikeja GRA, Lagos', item: 'Sage Garden Eyelet Midi Dress (8Y)', price: 21500, timeAgo: '9 mins ago' },
  { customer: 'Damilola A.', location: 'Ikoyi, Lagos', item: 'Terra Rust Ruffle Linen Romper (18M)', price: 15500, timeAgo: '14 mins ago' },
  { customer: 'Zainab M.', location: 'Maitama, Abuja', item: 'Golden Honey Birthday Princess Gown (5Y)', price: 29500, timeAgo: '18 mins ago' },
];

export const LiveActivityToast: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    // Initial delay before first pop
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3500);

    // Periodic rotation
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % RECENT_BOOKINGS.length);
        setIsVisible(true);
      }, 1200);
    }, 14000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isDismissed]);

  if (isDismissed || !isVisible) return null;

  const current = RECENT_BOOKINGS[currentIndex];

  return (
    <div className="fixed bottom-16 sm:bottom-6 left-4 z-30 max-w-[340px] animate-fadeIn pointer-events-auto">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-3 border border-boutique-border shadow-glass-card flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-full bg-boutique-rose-light text-boutique-rose flex items-center justify-center flex-shrink-0 mt-0.5">
          <CheckCircle2 className="w-4 h-4 text-boutique-rose" />
        </div>
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
              Verified Order
            </span>
            <span className="text-[9px] text-boutique-muted">{current.timeAgo}</span>
          </div>
          <p className="text-xs font-bold text-boutique-charcoal truncate mt-0.5">
            {current.customer} in {current.location}
          </p>
          <p className="text-[11px] text-boutique-taupe truncate">
            Booked <span className="font-semibold text-boutique-charcoal">{current.item}</span>
          </p>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-gray-400 hover:text-gray-700 p-0.5"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};