import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  InputAdornment,
  Chip,
} from "@mui/material";
import { Search, TrendingUp, Security, Speed } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useSound from "../../hooks/useSound";
import styles from "./HeroSection.module.css";

import HERO_BG_1 from "../../assets/hero-1.jpg";
import HERO_BG_2 from "../../assets/hero-2.jpg";
import HERO_BG_3 from "../../assets/hero-3.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const { play } = useSound();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: HERO_BG_1,
      title: "Top Up Your Favorite Games",
      subtitle: "Instantly",
      description:
        "Fast, secure, and reliable game top-ups for all your favorite titles. Get your gaming currency delivered instantly!",
    },
    {
      image: HERO_BG_2,
      title: "Exclusive Deals",
      subtitle: "24/7 Support",
      description:
        "Best prices guaranteed with round-the-clock customer support. Your gaming never stops!",
    },
    {
      image: HERO_BG_3,
      title: "Gift Cards & More",
      subtitle: "Global Coverage",
      description:
        "Access gift cards and game credits for multiple regions worldwide. Game without boundaries!",
    },
  ];

  const trustBadges = [
    { icon: <Speed />, text: "Instant Delivery" },
    { icon: <Security />, text: "Secure Checkout" },
    { icon: <TrendingUp />, text: "24/7 Support" },
  ];

  const popularSearches = [
    "Free Fire Diamonds",
    "PUBG UC",
    "Steam Wallet",
    "Mobile Legends",
    "Valorant Points",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      play();
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleQuickSearch = (query) => {
    play();
    setSearchQuery(query);
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  return (
    <Box className={styles.heroSection}>
      {/* Background Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className={styles.backgroundSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{
            backgroundImage: `url(${slides[currentSlide].image})`,
          }}
        />
      </AnimatePresence>

      {/* Overlay */}
      <Box className={styles.overlay} />

      {/* Content */}
      <Container maxWidth="lg" className={styles.content}>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Title */}
          <Typography variant="h1" className={styles.title}>
            <motion.span
              key={`title-${currentSlide}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {slides[currentSlide].title}
            </motion.span>
            <span className={styles.titleGradient}>
              {" "}
              {slides[currentSlide].subtitle}
            </span>
          </Typography>

          {/* Description */}
          <Typography variant="h6" className={styles.description}>
            <motion.span
              key={`desc-${currentSlide}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {slides[currentSlide].description}
            </motion.span>
          </Typography>

          {/* Search Bar */}
          <Box className={styles.searchContainer}>
            <TextField
              fullWidth
              placeholder="Search for Free Fire, PUBG, Mobile Legends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className={styles.searchInput}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search className={styles.searchIcon} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <Button
                    variant="contained"
                    onClick={handleSearch}
                    className={styles.searchButton}
                  >
                    Search
                  </Button>
                ),
              }}
            />
          </Box>

          {/* Popular Searches */}
          <Box className={styles.popularSearches}>
            <Typography className={styles.popularLabel}>Popular:</Typography>
            {popularSearches.map((search, index) => (
              <motion.div
                key={search}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={styles.chipWrapper}
              >
                <Chip
                  label={search}
                  onClick={() => handleQuickSearch(search)}
                  className={styles.searchChip}
                  clickable
                />
              </motion.div>
            ))}
          </Box>

          {/* Trust Badges */}
          <Box className={styles.trustBadges}>
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge.text}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={styles.badge}
              >
                <Box className={styles.badgeIcon}>{badge.icon}</Box>
                <Typography className={styles.badgeText}>
                  {badge.text}
                </Typography>
              </motion.div>
            ))}
          </Box>
        </motion.div>

        {/* Slide Indicators */}
        <Box className={styles.slideIndicators}>
          {slides.map((_, index) => (
            <Box
              key={index}
              className={`${styles.indicator} ${
                index === currentSlide ? styles.indicatorActive : ""
              }`}
              onClick={() => {
                play();
                setCurrentSlide(index);
              }}
            />
          ))}
        </Box>
      </Container>

      {/* Animated Elements */}
      <motion.div
        className={styles.floatingElement1}
        animate={{
          y: [-20, 20, -20],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className={styles.floatingElement2}
        animate={{
          y: [20, -20, 20],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </Box>
  );
};

export default HeroSection;
