import React, { useState } from "react";
import { useNavigate, useLocation, Outlet, Navigate } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Tooltip,
  Badge,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useAdmin } from "../../context/AdminContext";
import { useThemeContext } from "../../context/ThemeContext";

import LOGO from "../../assets/logo.png";

const drawerWidth = 260;

const menuItems = [
  {
    title: "Dashboard",
    icon: "mdi:view-dashboard",
    path: "/admin/dashboard",
  },
  {
    title: "Products",
    icon: "mdi:package-variant",
    path: "/admin/products",
  },
  {
    title: "Orders",
    icon: "mdi:cart-outline",
    path: "/admin/orders",
  },
  {
    title: "Leads",
    icon: "mdi:account-group",
    path: "/admin/leads",
  },
  {
    title: "Sync Products",
    icon: "mdi:cloud-sync",
    path: "/admin/sync",
  },
  {
    title: "Settings",
    icon: "mdi:cog",
    path: "/admin/settings",
  },
];

const AdminLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, isAuthenticated, logout } = useAdmin();
  const { mode, toggleTheme } = useThemeContext();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/admin");
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Logo Section */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={LOGO}
          alt="KELLS GLOBAL"
          style={{
            height: 32,
            width: "auto",
            filter: "drop-shadow(0 2px 8px rgba(102, 126, 234, 0.3))",
          }}
        />
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ flex: 1, px: 1, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  mx: 0.5,
                  bgcolor: isActive
                    ? theme.palette.mode === "dark"
                      ? "rgba(102, 126, 234, 0.2)"
                      : "rgba(102, 126, 234, 0.1)"
                    : "transparent",
                  color: isActive ? "primary.main" : "text.primary",
                  "&:hover": {
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(102, 126, 234, 0.15)"
                        : "rgba(102, 126, 234, 0.08)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? "primary.main" : "text.secondary",
                  }}
                >
                  <Icon icon={item.icon} style={{ fontSize: 22 }} />
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                    fontSize: "0.95rem",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* Back to Store Button */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={() => navigate("/")}
          sx={{
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            "&:hover": {
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Icon icon="mdi:store" style={{ fontSize: 22 }} />
          </ListItemIcon>
          <ListItemText
            primary="Back to Store"
            primaryTypographyProps={{ fontSize: "0.9rem" }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: theme.palette.mode === "dark" ? "#1a1a2e" : "#fff",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" }, color: "text.primary" }}
          >
            <Icon icon="mdi:menu" />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          {/* Theme Toggle */}
          <Tooltip title={mode === "dark" ? "Light Mode" : "Dark Mode"}>
            <IconButton onClick={toggleTheme} sx={{ color: "text.primary" }}>
              <Icon
                icon={
                  mode === "dark" ? "mdi:weather-sunny" : "mdi:weather-night"
                }
              />
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton sx={{ color: "text.primary", ml: 1 }}>
              <Badge badgeContent={3} color="error">
                <Icon icon="mdi:bell-outline" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          <IconButton onClick={handleMenuClick} sx={{ ml: 2 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                fontSize: "0.9rem",
              }}
            >
              {admin?.firstName?.[0] || "A"}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 180,
                borderRadius: 2,
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {admin?.firstName} {admin?.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {admin?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Icon icon="mdi:logout" style={{ fontSize: 20 }} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: theme.palette.mode === "dark" ? "#1a1a2e" : "#fff",
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: theme.palette.mode === "dark" ? "#1a1a2e" : "#fff",
              borderRight: "1px solid",
              borderColor: "divider",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          bgcolor: theme.palette.mode === "dark" ? "#0f0f23" : "#f5f7fa",
        }}
      >
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
