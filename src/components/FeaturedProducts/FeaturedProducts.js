import React from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Skeleton,
  Grid,
} from "@mui/material";
import {
  ShoppingCart,
  FlashOn,
  TrendingUp,
  LocalOffer,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatCurrency, calculateDiscount } from "../../utils/helpers";
import useSound from "../../hooks/useSound";
import styles from "./FeaturedProducts.module.css";

const FeaturedProducts = ({ products = [], isLoading = false }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { play } = useSound();

  const handleAddToCart = (product) => {
    play();
    addToCart(product);
  };

  const handleViewProduct = (productId) => {
    play();
    navigate(`/products/${productId}`);
  };

  const getDiscountColor = (discount) => {
    if (discount >= 20) return styles.discountHigh;
    if (discount >= 10) return styles.discountMedium;
    return styles.discountLow;
  };

  if (isLoading) {
    return (
      <Box className={styles.section}>
        <Typography variant="h3" className={styles.sectionTitle}>
          Featured & <span className={styles.titleGradient}>Trending</span>
        </Typography>
        <Typography className={styles.sectionSubtitle}>
          Hand-picked deals gamers love
        </Typography>
        <Grid container spacing={3} className={styles.productsGrid}>
          {[...Array(8)].map((_, index) => (
            <Grid item xs={6} sm={6} md={4} lg={3} key={index}>
              <Card className={styles.productCard}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  const displayProducts =
    products.length > 0
      ? products
      : [
          {
            id: 1,
            name: "Free Fire Diamond Plus",
            price: 9.99,
            originalPrice: 12.99,
            image: "https://placehold.co/300x400/7B1FA2/FFFFFF?text=Free+Fire",
            discount: 23,
            platform: "Mobile",
            trending: true,
            hot: true,
          },
          {
            id: 2,
            name: "PUBG G-Coin Global",
            price: 19.99,
            originalPrice: 24.99,
            image: "https://placehold.co/300x400/1976D2/FFFFFF?text=PUBG",
            discount: 20,
            platform: "Global",
            trending: false,
            hot: false,
          },
          {
            id: 3,
            name: "Steam Gift Card $50",
            price: 50.0,
            originalPrice: 50.0,
            image: "https://placehold.co/300x400/424242/FFFFFF?text=Steam",
            discount: 0,
            platform: "PC",
            trending: true,
            hot: false,
          },
          {
            id: 4,
            name: "Valorant Points",
            price: 35.99,
            originalPrice: 39.99,
            image: "https://placehold.co/300x400/E91E63/FFFFFF?text=Valorant",
            discount: 10,
            platform: "PC",
            trending: true,
            hot: true,
          },
          {
            id: 5,
            name: "Mobile Legends Diamonds",
            price: 14.99,
            originalPrice: 19.99,
            image: "https://placehold.co/300x400/4CAF50/FFFFFF?text=ML",
            discount: 25,
            platform: "Mobile",
            trending: true,
            hot: true,
          },
          {
            id: 6,
            name: "Genshin Impact Genesis",
            price: 49.99,
            originalPrice: 54.99,
            image: "https://placehold.co/300x400/3F51B5/FFFFFF?text=Genshin",
            discount: 9,
            platform: "Cross-platform",
            trending: false,
            hot: false,
          },
          {
            id: 7,
            name: "Call of Duty Mobile CP",
            price: 29.99,
            originalPrice: 34.99,
            image: "https://placehold.co/300x400/FF5722/FFFFFF?text=COD",
            discount: 14,
            platform: "Mobile",
            trending: true,
            hot: false,
          },
          {
            id: 8,
            name: "PlayStation Gift Card",
            price: 100.0,
            originalPrice: 100.0,
            image: "https://placehold.co/300x400/003791/FFFFFF?text=PSN",
            discount: 0,
            platform: "PlayStation",
            trending: false,
            hot: false,
          },
        ];

  return (
    <Box className={styles.section}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" className={styles.sectionTitle}>
          Featured & <span className={styles.titleGradient}>Trending</span>
        </Typography>
        <Typography className={styles.sectionSubtitle}>
          Hand-picked deals gamers love
        </Typography>
      </motion.div>

      <Grid container spacing={3} className={styles.productsGrid}>
        {displayProducts.map((product, index) => (
          <Grid item xs={6} sm={6} md={4} lg={3} key={product.id}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={styles.productWrapper}
            >
              <Card className={styles.productCard}>
                {/* Badges */}
                <Box className={styles.badges}>
                  {product.hot && (
                    <Chip
                      label="HOT"
                      size="small"
                      icon={<FlashOn />}
                      className={styles.hotBadge}
                    />
                  )}
                  {product.trending && (
                    <Chip
                      label="Trending"
                      size="small"
                      icon={<TrendingUp />}
                      className={styles.trendingBadge}
                    />
                  )}
                  {product.discount > 0 && (
                    <Chip
                      label={`-${product.discount}%`}
                      size="small"
                      className={`${styles.discountBadge} ${getDiscountColor(
                        product.discount
                      )}`}
                    />
                  )}
                </Box>

                {/* Image */}
                <Box className={styles.imageContainer}>
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.name}
                    className={styles.productImage}
                  />
                  <Box className={styles.imageOverlay}>
                    <Button
                      variant="contained"
                      className={styles.quickViewButton}
                      onClick={() => handleViewProduct(product.id)}
                    >
                      Quick View
                    </Button>
                  </Box>
                </Box>

                {/* Content */}
                <CardContent className={styles.cardContent}>
                  <Chip
                    label={product.platform}
                    size="small"
                    className={styles.platformChip}
                  />

                  <Typography className={styles.productName}>
                    {product.name}
                  </Typography>

                  <Box className={styles.priceContainer}>
                    <Typography className={styles.price}>
                      {formatCurrency(product.price)}
                    </Typography>
                    {product.originalPrice > product.price && (
                      <Typography className={styles.originalPrice}>
                        {formatCurrency(product.originalPrice)}
                      </Typography>
                    )}
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<ShoppingCart />}
                    className={styles.addToCartButton}
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Box className={styles.viewAllContainer}>
        <Button
          variant="outlined"
          size="large"
          className={styles.viewAllButton}
          onClick={() => {
            play();
            navigate("/products");
          }}
        >
          View All Products
        </Button>
      </Box>
    </Box>
  );
};

export default FeaturedProducts;
