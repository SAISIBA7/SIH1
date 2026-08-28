module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "bg-base": "#F2F2EF",
        "glass-panel": "rgba(255,255,255,0.6)",
        "glass-border": "rgba(255,255,255,0.7)",
        "focus-dark": "#1A1A1A",
        "accent-lime": "#CFE362",
        "text-primary": "#1A1A1A",
        "text-secondary": "#8C8C88",
        "risk-red": "#E4574B",
        "risk-yellow": "#F0B942",
        "risk-green": "#6FBF73"
      },
      borderRadius: {
        "lg": "28px",
        "md": "16px"
      },
      boxShadow: {
        "soft": "0 8px 24px rgba(0,0,0,0.06)"
      }
    }
  },
  plugins: []
};
