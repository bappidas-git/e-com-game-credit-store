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

  // Admin endpoints
  admin: {
    login: async (credentials) => {
      const response = await api.get("/admins", {
        params: {
          email: credentials.email,
          password: credentials.password,
        },
      });
      return response.data[0] || null;
    },
    getProducts: async () => {
      const response = await api.get("/products");
      return response.data;
    },
    getProduct: async (id) => {
      const response = await api.get(`/products/${id}`);
      return response.data;
    },
    createProduct: async (productData) => {
      const response = await api.post("/products", productData);
      return response.data;
    },
    updateProduct: async (id, productData) => {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    },
    deleteProduct: async (id) => {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    },
    getOrders: async () => {
      const response = await api.get("/orders");
      return response.data;
    },
    updateOrderStatus: async (id, status) => {
      const response = await api.patch(`/orders/${id}`, { status });
      return response.data;
    },
    // Lead management endpoints
    getLeads: async (params = {}) => {
      const response = await api.get("/leads", { params });
      return response.data;
    },
    getLead: async (id) => {
      const response = await api.get(`/leads/${id}`);
      return response.data;
    },
    updateLead: async (id, leadData) => {
      const response = await api.patch(`/leads/${id}`, {
        ...leadData,
        updatedAt: new Date().toISOString(),
      });
      return response.data;
    },
    deleteLead: async (id) => {
      const response = await api.delete(`/leads/${id}`);
      return response.data;
    },
  },

  // Lead endpoints (public - for form submissions)
  leads: {
    createContactLead: async (leadData) => {
      const response = await api.post("/leads", {
        type: "contact",
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone || null,
        orderNumber: leadData.orderNumber || null,
        category: leadData.category,
        subject: leadData.subject,
        message: leadData.message,
        status: "new",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: "",
      });
      return response.data;
    },
    createNewsletterLead: async (email) => {
      const response = await api.post("/leads", {
        type: "newsletter",
        name: null,
        email: email,
        phone: null,
        orderNumber: null,
        category: null,
        subject: null,
        message: null,
        status: "subscribed",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: "",
      });
      return response.data;
    },
  },
};

export default apiService;
