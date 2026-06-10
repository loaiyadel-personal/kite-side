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
        // Brand palette — ocean + sky + sand
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
        display: ['var(--font-outfit)', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(180deg, rgba(2,43,61,0.6) 0%, rgba(2,43,61,0.2) 60%, transparent 100%)',
      },
    },
  },
  plugins: [],
}

export default config
