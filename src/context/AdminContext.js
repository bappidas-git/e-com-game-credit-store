import React, { createContext, useState, useContext, useEffect } from "react";
import Swal from "sweetalert2";

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

// MOOGOLD API Configuration
const MOOGOLD_API_BASE = "https://phplaravel-780646-5827390.cloudwaysapps.com/api";
const MOOGOLD_CREDENTIALS = {
  email: "dee@dee.com",
  password: "12345678"
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [moogoldToken, setMoogoldToken] = useState(null);

  useEffect(() => {
    // Check for existing admin session on mount
    const storedAdmin = sessionStorage.getItem("admin");
    const adminToken = sessionStorage.getItem("adminToken");
    const storedMoogoldToken = sessionStorage.getItem("moogoldToken");

    if (storedAdmin && adminToken) {
      try {
        setAdmin(JSON.parse(storedAdmin));
        if (storedMoogoldToken) {
          setMoogoldToken(storedMoogoldToken);
        }
      } catch (error) {
        console.error("Error parsing stored admin:", error);
        sessionStorage.removeItem("admin");
        sessionStorage.removeItem("adminToken");
        sessionStorage.removeItem("moogoldToken");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // Admin credentials - hardcoded for demo
      const adminCredentials = [
        {
          id: 1,
          email: "admin@gamehub.com",
          password: "admin123",
          firstName: "Admin",
          lastName: "User",
          role: "admin"
        }
      ];

      const foundAdmin = adminCredentials.find(
        (a) => a.email === credentials.email && a.password === credentials.password
      );

      if (foundAdmin) {
        const adminData = {
          id: foundAdmin.id,
          email: foundAdmin.email,
          firstName: foundAdmin.firstName,
          lastName: foundAdmin.lastName,
          role: foundAdmin.role
        };

        // Store in session
        sessionStorage.setItem("admin", JSON.stringify(adminData));
        sessionStorage.setItem("adminToken", `admin-token-${Date.now()}`);
        setAdmin(adminData);

        // Show success notification
        Swal.fire({
          icon: "success",
          title: `Welcome Admin`,
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

      Swal.fire({
        icon: "error",
        title: "Login Error",
        text: "An error occurred during login. Please try again.",
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
      });

      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    sessionStorage.removeItem("admin");
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("moogoldToken");
    setAdmin(null);
    setMoogoldToken(null);

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

  // Get MOOGOLD API token
  const getMoogoldToken = async () => {
    try {
      const response = await fetch(`${MOOGOLD_API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(MOOGOLD_CREDENTIALS),
      });

      const data = await response.json();

      if (data.token) {
        setMoogoldToken(data.token);
        sessionStorage.setItem("moogoldToken", data.token);
        return data.token;
      }

      throw new Error("Failed to get MOOGOLD token");
    } catch (error) {
      console.error("MOOGOLD login error:", error);
      throw error;
    }
  };

  // Fetch product from MOOGOLD API
  const fetchMoogoldProduct = async (productId) => {
    try {
      let token = moogoldToken;

      if (!token) {
        token = await getMoogoldToken();
      }

      const response = await fetch(`${MOOGOLD_API_BASE}/moogold/products/${productId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // Token might be expired, try to refresh
        if (response.status === 401) {
          token = await getMoogoldToken();
          const retryResponse = await fetch(`${MOOGOLD_API_BASE}/moogold/products/${productId}`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!retryResponse.ok) {
            throw new Error("Failed to fetch product from MOOGOLD");
          }

          return await retryResponse.json();
        }
        throw new Error("Failed to fetch product from MOOGOLD");
      }

      return await response.json();
    } catch (error) {
      console.error("MOOGOLD product fetch error:", error);
      throw error;
    }
  };

  const value = {
    admin,
    isLoading,
    isAuthenticated: !!admin,
    login,
    logout,
    moogoldToken,
    getMoogoldToken,
    fetchMoogoldProduct,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
