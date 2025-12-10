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
  Rating,
} from "@mui/material";
import {
  ShoppingCart,
  FlashOn,
  TrendingUp,
  Bolt,
  Star,
  Public,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatCurrency, getProductMinPrice, getProductMaxDiscount } from "../../utils/helpers";
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
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
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
            id: "4690774",
            name: "Mobile Legends (Global)",
            slug: "mobile-legends-global",
            shortDescription: "Diamond Top Up for Mobile Legends Global Server",
            image: "https://cdn.moogold.com/2021/05/c9137e7a2879f90e22df9fc5cd3bf85f.jpg",
            platform: "Mobile",
            region: "Global",
            rating: 4.9,
            totalReviews: 12847,
            trending: true,
            hot: true,
            instantDelivery: true,
            deliveryTime: "Instant - 3 Minutes",
            currency: "Diamonds",
            offers: [
              { id: "578634", name: "5 Diamonds", sellingPrice: 10.90, originalPrice: 12.0, discount: 9, currency: "INR" },
              { id: "4690773", name: "70 Diamonds", sellingPrice: 130.19, originalPrice: 140.0, discount: 7, popular: true, currency: "INR" }
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
            rating: 4.8,
            totalReviews: 3892,
            trending: true,
            hot: true,
            instantDelivery: false,
            deliveryTime: "15-30 Minutes",
            currency: "Tokens",
            offers: [
              { id: "5177683", name: "16 Tokens", sellingPrice: 20.26, originalPrice: 22.0, discount: 8, currency: "INR" },
              { id: "5177684", name: "80 Tokens", sellingPrice: 92.77, originalPrice: 100.0, discount: 7, popular: true, currency: "INR" }
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
            rating: 4.9,
            totalReviews: 18432,
            trending: true,
            hot: true,
            instantDelivery: false,
            deliveryTime: "15-30 Minutes",
            currency: "Unknown Cash (UC)",
            offers: [
              { id: "4085924", name: "60 Unknown Cash", sellingPrice: 94.28, originalPrice: 100.0, discount: 6, currency: "INR" },
              { id: "4085925", name: "325 Unknown Cash", sellingPrice: 471.43, originalPrice: 500.0, discount: 6, popular: true, currency: "INR" }
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
            rating: 4.9,
            totalReviews: 3421,
            trending: true,
            hot: true,
            instantDelivery: true,
            deliveryTime: "Instant - 5 Minutes",
            currency: "Diamonds",
            offers: [
              { id: "15973174", name: "50 + 5 Diamonds", sellingPrice: 79.92, originalPrice: 90.0, discount: 11, currency: "INR" },
              { id: "5846336", name: "78 + 8 Diamonds", sellingPrice: 110.82, originalPrice: 120.0, discount: 8, currency: "INR" }
            ]
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
        {displayProducts.map((product, index) => {
          const priceInfo = getProductMinPrice(product);
          const maxDiscount = getProductMaxDiscount(product);

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
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
                    {product.instantDelivery && (
                      <Chip
                        label="Instant"
                        size="small"
                        icon={<Bolt />}
                        className={styles.instantBadge}
                      />
                    )}
                    {maxDiscount > 0 && (
                      <Chip
                        label={`-${maxDiscount}%`}
                        size="small"
                        className={`${styles.discountBadge} ${getDiscountColor(
                          maxDiscount
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
                    <Box className={styles.chipContainer}>
                      <Chip
                        label={product.platform}
                        size="small"
                        className={styles.platformChip}
                      />
                      {product.region && product.region !== "Global" && (
                        <Chip
                          label={product.region}
                          size="small"
                          icon={<Public style={{ fontSize: '14px' }} />}
                          className={styles.regionChip}
                        />
                      )}
                    </Box>

                    <Typography className={styles.productName}>
                      {product.name}
                    </Typography>

                    {/* Rating */}
                    {product.rating && (
                      <Box className={styles.ratingContainer}>
                        <Rating
                          value={product.rating}
                          precision={0.1}
                          size="small"
                          readOnly
                        />
                        <Typography className={styles.reviewCount}>
                          ({product.totalReviews?.toLocaleString() || 0})
                        </Typography>
                      </Box>
                    )}

                    <Box className={styles.priceContainer}>
                      <Typography className={styles.priceLabel}>
                        From
                      </Typography>
                      <Typography className={styles.price}>
                        {formatCurrency(priceInfo.sellingPrice, priceInfo.currency)}
                      </Typography>
                      {priceInfo.originalPrice > priceInfo.sellingPrice && (
                        <Typography className={styles.originalPrice}>
                          {formatCurrency(priceInfo.originalPrice, priceInfo.currency)}
                        </Typography>
                      )}
                    </Box>

                    {/* Delivery Time */}
                    {product.deliveryTime && (
                      <Typography className={styles.deliveryTime}>
                        {product.deliveryTime}
                      </Typography>
                    )}

                    <Button
                      variant="contained"
                      fullWidth
                      className={styles.addToCartButton}
                      onClick={() => handleViewProduct(product.id)}
                    >
                      View Options
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          );
        })}
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
