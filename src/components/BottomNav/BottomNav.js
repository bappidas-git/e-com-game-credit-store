import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Paper, Box } from "@mui/material";
import {
  Home,
  Info,
  ShoppingBag,
  Menu as MenuIcon,
  LocalOffer,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import BottomDrawer from "../BottomDrawer/BottomDrawer";
import { useTheme } from "../../context/ThemeContext";
import useSound from "../../hooks/useSound";
import styles from "./BottomNav.module.css";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const { play } = useSound();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = [
    { label: "Home", icon: <Home />, path: "/" },
    { label: "Products", icon: <ShoppingBag />, path: "/products" },
    { label: "Offers", icon: <LocalOffer />, path: "/special-offers" },
    { label: "About", icon: <Info />, path: "/about" },
    { label: "Menu", icon: <MenuIcon />, path: null },
  ];

  const getActiveIndex = () => {
    const path = location.pathname;
    if (path === "/") return 0;
    if (path.includes("/products")) return 1;
    if (path.includes("/special-offers")) return 2;
    if (path === "/about") return 3;
    return -1;
  };

  const handleNavClick = (item) => {
    play();

    if (item.path === null) {
      setDrawerOpen(true);
      return;
    }

    navigate(item.path);
  };

  const activeIndex = getActiveIndex();

  return (
    <>
      <Paper
        className={`mobile-only ${styles.bottomNav} ${
          isDarkMode ? styles.dark : styles.light
        }`}
        elevation={0}
      >
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={styles.navContainer}
        >
          {/* Navigation Items */}
          <Box className={styles.navItems}>
            {navItems.map((item, index) => (
              <motion.button
                key={item.label}
                className={`${styles.navItem} ${
                  activeIndex === index ? styles.active : ""
                }`}
                onClick={() => handleNavClick(item)}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  className={styles.iconWrapper}
                  animate={activeIndex === index ? { y: -2 } : { y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.icon}
                </motion.div>
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.span
                      className={styles.label}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </Box>

          {/* Active Indicator */}
          <motion.div
            className={styles.indicator}
            initial={false}
            animate={{
              left: activeIndex >= 0 ? `${(activeIndex * 100) / 5}%` : "0%",
              opacity: activeIndex >= 0 ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </motion.div>
      </Paper>

      <BottomDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};

export default BottomNav;
