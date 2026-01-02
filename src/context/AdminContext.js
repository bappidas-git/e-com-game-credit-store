import React, { createContext, useState, useContext, useEffect } from "react";
import Swal from "sweetalert2";
import { MOOGOLD_API_BASE } from "../services/baseURL";
import apiService from "../services/api";

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing admin session on mount
    const storedAdmin = sessionStorage.getItem("admin");
    const adminToken = sessionStorage.getItem("adminToken");

    if (storedAdmin && adminToken) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch (error) {
        console.error("Error parsing stored admin:", error);
        sessionStorage.removeItem("admin");
        sessionStorage.removeItem("adminToken");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // Use the real Cloudways API for admin login
      const adminData = await apiService.admin.login(credentials);

      if (adminData) {
        // Store in session
        sessionStorage.setItem("admin", JSON.stringify(adminData));
        setAdmin(adminData);

        // Show success notification
        Swal.fire({
          icon: "success",
          title: `Welcome ${adminData.firstName || "Admin"}`,
          text: "You have successfully logged in",
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

        return { success: true, admin: adminData };
      }

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid admin credentials",
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
      });

      return { success: false, error: "Invalid credentials" };
    } catch (error) {
      console.error("Admin login error:", error);

      // Extract error message from API response
      let errorMessage = "An error occurred during login. Please try again.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Login Error",
        text: errorMessage,
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
      });

      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    sessionStorage.removeItem("admin");
    sessionStorage.removeItem("adminToken");
    setAdmin(null);

    Swal.fire({
      icon: "info",
      title: "Logged Out",
      text: "You have been successfully logged out",
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  // Fetch product from MOOGOLD API using admin token
  const fetchMoogoldProduct = async (productId) => {
    try {
      // Get the admin token from session storage
      const adminToken = sessionStorage.getItem("adminToken");

      if (!adminToken) {
        throw new Error("Admin authentication required. Please log in again.");
      }

      const response = await fetch(`${MOOGOLD_API_BASE}/v1/moogold/products/${productId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${adminToken}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication expired. Please log in again.");
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch product from MOOGOLD");
      }

      return await response.json();
    } catch (error) {
      console.error("MOOGOLD product fetch error:", error);
      throw error;
    }
  };

  // Save product to database (works with both JSON Server and Cloudways API)
  const saveProductToDatabase = async (productData, existingProductId = null) => {
    try {
      if (existingProductId) {
        // Update existing product
        return await apiService.admin.updateProduct(existingProductId, productData);
      } else {
        // Create new product
        return await apiService.admin.createProduct(productData);
      }
    } catch (error) {
      console.error("Save product error:", error);
      throw error;
    }
  };

  // Get all products from database
  const getProductsFromDatabase = async () => {
    try {
      return await apiService.admin.getProducts();
    } catch (error) {
      console.error("Get products error:", error);
      throw error;
    }
  };

  // Check if product exists by MOOGOLD ID
  const checkProductExists = async (moogoldId) => {
    try {
      const products = await apiService.admin.getProducts();
      return products.find((p) => p.moogoldId === moogoldId || p.id === moogoldId);
    } catch (error) {
      console.error("Check product error:", error);
      return null;
    }
  };

  const value = {
    admin,
    isLoading,
    isAuthenticated: !!admin,
    login,
    logout,
    fetchMoogoldProduct,
    saveProductToDatabase,
    getProductsFromDatabase,
    checkProductExists,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
