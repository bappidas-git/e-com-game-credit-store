import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import {
  Close,
  Home,
  Info,
  ShoppingBag,
  CardGiftcard,
  CreditCard,
  SportsEsports,
  Support,
  LocalOffer,
  TrendingUp,
  PhoneAndroid,
} from "@mui/icons-material";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import useSound from "../../hooks/useSound";
import styles from "./SidebarMenu.module.css";

import LOGO from "../../assets/logo.png";
import DARK_SIDEBAR_BG from "../../assets/dark-sidebar-bg.jpg";
import LIGHT_SIDEBAR_BG from "../../assets/light-sidebar-bg.jpg";
import CLICK_SOUND from "../../assets/click-sound-1.wav";

const menuItems = [
  { title: "Home", path: "/", icon: <Home /> },
  { title: "About Us", path: "/about", icon: <Info /> },
  { title: "All Products", path: "/products", icon: <ShoppingBag /> },
  {
    title: "Game Top-Up",
    path: "/top-up",
    icon: <Icon icon="mdi:gamepad-variant" width={24} />,
  },
  { title: "Gift Cards", path: "/gift-cards", icon: <CardGiftcard /> },
  {
    title: "Mobile Games",
    path: "/products?category=mobile-game",
    icon: <PhoneAndroid />,
  },
  {
    title: "PC Games",
    path: "/products?category=pc-game",
    icon: <Icon icon="mdi:desktop-classic" width={24} />,
  },
  {
    title: "Trending",
    path: "/products?filter=trending",
    icon: <TrendingUp />,
  },
  {
    title: "Special Offers",
    path: "/products?filter=discount",
    icon: <LocalOffer />,
  },
  { title: "Support", path: "/support", icon: <Support /> },
];

const SidebarMenu = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { play } = useSound(CLICK_SOUND, 0.3);

  const handleNavigate = (path) => {
    play();
    navigate(path);
    onClose();
  };

  const backgroundImage = isDarkMode ? DARK_SIDEBAR_BG : LIGHT_SIDEBAR_BG;

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      className={styles.drawer}
      PaperProps={{
        className: styles.drawerPaper,
      }}
    >
      <Box
        className={styles.container}
        data-theme={isDarkMode ? "dark" : "light"}
      >
        {/* Background Image */}
        <Box
          className={styles.backgroundImage}
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        />

        {/* Overlay */}
        <Box className={styles.overlay} />

        {/* Content */}
        <Box className={styles.content}>
          {/* Header */}
          <Box className={styles.header}>
            <Box className={styles.logoSection}>
              <img src={LOGO} alt="GameHub" className={styles.logo} />
              <Typography variant="h5" className={styles.title}>
                GameHub
              </Typography>
            </Box>
            <IconButton onClick={onClose} className={styles.closeButton}>
              <Close />
            </IconButton>
          </Box>

          <Divider className={styles.divider} />

          {/* Menu Items */}
          <List className={styles.menuList}>
            <AnimatePresence>
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ListItem disablePadding className={styles.menuItem}>
                    <ListItemButton
                      onClick={() => handleNavigate(item.path)}
                      className={styles.menuButton}
                    >
                      <ListItemIcon className={styles.menuIcon}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.title}
                        className={styles.menuText}
                      />
                      <Box className={styles.menuIndicator} />
                    </ListItemButton>
                  </ListItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </List>

          {/* Footer */}
          <Box className={styles.footer}>
            <Typography className={styles.footerText}>
              © 2024 GameHub
            </Typography>
            <Typography className={styles.footerSubtext}>
              Your Gaming Marketplace
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SidebarMenu;
