import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Rating,
  TextField,
  Skeleton,
  IconButton,
  Divider,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  ArrowBack,
  LocalOffer,
  AccessTime,
  Verified,
  ExpandMore,
  ShoppingCart,
  CheckCircle,
  Info,
  TrendingUp,
  Whatshot,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import apiService from "../../services/api";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/helpers";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import styles from "./ProductDetails.module.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [requiredFields, setRequiredFields] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await apiService.products.getById(id);
      setProduct(data);

      // Initialize required fields
      if (data.requiredInfo && data.requiredInfo.length > 0) {
        const initialFields = {};
        data.requiredInfo.forEach((field) => {
          initialFields[field] = "";
        });
        setRequiredFields(initialFields);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      Swal.fire({
        icon: "error",
        title: "Product Not Found",
        text: "The product you are looking for does not exist.",
        confirmButtonText: "Go Back",
      }).then(() => {
        navigate("/");
      });
    } finally {
      setLoading(false);
    }
  };

  const validateFields = () => {
    const errors = {};
    let isValid = true;

    // Validate required fields
    if (product.requiredInfo && product.requiredInfo.length > 0) {
      product.requiredInfo.forEach((field) => {
        if (!requiredFields[field] || requiredFields[field].trim() === "") {
          errors[field] = `${field} is required`;
          isValid = false;
        }
      });
    }

    // Validate offer selection
    if (!selectedOffer) {
      errors.offer = "Please select a package";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleFieldChange = (field, value) => {
    setRequiredFields((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleOfferSelect = (offer) => {
    setSelectedOffer(offer);
    // Clear offer error when selected
    if (fieldErrors.offer) {
      setFieldErrors((prev) => ({ ...prev, offer: "" }));
    }
  };

  const handleAddToCart = () => {
    if (!validateFields()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all required fields and select a package.",
        confirmButtonColor: "#667eea",
      });
      return;
    }

    // Create cart item with offer details and required info
    const cartItem = {
      id: `${product.id}-${selectedOffer.id}`,
      productId: product.id,
      offerId: selectedOffer.id,
      name: `${product.name} - ${selectedOffer.name}`,
      image: product.image,
      platform: product.platform,
      region: product.region,
      price: selectedOffer.sellingPrice,
      originalPrice: selectedOffer.originalPrice,
      discount: selectedOffer.discount,
      currency: selectedOffer.currency || "INR",
      offerName: selectedOffer.name,
      requiredInfo: requiredFields,
      deliveryTime: product.deliveryTime,
    };

    addToCart(cartItem, quantity);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" className={styles.container}>
        <Box className={styles.backButtonContainer}>
          <Skeleton variant="rectangular" width={100} height={40} />
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={7}>
            <Skeleton variant="text" height={60} />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="rectangular" height={200} sx={{ mt: 2, borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Container maxWidth="lg" className={styles.container}>
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: "Products", path: "/products" },
            { label: product?.name || "Product" }
          ]}
        />

        <Grid container spacing={4}>
          {/* Product Image */}
          <Grid item xs={12} md={5}>
            <Card className={styles.imageCard}>
              <Box className={styles.imageContainer}>
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
                </Box>
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.productImage}
                />
              </Box>
            </Card>

            {/* Product Info Cards */}
            <Box className={styles.infoCards}>
              <Card className={styles.infoCard}>
                <CardContent className={styles.infoCardContent}>
                  <AccessTime className={styles.infoIcon} />
                  <Box>
                    <Typography variant="body2" className={styles.infoLabel}>
                      Delivery Time
                    </Typography>
                    <Typography variant="body1" className={styles.infoValue}>
                      {product.deliveryTime}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
              <Card className={styles.infoCard}>
                <CardContent className={styles.infoCardContent}>
                  <LocalOffer className={styles.infoIcon} />
                  <Box>
                    <Typography variant="body2" className={styles.infoLabel}>
                      Region
                    </Typography>
                    <Typography variant="body1" className={styles.infoValue}>
                      {product.region}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={7}>
            {/* Title & Rating */}
            <Box className={styles.titleSection}>
              <Typography variant="h4" className={styles.productTitle}>
                {product.name}
              </Typography>
              <Box className={styles.ratingContainer}>
                <Rating value={product.rating} precision={0.1} readOnly size="small" />
                <Typography variant="body2" className={styles.reviewCount}>
                  ({product.totalReviews?.toLocaleString() || 0} reviews)
                </Typography>
              </Box>
              <Box className={styles.chipContainer}>
                <Chip label={product.platform} size="small" className={styles.platformChip} />
                <Chip label={product.category} size="small" className={styles.categoryChip} />
                {product.developer && (
                  <Chip label={product.developer} size="small" variant="outlined" />
                )}
              </Box>
            </Box>

            {/* Description */}
            <Typography variant="body1" className={styles.description}>
              {product.description}
            </Typography>

            <Divider className={styles.divider} />

            {/* Required Info Fields */}
            {product.requiredInfo && product.requiredInfo.length > 0 && (
              <Box className={styles.requiredInfoSection}>
                <Typography variant="h6" className={styles.sectionTitle}>
                  <Info className={styles.sectionIcon} />
                  Required Information
                </Typography>
                <Grid container spacing={2}>
                  {product.requiredInfo.map((field) => (
                    <Grid item xs={12} sm={6} key={field}>
                      <TextField
                        fullWidth
                        label={field}
                        value={requiredFields[field] || ""}
                        onChange={(e) => handleFieldChange(field, e.target.value)}
                        error={!!fieldErrors[field]}
                        helperText={fieldErrors[field]}
                        variant="outlined"
                        className={styles.textField}
                        placeholder={`Enter your ${field}`}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Offer Selection */}
            <Box className={styles.offersSection}>
              <Typography variant="h6" className={styles.sectionTitle}>
                <LocalOffer className={styles.sectionIcon} />
                Select Package
              </Typography>
              {fieldErrors.offer && (
                <Alert severity="error" className={styles.offerError}>
                  {fieldErrors.offer}
                </Alert>
              )}
              <Grid container spacing={2}>
                {product.offers &&
                  product.offers.map((offer) => (
                    <Grid item xs={6} sm={4} md={4} key={offer.id}>
                      <Card
                        className={`${styles.offerCard} ${
                          selectedOffer?.id === offer.id ? styles.offerCardSelected : ""
                        } ${offer.popular ? styles.offerCardPopular : ""}`}
                        onClick={() => handleOfferSelect(offer)}
                      >
                        <CardContent className={styles.offerCardContent}>
                          {offer.popular && (
                            <Chip
                              label="Popular"
                              size="small"
                              className={styles.popularBadge}
                            />
                          )}
                          {selectedOffer?.id === offer.id && (
                            <CheckCircle className={styles.selectedIcon} />
                          )}
                          <Typography variant="body1" className={styles.offerName}>
                            {offer.name}
                          </Typography>
                          <Typography variant="h6" className={styles.offerPrice}>
                            {formatCurrency(offer.sellingPrice, offer.currency || "INR")}
                          </Typography>
                          {offer.discount > 0 && (
                            <Box className={styles.offerDiscountContainer}>
                              <Typography variant="body2" className={styles.offerOriginalPrice}>
                                {formatCurrency(offer.originalPrice, offer.currency || "INR")}
                              </Typography>
                              <Chip
                                label={`-${offer.discount}%`}
                                size="small"
                                className={styles.offerDiscountBadge}
                              />
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            </Box>

            {/* Quantity & Add to Cart */}
            <Box className={styles.cartSection}>
              <Box className={styles.quantityContainer}>
                <Typography variant="body1" className={styles.quantityLabel}>
                  Quantity:
                </Typography>
                <Box className={styles.quantityControls}>
                  <IconButton
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={styles.quantityButton}
                    disabled={quantity <= 1}
                  >
                    -
                  </IconButton>
                  <Typography className={styles.quantityValue}>{quantity}</Typography>
                  <IconButton
                    onClick={() => setQuantity(quantity + 1)}
                    className={styles.quantityButton}
                  >
                    +
                  </IconButton>
                </Box>
              </Box>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                className={styles.addToCartButton}
              >
                Add to Cart
                {selectedOffer && (
                  <span className={styles.cartTotal}>
                    - {formatCurrency(selectedOffer.sellingPrice * quantity, selectedOffer.currency || "INR")}
                  </span>
                )}
              </Button>
            </Box>

            {/* Instructions Accordions */}
            <Box className={styles.instructionsSection}>
              {product.howToTopUp && product.howToTopUp.length > 0 && (
                <Accordion className={styles.accordion} defaultExpanded>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    className={styles.accordionSummary}
                  >
                    <Typography variant="subtitle1" className={styles.accordionTitle}>
                      How to Top Up
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails className={styles.accordionDetails}>
                    <ol className={styles.instructionList}>
                      {product.howToTopUp.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </AccordionDetails>
                </Accordion>
              )}

              {product.howToFindPlayerId && product.howToFindPlayerId.length > 0 && (
                <Accordion className={styles.accordion}>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    className={styles.accordionSummary}
                  >
                    <Typography variant="subtitle1" className={styles.accordionTitle}>
                      How to Find Your Player ID
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails className={styles.accordionDetails}>
                    <ol className={styles.instructionList}>
                      {product.howToFindPlayerId.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </AccordionDetails>
                </Accordion>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
};

export default ProductDetails;
