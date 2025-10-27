// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Custom colors exactly matching the screenshot
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom colors for specific elements from your screenshot
        'dark-blue-bg': '#030816', // Main very dark background
        'sidebar-bg': '#041124', // Sidebar background
        'header-bg': 'rgba(4, 17, 36, 0.5)', // Header background with transparency
        'new-chat-btn': '#1a73e8', // New chat button blue
        'new-chat-btn-hover': '#1664cc', // New chat button hover
        'border-gray-800': '#2d3748', // Darker gray for borders
        'text-gray-200': '#e2e8f0', // Light gray text
        'text-gray-300': '#cbd5e0', // Slightly darker light gray text
        'text-gray-400': '#a0aec0', // Even darker gray text
        'recent-label': '#a0aec0', // Color for "RECENT" label
        'conversation-hover': '#1a2233', // Hover for conversation items
        'settings-text': '#cbd5e0', // Settings link text
        'logout-btn-bg': 'rgba(255,255,255,0.06)', // Logout button background
        'input-bg': '#1a2233', // Input area background
        'input-border': 'rgba(255,255,255,0.1)', // Input border
        'tools-btn-bg': 'rgba(255,255,255,0.06)', // Tools button background
        'prompt-bg': '#1a2233', // Prompt background (same as input)
        'prompt-border': 'rgba(255,255,255,0.1)', // Prompt border

      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      // Custom utility to create the gradient text and mask effect
      // This allows for a specific 'glassmorphism' card effect if needed
      backgroundImage: {
        'gradient-mask': 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};