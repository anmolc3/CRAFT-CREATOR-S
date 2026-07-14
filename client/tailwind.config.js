/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#111111',
          50: '#f5f5f5',
          100: '#e8e8e8',
          200: '#d1d1d1',
          300: '#aaaaaa',
          400: '#717171',
          500: '#555555',
          600: '#3d3d3d',
          700: '#2e2e2e',
          800: '#1f1f1f',
          900: '#111111',
          950: '#0a0a0a',
        },
        secondary: '#1F1F1F',
        accent: {
          DEFAULT: '#D4AF37',
          50: '#fdf9ed',
          100: '#f9f0c8',
          200: '#f4df8e',
          300: '#edc84d',
          400: '#e4b32a',
          500: '#D4AF37',
          600: '#b5871a',
          700: '#906318',
          800: '#764e1a',
          900: '#64411a',
        },
        gold: '#D4AF37',
        background: '#FAFAFA',
        surface: '#FFFFFF',
        dark: {
          DEFAULT: '#111111',
          card: '#1a1a1a',
          border: '#2a2a2a',
          muted: '#666666',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['1.875rem', { lineHeight: '1.3' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'luxury': '0 25px 80px -20px rgba(0, 0, 0, 0.15)',
        'luxury-lg': '0 40px 100px -20px rgba(0, 0, 0, 0.25)',
        'gold': '0 4px 30px rgba(212, 175, 55, 0.3)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 16px 48px rgba(0, 0, 0, 0.15)',
        'inner-soft': 'inset 0 1px 4px rgba(0,0,0,0.04)',
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(135deg, #111111 0%, #1f1f1f 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #b8960a 100%)',
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in': 'slideIn 0.5s ease-out forwards',
        'shimmer': 'shimmer 2s infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 175, 55, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(212, 175, 55, 0)' },
        },
      },
      aspectRatio: {
        'photo': '4 / 3',
        'portrait': '3 / 4',
        'cinema': '21 / 9',
      },
    },
  },
  plugins: [],
};
