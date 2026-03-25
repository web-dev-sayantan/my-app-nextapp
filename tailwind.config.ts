import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'media',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Colors - New Design System
      colors: {
        primary: {
          DEFAULT: '#F47B3F',
          light: '#F9A876',
          dark: '#D4612A',
        },
        bg: {
          main: '#F2EFE7',
          card: '#FFFFFF',
          soft: '#EDE8DC',
        },
        accent: {
          green: '#8BAF7C',
          blue: '#A8C8D8',
          peach: '#F2B49A',
        },
        // Text colors
        text: {
          primary: '#1A1A1A',
          secondary: '#6B6B6B',
          muted: '#A0A0A0',
        },
        // Utility colors
        success: '#8BAF7C',
        error: '#E07A5F',
        border: '#E5DDD0',
        // Brand Design Tokens
        brand: {
          forest: '#1a2e1a',
          moss: '#3d5c2e',
          sage: '#7a9e6e',
          sand: '#f5f0e8',
          warmwhite: '#faf8f4',
          burnt: '#c4601a',
          amber: '#e8a040',
        },
      },
      
      // Typography
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      
      // Border Radius
      borderRadius: {
        pill: '999px',
        card: '16px',
        'card-lg': '24px',
      },
      
      // Box Shadow
      boxShadow: {
        warm: '0 4px 20px rgba(244, 123, 63, 0.1)',
        'warm-md': '0 8px 30px rgba(244, 123, 63, 0.15)',
        'warm-lg': '0 12px 40px rgba(244, 123, 63, 0.2)',
      },
      
      // Background patterns
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      
      keyframes: {
        "slide-left" : {
          from: { "transform" : "translateX(0px)"},
          to: {"transform" : "translateX(-3000px)"}
        }
      },
      animation: {
        "slide-left" : "slide-left 60s linear 2s infinite  alternate"
      },
    },

    screens: {
      'below-xs' : {'max': '360px'} ,
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  },
  plugins: [],
};
export default config;
