import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Container, Box } from "@mui/material";
import HeroSection from "../../components/HeroSection/HeroSection";
import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";
// import WhyChooseUs from "../../components/WhyChooseUs/WhyChooseUs";
// import FAQ from "../../components/FAQ/FAQ";
// import Newsletter from "../../components/Newsletter/Newsletter";
import apiService from "../../services/api";
import styles from "./Home.module.css";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      setIsLoading(true);
      const products = await apiService.products.getFeatured();
      setFeaturedProducts(products.slice(0, 10)); // Get first 10 featured products
    } catch (error) {
      console.error("Error loading featured products:", error);
      // Fallback to dummy data if API fails
      setFeaturedProducts([
        {
          id: 1,
          name: "Free Fire Diamond Plus",
          price: 9.99,
          originalPrice: 12.99,
          image:
            "https://via.placeholder.com/300x400/7B1FA2/FFFFFF?text=Free+Fire",
          discount: 23,
          platform: "Mobile",
        },
        {
          id: 2,
          name: "PUBG G-Coin",
          price: 19.99,
          originalPrice: 24.99,
          image: "https://via.placeholder.com/300x400/1976D2/FFFFFF?text=PUBG",
          discount: 20,
          platform: "Global",
        },
        {
          id: 3,
          name: "Steam Gift Card",
          price: 50.0,
          image: "https://via.placeholder.com/300x400/424242/FFFFFF?text=Steam",
          platform: "PC",
        },
        {
          id: 4,
          name: "Valorant Points",
          price: 35.99,
          originalPrice: 39.99,
          image:
            "https://via.placeholder.com/300x400/E91E63/FFFFFF?text=Valorant",
          discount: 10,
          platform: "PC",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className={styles.homePage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <HeroSection />
      </section>

      {/* Featured Products Section */}
      <section className={styles.featuredSection}>
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <FeaturedProducts
              products={featuredProducts}
              isLoading={isLoading}
            />
          </motion.div>
        </Container>
      </section>

      {/* Why Choose Us Section */}
      {/* <section className={styles.whyChooseSection}>
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <WhyChooseUs />
          </motion.div>
        </Container>
      </section> */}

      {/* FAQ Section */}
      {/* <section className={styles.faqSection}>
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <FAQ />
          </motion.div>
        </Container>
      </section> */}

      {/* Newsletter Section */}
      {/* <section className={styles.newsletterSection}>
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Newsletter />
          </motion.div>
        </Container>
      </section> */}

      {/* Animated Background Elements */}
      <div className={styles.backgroundElements}>
        <motion.div
          className={styles.floatingOrb}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className={styles.floatingOrb2}
          animate={{
            y: [0, 20, 0],
            x: [0, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className={styles.floatingOrb3}
          animate={{
            y: [0, -15, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.div>
  );
};

export default Home;
