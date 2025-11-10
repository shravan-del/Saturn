/**
 * Voice Guardian - API Configuration
 * Centralized API endpoints and configuration
 */

const APIConfig = {
  // Base URL
  BASE_URL: 'http://localhost:8000',

  // API Endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      GOOGLE_LOGIN: '/auth/google/login',
      GOOGLE_CALLBACK: '/auth/google/callback',
      LOGOUT: '/auth/logout',
      ME: '/auth/me'
    },

    // Voice
    VOICE: {
      COMMAND: '/voice/command',
      STATUS: '/voice/status'
    },

    // Actions
    ACTIONS: {
      LIST: '/actions/',
      EXECUTE: '/actions/execute',
      DELETE: '/actions/{id}',
      UNDO: '/actions/{id}/undo'
    },

    // Teams (future)
    TEAMS: {
      LIST: '/teams',
      CREATE: '/teams',
      MEMBERS: '/teams/{id}/members'
    }
  },

  // Request Configuration
  REQUEST: {
    TIMEOUT: 10000, // 10 seconds
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 second
    RETRY_BACKOFF: 2 // Exponential backoff multiplier
  },

  // Headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Helper function to build endpoint URL
APIConfig.buildUrl = function(endpoint, params = {}) {
  let url = this.BASE_URL + endpoint;
  
  // Replace path parameters
  Object.keys(params).forEach(key => {
    url = url.replace(`{${key}}`, params[key]);
  });
  
  return url;
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = APIConfig;
} else {
  // For ES6 modules
  window.APIConfig = APIConfig;
}

