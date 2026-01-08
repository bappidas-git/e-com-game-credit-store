import axios from "axios";
import BASE_URL, { IS_MOCK_API } from "./baseURL";

// =============================================================================
// API Service Configuration
// =============================================================================
//
// This service handles all API calls for both Website and Admin Panel.
// It's designed to work with:
// - JSON Server (development/mock API)
// - Laravel Backend (production API)
//
// When switching to production:
// 1. Update REACT_APP_API_URL in .env
// 2. The response format handling is automatic via extractData helper
//
// =============================================================================

// Create axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000, // 30 second timeout
});

// =============================================================================
// Request Interceptor
// =============================================================================
api.interceptors.request.use(
  (config) => {
    // Determine which token to use based on the request URL
    // Admin endpoints use adminToken, user endpoints use token
    const isAdminRequest = config.url && config.url.includes("/admin/");

    if (isAdminRequest) {
      const adminToken = sessionStorage.getItem("adminToken");
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
    } else {
      const token = sessionStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =============================================================================
// Response Interceptor
// =============================================================================
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      const { status } = error.response;

      // Handle 401 Unauthorized - Token expired or invalid
      if (status === 401) {
        // Clear session and redirect to login
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("admin");
        sessionStorage.removeItem("adminToken");

        // Optionally redirect to login page
        // window.location.href = '/login';
      }

      // Handle 403 Forbidden
      if (status === 403) {
        console.error("Access forbidden");
      }

      // Handle 429 Too Many Requests
      if (status === 429) {
        console.error("Rate limit exceeded");
      }

      // Handle 500 Internal Server Error
      if (status >= 500) {
        console.error("Server error");
      }
    }

    return Promise.reject(error);
  }
);

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Extract data from API response
 * Handles both JSON Server (direct data) and Laravel API (wrapped in {success, data})
 */
const extractData = (response) => {
  // For production API with standard format: { success: true, data: {...} }
  if (response.data && typeof response.data === "object" && "success" in response.data) {
    return response.data.data;
  }
  // For JSON Server which returns data directly
  return response.data;
};

/**
 * Extract pagination meta from API response
 */
const extractMeta = (response) => {
  if (response.data && response.data.meta) {
    return response.data.meta;
  }
  return null;
};

/**
 * Handle API errors and extract error message
 */
const getErrorMessage = (error) => {
  if (error.response && error.response.data) {
    const { data } = error.response;
    // Production API error format
    if (data.message) {
      return data.message;
    }
    // Validation errors
    if (data.errors) {
      const firstError = Object.values(data.errors)[0];
      return Array.isArray(firstError) ? firstError[0] : firstError;
    }
  }
  return error.message || "An error occurred";
};

