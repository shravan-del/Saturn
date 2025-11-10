/**
 * Voice Guardian - Demo Mode
 * For testing without real API calls
 * 
 * Enable with: localStorage.setItem('demo_mode', 'true')
 * 
 * TODO: Implement demo mode mocks
 * - Mock calendar creation
 * - Mock auth check
 * - Mock API responses
 */

class DemoMode {
  /**
   * Check if demo mode is enabled
   * @returns {boolean}
   */
  static isEnabled() {
    return localStorage.getItem('demo_mode') === 'true';
  }

  /**
   * Mock calendar event creation
   * @param {Object} eventDetails - Event details
   * @returns {Object} Mock success response
   */
  static async mockCalendarCreate(eventDetails) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return mock success
    return {
      success: true,
      event_id: 'demo_' + Date.now(),
      event_url: 'https://calendar.google.com/calendar/',
      event: {
        title: eventDetails.title || 'Demo Event',
        start: eventDetails.start || new Date().toISOString(),
        end: eventDetails.end || new Date(Date.now() + 3600000).toISOString()
      }
    };
  }

  /**
   * Mock authentication check
   * @returns {Object} Mock user data
   */
  static async mockAuthCheck() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      authenticated: true,
      user: {
        email: 'demo@voiceguardian.com',
        name: 'Demo User',
        picture: 'https://ui-avatars.com/api/?name=Demo+User'
      }
    };
  }

  /**
   * Mock intent parsing
   * @param {string} command - Voice command
   * @returns {Object} Mock parsed intent
   */
  static async mockIntentParse(command) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      intent_type: 'create_event',
      confidence: 0.9,
      entities: {
        title: 'Demo Meeting',
        when: 'tomorrow 2pm',
        duration_minutes: 60,
        description: command
      }
    };
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DemoMode;
} else {
  // For ES6 modules
  window.DemoMode = DemoMode;
}

