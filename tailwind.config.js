/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#D4AF37', // Luminous Spun Champagne Gold
          hover: '#BA9326',
          light: '#FAF5E8',
          glow: 'rgba(212, 175, 55, 0.28)',
        },
        coral: {
          DEFAULT: '#E26D5C', // Royal Nigerian Coral Bead
          hover: '#CF5644',
          light: '#FDF1EE',
          glow: 'rgba(226, 109, 92, 0.25)',
        },
        boutique: {
          cream: '#F9F7F2',
          'warm-white': '#FFFDFB',
          sand: '#F2EDE4',
          emerald: '#0A3327',
          'emerald-dark': '#06281E',
          'emerald-light': '#EBF4F0',
          rose: '#E26D5C',
          'rose-hover': '#CF5644',
          'rose-light': '#FDF1EE',
          gold: '#D4AF37',
          'gold-hover': '#BA9326',
          'gold-light': '#FAF5E8',
          charcoal: '#121A16',
          taupe: '#55615B',
          muted: '#7B8781',
          border: '#DFD8CC',
          sage: '#44705A',
          'sage-light': '#EBF3EF',
          chambray: '#2E5A88',
          'chambray-light': '#EEF3F8',
        },
        surface: '#FFFFFF',
        canvas: '#F9F7F2',
        border: '#DFD8CC',
      },
      boxShadow: {
        'glass-subtle': '0 4px 20px 0 rgba(10, 51, 39, 0.05)',
        'glass-card': '0 12px 36px -6px rgba(10, 51, 39, 0.08), 0 2px 8px 0 rgba(212, 175, 55, 0.05)',
        'glass-hover': '0 24px 50px -12px rgba(212, 175, 55, 0.25), 0 4px 16px 0 rgba(10, 51, 39, 0.08)',
        'clay-pill': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.8), 0 8px 22px -4px rgba(212, 175, 55, 0.42)',
        'emerald-card': '0 16px 40px -10px rgba(6, 40, 30, 0.4), inset 0 1px 0 0 rgba(212, 175, 55, 0.3)',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
