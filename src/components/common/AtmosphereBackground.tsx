import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
// @ts-expect-error - vanta has no official types
import FOG from 'vanta/dist/vanta.fog.min.js';
// @ts-expect-error - vanta has no official types
import WAVES from 'vanta/dist/vanta.waves.min.js';
import { Sparkles, Waves, Cloud, Palette, Check, Crown } from 'lucide-react';

export type AtmosphereMode = 'fog' | 'waves' | 'pearls' | 'aurora';

interface AtmosphereContextType {
  mode: AtmosphereMode;
  setMode: (mode: AtmosphereMode) => void;
}

export const AtmosphereContext = React.createContext<AtmosphereContextType>({
  mode: 'fog',
  setMode: () => {},
});

export const useAtmosphere = () => React.useContext(AtmosphereContext);

export const AtmosphereProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<AtmosphereMode>(() => {
    const saved = localStorage.getItem('crown_coral_atmosphere');
    return (saved as AtmosphereMode) || 'fog';
  });

  const setMode = (newMode: AtmosphereMode) => {
    setModeState(newMode);
    localStorage.setItem('crown_coral_atmosphere', newMode);
  };

  return (
    <AtmosphereContext.Provider value={{ mode, setMode }}>
      {children}
    </AtmosphereContext.Provider>
  );
};

