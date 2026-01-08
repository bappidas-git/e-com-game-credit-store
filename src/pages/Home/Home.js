import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@mui/material";
import HeroSection from "../../components/HeroSection/HeroSection";
import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";
import FAQ from "../../components/FAQ/FAQ";
import CTASection from "../../components/CTASection/CTASection";
import Newsletter from "../../components/Newsletter/Newsletter";
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
      setFeaturedProducts(products?.slice(0, 10) || []);
    } catch (error) {
      console.error("Error loading featured products:", error);
      // No static fallback - display only products from the API
      setFeaturedProducts([]);
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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <FeaturedProducts
              products={featuredProducts}
              isLoading={isLoading}
            />
          </motion.div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <CTASection />
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <FAQ />
        </motion.div>
      </section>

      {/* Newsletter Section */}
      <section className={styles.newsletterSection}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Newsletter />
        </motion.div>
      </section>

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