// =============================================================================
// API Service Object
// =============================================================================
const apiService = {
  // ===========================================================================
  // Authentication Endpoints
  // ===========================================================================
  auth: {
    /**
     * User login
     * @param {Object} credentials - { email, password }
     * @returns {Object|null} User data or null if failed
     */
    login: async (credentials) => {
      try {
        if (IS_MOCK_API) {
          // JSON Server: Filter users by email and password
          const response = await api.get("/users", {
            params: {
              email: credentials.email,
              password: credentials.password,
            },
          });
          return response.data[0] || null;
        } else {
          // Production API: POST to login endpoint
          const response = await api.post("/auth/login", credentials);
          const data = extractData(response);
          if (data && data.token) {
            sessionStorage.setItem("token", data.token);
          }
          return data?.user || null;
        }
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },

    /**
     * User registration
     * @param {Object} userData - { email, password, firstName, lastName, phone }
     * @returns {Object} Created user data
     */
    register: async (userData) => {
      try {
        if (IS_MOCK_API) {
          const response = await api.post("/users", userData);
          return response.data;
        } else {
          const response = await api.post("/auth/register", userData);
          return extractData(response);
        }
      } catch (error) {
        console.error("Registration error:", error);
        throw error;
      }
    },

    /**
     * User logout
     */
    logout: async () => {
      try {
        if (!IS_MOCK_API) {
          await api.post("/auth/logout");
        }
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
      } catch (error) {
        // Still clear session on logout error
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
      }
    },

    /**
     * Get current user profile
     */
    getUser: async () => {
      try {
        if (IS_MOCK_API) {
          const storedUser = sessionStorage.getItem("user");
          return storedUser ? JSON.parse(storedUser) : null;
        } else {
          const response = await api.get("/auth/user");
          return extractData(response);
        }
      } catch (error) {
        console.error("Get user error:", error);
        throw error;
      }
    },

    /**
     * Update user profile
     * @param {Object} updates - Fields to update
     */
    updateUser: async (updates) => {
      try {
        if (IS_MOCK_API) {
          const storedUser = sessionStorage.getItem("user");
          if (storedUser) {
            const user = JSON.parse(storedUser);
            const response = await api.patch(`/users/${user.id}`, updates);
            return response.data;
          }
          return null;
        } else {
          const response = await api.put("/auth/user", updates);
          return extractData(response);
        }
      } catch (error) {
        console.error("Update user error:", error);
        throw error;
      }
    },

    /**
     * Change password
     * @param {Object} passwordData - { current_password, password, password_confirmation }
     */
    changePassword: async (passwordData) => {
      try {
        if (IS_MOCK_API) {
          // Mock API doesn't support password change
          return { success: true };
        } else {
          const response = await api.put("/auth/password", passwordData);
          return extractData(response);
        }
      } catch (error) {
        console.error("Change password error:", error);
        throw error;
      }
    },
  },

  // ===========================================================================
  // Product Endpoints
  // ===========================================================================
  products: {
    /**
     * Get all products with optional filters
     * @param {Object} params - Query parameters (featured, trending, category, etc.)
     */
    getAll: async (params = {}) => {
      try {
        const response = await api.get("/products", { params });
        return extractData(response);
      } catch (error) {
        console.error("Get products error:", error);
        throw error;
      }
    },

    /**
     * Get product by ID
     * @param {string|number} id - Product ID
     */
    getById: async (id) => {
      try {
        const response = await api.get(`/products/${id}`);
        return extractData(response);
      } catch (error) {
        console.error("Get product error:", error);
        throw error;
      }
    },

    /**
     * Get product by slug
     * @param {string} slug - Product slug
     */
    getBySlug: async (slug) => {
      try {
        if (IS_MOCK_API) {
          const response = await api.get("/products", { params: { slug } });
          const data = response.data;
          return Array.isArray(data) ? data[0] : data;
        } else {
          const response = await api.get(`/products/slug/${slug}`);
          return extractData(response);
        }
      } catch (error) {
        console.error("Get product by slug error:", error);
        throw error;
      }
    },

    /**
     * Get featured products
     * @param {number} limit - Maximum number of products
     */
    getFeatured: async (limit = 10) => {
      try {
        if (IS_MOCK_API) {
          const response = await api.get("/products", {
            params: { featured: true },
          });
          return response.data.slice(0, limit);
        } else {
          const response = await api.get("/products/featured", {
            params: { limit },
          });
          return extractData(response);
        }
      } catch (error) {
        console.error("Get featured products error:", error);
        throw error;
      }
    },

    /**
     * Get trending products
     * @param {number} limit - Maximum number of products
     */
    getTrending: async (limit = 10) => {
      try {
        if (IS_MOCK_API) {
          const response = await api.get("/products", {
            params: { trending: true },
          });
          return response.data.slice(0, limit);
        } else {
          const response = await api.get("/products/trending", {
            params: { limit },
          });
          return extractData(response);
        }
      } catch (error) {
        console.error("Get trending products error:", error);
        throw error;
      }
    },

    /**
     * Get hot products
     * @param {number} limit - Maximum number of products
     */
    getHot: async (limit = 10) => {
      try {
        if (IS_MOCK_API) {
          const response = await api.get("/products", {
            params: { hot: true },
          });
          return response.data.slice(0, limit);
        } else {
          const response = await api.get("/products/hot", {
            params: { limit },
          });
          return extractData(response);
        }
      } catch (error) {
        console.error("Get hot products error:", error);
        throw error;
      }
    },

    /**
     * Get products by category
     * @param {string} category - Category slug
     */
    getByCategory: async (category) => {
      try {
        if (IS_MOCK_API) {
          const response = await api.get("/products", {
            params: { category },
          });
          return response.data;
        } else {
          const response = await api.get(`/products/category/${category}`);
          return extractData(response);
        }
      } catch (error) {
        console.error("Get products by category error:", error);
        throw error;
      }
    },

    /**
     * Search products
     * @param {string} query - Search query
     */
    search: async (query) => {
      try {
        if (IS_MOCK_API) {
          const response = await api.get("/products", {
            params: { q: query },
          });
          return response.data;
        } else {
          const response = await api.get("/products", {
            params: { search: query },
          });
          return extractData(response);
        }
      } catch (error) {
        console.error("Search products error:", error);
        throw error;
      }
    },
  },

  // ===========================================================================
  // Category Endpoints
  // ===========================================================================
  categories: {
    /**
     * Get all categories
     */
    getAll: async () => {
      try {
        const response = await api.get("/categories");
        return extractData(response);
      } catch (error) {
        console.error("Get categories error:", error);
        throw error;
      }
    },

    /**
     * Get category by slug
     * @param {string} slug - Category slug
     */
    getBySlug: async (slug) => {
      try {
        if (IS_MOCK_API) {
          const response = await api.get("/categories", { params: { slug } });
          const data = response.data;
          return Array.isArray(data) ? data[0] : data;
        } else {
          const response = await api.get(`/categories/${slug}`);
          return extractData(response);
        }
      } catch (error) {
        console.error("Get category error:", error);
        throw error;
      }
    },
  },

  // ===========================================================================
  // Cart Endpoints
  // ===========================================================================
  cart: {
    /**
     * Get user's cart
     * @param {number} userId - User ID
     */
    getCart: async (userId) => {
      try {
        if (IS_MOCK_API) {
          const response = await api.get("/cart", {
            params: { userId },
          });
          return response.data;
        } else {
          const response = await api.get("/cart");
          return extractData(response);
        }
      } catch (error) {
        console.error("Get cart error:", error);
        throw error;
      }
    },

    /**
     * Add item to cart
     * @param {Object} item - Cart item data
     */
    addToCart: async (item) => {
      try {
        const response = await api.post("/cart", item);
        return extractData(response);
      } catch (error) {
        console.error("Add to cart error:", error);
        throw error;
      }
    },

    /**
     * Update cart item
     * @param {number} id - Cart item ID
     * @param {Object} updates - Fields to update
     */
    updateCartItem: async (id, updates) => {
      try {
        const response = await api.patch(`/cart/${id}`, updates);
        return extractData(response);
      } catch (error) {
        console.error("Update cart error:", error);
        throw error;
      }
    },

    /**
     * Remove item from cart
     * @param {number} id - Cart item ID
     */
    removeFromCart: async (id) => {
      try {
        const response = await api.delete(`/cart/${id}`);
        return IS_MOCK_API ? response.data : extractData(response);
      } catch (error) {
        console.error("Remove from cart error:", error);
        throw error;
      }
    },

    /**
     * Clear all cart items
     */
    clearCart: async () => {
      try {
        if (IS_MOCK_API) {
          // JSON Server doesn't support bulk delete, get and delete each
          const storedUser = sessionStorage.getItem("user");
          if (storedUser) {
            const user = JSON.parse(storedUser);
            const cartResponse = await api.get("/cart", {
              params: { userId: user.id },
            });
            await Promise.all(
              cartResponse.data.map((item) => api.delete(`/cart/${item.id}`))
            );
          }
          return true;
        } else {
          const response = await api.delete("/cart");
          return extractData(response);
        }
      } catch (error) {
        console.error("Clear cart error:", error);
        throw error;
      }
    },
  },

  // ===========================================================================
  // Order Endpoints
  // ===========================================================================
  orders: {
    /**
     * Create a new order
     * @param {Object} orderData - Order data including items, totals, payment info
     */
    create: async (orderData) => {
      try {
        const response = await api.post("/orders", orderData);
        return extractData(response);
      } catch (error) {
        console.error("Create order error:", error);
        throw error;
      }
    },

    /**
     * Get user's orders
     * @param {number} userId - User ID
     */
    getByUserId: async (userId) => {
      try {
        if (IS_MOCK_API) {
          const response = await api.get("/orders", {
            params: { userId },
          });
          return response.data;
        } else {
          const response = await api.get("/orders");
          return extractData(response);
        }
      } catch (error) {
        console.error("Get orders error:", error);
        throw error;
      }
    },

    /**
     * Get order by ID
     * @param {number|string} id - Order ID or order number
     */
    getById: async (id) => {
      try {
        const response = await api.get(`/orders/${id}`);
        return extractData(response);
      } catch (error) {
        console.error("Get order error:", error);
        throw error;
      }
    },
  },

  // ===========================================================================
  // Wishlist Endpoints
  // ===========================================================================
  wishlist: {
    /**
     * Get user's wishlist
     * @param {number} userId - User ID
     */
    get: async (userId) => {
      try {
        if (IS_MOCK_API) {
          const response = await api.get("/wishlist", {
            params: { userId },
          });
          return response.data;
        } else {
          const response = await api.get("/wishlist");
          return extractData(response);
        }
      } catch (error) {
        console.error("Get wishlist error:", error);
        throw error;
      }
    },

    /**
     * Add item to wishlist
     * @param {Object} item - Wishlist item data
     */
    add: async (item) => {
      try {
        const response = await api.post("/wishlist", item);
        return extractData(response);
      } catch (error) {
        console.error("Add to wishlist error:", error);
        throw error;
      }
    },

    /**
     * Remove item from wishlist
     * @param {number} id - Wishlist item ID
     */
    remove: async (id) => {
      try {
        const response = await api.delete(`/wishlist/${id}`);
        return IS_MOCK_API ? response.data : extractData(response);
      } catch (error) {
        console.error("Remove from wishlist error:", error);
        throw error;
      }
    },
  },

  // ===========================================================================
  // Lead/Support Endpoints
  // ===========================================================================
  leads: {
    /**
     * Create a contact/support lead
     * @param {Object} leadData - Contact form data
     */
    createContactLead: async (leadData) => {
      try {
        if (IS_MOCK_API) {
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
        } else {
          const response = await api.post("/leads/contact", leadData);
          return extractData(response);
        }
      } catch (error) {
        console.error("Create contact lead error:", error);
        throw error;
      }
    },

    /**
     * Create a newsletter subscription lead
     * @param {string} email - Subscriber email
     */
    createNewsletterLead: async (email) => {
      try {
        if (IS_MOCK_API) {
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
        } else {
          const response = await api.post("/leads/newsletter", { email });
          return extractData(response);
        }
      } catch (error) {
        console.error("Create newsletter lead error:", error);
        throw error;
      }
    },
  },

  // ===========================================================================
  // Admin Endpoints
  // ===========================================================================
  admin: {
    /**
     * Admin login
     * @param {Object} credentials - { email, password }
     */
    login: async (credentials) => {
      try {
        if (IS_MOCK_API) {
          const response = await api.get("/admins", {
            params: {
              email: credentials.email,
              password: credentials.password,
            },
          });
          return response.data[0] || null;
        } else {
          const response = await api.post("/admin/auth/login", credentials);
          const data = extractData(response);
          if (data && data.token) {
            sessionStorage.setItem("adminToken", data.token);
          }
          return data?.admin || null;
        }
      } catch (error) {
        console.error("Admin login error:", error);
        throw error;
      }
    },

    /**
     * Admin logout
     */
    logout: async () => {
      try {
        if (!IS_MOCK_API) {
          await api.post("/admin/auth/logout");
        }
        sessionStorage.removeItem("admin");
        sessionStorage.removeItem("adminToken");
      } catch (error) {
        sessionStorage.removeItem("admin");
        sessionStorage.removeItem("adminToken");
      }
    },

    // -------------------------------------------------------------------------
    // Admin Product Management
    // -------------------------------------------------------------------------

    /**
     * Get all products (admin view)
     */
    getProducts: async () => {
      try {
        if (IS_MOCK_API) {
          const response = await api.get("/products");
          return response.data;
        } else {
          const response = await api.get("/admin/products");
          return extractData(response);
        }
      } catch (error) {
        console.error("Admin get products error:", error);
        throw error;
      }
    },

    /**
     * Get single product (admin view)
     * @param {string|number} id - Product ID
     */
    getProduct: async (id) => {
      try {
        if (IS_MOCK_API) {
          const response = await api.get(`/products/${id}`);
          return response.data;
        } else {
          const response = await api.get(`/admin/products/${id}`);
          return extractData(response);
        }
      } catch (error) {
        console.error("Admin get product error:", error);
        throw error;
      }
    },

    /**
     * Create a new product
     * @param {Object} productData - Product data with offers
     */
    createProduct: async (productData) => {
      try {
        if (IS_MOCK_API) {
          const response = await api.post("/products", productData);
          return response.data;
        } else {
          const response = await api.post("/admin/products", productData);
          return extractData(response);
        }
      } catch (error) {
        console.error("Admin create product error:", error);
        throw error;
      }
    },

    /**
     * Update a product
     * @param {string|number} id - Product ID
     * @param {Object} productData - Updated product data
     */
    updateProduct: async (id, productData) => {
      try {
        if (IS_MOCK_API) {
          const response = await api.put(`/products/${id}`, productData);
          return response.data;
        } else {
          const response = await api.put(`/admin/products/${id}`, productData);
          return extractData(response);
        }
      } catch (error) {
        console.error("Admin update product error:", error);
        throw error;
      }
    },

    /**
     * Delete a product
     * @param {string|number} id - Product ID
     */
    deleteProduct: async (id) => {
      try {
        if (IS_MOCK_API) {
          const response = await api.delete(`/products/${id}`);
          return response.data;
        } else {
          const response = await api.delete(`/admin/products/${id}`);
          return extractData(response);
        }
      } catch (error) {
        console.error("Admin delete product error:", error);
        throw error;
      }
    },

    // -------------------------------------------------------------------------
    // Admin Order Management
    // -------------------------------------------------------------------------

    /**
     * Get all orders (admin view)
     * @param {Object} params - Query parameters for filtering
     */
    getOrders: async (params = {}) => {
      try {
        if (IS_MOCK_API) {
          const response = await api.get("/orders", { params });
          return response.data;
        } else {
          const response = await api.get("/admin/orders", { params });
          return extractData(response);
        }
      } catch (error) {
        console.error("Admin get orders error:", error);
        throw error;
      }
    },

    /**
     * Update order status
     * @param {number} id - Order ID
     * @param {string} status - New status
     * @param {string} notes - Optional notes
     */
    updateOrderStatus: async (id, status, notes = "") => {
      try {
        if (IS_MOCK_API) {
          const response = await api.patch(`/orders/${id}`, {
            status,
            notes,
            updatedAt: new Date().toISOString(),
          });
          return response.data;
        } else {
          const response = await api.patch(`/admin/orders/${id}`, {
            status,
            notes,
          });
          return extractData(response);
        }
      } catch (error) {
        console.error("Admin update order status error:", error);
        throw error;
      }
    },

    // -------------------------------------------------------------------------
    // Admin Lead Management
    // -------------------------------------------------------------------------

    /**
     * Get all leads (admin view)
     * @param {Object} params - Query parameters for filtering
     */
    getLeads: async (params = {}) => {
      try {
        if (IS_MOCK_API) {
          const response = await api.get("/leads", { params });
          return response.data;
        } else {
          const response = await api.get("/admin/leads", { params });
          return extractData(response);
        }
      } catch (error) {
        console.error("Admin get leads error:", error);
        throw error;
      }
    },

    /**
     * Get single lead
     * @param {number} id - Lead ID
     */
    getLead: async (id) => {
      try {
        if (IS_MOCK_API) {
          const response = await api.get(`/leads/${id}`);
          return response.data;
        } else {
          const response = await api.get(`/admin/leads/${id}`);
          return extractData(response);
        }
      } catch (error) {
        console.error("Admin get lead error:", error);
        throw error;
      }
    },

    /**
     * Update a lead
     * @param {number} id - Lead ID
     * @param {Object} leadData - Updated lead data
     */
    updateLead: async (id, leadData) => {
      try {
        if (IS_MOCK_API) {
          const response = await api.patch(`/leads/${id}`, {
            ...leadData,
            updatedAt: new Date().toISOString(),
          });
          return response.data;
        } else {
          const response = await api.patch(`/admin/leads/${id}`, leadData);
          return extractData(response);
        }
      } catch (error) {
        console.error("Admin update lead error:", error);
        throw error;
      }
    },

    /**
     * Delete a lead
     * @param {number} id - Lead ID
     */
    deleteLead: async (id) => {
      try {
        if (IS_MOCK_API) {
          const response = await api.delete(`/leads/${id}`);
          return response.data;
        } else {
          const response = await api.delete(`/admin/leads/${id}`);
          return extractData(response);
        }
      } catch (error) {
        console.error("Admin delete lead error:", error);
        throw error;
      }
    },

    // -------------------------------------------------------------------------
    // Admin Category Management
    // -------------------------------------------------------------------------

    /**
     * Get all categories (admin view)
     */
    getCategories: async () => {
      try {
        if (IS_MOCK_API) {
          const response = await api.get("/categories");
          return response.data;
        } else {
          const response = await api.get("/categories");
          return extractData(response);
        }
      } catch (error) {
        console.error("Admin get categories error:", error);
        throw error;
      }
    },

    /**
     * Create a new category
     * @param {Object} categoryData - Category data { name, slug, description, icon, is_active }
     */
    createCategory: async (categoryData) => {
      try {
        if (IS_MOCK_API) {
          const response = await api.post("/categories", categoryData);
          return response.data;
        } else {
          const response = await api.post("/categories", categoryData);
          return extractData(response);
        }
      } catch (error) {
        console.error("Admin create category error:", error);
        throw error;
      }
    },

    /**
     * Update a category
     * @param {string|number} id - Category ID
     * @param {Object} categoryData - Updated category data
     */
    updateCategory: async (id, categoryData) => {
      try {
        if (IS_MOCK_API) {
          const response = await api.put(`/categories/${id}`, categoryData);
          return response.data;
        } else {
          const response = await api.put(`/categories/${id}`, categoryData);
          return extractData(response);
        }
      } catch (error) {
        console.error("Admin update category error:", error);
        throw error;
      }
    },

    /**
     * Delete a category
     * @param {string|number} id - Category ID
     */
    deleteCategory: async (id) => {
      try {
        if (IS_MOCK_API) {
          const response = await api.delete(`/categories/${id}`);
          return response.data;
        } else {
          const response = await api.delete(`/categories/${id}`);
          return extractData(response);
        }
      } catch (error) {
        console.error("Admin delete category error:", error);
        throw error;
      }
    },

    // -------------------------------------------------------------------------
    // Admin Dashboard Statistics
    // -------------------------------------------------------------------------

    /**
     * Get dashboard statistics
     */
    getDashboardStats: async () => {
      try {
        if (IS_MOCK_API) {
          // For mock API, compute stats from data
          const [products, orders, leads] = await Promise.all([
            api.get("/products"),
            api.get("/orders"),
            api.get("/leads"),
          ]);
          return {
            total_products: products.data.length,
            total_orders: orders.data.length,
            total_leads: leads.data.length,
            pending_orders: orders.data.filter((o) => o.status === "pending").length,
            completed_orders: orders.data.filter((o) => o.status === "completed").length,
            total_revenue: orders.data.reduce((sum, o) => sum + (o.total || 0), 0),
          };
        } else {
          const response = await api.get("/admin/dashboard/stats");
          return extractData(response);
        }
      } catch (error) {
        console.error("Admin get dashboard stats error:", error);
        throw error;
      }
    },
  },
};

// Export the API service and helper functions
export { api, extractData, extractMeta, getErrorMessage };
export default apiService;
