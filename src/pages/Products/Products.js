import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Rating,
  IconButton,
  useMediaQuery,
  Drawer,
  Divider,
} from "@mui/material";
import {
  Search,
  FilterList,
  Sort,
  Close,
  Whatshot,
  TrendingUp,
  Verified,
  LocalOffer,
  ShoppingCart,
  Visibility,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import apiService from "../../services/api";
import { formatCurrency, getProductMinPrice, getProductMaxDiscount } from "../../utils/helpers";
import useSound from "../../hooks/useSound";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import styles from "./Products.module.css";

const Products = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { play } = useSound();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [sortBy, setSortBy] = useState(searchParams.get("filter") || "default");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "mobile-game", label: "Mobile Games" },
    { value: "pc-game", label: "PC Games" },
    { value: "gift-cards", label: "Gift Cards" },
    { value: "subscriptions", label: "Subscriptions" },
  ];

  const platforms = [
    { value: "all", label: "All Platforms" },
    { value: "Mobile", label: "Mobile" },
    { value: "PC", label: "PC" },
    { value: "Console", label: "Console" },
    { value: "Multi-platform", label: "Multi-platform" },
  ];

  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "trending", label: "Trending" },
    { value: "discount", label: "Best Discount" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "name", label: "Name A-Z" },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await apiService.products.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      // Fallback data
      setProducts([
        {
          id: "4690774",
          name: "Mobile Legends (Global)",
          slug: "mobile-legends-global",
          shortDescription: "Diamond Top Up for Mobile Legends Global Server",
          image: "https://cdn.moogold.com/2021/05/c9137e7a2879f90e22df9fc5cd3bf85f.jpg",
          platform: "Mobile",
          region: "Global",
          category: "mobile-game",
          rating: 4.9,
          totalReviews: 12847,
          trending: true,
          hot: true,
          instantDelivery: true,
          offers: [
            { id: "578634", name: "5 Diamonds", sellingPrice: 10.90, originalPrice: 12.0, discount: 9, currency: "INR" },
            { id: "4690773", name: "70 Diamonds", sellingPrice: 130.19, originalPrice: 140.0, discount: 7, popular: true, currency: "INR" }
          ]
        },
        {
          id: "6963",
          name: "PUBG Mobile (Global)",
          slug: "pubg-mobile-global",
          shortDescription: "Unknown Cash (UC) Top Up for PUBG Mobile Global",
          image: "https://cdn.moogold.com/2019/08/pubg.jpg",
          platform: "Mobile",
          region: "Global",
          category: "mobile-game",
          rating: 4.9,
          totalReviews: 18432,
          trending: true,
          hot: true,
          instantDelivery: false,
          offers: [
            { id: "4085924", name: "60 Unknown Cash", sellingPrice: 94.28, originalPrice: 100.0, discount: 6, currency: "INR" },
            { id: "4085925", name: "325 Unknown Cash", sellingPrice: 471.43, originalPrice: 500.0, discount: 6, popular: true, currency: "INR" }
          ]
        },
        {
          id: "5177311",
          name: "Honor of Kings",
          slug: "honor-of-kings",
          shortDescription: "Token Top Up for Honor of Kings",
          image: "https://cdn.moogold.com/2023/09/honor-of-kings.jpg",
          platform: "Mobile",
          region: "Global",
          category: "mobile-game",
          rating: 4.8,
          totalReviews: 3892,
          trending: true,
          hot: true,
          instantDelivery: false,
          offers: [
            { id: "5177683", name: "16 Tokens", sellingPrice: 20.26, originalPrice: 22.0, discount: 8, currency: "INR" },
            { id: "5177684", name: "80 Tokens", sellingPrice: 92.77, originalPrice: 100.0, discount: 7, popular: true, currency: "INR" }
          ]
        },
        {
          id: "5846232",
          name: "Mobile Legends (Brazil)",
          slug: "mobile-legends-brazil",
          shortDescription: "Diamond Top Up for Mobile Legends Brazil Server",
          image: "https://cdn.moogold.com/2021/05/c9137e7a2879f90e22df9fc5cd3bf85f.jpg",
          platform: "Mobile",
          region: "Brazil",
          category: "mobile-game",
          rating: 4.9,
          totalReviews: 3421,
          trending: true,
          hot: true,
          instantDelivery: true,
          offers: [
            { id: "15973174", name: "50 + 5 Diamonds", sellingPrice: 79.92, originalPrice: 90.0, discount: 11, currency: "INR" },
            { id: "5846336", name: "78 + 8 Diamonds", sellingPrice: 110.82, originalPrice: 120.0, discount: 8, currency: "INR" }
          ]
        },
        {
          id: "7001",
          name: "Free Fire Diamonds",
          slug: "free-fire-diamonds",
          shortDescription: "Diamond Top Up for Garena Free Fire",
          image: "https://cdn.moogold.com/2020/01/freefire.jpg",
          platform: "Mobile",
          region: "Global",
          category: "mobile-game",
          rating: 4.7,
          totalReviews: 9234,
          trending: false,
          hot: true,
          instantDelivery: true,
          offers: [
            { id: "7002", name: "100 Diamonds", sellingPrice: 80.00, originalPrice: 90.0, discount: 11, currency: "INR" },
            { id: "7003", name: "310 Diamonds", sellingPrice: 240.00, originalPrice: 270.0, discount: 11, popular: true, currency: "INR" }
          ]
        },
        {
          id: "8001",
          name: "Steam Wallet Code",
          slug: "steam-wallet-code",
          shortDescription: "Steam Wallet Gift Card for PC Gaming",
          image: "https://cdn.moogold.com/2021/03/steam.jpg",
          platform: "PC",
          region: "Global",
          category: "gift-cards",
          rating: 4.8,
          totalReviews: 15678,
          trending: true,
          hot: false,
          instantDelivery: true,
          offers: [
            { id: "8002", name: "$5 USD", sellingPrice: 420.00, originalPrice: 450.0, discount: 7, currency: "INR" },
            { id: "8003", name: "$10 USD", sellingPrice: 835.00, originalPrice: 900.0, discount: 7, popular: true, currency: "INR" }
          ]
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Search filter - improved to search across more fields including category and tags
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.shortDescription?.toLowerCase().includes(query) ||
          product.region?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query) ||
          product.platform?.toLowerCase().includes(query) ||
          product.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((product) => product.category === selectedCategory);
    }

    // Platform filter
    if (selectedPlatform !== "all") {
      result = result.filter((product) => product.platform === selectedPlatform);
    }

    // Sorting
    switch (sortBy) {
      case "trending":
        result = result.filter((product) => product.trending);
        break;
      case "discount":
        result = result.sort(
          (a, b) => (getProductMaxDiscount(b) || 0) - (getProductMaxDiscount(a) || 0)
        );
        break;
      case "price-low":
        result = result.sort(
          (a, b) => (getProductMinPrice(a) || 0) - (getProductMinPrice(b) || 0)
        );
        break;
      case "price-high":
        result = result.sort(
          (a, b) => (getProductMinPrice(b) || 0) - (getProductMinPrice(a) || 0)
        );
        break;
      case "rating":
        result = result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "name":
        result = result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep original order for default
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedPlatform, sortBy]);

  const handleProductClick = (productId) => {
    play();
    navigate(`/products/${productId}`);
  };

  const handleFilterChange = (type, value) => {
    play();
    switch (type) {
      case "category":
        setSelectedCategory(value);
        if (value !== "all") {
          searchParams.set("category", value);
        } else {
          searchParams.delete("category");
        }
        break;
      case "platform":
        setSelectedPlatform(value);
        break;
      case "sort":
        setSortBy(value);
        if (value !== "default") {
          searchParams.set("filter", value);
        } else {
          searchParams.delete("filter");
        }
        break;
      default:
        break;
    }
    setSearchParams(searchParams);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    const newParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      newParams.set("search", value);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    play();
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedPlatform("all");
    setSortBy("default");
    setSearchParams({});
  };

  const hasActiveFilters =
    searchQuery || selectedCategory !== "all" || selectedPlatform !== "all" || sortBy !== "default";

  const FilterControls = () => (
    <Box className={styles.filterControls}>
      <FormControl size="small" className={styles.filterSelect}>
        <InputLabel>Category</InputLabel>
        <Select
          value={selectedCategory}
          label="Category"
          onChange={(e) => handleFilterChange("category", e.target.value)}
        >
          {categories.map((cat) => (
            <MenuItem key={cat.value} value={cat.value}>
              {cat.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" className={styles.filterSelect}>
        <InputLabel>Platform</InputLabel>
        <Select
          value={selectedPlatform}
          label="Platform"
          onChange={(e) => handleFilterChange("platform", e.target.value)}
        >
          {platforms.map((plat) => (
            <MenuItem key={plat.value} value={plat.value}>
              {plat.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" className={styles.filterSelect}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortBy}
          label="Sort By"
          onChange={(e) => handleFilterChange("sort", e.target.value)}
        >
          {sortOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {hasActiveFilters && (
        <Button
          variant="outlined"
          size="small"
          startIcon={<Close />}
          onClick={clearFilters}
          className={styles.clearButton}
        >
          Clear
        </Button>
      )}
    </Box>
  );

  const ProductSkeleton = () => (
    <Card className={styles.productCard}>
      <Skeleton variant="rectangular" height={180} />
      <CardContent>
        <Skeleton variant="text" width="80%" height={28} />
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="text" width="40%" height={24} />
      </CardContent>
    </Card>
  );

  return (
    <motion.div
      className={styles.productsPage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Container maxWidth="xl">
        <Breadcrumb items={[{ label: "All Products" }]} />

        {/* Page Header */}
        <Box className={styles.pageHeader}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h3" className={styles.pageTitle}>
              All Products
            </Typography>
            <Typography variant="body1" className={styles.pageSubtitle}>
              Browse our complete collection of game credits, gift cards, and more
            </Typography>
          </motion.div>
        </Box>

        {/* Search & Filter Section */}
        <Box className={styles.searchFilterSection}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className={styles.searchInput}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search className={styles.searchIcon} />
                </InputAdornment>
              ),
            }}
          />

          {isMobile ? (
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setFilterDrawerOpen(true)}
              className={styles.mobileFilterButton}
            >
              Filters
            </Button>
          ) : (
            <FilterControls />
          )}
        </Box>

        {/* Results Count */}
        <Box className={styles.resultsInfo}>
          <Typography variant="body2" className={styles.resultsCount}>
            Showing {filteredAndSortedProducts.length} of {products.length} products
          </Typography>
          {hasActiveFilters && (
            <Box className={styles.activeFilters}>
              {selectedCategory !== "all" && (
                <Chip
                  label={categories.find((c) => c.value === selectedCategory)?.label}
                  size="small"
                  onDelete={() => handleFilterChange("category", "all")}
                  className={styles.filterChip}
                />
              )}
              {selectedPlatform !== "all" && (
                <Chip
                  label={selectedPlatform}
                  size="small"
                  onDelete={() => handleFilterChange("platform", "all")}
                  className={styles.filterChip}
                />
              )}
              {sortBy !== "default" && (
                <Chip
                  label={sortOptions.find((s) => s.value === sortBy)?.label}
                  size="small"
                  onDelete={() => handleFilterChange("sort", "default")}
                  className={styles.filterChip}
                />
              )}
            </Box>
          )}
        </Box>

        {/* Products Grid */}
        <Grid container spacing={3}>
          <AnimatePresence mode="popLayout">
            {loading ? (
              [...Array(8)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={`skeleton-${index}`}>
                  <ProductSkeleton />
                </Grid>
              ))
            ) : filteredAndSortedProducts.length > 0 ? (
              filteredAndSortedProducts.map((product, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card
                      className={styles.productCard}
                      onClick={() => handleProductClick(product.id)}
                    >
                      {/* Badges */}
                      <Box className={styles.badges}>
                        {product.hot && (
                          <Chip
                            icon={<Whatshot />}
                            label="HOT"
                            size="small"
                            className={styles.hotBadge}
                          />
                        )}
                        {product.trending && (
                          <Chip
                            icon={<TrendingUp />}
                            label="Trending"
                            size="small"
                            className={styles.trendingBadge}
                          />
                        )}
                        {product.instantDelivery && (
                          <Chip
                            icon={<Verified />}
                            label="Instant"
                            size="small"
                            className={styles.instantBadge}
                          />
                        )}
                        {getProductMaxDiscount(product) > 0 && (
                          <Chip
                            label={`-${getProductMaxDiscount(product)}%`}
                            size="small"
                            className={styles.discountBadge}
                          />
                        )}
                      </Box>

                      {/* Product Image */}
                      <CardMedia
                        component="img"
                        height="180"
                        image={product.image}
                        alt={product.name}
                        className={styles.productImage}
                      />

                      {/* Quick View Overlay */}
                      <Box className={styles.overlay}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<Visibility />}
                          className={styles.quickViewButton}
                        >
                          Quick View
                        </Button>
                      </Box>

                      {/* Product Info */}
                      <CardContent className={styles.productContent}>
                        <Typography variant="h6" className={styles.productName}>
                          {product.name}
                        </Typography>
                        <Typography variant="body2" className={styles.productDescription}>
                          {product.shortDescription}
                        </Typography>

                        <Box className={styles.productMeta}>
                          <Box className={styles.ratingContainer}>
                            <Rating
                              value={product.rating}
                              precision={0.1}
                              readOnly
                              size="small"
                            />
                            <Typography variant="caption" className={styles.reviewCount}>
                              ({product.totalReviews?.toLocaleString()})
                            </Typography>
                          </Box>

                          <Box className={styles.chipContainer}>
                            <Chip
                              label={product.platform}
                              size="small"
                              className={styles.platformChip}
                            />
                            <Chip
                              label={product.region}
                              size="small"
                              variant="outlined"
                              className={styles.regionChip}
                            />
                          </Box>
                        </Box>

                        <Box className={styles.priceSection}>
                          <Typography variant="h6" className={styles.price}>
                            From {formatCurrency(getProductMinPrice(product).sellingPrice, "INR")}
                          </Typography>
                          <IconButton size="small" className={styles.cartIcon}>
                            <ShoppingCart />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box className={styles.noResults}>
                  <Typography variant="h5" className={styles.noResultsTitle}>
                    No products found
                  </Typography>
                  <Typography variant="body1" className={styles.noResultsText}>
                    Try adjusting your search or filter criteria
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={clearFilters}
                    className={styles.clearFiltersButton}
                  >
                    Clear All Filters
                  </Button>
                </Box>
              </Grid>
            )}
          </AnimatePresence>
        </Grid>
      </Container>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="bottom"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        className={styles.filterDrawer}
      >
        <Box className={styles.filterDrawerContent}>
          <Box className={styles.filterDrawerHeader}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setFilterDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <Divider />
          <Box className={styles.filterDrawerBody}>
            <FormControl fullWidth size="small" className={styles.mobileFilter}>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" className={styles.mobileFilter}>
              <InputLabel>Platform</InputLabel>
              <Select
                value={selectedPlatform}
                label="Platform"
                onChange={(e) => handleFilterChange("platform", e.target.value)}
              >
                {platforms.map((plat) => (
                  <MenuItem key={plat.value} value={plat.value}>
                    {plat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" className={styles.mobileFilter}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => handleFilterChange("sort", e.target.value)}
              >
                {sortOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box className={styles.filterDrawerActions}>
              <Button
                variant="outlined"
                fullWidth
                onClick={clearFilters}
                className={styles.clearAllButton}
              >
                Clear All
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => setFilterDrawerOpen(false)}
                className={styles.applyButton}
              >
                Apply Filters
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </motion.div>
  );
};

export default Products;
