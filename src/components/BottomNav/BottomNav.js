import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { Home, Info, ShoppingBag, Menu as MenuIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
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

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === "/") return 0;
    if (path === "/about") return 1;
    if (path.includes("/products")) return 2;
    return 3;
  };

  const handleNavChange = (event, newValue) => {
    play();

    if (newValue === 3) {
      setDrawerOpen(true);
      return;
    }

    const paths = ["/", "/about", "/products"];
    navigate(paths[newValue]);
  };

  return (
    <>
      <Paper className={`mobile-only ${styles.bottomNav} ${isDarkMode ? styles.dark : styles.light}`} elevation={0}>
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={styles.navContainer}
        >
          <BottomNavigation
            value={getActiveTab()}
            onChange={handleNavChange}
            className={styles.navigation}
            showLabels
          >
            <BottomNavigationAction
              label="Home"
              icon={<Home />}
              className={styles.navAction}
            />
            <BottomNavigationAction
              label="About"
              icon={<Info />}
              className={styles.navAction}
            />
            <BottomNavigationAction
              label="Products"
              icon={<ShoppingBag />}
              className={styles.navAction}
            />
            <BottomNavigationAction
              label="Menu"
              icon={<MenuIcon />}
              className={styles.navAction}
            />
          </BottomNavigation>

          <div
            className={styles.indicator}
            style={{ left: `${getActiveTab() * 25}%` }}
          />
        </motion.div>
      </Paper>

      <BottomDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};

export default BottomNav;
