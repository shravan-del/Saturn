/**
 * Voice Guardian Configuration
 * Configure this for your Google OAuth setup
 */

const CONFIG = {
  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your actual client ID
  
  // Backend API Configuration
  API_BASE_URL: 'http://localhost:8000',
  
  // User Configuration
  DEFAULT_USER: {
    name: 'Shravan Athikinasetti',
    email: 'shravan.athikinasetti@gmail.com'
  },
  
  // Demo Mode (set to false for production)
  DEMO_MODE: false,
  
  // Features
  FEATURES: {
    VOICE_RECOGNITION: true,
    CALENDAR_INTEGRATION: true,
    GUARDIAN_VALIDATION: true
  }
};

// Make it available globally
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
