/**
 * Voice Guardian - Application Constants
 * Centralized constants for the extension
 */

const Constants = {
  // API Configuration
  API: {
    BASE_URL: 'http://localhost:8000',
    TIMEOUT: 10000, // 10 seconds
    MAX_RETRIES: 3
  },

  // Guardian Configuration
  GUARDIAN: {
    RISK_THRESHOLDS: {
      AUTO: 0.19,      // Execute immediately
      CONFIRM: 0.49,   // Ask user
      BLOCK: 1.0       // Don't allow
    },
    CONFIDENCE_THRESHOLDS: {
      LOW: 0.4,
      MODERATE: 0.7,
      HIGH: 0.9
    }
  },

  // Storage Keys
  STORAGE: {
    TOKEN: 'vg_token',
    USER: 'vg_user',
    ACTIONS: 'vg_actions',
    SETTINGS: 'vg_settings',
    DEMO_MODE: 'demo_mode'
  },

  // Voice Recognition
  VOICE: {
    LANGUAGE: 'en-US',
    CONTINUOUS: false,
    INTERIM_RESULTS: true
  },

  // Calendar
  CALENDAR: {
    DEFAULT_DURATION: 60, // minutes
    DEFAULT_TIMEZONE: 'America/Los_Angeles'
  },

  // Error Messages
  ERRORS: {
    NETWORK: 'Unable to connect. Please check your internet.',
    AUTH: 'Session expired. Please sign in again.',
    RATE_LIMIT: 'Too many requests. Please wait a moment.',
    SPEECH: 'Could not understand. Please try again.',
    UNKNOWN: 'Something went wrong. Please try again.'
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Constants;
} else {
  // For ES6 modules
  window.Constants = Constants;
}