export const AtmosphereBackground: React.FC = () => {
  const { mode } = useAtmosphere();
  const vantaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const effectRef = useRef<any>(null);

  // Initialize Vanta 3D background effects (Royal Emerald & Champagne Gold)
  useEffect(() => {
    if (effectRef.current) {
      try {
        effectRef.current.destroy();
      } catch (e) {
        console.warn('Vanta cleanup error:', e);
      }
      effectRef.current = null;
    }

    if (!vantaRef.current) return;

    if (mode === 'fog') {
      try {
        const fogInit = FOG.default || FOG;
        effectRef.current = fogInit({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          highlightColor: 0xd4af37, // Spun Champagne Gold
          midtoneColor: 0x0f4736,   // Royal Parisian Emerald
          lowlightColor: 0x06281e,  // Deep Regal Velvet Forest
          baseColor: 0x08221a,      // Midnight Royal Emerald
          blurFactor: 0.72,
          zoom: 1.15,
          speed: 1.05,
        });
      } catch (err) {
        console.warn('Failed to initialize Vanta FOG:', err);
      }
    } else if (mode === 'waves') {
      try {
        const wavesInit = WAVES.default || WAVES;
        effectRef.current = wavesInit({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          color: 0x0a3327,          // Deep Royal Emerald silk sheen
          shininess: 45.0,
          waveHeight: 15.0,
          waveSpeed: 0.7,
          zoom: 0.92,
        });
      } catch (err) {
        console.warn('Failed to initialize Vanta WAVES:', err);
      }
    }

    return () => {
      if (effectRef.current) {
        try {
          effectRef.current.destroy();
        } catch (e) {
          console.warn('Vanta cleanup error:', e);
        }
        effectRef.current = null;
      }
    };
  }, [mode]);

  // Interactive Royal Coral & Gold Beads Particle Simulation (for 'pearls' mode)
  useEffect(() => {
    if (mode !== 'pearls') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Royal Coral & Champagne Gold beads
    const particleCount = window.innerWidth < 768 ? 26 : 48;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3.2 + 1.2,
      color: Math.random() > 0.45 
        ? 'rgba(212, 175, 55, ' // Champagne Gold
        : (Math.random() > 0.5 ? 'rgba(226, 109, 92, ' : 'rgba(82, 183, 136, '), // Royal Coral or Jade
      alpha: Math.random() * 0.45 + 0.18,
      speedY: Math.random() * 0.4 + 0.15,
      speedX: (Math.random() - 0.5) * 0.25,
      swing: Math.random() * Math.PI * 2,
      swingSpeed: Math.random() * 0.02 + 0.01,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep royal emerald base gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#06281e');
      bgGrad.addColorStop(0.5, '#0a3327');
      bgGrad.addColorStop(1, '#08221a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw floating coral & gold beads
      particles.forEach((p) => {
        p.swing += p.swingSpeed;
        p.y -= p.speedY;
        p.x += Math.sin(p.swing) * 0.5 + p.speedX;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mode]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-20 transition-opacity duration-700">
      {/* Vanta 3D Container (for Royal Fog and Waves) */}
      {(mode === 'fog' || mode === 'waves') && (
        <div
          ref={vantaRef}
          className="absolute inset-0 w-full h-full opacity-95 transition-opacity duration-700"
        />
      )}

      {/* Canvas Royal Coral & Gold Bokeh Container */}
      {mode === 'pearls' && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-95 transition-opacity duration-700"
        />
      )}

      {/* Aurora Ambient Orbs Container: Royal Emerald & Gold */}
      {mode === 'aurora' && (
        <div className="absolute inset-0 bg-[#06281e] transition-all duration-700">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#0f4736]/70 rounded-full blur-[140px] animate-pulse [animation-duration:8s]" />
          <div className="absolute top-1/4 -right-40 w-[550px] h-[550px] bg-[#d4af37]/20 rounded-full blur-[140px] animate-pulse [animation-duration:10s]" />
          <div className="absolute top-2/3 -left-20 w-[500px] h-[500px] bg-[#e26d5c]/20 rounded-full blur-[130px] animate-pulse [animation-duration:9s]" />
          <div className="absolute -bottom-32 right-1/4 w-[600px] h-[600px] bg-[#0a3327]/80 rounded-full blur-[140px] animate-pulse [animation-duration:11s]" />
        </div>
      )}

      {/* Subtle overlay texture to give luxury tactile glass sheen */}
      <div className="absolute inset-0 bg-black/10 backdrop-filter backdrop-contrast-[1.03] pointer-events-none" />
    </div>
  );
};

export const AtmosphereSwitcher: React.FC = () => {
  const { mode, setMode } = useAtmosphere();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const options: { id: AtmosphereMode; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'fog',
      label: 'Royal Emerald Silk',
      desc: '3D emerald & champagne mist',
      icon: <Cloud className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'waves',
      label: 'Imperial Silk Waves',
      desc: '3D undulating royal waves',
      icon: <Waves className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'pearls',
      label: 'Coral & Gold Beads',
      desc: 'Floating royal coral particles',
      icon: <Sparkles className="w-4 h-4 text-coral" />,
    },
    {
      id: 'aurora',
      label: 'Palace Royal Orbs',
      desc: 'Luminous ambient atmosphere',
      icon: <Palette className="w-4 h-4 text-amber-300" />,
    },
  ];

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const currentOption = options.find((o) => o.id === mode) || options[0];

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/70 hover:bg-white/90 border border-boutique-border/70 text-boutique-charcoal text-xs font-medium transition shadow-xs backdrop-blur-md"
        title="Change 3D Royal Atmosphere"
        aria-label="Change 3D Royal Atmosphere"
      >
        <span className="flex items-center justify-center">{currentOption.icon}</span>
        <span className="hidden sm:inline text-[11px] font-semibold text-boutique-charcoal">
          {currentOption.label}
        </span>
        <Crown className="w-3 h-3 text-accent ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white/95 backdrop-blur-2xl border border-boutique-border shadow-2xl p-2 z-50 animate-fadeInScale">
          <div className="px-3 py-2 border-b border-boutique-border/60 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent block flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-accent" />
              <span>Royal 3D Atmosphere</span>
            </span>
            <span className="text-xs text-boutique-taupe">Select interactive backdrop mood</span>
          </div>

          <div className="space-y-1">
            {options.map((opt) => {
              const isSelected = mode === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setMode(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition ${
                    isSelected
                      ? 'bg-accent/15 border border-accent/30 text-boutique-charcoal font-semibold'
                      : 'hover:bg-boutique-sand/40 text-boutique-taupe hover:text-boutique-charcoal'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white/80 border border-boutique-border/60 flex items-center justify-center shadow-xs">
                      {opt.icon}
                    </div>
                    <div>
                      <span className="text-xs block font-medium leading-tight text-boutique-charcoal">
                        {opt.label}
                      </span>
                      <span className="text-[10px] text-boutique-taupe block">{opt.desc}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-accent" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
