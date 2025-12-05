/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light mode colors for landing page
        background: '#ffffff',
        surface: {
          DEFAULT: '#f9fafb',
          light: '#ffffff',
        },
        // Dark mode colors for dashboard
        dark: {
          background: '#0a0a0f',
          surface: {
            DEFAULT: '#1a1a2e',
            light: '#25253a',
          },
        },
        primary: {
          DEFAULT: '#2563eb', // Blue-600
          dark: '#1e40af', // Blue-800
          light: '#3b82f6', // Blue-500
        },
        secondary: {
          DEFAULT: '#06b6d4', // Cyan-500
          dark: '#0891b2', // Cyan-600
          light: '#22d3ee', // Cyan-400
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        text: {
          primary: '#111827', // Gray-900 for light mode
          secondary: '#6b7280', // Gray-500
          tertiary: '#9ca3af', // Gray-400
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
