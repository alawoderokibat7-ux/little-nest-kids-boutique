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
          DEFAULT: '#D46A7E',
          hover: '#BA5064',
          light: '#FDF2F4',
          glow: 'rgba(212, 106, 126, 0.18)',
        },
        boutique: {
          cream: '#FAF7F2',
          'warm-white': '#FFFDFB',
          sand: '#F3ECE4',
          rose: '#D46A7E',
          'rose-hover': '#BA5064',
          'rose-light': '#FDF2F4',
          gold: '#C59B4B',
          'gold-light': '#FAF4E8',
          charcoal: '#1E1B18',
          taupe: '#685F56',
          muted: '#8F857B',
          border: '#E8E1D7',
          sage: '#5E826E',
          'sage-light': '#F1F6F3',
          chambray: '#4A6B8F',
          'chambray-light': '#F0F4F9',
        },
        surface: '#FFFFFF',
        canvas: '#FAF7F2',
        border: '#E8E1D7',
      },
      boxShadow: {
        'glass-subtle': '0 4px 20px 0 rgba(30, 27, 24, 0.04)',
        'glass-card': '0 12px 36px -6px rgba(30, 27, 24, 0.06), 0 2px 8px 0 rgba(30, 27, 24, 0.02)',
        'glass-hover': '0 24px 50px -12px rgba(212, 106, 126, 0.22), 0 4px 16px 0 rgba(30, 27, 24, 0.04)',
        'clay-pill': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.7), 0 8px 20px -4px rgba(212, 106, 126, 0.35)',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
