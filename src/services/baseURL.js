// =============================================================================
// API Base URL Configuration
// =============================================================================
//
// This file configures the API base URL for different environments.
//
// HOW TO SWITCH BETWEEN JSON SERVER AND CLOUDWAYS API:
// =====================================================
//
// Option 1: Using .env file (Recommended)
// ----------------------------------------
// For JSON Server (Mock API):
//   REACT_APP_API_URL=http://localhost:3001
//   REACT_APP_USE_MOCK_API=true
//
// For Cloudways API (Production):
//   REACT_APP_API_URL=https://phplaravel-780646-5827390.cloudwaysapps.com/api/v1
//   REACT_APP_USE_MOCK_API=false
//
// IMPORTANT: Restart the dev server after changing .env values!
//
// Option 2: Using npm scripts
// ---------------------------
// npm run dev        - Runs with JSON Server (mock API)
// npm start          - Runs with settings from .env file
//
// =============================================================================

// Production API URL (Cloudways Laravel Backend)
export const PRODUCTION_URL = "https://phplaravel-780646-5827390.cloudwaysapps.com/api/v1";

// Development/Mock API URL (JSON Server)
export const MOCK_API_URL = "http://localhost:3001";

// MOOGOLD API Base URL (for admin product sync - always uses Cloudways)
export const MOOGOLD_API_BASE = "https://phplaravel-780646-5827390.cloudwaysapps.com/api";

// Determine which URL to use
const getBaseURL = () => {
  // Check if explicitly using mock API
  if (process.env.REACT_APP_USE_MOCK_API === "true") {
    return MOCK_API_URL;
  }

  // Use environment variable if set
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // In development, use mock API by default (unless explicitly set otherwise)
  if (process.env.NODE_ENV === "development") {
    return MOCK_API_URL;
  }

  // In production, use the production URL
  return PRODUCTION_URL;
};

const BASE_URL = getBaseURL();

// Flag to check if using mock API (JSON Server)
// This helps components handle response format differences
export const IS_MOCK_API = BASE_URL === MOCK_API_URL || process.env.REACT_APP_USE_MOCK_API === "true";

// API Version
export const API_VERSION = "v1";

// Export configuration for debugging
export const API_CONFIG = {
  baseURL: BASE_URL,
  isMockAPI: IS_MOCK_API,
  mockApiUrl: MOCK_API_URL,
  productionUrl: PRODUCTION_URL,
  moogoldApiBase: MOOGOLD_API_BASE,
  environment: process.env.NODE_ENV,
  useMockApiEnv: process.env.REACT_APP_USE_MOCK_API,
};

// Helper function to get current API mode name
export const getApiModeName = () => {
  return IS_MOCK_API ? "JSON Server (Mock)" : "Cloudways API (Production)";
};

// Log API configuration in development
if (process.env.NODE_ENV === "development") {
  console.log("=== API Configuration ===");
  console.log(`Mode: ${getApiModeName()}`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`MOOGOLD API: ${MOOGOLD_API_BASE}`);
  console.log("=========================");
}

export default BASE_URL;
