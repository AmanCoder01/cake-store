export const APP_CONFIG = {
  APP_NAME: "Cake Baker's",
  API_BASE_URL: import.meta.env.VITE_API_URL || (
    import.meta.env.PROD 
      ? "/api" 
      : typeof window !== 'undefined' 
        ? `http://${window.location.hostname}:5000/api` 
        : "http://localhost:5000/api"
  ),
  VAPID_PUBLIC_KEY: "BPyBN0a6h6X207ASr052BcRPflQVydhoYlhHoyneC9Bn3qC6D7PFiIx-fi9YbOKm8Z_oSIhQXV0PUEKK810wO3g",

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

  CATEGORIES: [
    'Birthday Cakes', 
    'Wedding Cakes', 
    'Anniversary Cakes', 
    'Eggless Special', 
    'Custom Creations', 
    'Exquisite Cupcakes', 
    'Artisan Pastries', 
    'Chocolate Decadence'
  ]
};

export const PLACEHOLDER_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%"><defs><linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23FFF5F5"/><stop offset="100%" stop-color="%23FFE3E3"/></linearGradient><linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="%23FF7A7A"/><stop offset="100%" stop-color="%23FF4B4B"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23bgGrad)"/><circle cx="50" cy="50" r="30" fill="%23FF7A7A" opacity="0.05"/><circle cx="350" cy="250" r="60" fill="%23FF7A7A" opacity="0.05"/><circle cx="300" cy="60" r="40" fill="%23FF7A7A" opacity="0.03"/><g transform="translate(160, 60)"><path d="M-40,65 L120,65 C130,65 140,70 140,75 C140,80 130,85 120,85 L-40,85 C-50,85 -60,80 -60,75 C-60,70 -50,65 -40,65 Z" fill="%23E2D1D1" opacity="0.8"/><path d="M30,85 L50,85 L60,115 L20,115 Z" fill="%23D3C1C1" opacity="0.9"/><rect x="-20" y="20" width="120" height="45" rx="8" fill="%23FFF" stroke="%23FF7A7A" stroke-width="2"/><path d="M-20,35 Q-10,45 0,35 Q10,45 20,35 Q30,45 40,35 Q50,45 60,35 Q70,45 80,35 Q90,45 100,35" fill="none" stroke="%23FF7A7A" stroke-width="3" stroke-linecap="round"/><rect x="5" y="-15" width="70" height="35" rx="6" fill="%23FFF" stroke="%23FF7A7A" stroke-width="2"/><rect x="37" y="-35" width="6" height="20" rx="2" fill="url(%23primaryGrad)"/><path d="M40,-48 C37,-42 40,-35 40,-35 C40,-35 43,-42 40,-48 Z" fill="%23FFC107"/></g><text x="200" y="215" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="900" fill="%23FF4B4B" text-anchor="middle" letter-spacing="1">CAKE BAKER'S</text><text x="200" y="238" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="800" fill="%23A88E8E" text-anchor="middle" letter-spacing="3">VARANASI</text><text x="200" y="260" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="600" fill="%23C2B2B2" text-anchor="middle">Freshly Baked Happiness</text></svg>`;
