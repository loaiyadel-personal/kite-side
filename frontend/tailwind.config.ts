import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Extracted from logo: rounded-rect border + "BEACH CLUB" text
        'brand-primary': '#5AACBC',
        // Extracted from logo: letter stripe fill / deep teal
        'brand-deep': '#2B6070',
        // Deep navy (hero background, footer)
        'brand-dark': '#022b3d',
        // Sand/gold accent
        'brand-accent': '#e4c97a',
        // Very light teal — subtle section backgrounds
        'brand-surface': '#EEF7F9',

        // Brand palette — ocean + sky + sand (kept for existing usage)
        ocean: {
          50: '#e6f4ff',
          100: '#b3deff',
          400: '#1a9fd4',
          500: '#0e86b8',
          600: '#0a6d96',
          900: '#022b3d',
        },
        sand: {
          50: '#fdf8ee',
          100: '#f5e9c8',
          300: '#e4c97a',
          500: '#c9a43a',
        },
        wind: {
          calm: '#22c55e',
          light: '#84cc16',
          moderate: '#eab308',
          fresh: '#f97316',
          strong: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        outfit: ['var(--font-outfit)', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(180deg, rgba(2,43,61,0.6) 0%, rgba(2,43,61,0.2) 60%, transparent 100%)',
        'brand-gradient': 'linear-gradient(135deg, #022b3d 0%, #2B6070 50%, #5AACBC 100%)',
        'hero-bg': 'linear-gradient(160deg, #022b3d 0%, #0a4f6e 45%, #1284a8 100%)',
      },
      boxShadow: {
        'brand-sm': '0 2px 12px 0 rgba(90,172,188,0.12)',
        'brand-md': '0 4px 24px 0 rgba(90,172,188,0.18)',
        'brand-lg': '0 8px 40px 0 rgba(90,172,188,0.22)',
        'glow-brand': '0 0 24px rgba(90,172,188,0.5)',
        'glow-brand-lg': '0 0 40px rgba(90,172,188,0.35)',
        'card': '0 8px 32px rgba(2,43,61,0.12), 0 2px 8px rgba(90,172,188,0.08)',
        'card-hover': '0 12px 40px rgba(2,43,61,0.16), 0 4px 12px rgba(90,172,188,0.12)',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
