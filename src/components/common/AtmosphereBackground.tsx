import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
// @ts-expect-error - vanta has no official types
import FOG from 'vanta/dist/vanta.fog.min.js';
// @ts-expect-error - vanta has no official types
import WAVES from 'vanta/dist/vanta.waves.min.js';
import { Sparkles, Waves, Cloud, Palette, Check } from 'lucide-react';

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
    const saved = localStorage.getItem('little_nest_atmosphere');
    return (saved as AtmosphereMode) || 'fog';
  });

  const setMode = (newMode: AtmosphereMode) => {
    setModeState(newMode);
    localStorage.setItem('little_nest_atmosphere', newMode);
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

  // Initialize Vanta 3D background effects (Fog / Waves)
  useEffect(() => {
    // Clean up previous vanta instance
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
          highlightColor: 0xffd5dc, // Soft boutique blush pink
          midtoneColor: 0xeae0f5,   // Soft dreamy lavender
          lowlightColor: 0xfcf3eb,   // Warm champagne cream
          baseColor: 0xfbf8f3,       // Soft ivory backdrop
          blurFactor: 0.68,
          zoom: 1.1,
          speed: 1.1,
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
          color: 0xf3ded9,          // Champagne rose silk sheen
          shininess: 38.0,
          waveHeight: 14.0,
          waveSpeed: 0.65,
          zoom: 0.88,
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

  // Interactive Pearl Bokeh Particle Simulation (for 'pearls' mode)
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

    // Pearl particles
    const particleCount = window.innerWidth < 768 ? 25 : 45;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.8 + 1.2,
      color: Math.random() > 0.5 ? 'rgba(235, 178, 178, ' : 'rgba(212, 192, 160, ',
      alpha: Math.random() * 0.4 + 0.15,
      speedY: Math.random() * 0.4 + 0.15,
      speedX: (Math.random() - 0.5) * 0.25,
      swing: Math.random() * Math.PI * 2,
      swingSpeed: Math.random() * 0.02 + 0.01,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle base warmth
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#fdfbf7');
      bgGrad.addColorStop(0.5, '#faedf0');
      bgGrad.addColorStop(1, '#f5eef8');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw floating pearls
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
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(240, 195, 195, 0.5)';
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
      {/* Vanta 3D Container (for Fog and Waves) */}
      {(mode === 'fog' || mode === 'waves') && (
        <div
          ref={vantaRef}
          className="absolute inset-0 w-full h-full opacity-90 transition-opacity duration-700"
        />
      )}

      {/* Canvas Pearl Bokeh Container */}
      {mode === 'pearls' && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-85 transition-opacity duration-700"
        />
      )}

      {/* Aurora Ambient Orbs Container */}
      {mode === 'aurora' && (
        <div className="absolute inset-0 bg-[#fdfaf7] transition-all duration-700">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-pink-200/60 rounded-full blur-[140px] animate-pulse [animation-duration:8s]" />
          <div className="absolute top-1/4 -right-40 w-[550px] h-[550px] bg-purple-200/50 rounded-full blur-[140px] animate-pulse [animation-duration:10s]" />
          <div className="absolute top-2/3 -left-20 w-[500px] h-[500px] bg-amber-100/65 rounded-full blur-[130px] animate-pulse [animation-duration:9s]" />
          <div className="absolute -bottom-32 right-1/4 w-[600px] h-[600px] bg-blue-100/60 rounded-full blur-[140px] animate-pulse [animation-duration:11s]" />
        </div>
      )}

      {/* Subtle overlay texture to give luxury tactile grain */}
      <div className="absolute inset-0 bg-white/20 backdrop-filter backdrop-contrast-[1.02] pointer-events-none" />
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
      label: 'Pastel Fog',
      desc: 'Dreamy 3D rose mist',
      icon: <Cloud className="w-4 h-4 text-pink-400" />,
    },
    {
      id: 'waves',
      label: 'Silk Waves',
      desc: 'Liquid satin drapery',
      icon: <Waves className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'pearls',
      label: 'Pearl Bokeh',
      desc: 'Floating fairy dust',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
    },
    {
      id: 'aurora',
      label: 'Aurora Glow',
      desc: 'Soft ambient orbs',
      icon: <Palette className="w-4 h-4 text-sky-400" />,
    },
  ];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wide bg-white/70 hover:bg-white text-boutique-charcoal border border-boutique-rose/25 shadow-sm hover:shadow transition-all backdrop-blur-md"
        title="Change Background Atmosphere"
      >
        <Sparkles className="w-3.5 h-3.5 text-boutique-rose animate-spin-slow" />
        <span className="hidden sm:inline">Atmosphere:</span>
        <span className="text-boutique-rose capitalize font-bold">
          {mode === 'fog' ? 'Pastel Fog' : mode === 'waves' ? 'Silk Waves' : mode === 'pearls' ? 'Pearl Bokeh' : 'Aurora'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 p-1.5 bg-white/95 backdrop-blur-xl border border-boutique-rose/20 rounded-2xl shadow-2xl z-50 animate-fadeIn text-left">
          <div className="px-3 py-1.5 border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-boutique-taupe">
            Select Mood Atmosphere
          </div>
          <div className="space-y-1 mt-1">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setMode(opt.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  mode === opt.id
                    ? 'bg-boutique-rose-light text-boutique-rose font-bold'
                    : 'text-boutique-charcoal hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-white shadow-xs border border-gray-100">
                    {opt.icon}
                  </span>
                  <div>
                    <div className="font-semibold text-[11px] leading-tight">{opt.label}</div>
                    <div className="text-[9px] text-boutique-taupe font-normal">{opt.desc}</div>
                  </div>
                </div>
                {mode === opt.id && <Check className="w-3.5 h-3.5 text-boutique-rose" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
