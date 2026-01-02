import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Divider,
  IconButton,
  Tooltip,
  Skeleton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import apiService from "../../services/api";

const AdminOrders = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Dialog state
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchQuery, statusFilter, orders]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await apiService.admin.getOrders();
      // Sort by date descending
      const orders = data || [];
      const sorted = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sorted);
      setFilteredOrders(sorted);
      setLoading(false);
    } catch (error) {
      console.error("Error loading orders:", error);
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.orderNumber?.toLowerCase().includes(query) ||
          order.contactInfo?.email?.toLowerCase().includes(query) ||
          order.contactInfo?.firstName?.toLowerCase().includes(query) ||
          order.contactInfo?.lastName?.toLowerCase().includes(query)
      );
    }

    setFilteredOrders(filtered);
    setPage(0);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsDialogOpen(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  const getPaymentIcon = (method) => {
    switch (method) {
      case "card":
        return "mdi:credit-card";
      case "upi":
        return "simple-icons:googlepay";
      case "wallet":
        return "mdi:wallet";
      default:
        return "mdi:cash";
    }
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="rounded" height={60} sx={{ mb: 3, borderRadius: 2 }} />
        <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Page Header */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Orders
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage and track customer orders
      </Typography>

      {/* Filters */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Search by order number, email, or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon icon="mdi:magnify" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", gap: 2, justifyContent: { xs: "flex-start", md: "flex-end" } }}>
              <Button
                variant="outlined"
                startIcon={<Icon icon="mdi:refresh" />}
                onClick={loadOrders}
                sx={{ borderRadius: 2 }}
              >
                Refresh
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {["all", "pending", "processing", "completed"].map((status) => {
          const count = status === "all" ? orders.length : orders.filter((o) => o.status === status).length;
          const colors = {
            all: "#667eea",
            pending: "#2196f3",
            processing: "#ff9800",
            completed: "#4caf50",
          };
          return (
            <Grid item xs={6} md={3} key={status}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  cursor: "pointer",
                  bgcolor: statusFilter === status ? `${colors[status]}10` : "transparent",
                  "&:hover": { bgcolor: `${colors[status]}08` },
                }}
                onClick={() => setStatusFilter(status)}
              >
                <Typography variant="h4" fontWeight="bold" sx={{ color: colors[status] }}>
                  {count}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textTransform: "capitalize" }}>
                  {status === "all" ? "Total Orders" : status}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Orders Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}>
                <TableCell>Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {filteredOrders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      component={TableRow}
                      hover
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={500} fontFamily="monospace">
                          #{order.orderNumber?.slice(-8) || order.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar sx={{ width: 32, height: 32, fontSize: "0.8rem" }}>
                            {order.contactInfo?.firstName?.[0] || "U"}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {order.contactInfo?.firstName} {order.contactInfo?.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {order.contactInfo?.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${order.items?.length || 0} items`}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {formatCurrency(order.total || 0)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<Icon icon={getPaymentIcon(order.paymentMethod)} style={{ fontSize: 16 }} />}
                          label={order.paymentMethod}
                          size="small"
                          variant="outlined"
                          sx={{ textTransform: "uppercase", fontSize: "0.7rem" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(order.createdAt)}
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
                      <TableCell align="right">
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(order)}
                            sx={{ color: "primary.main" }}
                          >
                            <Icon icon="mdi:eye" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </motion.tr>
                  ))}
              </AnimatePresence>
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Icon icon="mdi:cart-outline" style={{ fontSize: 48, opacity: 0.3 }} />
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                      No orders found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredOrders.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      {/* Order Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Icon icon="mdi:receipt" />
                  Order Details
                </Box>
                <Chip
                  label={selectedOrder.status}
                  color={getStatusColor(selectedOrder.status)}
                  size="small"
                  sx={{ textTransform: "capitalize" }}
                />
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                {/* Order Info */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>
                    Order Information
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">Order Number:</Typography>
                      <Typography variant="body2" fontWeight={500} fontFamily="monospace">
                        {selectedOrder.orderNumber}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">Date:</Typography>
                      <Typography variant="body2">{formatDate(selectedOrder.createdAt)}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">Payment Method:</Typography>
                      <Chip
                        icon={<Icon icon={getPaymentIcon(selectedOrder.paymentMethod)} style={{ fontSize: 14 }} />}
                        label={selectedOrder.paymentMethod}
                        size="small"
                        variant="outlined"
                        sx={{ textTransform: "uppercase", fontSize: "0.7rem" }}
                      />
                    </Box>
                    {selectedOrder.paymentDetails?.last4 && (
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" color="text.secondary">Card:</Typography>
                        <Typography variant="body2">**** {selectedOrder.paymentDetails.last4}</Typography>
                      </Box>
                    )}
                    {selectedOrder.paymentDetails?.upiId && (
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" color="text.secondary">UPI:</Typography>
                        <Typography variant="body2">{selectedOrder.paymentDetails.upiId}</Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>

                {/* Customer Info */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>
                    Customer Information
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">Name:</Typography>
                      <Typography variant="body2">
                        {selectedOrder.contactInfo?.firstName} {selectedOrder.contactInfo?.lastName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">Email:</Typography>
                      <Typography variant="body2">{selectedOrder.contactInfo?.email}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">Phone:</Typography>
                      <Typography variant="body2">{selectedOrder.contactInfo?.phone}</Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Items */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
                    Order Items ({selectedOrder.items?.length || 0})
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Item</TableCell>
                          <TableCell align="right">Price</TableCell>
                          <TableCell align="right">Qty</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOrder.items?.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <Avatar
                                  src={item.image}
                                  variant="rounded"
                                  sx={{ width: 40, height: 40 }}
                                />
                                <Box>
                                  <Typography variant="body2" fontWeight={500}>
                                    {item.name}
                                  </Typography>
                                  {item.offerName && (
                                    <Typography variant="caption" color="text.secondary">
                                      {item.offerName}
                                    </Typography>
                                  )}
                                  {item.requiredInfo && (
                                    <Box sx={{ mt: 0.5 }}>
                                      {Object.entries(item.requiredInfo).map(([key, value]) => (
                                        <Typography key={key} variant="caption" color="text.secondary" display="block">
                                          {key}: {value}
                                        </Typography>
                                      ))}
                                    </Box>
                                  )}
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 500 }}>
                              {formatCurrency(item.price * item.quantity)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                {/* Totals */}
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5, mt: 2 }}>
                    <Box sx={{ display: "flex", gap: 4 }}>
                      <Typography variant="body2" color="text.secondary">Subtotal:</Typography>
                      <Typography variant="body2">{formatCurrency(selectedOrder.subtotal || 0)}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 4 }}>
                      <Typography variant="body2" color="text.secondary">Tax (8%):</Typography>
                      <Typography variant="body2">{formatCurrency(selectedOrder.tax || 0)}</Typography>
                    </Box>
                    <Divider sx={{ width: 200, my: 1 }} />
                    <Box sx={{ display: "flex", gap: 4 }}>
                      <Typography variant="subtitle1" fontWeight="bold">Total:</Typography>
                      <Typography variant="subtitle1" fontWeight="bold" color="primary">
                        {formatCurrency(selectedOrder.total || 0)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AdminOrders;
