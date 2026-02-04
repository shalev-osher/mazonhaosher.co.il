import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  safelist: [
    // Gradient directions
    "bg-gradient-to-br",
    "bg-gradient-to-r",
    "bg-gradient-to-b",
    
    // Navigation icon gradients
    "from-orange-500",
    "to-amber-600",
    "from-pink-500",
    "to-rose-600",
    "from-amber-500",
    "to-orange-600",
    "from-sky-500",
    "to-cyan-600",
    "from-emerald-500",
    "to-teal-600",
    "from-cyan-500",
    "to-blue-600",
    "from-red-500",
    "from-rose-500",
    "to-pink-600",

    // Social media brand colors (hex)
    "from-[#25D366]",
    "to-[#128C7E]",
    "bg-[#25D366]",
    "hover:bg-[#128C7E]",
    "from-[#1877F2]",
    "to-[#0d5fc4]",
    "from-[#833AB4]",
    "via-[#E1306C]",
    "to-[#F77737]",

    // Cookie glow effect
    "from-[hsl(35,80%,55%)]",
    "border-[hsl(35,80%,55%)]",

    // Common status/icon colors
    "bg-yellow-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-red-500",
    "bg-orange-500",
    "bg-gray-500",
    "bg-amber-500",
    "bg-amber-100",
    "dark:bg-amber-900/50",
    "text-red-500",
    "text-amber-500",
    "text-amber-600",
    "text-emerald-500",
    "text-cyan-500",
    "text-purple-500",
    "fill-red-500",
    "stroke-red-500",
    "fill-current",
    "fill-white",
    "text-white",
  ],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["Secular One", "sans-serif"],
        body: ["Rubik", "sans-serif"],
      },
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
        cream: "hsl(var(--warm-cream))",
        rose: "hsl(var(--rose))",
        coral: "hsl(var(--coral))",
        honey: "hsl(var(--golden-honey))",
        teal: "hsl(var(--teal))",
        violet: "hsl(var(--violet))",
        sky: "hsl(var(--sky))",
        emerald: "hsl(var(--emerald))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        warm: "var(--shadow-warm)",
        elevated: "var(--shadow-elevated)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-2px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(2px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shake: "shake 0.5s ease-in-out",
        marquee: "marquee 20s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
