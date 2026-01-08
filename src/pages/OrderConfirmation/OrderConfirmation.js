import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  Grid,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  CheckCircle,
  LocalShipping,
  Receipt,
  Home,
  History,
  ContentCopy,
  Email,
  Phone,
  AccessTime,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useOrder } from "../../context/OrderContext";
import { formatCurrency } from "../../utils/helpers";
import confetti from "canvas-confetti";
import styles from "./OrderConfirmation.module.css";

const OrderConfirmation = () => {
  const { orderNumber } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { getOrderById, orders, isLoading } = useOrder();

  const [order, setOrder] = useState(location.state?.order || null);
  const [copied, setCopied] = useState(false);

  // Try to get order from context if not in location state
  useEffect(() => {
    if (!order && orderNumber && orders.length > 0) {
      const foundOrder = getOrderById(orderNumber);
      if (foundOrder) {
        setOrder(foundOrder);
      }
    }
  }, [orderNumber, orders, getOrderById, order]);

  // Trigger confetti on mount
  useEffect(() => {
    if (order) {
      const duration = 3000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#667eea", "#764ba2", "#f093fb", "#f5576c"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#667eea", "#764ba2", "#f093fb", "#f5576c"],
        });
      }, 150);

      return () => clearInterval(interval);
    }
  }, [order]);

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "long",
      timeStyle: "short",
    });
  };

  if (isLoading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography>Loading order details...</Typography>
      </Box>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="md" className={styles.notFoundContainer}>
        <Card className={styles.notFoundCard}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Order Not Found
            </Typography>
            <Typography color="textSecondary" paragraph>
              We couldn't find the order you're looking for. It may have been
              placed in a different session.
            </Typography>
            <Box className={styles.notFoundActions}>
              <Button
                variant="contained"
                startIcon={<Home />}
                onClick={() => navigate("/")}
              >
                Go to Home
              </Button>
              <Button
                variant="outlined"
                startIcon={<History />}
                onClick={() => navigate("/orders")}
              >
                View Order History
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Box className={styles.confirmationPage}>
      <Container maxWidth="lg">
        {/* Success Header */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className={styles.successHeader}
        >
          <Box className={styles.successIcon}>
            <CheckCircle />
          </Box>
          <Typography variant="h4" className={styles.successTitle}>
            Thank You for Your Order!
          </Typography>
          <Typography className={styles.successSubtitle}>
            Your payment was successful and your order is being processed.
          </Typography>
        </motion.div>

        {/* Order Number Banner */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className={styles.orderNumberCard}>
            <CardContent>
              <Typography className={styles.orderNumberLabel}>
                Order Number
              </Typography>
              <Box className={styles.orderNumberValue}>
                <Typography variant="h5">{order.orderNumber}</Typography>
                <Button
                  size="small"
                  startIcon={<ContentCopy />}
                  onClick={handleCopyOrderNumber}
                  className={styles.copyButton}
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </Box>
              <Typography className={styles.orderDate}>
                Placed on {formatDate(order.createdAt)}
              </Typography>
            </CardContent>
          </Card>
        </motion.div>

        <Grid container spacing={3}>
          {/* Order Details */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Items Ordered */}
              <Card className={styles.detailsCard}>
                <CardContent>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    <Receipt /> Items Ordered
                  </Typography>

                  <Box className={styles.itemsList}>
                    {order.items.map((item, index) => (
                      <Box key={index} className={styles.orderItem}>
                        <Box className={styles.itemImage}>
                          <img src={item.image} alt={item.name} />
                        </Box>
                        <Box className={styles.itemDetails}>
                          <Typography className={styles.itemName}>
                            {item.name}
                          </Typography>
                          <Typography className={styles.itemOffer}>
                            {item.offerName}
                          </Typography>
                          <Box className={styles.itemChips}>
                            <Chip label={item.platform} size="small" />
                            {item.region && (
                              <Chip label={item.region} size="small" />
                            )}
                          </Box>
                          {item.requiredInfo &&
                            Object.keys(item.requiredInfo).length > 0 && (
                              <Box className={styles.requiredInfo}>
                                {Object.entries(item.requiredInfo).map(
                                  ([key, value]) => (
                                    <Typography key={key} variant="caption">
                                      {key}: <strong>{value}</strong>
                                    </Typography>
                                  )
                                )}
                              </Box>
                            )}
                        </Box>
                        <Box className={styles.itemPricing}>
                          <Typography className={styles.itemQuantity}>
                            Qty: {item.quantity}
                          </Typography>
                          <Typography className={styles.itemPrice}>
                            {formatCurrency(
                              item.price * item.quantity,
                              item.currency
                            )}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>

              {/* Delivery Info */}
              <Card className={styles.detailsCard}>
                <CardContent>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    <LocalShipping /> Delivery Information
                  </Typography>

                  <Alert severity="success" className={styles.deliveryAlert}>
                    <Box className={styles.deliveryAlertContent}>
                      <AccessTime />
                      <Box>
                        <Typography variant="subtitle2">
                          Estimated Delivery
                        </Typography>
                        <Typography variant="body2">
                          Your items will be delivered within{" "}
                          <strong>5-30 minutes</strong> depending on the product.
                        </Typography>
                      </Box>
                    </Box>
                  </Alert>

                  <Typography variant="body2" color="textSecondary" paragraph>
                    Digital items will be automatically credited to your game
                    account using the information you provided during checkout.
                    You will receive an email confirmation once all items have
                    been delivered.
                  </Typography>

                  <Box className={styles.contactInfo}>
                    <Typography variant="subtitle2" gutterBottom>
                      Contact Information
                    </Typography>
                    {order.contactInfo ? (
                      <>
                        <Box className={styles.contactRow}>
                          <Email fontSize="small" />
                          <Typography>{order.contactInfo.email}</Typography>
                        </Box>
                        <Box className={styles.contactRow}>
                          <Phone fontSize="small" />
                          <Typography>{order.contactInfo.phone}</Typography>
                        </Box>
                      </>
                    ) : (
                      <Typography color="textSecondary">
                        Contact information not available
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card className={styles.summaryCard}>
                <CardContent>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    Payment Summary
                  </Typography>

                  <Box className={styles.summaryRow}>
                    <Typography>Subtotal</Typography>
                    <Typography>
                      {formatCurrency(order.subtotal)}
                    </Typography>
                  </Box>

                  <Box className={styles.summaryRow}>
                    <Typography>Tax</Typography>
                    <Typography>{formatCurrency(order.tax)}</Typography>
                  </Box>

                  <Divider className={styles.summaryDivider} />

                  <Box className={styles.summaryTotal}>
                    <Typography variant="h6">Total Paid</Typography>
                    <Typography variant="h6" className={styles.totalAmount}>
                      {formatCurrency(order.total)}
                    </Typography>
                  </Box>

                  <Box className={styles.paymentMethod}>
                    <Typography variant="caption" color="textSecondary">
                      Payment Method
                    </Typography>
                    <Chip
                      label={order.paymentMethod.toUpperCase()}
                      size="small"
                      className={styles.paymentChip}
                    />
                  </Box>

                  <Box className={styles.statusBadge}>
                    <Chip
                      icon={<CheckCircle />}
                      label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      color="success"
                      className={styles.statusChip}
                    />
                  </Box>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Box className={styles.actionButtons}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Home />}
                  onClick={() => navigate("/")}
                  className={styles.homeButton}
                >
                  Continue Shopping
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<History />}
                  onClick={() => navigate("/orders")}
                  className={styles.ordersButton}
                >
                  View All Orders
                </Button>
              </Box>

              {/* Help Section */}
              <Card className={styles.helpCard}>
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Need Help?
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    If you have any questions about your order, please contact
                    our support team.
                  </Typography>
                  <Button
                    size="small"
                    color="primary"
                    className={styles.supportLink}
                    onClick={() => navigate("/support")}
                  >
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default OrderConfirmation;
