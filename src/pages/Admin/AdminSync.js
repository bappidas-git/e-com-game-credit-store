import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useAdmin } from "../../context/AdminContext";
import Swal from "sweetalert2";

const AdminSync = () => {
  const { fetchMoogoldProduct } = useAdmin();

  const [productId, setProductId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [existingProducts, setExistingProducts] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Product metadata form
  const [metadata, setMetadata] = useState({
    slug: "",
    shortDescription: "",
    description: "",
    category: "mobile-game",
    platform: "Mobile",
    region: "Global",
    rating: 4.5,
    totalReviews: 0,
    featured: false,
    trending: false,
    hot: false,
    instantDelivery: true,
    deliveryTime: "Instant - 5 Minutes",
    developer: "",
    currency: "Diamonds",
    tags: "",
    requiredInfo: "User ID, Zone ID",
    howToTopUp: "",
    howToFindPlayerId: "",
    marginType: "percentage",
    marginValue: 12,
    baseCurrency: "INR",
  });

  // Add to DB dialog
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
    loadExistingProducts();
  }, []);

  const loadExistingProducts = async () => {
    try {
      const response = await fetch("http://localhost:3001/products");
      const data = await response.json();
      setExistingProducts(data);
    } catch (error) {
      console.error("Error loading existing products:", error);
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleFetchProduct = async () => {
    if (!productId.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter a product ID",
        severity: "warning",
      });
      return;
    }

    setLoading(true);
    setFetchedProduct(null);

    try {
      const product = await fetchMoogoldProduct(productId.trim());

      if (product) {
        setFetchedProduct(product);
        // Auto-fill some metadata
        setMetadata((prev) => ({
          ...prev,
          slug: generateSlug(product.name),
          shortDescription: `Top Up for ${product.name}`,
        }));
        setSnackbar({
          open: true,
          message: "Product fetched successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch product. Please check the Product ID.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMetadataChange = (field, value) => {
    setMetadata((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOpenAddDialog = () => {
    if (!fetchedProduct) {
      setSnackbar({
        open: true,
        message: "Please fetch a product first",
        severity: "warning",
      });
      return;
    }
    setAddDialogOpen(true);
  };

  const calculateOfferPrices = (offers, marginValue) => {
    return offers.map((offer) => {
      const basePrice = parseFloat(offer.price);
      const sellingPrice = basePrice * (1 + marginValue / 100);
      const originalPrice = sellingPrice * 1.1; // 10% higher for display
      const discount = Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);

      // Extract offer name without product name prefix
      let offerName = offer.name;
      const hashIndex = offerName.indexOf("(#");
      if (hashIndex > 0) {
        offerName = offerName.substring(0, hashIndex).trim();
        // Remove product name prefix
        const dashIndex = offerName.indexOf(" - ");
        if (dashIndex > 0) {
          offerName = offerName.substring(dashIndex + 3).trim();
        }
      }

      return {
        id: offer.id,
        offerId: offer.id,
        name: offerName,
        basePrice: basePrice,
        margin: marginValue,
        sellingPrice: Math.round(sellingPrice * 100) / 100,
        originalPrice: Math.round(originalPrice * 100) / 100,
        discount: discount,
        popular: false,
        currency: "INR",
      };
    });
  };

  const handleAddToDatabase = async () => {
    try {
      // Check if product already exists
      const existingProduct = existingProducts.find((p) => p.moogoldId === fetchedProduct.id);
      if (existingProduct) {
        const result = await Swal.fire({
          title: "Product Already Exists",
          text: "Do you want to update the existing product?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes, Update",
          cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) {
          return;
        }
      }

      // Build the complete product object
      const processedOffers = calculateOfferPrices(fetchedProduct.offers || [], metadata.marginValue);

      const completeProduct = {
        id: fetchedProduct.id,
        moogoldId: fetchedProduct.id,
        name: fetchedProduct.name,
        slug: metadata.slug,
        shortDescription: metadata.shortDescription,
        description: metadata.description,
        category: metadata.category,
        platform: metadata.platform,
        region: metadata.region,
        image: fetchedProduct.image_url,
        rating: parseFloat(metadata.rating) || 4.5,
        totalReviews: parseInt(metadata.totalReviews) || 0,
        featured: metadata.featured,
        trending: metadata.trending,
        hot: metadata.hot,
        instantDelivery: metadata.instantDelivery,
        deliveryTime: metadata.deliveryTime,
        requiredInfo: metadata.requiredInfo.split(",").map((t) => t.trim()).filter(Boolean),
        howToTopUp: metadata.howToTopUp.split("\n").map((t) => t.trim()).filter(Boolean),
        howToFindPlayerId: metadata.howToFindPlayerId.split("\n").map((t) => t.trim()).filter(Boolean),
        tags: metadata.tags.split(",").map((t) => t.trim()).filter(Boolean),
        developer: metadata.developer,
        currency: metadata.currency,
        pricingConfig: {
          marginType: metadata.marginType,
          marginValue: parseFloat(metadata.marginValue) || 12,
          baseCurrency: metadata.baseCurrency,
        },
        offers: processedOffers,
      };

      let response;
      if (existingProduct) {
        // Update existing product
        response = await fetch(`http://localhost:3001/products/${existingProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(completeProduct),
        });
      } else {
        // Create new product
        response = await fetch("http://localhost:3001/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(completeProduct),
        });
      }

      if (response.ok) {
        setSnackbar({
          open: true,
          message: existingProduct ? "Product updated successfully!" : "Product added successfully!",
          severity: "success",
        });
        setAddDialogOpen(false);
        setFetchedProduct(null);
        setProductId("");
        loadExistingProducts();

        // Reset metadata
        setMetadata({
          slug: "",
          shortDescription: "",
          description: "",
          category: "mobile-game",
          platform: "Mobile",
          region: "Global",
          rating: 4.5,
          totalReviews: 0,
          featured: false,
          trending: false,
          hot: false,
          instantDelivery: true,
          deliveryTime: "Instant - 5 Minutes",
          developer: "",
          currency: "Diamonds",
          tags: "",
          requiredInfo: "User ID, Zone ID",
          howToTopUp: "",
          howToFindPlayerId: "",
          marginType: "percentage",
          marginValue: 12,
          baseCurrency: "INR",
        });
      } else {
        throw new Error("Failed to save product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setSnackbar({
        open: true,
        message: "Failed to add product to database",
        severity: "error",
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Known product IDs for quick access
  const knownProductIds = [
    { id: "23838543", name: "Mobile Legends: Adventure" },
    { id: "5846232", name: "Mobile Legends (Brazil)" },
    { id: "6637539", name: "Mobile Legends (Russia)" },
    { id: "8957883", name: "Mobile Legends (Philippines)" },
    { id: "2362359", name: "Mobile Legends (Indonesia)" },
    { id: "4690648", name: "Mobile Legends (Malaysia)" },
    { id: "15145", name: "Mobile Legends" },
    { id: "5177311", name: "Honor of Kings" },
    { id: "1372021", name: "PUBG: New State" },
    { id: "6963", name: "PUBG Mobile (Global)" },
  ];

  return (
    <Box>
      {/* Page Header */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Sync Products from MOOGOLD
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Fetch products from MOOGOLD API and add them to your store with custom metadata
      </Typography>

      {/* Fetch Product Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Fetch Product
        </Typography>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="MOOGOLD Product ID"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="e.g., 5846232"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon icon="mdi:identifier" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleFetchProduct}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Icon icon="mdi:cloud-download" />}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                height: 56,
              }}
            >
              {loading ? "Fetching..." : "Fetch Product"}
            </Button>
          </Grid>
          <Grid item xs={12} md={5}>
            <FormControl fullWidth>
              <InputLabel>Quick Select</InputLabel>
              <Select
                value=""
                label="Quick Select"
                onChange={(e) => setProductId(e.target.value)}
              >
                {knownProductIds.map((p) => {
                  const exists = existingProducts.some((ep) => ep.moogoldId === p.id);
                  return (
                    <MenuItem key={p.id} value={p.id}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
                        <Typography>{p.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          ({p.id})
                        </Typography>
                        {exists && (
                          <Chip label="Exists" size="small" color="success" sx={{ ml: "auto" }} />
                        )}
                      </Box>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Fetched Product Preview */}
      {fetchedProduct && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Fetched Product
              </Typography>
              <Button
                variant="contained"
                startIcon={<Icon icon="mdi:plus" />}
                onClick={handleOpenAddDialog}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                Add to Store
              </Button>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ borderRadius: 2 }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={fetchedProduct.image_url}
                    alt={fetchedProduct.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      {fetchedProduct.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ID: {fetchedProduct.id}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={8}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Available Offers ({fetchedProduct.offers?.length || 0})
                </Typography>
                <TableContainer sx={{ maxHeight: 300 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Offer ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Base Price</TableCell>
                        <TableCell align="right">Selling Price (12%)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fetchedProduct.offers?.map((offer) => {
                        const sellingPrice = parseFloat(offer.price) * 1.12;
                        return (
                          <TableRow key={offer.id} hover>
                            <TableCell>
                              <Typography variant="caption" fontFamily="monospace">
                                {offer.id}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {offer.name}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              {formatCurrency(parseFloat(offer.price))}
                            </TableCell>
                            <TableCell align="right">
                              <Typography fontWeight={500} color="primary">
                                {formatCurrency(sellingPrice)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      )}

      {/* Existing Products */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Products in Database ({existingProducts.length})
        </Typography>
        <Grid container spacing={2}>
          {existingProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card
                sx={{
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-4px)" },
                }}
              >
                <CardMedia
                  component="img"
                  height="100"
                  image={product.image}
                  alt={product.name}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ p: 1.5 }}>
                  <Typography variant="body2" fontWeight={500} noWrap>
                    {product.name}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.5, mt: 1, flexWrap: "wrap" }}>
                    <Chip label={product.region} size="small" variant="outlined" sx={{ fontSize: "0.65rem" }} />
                    <Chip label={`${product.offers?.length || 0} offers`} size="small" sx={{ fontSize: "0.65rem" }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Add to Database Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Icon icon="mdi:plus-circle" />
            Add Product to Store
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Alert severity="info" sx={{ mb: 3 }}>
            Fill in the additional metadata for this product. The offers and base prices are fetched from MOOGOLD.
          </Alert>

          <Grid container spacing={2}>
            {/* Basic Info */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>
                Basic Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="URL Slug"
                value={metadata.slug}
                onChange={(e) => handleMetadataChange("slug", e.target.value)}
                helperText="URL-friendly name (e.g., mobile-legends-brazil)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Short Description"
                value={metadata.shortDescription}
                onChange={(e) => handleMetadataChange("shortDescription", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Description"
                multiline
                rows={3}
                value={metadata.description}
                onChange={(e) => handleMetadataChange("description", e.target.value)}
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
                  value={metadata.category}
                  label="Category"
                  onChange={(e) => handleMetadataChange("category", e.target.value)}
                >
                  <MenuItem value="mobile-game">Mobile Game</MenuItem>
                  <MenuItem value="pc-game">PC Game</MenuItem>
                  <MenuItem value="gift-card">Gift Card</MenuItem>
                  <MenuItem value="cross-platform">Cross Platform</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Platform</InputLabel>
                <Select
                  value={metadata.platform}
                  label="Platform"
                  onChange={(e) => handleMetadataChange("platform", e.target.value)}
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
                value={metadata.region}
                onChange={(e) => handleMetadataChange("region", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Developer"
                value={metadata.developer}
                onChange={(e) => handleMetadataChange("developer", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Currency Name"
                value={metadata.currency}
                onChange={(e) => handleMetadataChange("currency", e.target.value)}
                helperText="e.g., Diamonds, UC, Tokens"
              />
            </Grid>

            {/* Pricing */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
                Pricing
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Margin Type</InputLabel>
                <Select
                  value={metadata.marginType}
                  label="Margin Type"
                  onChange={(e) => handleMetadataChange("marginType", e.target.value)}
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
                value={metadata.marginValue}
                onChange={(e) => handleMetadataChange("marginValue", e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {metadata.marginType === "percentage" ? "%" : "INR"}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Delivery Time"
                value={metadata.deliveryTime}
                onChange={(e) => handleMetadataChange("deliveryTime", e.target.value)}
              />
            </Grid>

            {/* Status */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
                Status & Visibility
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={metadata.featured}
                    onChange={(e) => handleMetadataChange("featured", e.target.checked)}
                    color="primary"
                  />
                }
                label="Featured"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={metadata.trending}
                    onChange={(e) => handleMetadataChange("trending", e.target.checked)}
                    color="secondary"
                  />
                }
                label="Trending"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={metadata.hot}
                    onChange={(e) => handleMetadataChange("hot", e.target.checked)}
                    color="error"
                  />
                }
                label="Hot"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={metadata.instantDelivery}
                    onChange={(e) => handleMetadataChange("instantDelivery", e.target.checked)}
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tags (comma separated)"
                value={metadata.tags}
                onChange={(e) => handleMetadataChange("tags", e.target.value)}
                helperText="e.g., MOBA, Multiplayer, Diamonds"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Required Info (comma separated)"
                value={metadata.requiredInfo}
                onChange={(e) => handleMetadataChange("requiredInfo", e.target.value)}
                helperText="e.g., User ID, Zone ID"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="How to Top Up (one step per line)"
                multiline
                rows={3}
                value={metadata.howToTopUp}
                onChange={(e) => handleMetadataChange("howToTopUp", e.target.value)}
                placeholder="Select the package you want
Enter your User ID and Zone ID
Complete the payment
Receive credits instantly"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="How to Find Player ID (one step per line)"
                multiline
                rows={3}
                value={metadata.howToFindPlayerId}
                onChange={(e) => handleMetadataChange("howToFindPlayerId", e.target.value)}
                placeholder="Open the game
Tap on your profile
Your ID will be displayed"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Rating"
                type="number"
                inputProps={{ min: 0, max: 5, step: 0.1 }}
                value={metadata.rating}
                onChange={(e) => handleMetadataChange("rating", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Total Reviews"
                type="number"
                value={metadata.totalReviews}
                onChange={(e) => handleMetadataChange("totalReviews", e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddToDatabase}
            startIcon={<Icon icon="mdi:database-plus" />}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            Add to Database
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

export default AdminSync;
