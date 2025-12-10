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

// Components
import Header from "./components/Header/Header";
import BottomNav from "./components/BottomNav/BottomNav";
import Footer from "./components/Footer/Footer";

// Pages
import Home from "./pages/Home/Home";
// import About from "./pages/About/About";
// import Products from "./pages/Products/Products";
// import TopUp from "./pages/TopUp/TopUp";
// import GiftCards from "./pages/GiftCards/GiftCards";
// import Profile from "./pages/Profile/Profile";
// import OrderHistory from "./pages/OrderHistory/OrderHistory";
// import WishList from "./pages/WishList/WishList";
// import Support from "./pages/Support/Support";

// Styles
import "./App.css";

function App() {
  return (
    <ThemeContextProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <CssBaseline />
            <div className="App">
              <Header />
              <main className="main-content">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    {/* <Route path="/about" element={<About />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/top-up" element={<TopUp />} />
                    <Route path="/gift-cards" element={<GiftCards />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/orders" element={<OrderHistory />} />
                    <Route path="/wishlist" element={<WishList />} />
                    <Route path="/support" element={<Support />} /> */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </AnimatePresence>
              </main>
              {<Footer />}
              <BottomNav />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeContextProvider>
  );
}

export default App;
