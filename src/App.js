import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AnimatePresence } from "framer-motion";

// Context Providers
import { ThemeContextProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import { AdminProvider } from "./context/AdminContext";

// Components
import Header from "./components/Header/Header";
import BottomNav from "./components/BottomNav/BottomNav";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import AdminLayout from "./components/AdminLayout/AdminLayout";

// Pages
import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Checkout from "./pages/Checkout/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation/OrderConfirmation";
import OrderHistory from "./pages/OrderHistory/OrderHistory";
import HelpCenter from "./pages/HelpCenter/HelpCenter";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy/CookiePolicy";
import RefundPolicy from "./pages/RefundPolicy/RefundPolicy";
import Support from "./pages/Support/Support";
import AboutUs from "./pages/AboutUs/AboutUs";
import SpecialOffers from "./pages/SpecialOffers/SpecialOffers";

// Admin Pages
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminLeads from "./pages/Admin/AdminLeads";
import AdminSync from "./pages/Admin/AdminSync";

// Styles
import "./App.css";

function App() {
  return (
    <ThemeContextProvider>
      <AuthProvider>
        <AdminProvider>
          <CartProvider>
            <OrderProvider>
              <Router>
                <ScrollToTop />
                <CssBaseline />
                <Routes>
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route path="/admin/*" element={<AdminLayout />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="leads" element={<AdminLeads />} />
                    <Route path="sync" element={<AdminSync />} />
                  </Route>

                  {/* Public Routes */}
                  <Route
                    path="/*"
                    element={
                      <div className="App">
                        <Header />
                        <main className="main-content">
                          <AnimatePresence mode="wait">
                            <Routes>
                              <Route path="/" element={<Home />} />
                              <Route path="/products" element={<Products />} />
                              <Route path="/products/:id" element={<ProductDetails />} />
                              <Route path="/checkout" element={<Checkout />} />
                              <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
                              <Route path="/orders" element={<OrderHistory />} />
                              <Route path="/help" element={<HelpCenter />} />
                              <Route path="/privacy" element={<PrivacyPolicy />} />
                              <Route path="/terms" element={<TermsOfService />} />
                              <Route path="/cookies" element={<CookiePolicy />} />
                              <Route path="/refund" element={<RefundPolicy />} />
                              <Route path="/support" element={<Support />} />
                              <Route path="/about" element={<AboutUs />} />
                              <Route path="/special-offers" element={<SpecialOffers />} />
                              <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                          </AnimatePresence>
                        </main>
                        <Footer />
                        <BottomNav />
                      </div>
                    }
                  />
                </Routes>
              </Router>
            </OrderProvider>
          </CartProvider>
        </AdminProvider>
      </AuthProvider>
    </ThemeContextProvider>
  );
}

export default App;
