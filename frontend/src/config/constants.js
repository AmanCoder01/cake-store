export const APP_CONFIG = {
  APP_NAME: "Cake Baker's",
  API_BASE_URL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "/api" : "http://localhost:5000/api"),

  COLORS: {
    PRIMARY: "#FF6F61", // Vibrant coral
    SECONDARY: "#6B7280", // Gray
    ACCENT: "#FDE047", // Yellow
    BACKGROUND: "#FFF7F5", // Soft peach
    TEXT: "#1F2937", // Dark gray
    WHITE: "#FFFFFF",
    SUCCESS: "#10B981",
    ERROR: "#EF4444"
  },

  PAGINATION: {
    DEFAULT_LIMIT: 12
  },

  CATEGORIES: ['Birthday', 'Wedding', 'Anniversary', 'Custom', 'Combo']
};
