// =============================================================================
// API Base URL Configuration
// =============================================================================
//
// This file configures the API base URL for different environments.
// When backend APIs are ready:
// 1. Set REACT_APP_API_URL in your .env file to the production API URL
// 2. Or update the PRODUCTION_URL constant below
//
// Environment Variables:
// - REACT_APP_API_URL: Production API URL (e.g., https://api.yourdomain.com/api/v1)
// - REACT_APP_USE_MOCK_API: Set to "true" to force using JSON Server
//
// =============================================================================

// Production API URL (Cloudways Laravel Backend)
const PRODUCTION_URL = "https://phplaravel-780646-5827390.cloudwaysapps.com/api/v1";

// Development/Mock API URL (JSON Server)
const MOCK_API_URL = "http://localhost:3001";

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

  // In development, use mock API by default
  if (process.env.NODE_ENV === "development") {
    return MOCK_API_URL;
  }

  // In production, use the production URL
  return PRODUCTION_URL;
};

const BASE_URL = getBaseURL();

// Flag to check if using mock API (JSON Server)
// This helps components handle response format differences
export const IS_MOCK_API = BASE_URL === MOCK_API_URL;

// API Version
export const API_VERSION = "v1";

// Export configuration for debugging
export const API_CONFIG = {
  baseURL: BASE_URL,
  isMockAPI: IS_MOCK_API,
  environment: process.env.NODE_ENV,
};

// Log API configuration in development
if (process.env.NODE_ENV === "development") {
  console.log("API Configuration:", API_CONFIG);
}

export default BASE_URL;
