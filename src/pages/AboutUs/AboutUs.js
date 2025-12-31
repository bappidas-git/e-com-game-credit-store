import React from "react";
import { Container, Typography, Box, Card, CardContent, Grid } from "@mui/material";
import { motion } from "framer-motion";
import {
  Storefront,
  Speed,
  Security,
  SupportAgent,
  Public,
  Verified,
} from "@mui/icons-material";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import styles from "./AboutUs.module.css";

const AboutUs = () => {
  const features = [
    {
      icon: <Storefront />,
      title: "Wide Selection",
      description: "Access thousands of game credits, gift cards, and digital products from top publishers worldwide.",
    },
    {
      icon: <Speed />,
      title: "Instant Delivery",
      description: "Get your game credits and gift cards delivered instantly to your email after purchase.",
    },
    {
      icon: <Security />,
      title: "Secure Payments",
      description: "Shop with confidence using our encrypted payment systems and secure checkout process.",
    },
    {
      icon: <SupportAgent />,
      title: "24/7 Support",
      description: "Our dedicated support team is always ready to help you with any questions or issues.",
    },
    {
      icon: <Public />,
      title: "Global Reach",
      description: "Serving gamers worldwide with localized payment options and multi-currency support.",
    },
    {
      icon: <Verified />,
      title: "Authentic Products",
      description: "100% genuine game credits and gift cards sourced directly from official publishers.",
    },
  ];

  const stats = [
    { value: "1M+", label: "Happy Customers" },
    { value: "50K+", label: "Products Available" },
    { value: "100+", label: "Countries Served" },
    { value: "24/7", label: "Customer Support" },
  ];

  return (
    <motion.div
      className={styles.aboutPage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Container maxWidth="lg">
        <Breadcrumb items={[{ label: "About Us" }]} />

        {/* Hero Section */}
        <Card className={styles.heroCard}>
          <CardContent className={styles.heroContent}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h3" className={styles.pageTitle}>
                About KELLS GLOBAL
              </Typography>
              <Typography variant="h6" className={styles.tagline}>
                Your Trusted Gaming Marketplace
              </Typography>
              <Box className={styles.introduction}>
                <Typography variant="body1">
                  Welcome to KELLS GLOBAL, your premier destination for game credits, gift cards, and digital gaming products. Founded with a passion for gaming, we've grown to become one of the most trusted platforms for gamers worldwide.
                </Typography>
                <Typography variant="body1">
                  Our mission is simple: to make gaming more accessible by providing instant, secure, and affordable digital products to gamers everywhere. Whether you're looking for mobile game top-ups, PC game credits, or gift cards for your favorite platforms, we've got you covered.
                </Typography>
              </Box>
            </motion.div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <Box className={styles.statsSection}>
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className={styles.statCard}>
                    <CardContent className={styles.statContent}>
                      <Typography variant="h3" className={styles.statValue}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" className={styles.statLabel}>
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Features Section */}
        <Box className={styles.featuresSection}>
          <Typography variant="h4" className={styles.sectionTitle}>
            Why Choose Us?
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className={styles.featureCard}>
                    <CardContent className={styles.featureContent}>
                      <Box className={styles.featureIcon}>{feature.icon}</Box>
                      <Typography variant="h6" className={styles.featureTitle}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" className={styles.featureDescription}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Story Section */}
        <Card className={styles.storyCard}>
          <CardContent className={styles.storyContent}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h4" className={styles.sectionTitle}>
                Our Story
              </Typography>
              <Typography variant="body1" className={styles.storyText}>
                KELLS GLOBAL started as a small team of passionate gamers who understood the challenges of purchasing game credits internationally. We experienced firsthand the frustrations of limited payment options, delayed deliveries, and unreliable sellers.
              </Typography>
              <Typography variant="body1" className={styles.storyText}>
                That's why we built KELLS GLOBAL - a platform designed by gamers, for gamers. We partnered directly with game publishers and payment providers to create a seamless shopping experience that delivers genuine products instantly.
              </Typography>
              <Typography variant="body1" className={styles.storyText}>
                Today, we're proud to serve over a million happy customers across 100+ countries. Our commitment to quality, security, and customer satisfaction remains at the heart of everything we do.
              </Typography>
            </motion.div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className={styles.contactCard}>
          <CardContent className={styles.contactContent}>
            <Typography variant="h5" className={styles.contactTitle}>
              Get in Touch
            </Typography>
            <Typography variant="body1" className={styles.contactText}>
              Have questions or feedback? We'd love to hear from you!
            </Typography>
            <Box className={styles.contactInfo}>
              <Typography variant="body2">
                Email: support@kellsglobal.com
              </Typography>
              <Typography variant="body2">
                Address: KELLS GLOBAL, Business Center, Mumbai, India
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </motion.div>
  );
};

export default AboutUs;
