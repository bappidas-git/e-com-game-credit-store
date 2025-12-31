export const APP_NAME = "KELLS GLOBAL";
export const APP_TAGLINE = "Top up your favorite games instantly";
export const APP_DESCRIPTION =
  "Fast, secure, and reliable game top-ups for all your favorite titles";

export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  PRODUCTS: "/products",
  TOP_UP: "/top-up",
  GIFT_CARDS: "/gift-cards",
  PROFILE: "/profile",
  ORDERS: "/orders",
  ORDER_CONFIRMATION: "/order-confirmation",
  CHECKOUT: "/checkout",
  WISHLIST: "/wishlist",
  SUPPORT: "/support",
};

export const GAME_CATEGORIES = {
  MOBILE: "mobile-game",
  PC: "pc-game",
  GIFT_CARD: "gift-card",
  CROSS_PLATFORM: "cross-platform",
};

export const PLATFORMS = {
  MOBILE: "Mobile",
  PC: "PC",
  PLAYSTATION: "PlayStation",
  XBOX: "Xbox",
  NINTENDO: "Nintendo",
  GLOBAL: "Global",
  UNIVERSAL: "Universal",
  CROSS_PLATFORM: "Cross-platform",
};

export const PAYMENT_METHODS = {
  CARD: "card",
  PAYPAL: "paypal",
  CRYPTO: "crypto",
  WALLET: "wallet",
};

export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
};

export const DELIVERY_TIME = {
  INSTANT: "Instant Delivery",
  MINUTES_5: "5 Minutes",
  MINUTES_15: "15 Minutes",
  HOURS_1: "1 Hour",
  HOURS_24: "24 Hours",
};

export const TRUST_BADGES = [
  "100% Secure Payment",
  "Instant Delivery",
  "24/7 Support",
  "Best Price Guarantee",
];

export const SOCIAL_LINKS = {
  FACEBOOK: "https://facebook.com/gamehub",
  TWITTER: "https://twitter.com/gamehub",
  INSTAGRAM: "https://instagram.com/gamehub",
  DISCORD: "https://discord.gg/gamehub",
  YOUTUBE: "https://youtube.com/gamehub",
};

export const SUPPORT_EMAIL = "support@gamehub.com";
export const SUPPORT_PHONE = "+1 (555) 123-4567";

export const FAQ_ITEMS = [
  {
    id: 1,
    question: "How fast is delivery?",
    answer:
      "Most orders are delivered instantly after payment confirmation. Some items may take up to 15 minutes during peak hours.",
  },
  {
    id: 2,
    question: "Is payment secure?",
    answer:
      "Yes, we use industry-standard SSL encryption and partner with trusted payment processors to ensure your transactions are 100% secure.",
  },
  {
    id: 3,
    question: "What if I entered the wrong UID?",
    answer:
      "Contact our support team immediately. If the order hasn't been processed, we can help correct it. Processed orders cannot be reversed.",
  },
  {
    id: 4,
    question: "Do prices include taxes/fees?",
    answer:
      "Yes, all displayed prices are final. There are no hidden fees or additional charges at checkout.",
  },
];

export const WHY_CHOOSE_US = [
  {
    id: 1,
    title: "Blazing Delivery",
    description: "Most orders fulfilled in minutes or less",
    icon: "mdi:rocket-launch",
  },
  {
    id: 2,
    title: "Secure Checkout",
    description:
      "Your payments are processed with advanced 256-bit SSL encryption",
    icon: "mdi:shield-check",
  },
  {
    id: 3,
    title: "Global Coverage",
    description: "Gift cards and top-ups for multiple regions worldwide",
    icon: "mdi:earth",
  },
  {
    id: 4,
    title: "Friendly Support",
    description: "Get help quickly via chat or email support",
    icon: "mdi:headset",
  },
];

export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 },
  },
  slideDown: {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 50, opacity: 0 },
  },
  slideLeft: {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  },
  slideRight: {
    initial: { x: -50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 50, opacity: 0 },
  },
  scale: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  },
};

export const BREAKPOINTS = {
  XS: 480,
  SM: 768,
  MD: 1024,
  LG: 1280,
  XL: 1440,
  XXL: 1920,
};

export const CURRENCIES = {
  INR: { symbol: "₹", code: "INR", name: "Indian Rupee" },
  USD: { symbol: "$", code: "USD", name: "US Dollar" },
  EUR: { symbol: "€", code: "EUR", name: "Euro" },
  GBP: { symbol: "£", code: "GBP", name: "British Pound" },
  JPY: { symbol: "¥", code: "JPY", name: "Japanese Yen" },
};

export const DEFAULT_CURRENCY = CURRENCIES.INR;

export const REGIONS = {
  GLOBAL: "Global",
  BRAZIL: "Brazil",
  RUSSIA: "Russia",
  PHILIPPINES: "Philippines",
  INDIA: "India",
};
