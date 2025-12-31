import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Facebook, Instagram, Send } from "@mui/icons-material";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import useSound from "../../hooks/useSound";
import { useTheme } from "../../context/ThemeContext";
import styles from "./Footer.module.css";

import LOGO from "../../assets/logo.png";

const Footer = () => {
  const navigate = useNavigate();
  const { play } = useSound();
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState("");

  const handleNavigate = (path) => {
    play();
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    play();
    console.log("Subscribing email:", email);
    setEmail("");
  };

  const handleSocialClick = (url) => {
    play();
    window.open(url, "_blank");
  };

  const footerLinks = [
    { title: "Help Center", path: "/help" },
    { title: "Support", path: "/support" },
    { title: "Privacy Policy", path: "/privacy" },
    { title: "Terms of Service", path: "/terms" },
    { title: "Cookie Policy", path: "/cookies" },
    { title: "Refund Policy", path: "/refund" },
  ];

  const quickLinks = [
    { title: "Home", path: "/" },
    { title: "All Products", path: "/products" },
    { title: "Special Offers", path: "/special-offers" },
    { title: "About Us", path: "/about" },
  ];

  const socialLinks = [
    {
      icon: <Facebook />,
      url: "https://facebook.com",
      color: "#1877f2",
      name: "Facebook",
    },
    {
      icon: <Instagram />,
      url: "https://instagram.com",
      color: "#e4405f",
      name: "Instagram",
    },
    {
      icon: <Icon icon="mdi:telegram" />,
      url: "https://telegram.org",
      color: "#0088cc",
      name: "Telegram",
    },
    {
      icon: <Icon icon="mdi:twitter" />,
      url: "https://twitter.com",
      color: "#1da1f2",
      name: "Twitter",
    },
  ];

  const paymentMethods = [
    { icon: "logos:visa", name: "Visa" },
    { icon: "logos:mastercard", name: "Mastercard" },
    { icon: "logos:paypal", name: "PayPal" },
    { icon: "simple-icons:googlepay", name: "Google Pay" },
    { icon: "simple-icons:applepay", name: "Apple Pay" },
  ];

  return (
    <footer
      className={styles.footer}
      data-theme={isDarkMode ? "dark" : "light"}
    >
      {/* Main Footer Content */}
      <Box className={styles.mainFooter}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="flex-start">
            {/* Company Info & Logo */}
            <Grid item xs={12} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Box className={styles.logoSection}>
                  <Box className={styles.logoWrapper}>
                    <img src={LOGO} alt="KELLS GLOBAL" className={styles.footerLogo} />
                  </Box>
                  <Box className={styles.brandInfo}>
                    <Typography className={styles.brandName}>KELLS GLOBAL</Typography>
                    <Typography className={styles.brandTagline}>Your Gaming Marketplace</Typography>
                  </Box>
                </Box>
                <Typography className={styles.companyDescription}>
                  Your ultimate destination for gaming. Fast, secure, and
                  reliable game top-ups for all your favorite titles.
                </Typography>

                {/* Social Icons */}
                <Box className={styles.socialIcons}>
                  {socialLinks.map((social) => (
                    <motion.div
                      key={social.name}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconButton
                        className={styles.socialIcon}
                        style={{ "--social-color": social.color }}
                        onClick={() => handleSocialClick(social.url)}
                        aria-label={social.name}
                      >
                        {social.icon}
                      </IconButton>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={6} sm={6} md={2}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Typography variant="h6" className={styles.sectionTitle}>
                  Quick Links
                </Typography>
                <Box className={styles.footerLinks}>
                  {quickLinks.map((link) => (
                    <motion.button
                      key={link.title}
                      onClick={() => handleNavigate(link.path)}
                      className={styles.footerLink}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon icon="mdi:chevron-right" className={styles.linkIcon} />
                      {link.title}
                    </motion.button>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Support Links */}
            <Grid item xs={6} sm={6} md={2}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <Typography variant="h6" className={styles.sectionTitle}>
                  Support
                </Typography>
                <Box className={styles.footerLinks}>
                  {footerLinks.slice(0, 4).map((link) => (
                    <motion.button
                      key={link.title}
                      onClick={() => handleNavigate(link.path)}
                      className={styles.footerLink}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon icon="mdi:chevron-right" className={styles.linkIcon} />
                      {link.title}
                    </motion.button>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Newsletter */}
            <Grid item xs={12} sm={6} md={5}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Typography variant="h6" className={styles.sectionTitle}>
                  Stay Updated
                </Typography>
                <Typography className={styles.newsletterText}>
                  Subscribe to get exclusive deals, updates, and early access to new features!
                </Typography>
                <form
                  onSubmit={handleSubscribe}
                  className={styles.newsletterForm}
                >
                  <Box className={styles.inputWrapper}>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={styles.newsletterInput}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Icon icon="mdi:email-outline" className={styles.emailIcon} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              type="submit"
                              size="small"
                              className={styles.subscribeButton}
                              onClick={handleSubscribe}
                            >
                              <Send />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </form>

                {/* Trust Badges */}
                <Box className={styles.trustBadges}>
                  <Box className={styles.trustBadge}>
                    <Icon icon="mdi:shield-check" />
                    <span>Secure</span>
                  </Box>
                  <Box className={styles.trustBadge}>
                    <Icon icon="mdi:lightning-bolt" />
                    <span>Instant</span>
                  </Box>
                  <Box className={styles.trustBadge}>
                    <Icon icon="mdi:headset" />
                    <span>24/7</span>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Bottom Footer */}
      <Box className={styles.bottomFooter}>
        <Container maxWidth="lg">
          <Box className={styles.bottomContent}>
            <Typography className={styles.copyright}>
              © {new Date().getFullYear()} KELLS GLOBAL. All rights reserved.
            </Typography>
            <Box className={styles.paymentSection}>
              <Typography className={styles.paymentTitle}>We Accept</Typography>
              <Box className={styles.paymentIcons}>
                {paymentMethods.map((method, index) => (
                  <Box key={index} className={styles.paymentIcon} title={method.name}>
                    <Icon icon={method.icon} />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Scroll to Top Button */}
      <motion.button
        className={styles.scrollTopButton}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          play();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        aria-label="Scroll to top"
      >
        <Icon icon="mdi:arrow-up" />
      </motion.button>
    </footer>
  );
};

export default Footer;
