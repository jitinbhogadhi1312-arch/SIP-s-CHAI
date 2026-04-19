/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        card: 'hsl(var(--card))',
        border: 'hsl(var(--border))',
        muted: 'hsl(var(--muted))',
        status: {
          good: { text: 'hsl(var(--status-good))', bg: 'hsl(var(--status-good-bg))' },
          low: { text: 'hsl(var(--status-low))', bg: 'hsl(var(--status-low-bg))' },
          critical: { text: 'hsl(var(--status-critical))', bg: 'hsl(var(--status-critical-bg))' }
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        sm: '0.375rem',
      }
    },
  },
  plugins: [],
}
