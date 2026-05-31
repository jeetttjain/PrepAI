/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* ── Surfaces ── */
        "background":                  "#0a0a0a",
        "surface":                     "#111111",
        "surface-dim":                 "#0a0a0a",
        "surface-bright":              "#1f1f1f",
        "surface-container-lowest":    "#060606",
        "surface-container-low":       "#0f0f0f",
        "surface-container":           "#141414",
        "surface-container-high":      "#1a1a1a",
        "surface-container-highest":   "#242424",
        "surface-variant":             "#1f1f1f",
        "inverse-surface":             "#e4e4e7",
        "inverse-on-surface":          "#141414",

        /* ── Text ── */
        "on-surface":                  "#e4e4e7",
        "on-surface-variant":          "#71717a",
        "on-background":               "#e4e4e7",
        "on-primary":                  "#ffffff",
        "on-secondary":                "#ffffff",
        "on-tertiary":                 "#ffffff",

        /* ── Primary: Indigo — AI, Intelligence, Premium ── */
        "primary":                     "#6366f1",
        "primary-container":           "#312e81",
        "on-primary-container":        "#e0e7ff",
        "primary-fixed":               "#e0e7ff",
        "primary-fixed-dim":           "#c7d2fe",
        "on-primary-fixed":            "#312e81",
        "on-primary-fixed-variant":    "#3730a3",
        "inverse-primary":             "#4f46e5",
        "surface-tint":                "#6366f1",

        /* ── Secondary: Violet ── */
        "secondary":                   "#8b5cf6",
        "secondary-container":         "#4c1d95",
        "on-secondary-container":      "#ede9fe",
        "secondary-fixed":             "#ede9fe",
        "secondary-fixed-dim":         "#ddd6fe",
        "on-secondary-fixed":          "#4c1d95",
        "on-secondary-fixed-variant":  "#6d28d9",

        /* ── Tertiary: Sky Blue ── */
        "tertiary":                    "#38bdf8",
        "tertiary-container":          "#0c4a6e",
        "on-tertiary-container":       "#e0f2fe",
        "tertiary-fixed":              "#e0f2fe",
        "tertiary-fixed-dim":          "#bae6fd",
        "on-tertiary-fixed":           "#0c4a6e",
        "on-tertiary-fixed-variant":   "#075985",

        /* ── Error ── */
        "error":                       "#f87171",
        "error-container":             "#7f1d1d",
        "on-error":                    "#ffffff",
        "on-error-container":          "#fee2e2",

        /* ── Outline ── */
        "outline":                     "#3f3f46",
        "outline-variant":             "#27272a",
      },

      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg":      "0.5rem",
        "xl":      "0.75rem",
        "2xl":     "1rem",
        "3xl":     "1.25rem",
        "full":    "9999px",
      },

      spacing: {
        "margin-desktop":  "40px",
        "gutter":          "24px",
        "unit":            "8px",
        "margin-mobile":   "16px",
        "container-max":   "1280px",
      },

      fontFamily: {
        "headline-lg":        ["Inter", "sans-serif"],
        "headline-lg-mobile": ["Inter", "sans-serif"],
        "headline-xl":        ["Inter", "sans-serif"],
        "body-md":            ["Inter", "sans-serif"],
        "body-sm":            ["Inter", "sans-serif"],
        "label-caps":         ["Inter", "sans-serif"],
        "mono-data":          ["'JetBrains Mono'", "'Fira Code'", "monospace"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
