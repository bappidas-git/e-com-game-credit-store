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
  IconButton,
  Button,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  Tooltip,
  Skeleton,
  Alert,
  Snackbar,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import apiService from "../../services/api";

const AdminProducts = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Categories
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await apiService.categories.getAll();
      const categoryList = Array.isArray(data) ? data : [];
      setCategories(categoryList);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  useEffect(() => {
    filterProducts();
  }, [searchQuery, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await apiService.admin.getProducts();
      setProducts(data || []);
      setFilteredProducts(data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error loading products:", error);
      setLoading(false);
      setSnackbar({
        open: true,
        message: "Failed to load products",
        severity: "error",
      });
    }
  };

  const filterProducts = () => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(
      (product) =>
        product.name?.toLowerCase().includes(query) ||
        product.id?.toLowerCase().includes(query) ||
        product.region?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
    setPage(0);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setEditForm({
      name: product.name || "",
      slug: product.slug || "",
      shortDescription: product.shortDescription || "",
      description: product.description || "",
      category: product.category || (categories.length > 0 ? categories[0].slug : ""),
      platform: product.platform || "Mobile",
      region: product.region || "Global",
      image: product.image || "",
      rating: product.rating || 4.5,
      totalReviews: product.totalReviews || 0,
      featured: product.featured || false,
      trending: product.trending || false,
      hot: product.hot || false,
      instantDelivery: product.instantDelivery || true,
      deliveryTime: product.deliveryTime || "Instant - 5 Minutes",
      developer: product.developer || "",
      currency: product.currency || "Diamonds",
      tags: product.tags?.join(", ") || "",
      requiredInfo: product.requiredInfo?.join(", ") || "",
      howToTopUp: product.howToTopUp?.join("\n") || "",
      howToFindPlayerId: product.howToFindPlayerId?.join("\n") || "",
      pricingConfig: product.pricingConfig || {
        marginType: "percentage",
        marginValue: 12,
        baseCurrency: "INR",
      },
    });
    setEditDialogOpen(true);
  };

  const handleEditFormChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePricingConfigChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      pricingConfig: {
        ...prev.pricingConfig,
        [field]: value,
      },
    }));
  };

  const handleSaveProduct = async () => {
    try {
      setSaving(true);

      const updatedProduct = {
        ...selectedProduct,
        name: editForm.name,
        slug: editForm.slug,
        shortDescription: editForm.shortDescription,
        description: editForm.description,
        category: editForm.category,
        platform: editForm.platform,
        region: editForm.region,
        image: editForm.image,
        rating: parseFloat(editForm.rating) || 4.5,
        totalReviews: parseInt(editForm.totalReviews) || 0,
        featured: editForm.featured,
        trending: editForm.trending,
        hot: editForm.hot,
        instantDelivery: editForm.instantDelivery,
        deliveryTime: editForm.deliveryTime,
        developer: editForm.developer,
        currency: editForm.currency,
        tags: editForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
        requiredInfo: editForm.requiredInfo.split(",").map((t) => t.trim()).filter(Boolean),
        howToTopUp: editForm.howToTopUp.split("\n").map((t) => t.trim()).filter(Boolean),
        howToFindPlayerId: editForm.howToFindPlayerId.split("\n").map((t) => t.trim()).filter(Boolean),
        pricingConfig: editForm.pricingConfig,
      };

      // Recalculate offer prices based on new margin
      if (updatedProduct.offers) {
        updatedProduct.offers = updatedProduct.offers.map((offer) => {
          const margin = editForm.pricingConfig.marginValue;
          const basePrice = offer.basePrice;
          const sellingPrice = basePrice * (1 + margin / 100);
          return {
            ...offer,
            margin: margin,
            sellingPrice: Math.round(sellingPrice * 100) / 100,
          };
        });
      }

      await apiService.admin.updateProduct(selectedProduct.id, updatedProduct);
      setSnackbar({
        open: true,
        message: "Product updated successfully!",
        severity: "success",
      });
      setEditDialogOpen(false);
      loadProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      setSnackbar({
        open: true,
        message: "Failed to update product",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (product) => {
    const result = await Swal.fire({
      title: "Delete Product?",
      text: `Are you sure you want to delete "${product.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await apiService.admin.deleteProduct(product.id);
        setSnackbar({
          open: true,
          message: "Product deleted successfully!",
          severity: "success",
        });
        loadProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        setSnackbar({
          open: true,
          message: "Failed to delete product",
          severity: "error",
        });
      }
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

  const getLowestPrice = (product) => {
    if (!product.offers || product.offers.length === 0) return 0;
    return Math.min(...product.offers.map((o) => o.sellingPrice || 0));
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Products
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your game credit products
          </Typography>
        </Box>
      </Box>

      {/* Search and Filters */}
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
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search products by name, ID, region..."
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
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", gap: 2, justifyContent: { xs: "flex-start", md: "flex-end" } }}>
              <Button
                variant="outlined"
                startIcon={<Icon icon="mdi:refresh" />}
                onClick={loadProducts}
                sx={{ borderRadius: 2 }}
              >
                Refresh
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Products Table */}
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
                <TableCell>Product</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Region</TableCell>
                <TableCell>Offers</TableCell>
                <TableCell>Starting Price</TableCell>
                <TableCell>Margin</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {filteredProducts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((product) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      component={TableRow}
                      hover
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar
                            src={product.image}
                            variant="rounded"
                            sx={{ width: 48, height: 48 }}
                          >
                            <Icon icon="mdi:package-variant" />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {product.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {product.category}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {product.moogoldId || product.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={product.region} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${product.offers?.length || 0} offers`}
                          size="small"
                          sx={{
                            bgcolor: theme.palette.mode === "dark" ? "rgba(102, 126, 234, 0.2)" : "rgba(102, 126, 234, 0.1)",
                            color: "primary.main",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {formatCurrency(getLowestPrice(product))}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            product.pricingConfig?.marginType === "fixed"
                              ? formatCurrency(product.pricingConfig?.marginValue || 0)
                              : `${product.pricingConfig?.marginValue || 0}%`
                          }
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                          {product.featured && (
                            <Chip label="Featured" size="small" color="primary" sx={{ fontSize: "0.7rem" }} />
                          )}
                          {product.trending && (
                            <Chip label="Trending" size="small" color="secondary" sx={{ fontSize: "0.7rem" }} />
                          )}
                          {product.hot && (
                            <Chip label="Hot" size="small" color="error" sx={{ fontSize: "0.7rem" }} />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit Product">
                          <IconButton
                            size="small"
                            onClick={() => handleEditClick(product)}
                            sx={{ color: "primary.main" }}
                          >
                            <Icon icon="mdi:pencil" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Product">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteProduct(product)}
                            sx={{ color: "error.main" }}
                          >
                            <Icon icon="mdi:delete" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </motion.tr>
                  ))}
              </AnimatePresence>
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Icon icon="mdi:package-variant-closed" style={{ fontSize: 48, opacity: 0.3 }} />
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                      No products found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredProducts.length}
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

      {/* Edit Product Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Icon icon="mdi:pencil" />
            Edit Product
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            {/* Basic Info */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>
                Basic Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Product Name"
                value={editForm.name}
                onChange={(e) => handleEditFormChange("name", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Slug"
                value={editForm.slug}
                onChange={(e) => handleEditFormChange("slug", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Short Description"
                value={editForm.shortDescription}
                onChange={(e) => handleEditFormChange("shortDescription", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={editForm.description}
                onChange={(e) => handleEditFormChange("description", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                value={editForm.image}
                onChange={(e) => handleEditFormChange("image", e.target.value)}
              />
            </Grid>

            {/* Category & Platform */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
                Category & Platform
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={editForm.category}
                  label="Category"
                  onChange={(e) => handleEditFormChange("category", e.target.value)}
                >
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.slug}>
                        {cat.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      No categories available
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Platform</InputLabel>
                <Select
                  value={editForm.platform}
                  label="Platform"
                  onChange={(e) => handleEditFormChange("platform", e.target.value)}
                >
                  <MenuItem value="Mobile">Mobile</MenuItem>
                  <MenuItem value="PC">PC</MenuItem>
                  <MenuItem value="Console">Console</MenuItem>
                  <MenuItem value="All">All</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Region"
                value={editForm.region}
                onChange={(e) => handleEditFormChange("region", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Developer"
                value={editForm.developer}
                onChange={(e) => handleEditFormChange("developer", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Currency Name (e.g., Diamonds, UC)"
                value={editForm.currency}
                onChange={(e) => handleEditFormChange("currency", e.target.value)}
              />
            </Grid>

            {/* Pricing Config */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
                Pricing Configuration
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Margin Type</InputLabel>
                <Select
                  value={editForm.pricingConfig?.marginType || "percentage"}
                  label="Margin Type"
                  onChange={(e) => handlePricingConfigChange("marginType", e.target.value)}
                >
                  <MenuItem value="percentage">Percentage</MenuItem>
                  <MenuItem value="fixed">Fixed Amount</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Margin Value"
                type="number"
                value={editForm.pricingConfig?.marginValue || 0}
                onChange={(e) => handlePricingConfigChange("marginValue", parseFloat(e.target.value) || 0)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {editForm.pricingConfig?.marginType === "percentage" ? "%" : "INR"}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Base Currency</InputLabel>
                <Select
                  value={editForm.pricingConfig?.baseCurrency || "INR"}
                  label="Base Currency"
                  onChange={(e) => handlePricingConfigChange("baseCurrency", e.target.value)}
                >
                  <MenuItem value="INR">INR</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Status Flags */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
                Status & Visibility
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editForm.featured}
                    onChange={(e) => handleEditFormChange("featured", e.target.checked)}
                    color="primary"
                  />
                }
                label="Featured"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editForm.trending}
                    onChange={(e) => handleEditFormChange("trending", e.target.checked)}
                    color="secondary"
                  />
                }
                label="Trending"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editForm.hot}
                    onChange={(e) => handleEditFormChange("hot", e.target.checked)}
                    color="error"
                  />
                }
                label="Hot"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editForm.instantDelivery}
                    onChange={(e) => handleEditFormChange("instantDelivery", e.target.checked)}
                    color="success"
                  />
                }
                label="Instant Delivery"
              />
            </Grid>

            {/* Additional Info */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
                Additional Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Rating"
                type="number"
                inputProps={{ min: 0, max: 5, step: 0.1 }}
                value={editForm.rating}
                onChange={(e) => handleEditFormChange("rating", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Total Reviews"
                type="number"
                value={editForm.totalReviews}
                onChange={(e) => handleEditFormChange("totalReviews", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Delivery Time"
                value={editForm.deliveryTime}
                onChange={(e) => handleEditFormChange("deliveryTime", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags (comma separated)"
                value={editForm.tags}
                onChange={(e) => handleEditFormChange("tags", e.target.value)}
                helperText="e.g., MOBA, Multiplayer, Diamonds"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Required Info (comma separated)"
                value={editForm.requiredInfo}
                onChange={(e) => handleEditFormChange("requiredInfo", e.target.value)}
                helperText="e.g., User ID, Zone ID"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="How to Top Up (one step per line)"
                multiline
                rows={3}
                value={editForm.howToTopUp}
                onChange={(e) => handleEditFormChange("howToTopUp", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="How to Find Player ID (one step per line)"
                multiline
                rows={3}
                value={editForm.howToFindPlayerId}
                onChange={(e) => handleEditFormChange("howToFindPlayerId", e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditDialogOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveProduct}
            disabled={saving}
            startIcon={saving ? null : <Icon icon="mdi:content-save" />}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminProducts;
