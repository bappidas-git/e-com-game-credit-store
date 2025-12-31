import React from "react";
import { useNavigate } from "react-router-dom";
import {
  SwipeableDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Close,
  CreditCard,
  CardGiftcard,
  Support,
  LocalOffer,
  TrendingUp,
  Category,
  Star,
  PhoneIphone,
  DesktopMac,
  Receipt,
} from "@mui/icons-material";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import useSound from "../../hooks/useSound";
import styles from "./BottomDrawer.module.css";

import LOGO from "../../assets/logo.png";

const menuSections = [
  {
    title: "Quick Links",
    items: [
      {
        title: "Top Up",
        path: "/top-up",
        icon: <CreditCard />,
        color: "#a855f7",
      },
      {
        title: "Gift Cards",
        path: "/gift-cards",
        icon: <CardGiftcard />,
        color: "#ec4899",
      },
      {
        title: "Order History",
        path: "/orders",
        icon: <Receipt />,
        color: "#3b82f6",
      },
      {
        title: "Special Offers",
        path: "/products?filter=discount",
        icon: <LocalOffer />,
        color: "#10b981",
      },
    ],
  },
  {
    title: "Categories",
    items: [
      {
        title: "Mobile Games",
        path: "/products?category=mobile-game",
        icon: <PhoneIphone />,
        color: "#f59e0b",
      },
      {
        title: "PC Games",
        path: "/products?category=pc-game",
        icon: <DesktopMac />,
        color: "#6366f1",
      },
      {
        title: "Console Games",
        path: "/products?category=console",
        icon: <PhoneIphone />,
        color: "#8b5cf6",
      },
      {
        title: "All Categories",
        path: "/products",
        icon: <Category />,
        color: "#06b6d4",
      },
    ],
  },
  {
    title: "Help & Support",
    items: [
      {
        title: "Customer Support",
        path: "/support",
        icon: <Support />,
        color: "#ef4444",
      },
      { title: "Rate Us", path: "#", icon: <Star />, color: "#facc15" },
    ],
  },
];

const BottomDrawer = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { play } = useSound();

  const handleNavigate = (path) => {
    play();
    if (path === "#") return;
    navigate(path);
    onClose();
  };

  const handleClose = () => {
    play();
    onClose();
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={handleClose}
      onOpen={() => {}}
      className={styles.drawer}
      PaperProps={{
        className: `${styles.drawerPaper} ${
          isDarkMode ? styles.dark : styles.light
        }`,
        style: {
          height: "85vh",
          borderTopLeftRadius: "24px",
          borderTopRightRadius: "24px",
        },
      }}
      disableSwipeToOpen
    >
      <Box className={styles.container}>
        {/* Handle Bar */}
        <Box className={styles.handleBar} />

        {/* Header */}
        <Box className={styles.header}>
          <Typography variant="h6" className={styles.title}>
            Menu
          </Typography>
          <IconButton onClick={handleClose} className={styles.closeButton}>
            <Close />
          </IconButton>
        </Box>

        <Divider className={styles.divider} />

        {/* Menu Sections */}
        <Box className={styles.content}>
          <AnimatePresence>
            {menuSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
                className={styles.section}
              >
                <Typography className={styles.sectionTitle}>
                  {section.title}
                </Typography>

                <List className={styles.menuList}>
                  {section.items.map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: sectionIndex * 0.1 + index * 0.05 }}
                    >
                      <ListItem disablePadding className={styles.menuItem}>
                        <ListItemButton
                          onClick={() => handleNavigate(item.path)}
                          className={styles.menuButton}
                        >
                          <ListItemIcon
                            className={styles.menuIcon}
                            style={{ color: item.color }}
                          >
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={item.title}
                            className={styles.menuText}
                          />
                          <Box
                            className={styles.menuIndicator}
                            style={{ background: item.color }}
                          />
                        </ListItemButton>
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>

        {/* Footer */}
        <Box className={styles.footer}>
          <img src={LOGO} alt="KELLS GLOBAL" className={styles.footerLogo} />
          <Typography className={styles.footerText}>KELLS GLOBAL © 2024</Typography>
        </Box>
      </Box>
    </SwipeableDrawer>
  );
};

export default BottomDrawer;
