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
      setFeaturedProducts(products.slice(0, 10));
    } catch (error) {
      console.error("Error loading featured products:", error);
      setFeaturedProducts([
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
