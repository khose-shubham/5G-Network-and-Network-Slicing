/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060b17',
          900: '#0a1024',
          850: '#0e1733',
          800: '#131f42',
          700: '#1b2c5c',
          600: '#253d7e',
        },
        slice: {
          embb: '#06b6d4',      // Cyan (High throughput)
          urllc: '#10b981',     // Emerald / Critical reliability (Low latency)
          mmtc: '#a855f7',      // Purple (Massive IoT density)
          enterprise: '#f59e0b', // Amber / Gold (Private/Mission Critical)
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flow-fast': 'flow 1.5s linear infinite',
      },
      keyframes: {
        flow: {
          '0%': { strokeDashoffset: '24' },
          '100%': { strokeDashoffset: '0' },
        }
      }
    },
  },
  plugins: [],
}
