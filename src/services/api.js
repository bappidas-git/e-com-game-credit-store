import axios from "axios";
import BASE_URL from "./baseURL";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API endpoints
const apiService = {
  // Auth endpoints
  auth: {
    login: async (credentials) => {
      const response = await api.get("/users", {
        params: {
          email: credentials.email,
          password: credentials.password,
        },
      });
      return response.data[0] || null;
    },
    register: async (userData) => {
      const response = await api.post("/users", userData);
      return response.data;
    },
  },

  // Products endpoints
  products: {
    getAll: async (params = {}) => {
      const response = await api.get("/products", { params });
      return response.data;
    },
    getById: async (id) => {
      const response = await api.get(`/products/${id}`);
      return response.data;
    },
    getFeatured: async () => {
      const response = await api.get("/products", {
        params: { featured: true },
      });
      return response.data;
    },
    getTrending: async () => {
      const response = await api.get("/products", {
        params: { trending: true },
      });
      return response.data;
    },
    getByCategory: async (category) => {
      const response = await api.get("/products", {
        params: { category },
      });
      return response.data;
    },
  },

  // Categories endpoints
  categories: {
    getAll: async () => {
      const response = await api.get("/categories");
      return response.data;
    },
  },

  // Cart endpoints
  cart: {
    getCart: async (userId) => {
      const response = await api.get("/cart", {
        params: { userId },
      });
      return response.data;
    },
    addToCart: async (item) => {
      const response = await api.post("/cart", item);
      return response.data;
    },
    updateCartItem: async (id, updates) => {
      const response = await api.patch(`/cart/${id}`, updates);
      return response.data;
    },
    removeFromCart: async (id) => {
      const response = await api.delete(`/cart/${id}`);
      return response.data;
    },
  },

  // Orders endpoints
  orders: {
    create: async (orderData) => {
      const response = await api.post("/orders", orderData);
      return response.data;
    },
    getByUserId: async (userId) => {
      const response = await api.get("/orders", {
        params: { userId },
      });
      return response.data;
    },
  },

  // Wishlist endpoints
  wishlist: {
    get: async (userId) => {
      const response = await api.get("/wishlist", {
        params: { userId },
      });
      return response.data;
    },
    add: async (item) => {
      const response = await api.post("/wishlist", item);
      return response.data;
    },
    remove: async (id) => {
      const response = await api.delete(`/wishlist/${id}`);
      return response.data;
    },
  },
};

export default apiService;
