/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors (Blue)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe', 
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Main blue
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        
        // Secondary Colors (Purple)
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff', 
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7', // Main purple
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        
        // Accent Colors
        accent: {
          // Green tones
          green: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e', // Success green
            600: '#16a34a',
            700: '#15803d',
          },
          // Orange tones
          orange: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#f97316', // Warning orange
            600: '#ea580c',
            700: '#c2410c',
          },
          // Red tones
          red: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444', // Error red
            600: '#dc2626',
            700: '#b91c1c',
          }
        },
        
        // Glassmorphic Colors - White tones
        'glass-white': 'rgba(255, 255, 255, 0.9)',      // Çok opak beyaz
        'glass-white-80': 'rgba(255, 255, 255, 0.8)',   // 80% beyaz
        'glass-white-70': 'rgba(255, 255, 255, 0.7)',   // 70% beyaz
        'glass-white-50': 'rgba(255, 255, 255, 0.5)',   // 50% beyaz
        'glass-white-30': 'rgba(255, 255, 255, 0.3)',   // 30% beyaz
        'glass-white-20': 'rgba(255, 255, 255, 0.2)',   // 20% beyaz
        'glass-white-10': 'rgba(255, 255, 255, 0.1)',   // 10% beyaz
        
        // Glassmorphic Colors - Black tones
        'glass-black': 'rgba(0, 0, 0, 0.8)',            // Koyu siyah
        'glass-black-50': 'rgba(0, 0, 0, 0.5)',         // 50% siyah
        'glass-black-30': 'rgba(0, 0, 0, 0.3)',         // 30% siyah
        'glass-black-20': 'rgba(0, 0, 0, 0.2)',         // 20% siyah
        'glass-black-10': 'rgba(0, 0, 0, 0.1)',         // 10% siyah
        'glass-black-5': 'rgba(0, 0, 0, 0.05)',         // 5% siyah
        
        // Shortcuts for common uses
        'glass-card': '#ffffff',                         // Pure white card backgrounds
        'glass-overlay': 'rgba(255, 255, 255, 0.2)',    // Button overlays
        'glass-border': 'rgba(255, 255, 255, 0.3)',     // Borders
      },
    },
  },
  plugins: [],
};
