import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Skeleton,
  useTheme,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import apiService from "../../services/api";

const StatCard = ({ title, value, icon, color, trend, trendValue }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          height: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Decoration */}
        <Box
          sx={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: `${color}15`,
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
            {trend && (
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Icon
                  icon={trend === "up" ? "mdi:trending-up" : "mdi:trending-down"}
                  style={{
                    fontSize: 18,
                    color: trend === "up" ? "#4caf50" : "#f44336",
                    marginRight: 4,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ color: trend === "up" ? "#4caf50" : "#f44336" }}
                >
                  {trendValue}
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar
            sx={{
              width: 50,
              height: 50,
              bgcolor: `${color}20`,
              color: color,
            }}
          >
            <Icon icon={icon} style={{ fontSize: 28 }} />
          </Avatar>
        </Box>
      </Paper>
    </motion.div>
  );
};

const AdminDashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch products
      const products = await apiService.products.getAll();

      // Fetch orders (get all orders for admin)
      const ordersResponse = await fetch("http://localhost:3001/orders");
      const orders = await ordersResponse.json();

      // Fetch users
      const usersResponse = await fetch("http://localhost:3001/users");
      const users = await usersResponse.json();

      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: totalRevenue.toFixed(2),
        totalUsers: users.length,
      });

      // Recent orders (last 5)
      setRecentOrders(orders.slice(-5).reverse());

      // Top products (by featured status)
      setTopProducts(products.filter((p) => p.featured).slice(0, 5));

      setLoading(false);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "processing":
        return "warning";
      case "pending":
        return "info";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} lg={3} key={i}>
              <Skeleton variant="rounded" height={140} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} lg={8}>
            <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      {/* Page Title */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Welcome back! Here's what's happening with your store.
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon="mdi:package-variant"
            color="#667eea"
            trend="up"
            trendValue="+12% from last month"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon="mdi:cart-outline"
            color="#4caf50"
            trend="up"
            trendValue="+8% from last month"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon="mdi:currency-inr"
            color="#ff9800"
            trend="up"
            trendValue="+23% from last month"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon="mdi:account-group"
            color="#e91e63"
            trend="up"
            trendValue="+5% from last month"
          />
        </Grid>
      </Grid>

      {/* Tables Section */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Recent Orders */}
        <Grid item xs={12} lg={8}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 2.5,
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Recent Orders
              </Typography>
              <Chip
                label={`${recentOrders.length} orders`}
                size="small"
                sx={{ bgcolor: "primary.main", color: "#fff" }}
              />
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          #{order.orderNumber?.slice(-8) || order.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, fontSize: "0.8rem" }}>
                            {order.contactInfo?.firstName?.[0] || "U"}
                          </Avatar>
                          <Box>
                            <Typography variant="body2">
                              {order.contactInfo?.firstName} {order.contactInfo?.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {order.contactInfo?.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{order.items?.length || 0} items</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {formatCurrency(order.total || 0)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.status || "pending"}
                          size="small"
                          color={getStatusColor(order.status)}
                          sx={{ textTransform: "capitalize" }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {recentOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">No orders yet</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Top Products */}
        <Grid item xs={12} lg={4}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 2.5,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Featured Products
              </Typography>
            </Box>

            <Box sx={{ p: 2 }}>
              {topProducts.map((product, index) => (
                <Box
                  key={product.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    py: 1.5,
                    borderBottom: index < topProducts.length - 1 ? "1px solid" : "none",
                    borderColor: "divider",
                  }}
                >
                  <Avatar
                    src={product.image}
                    variant="rounded"
                    sx={{ width: 48, height: 48 }}
                  >
                    <Icon icon="mdi:package-variant" />
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {product.region}
                    </Typography>
                  </Box>
                  <Chip
                    label={product.offers?.length || 0}
                    size="small"
                    sx={{
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(102, 126, 234, 0.2)"
                          : "rgba(102, 126, 234, 0.1)",
                      color: "primary.main",
                      fontWeight: 600,
                    }}
                  />
                </Box>
              ))}
              {topProducts.length === 0 && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography color="text.secondary">No products yet</Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
