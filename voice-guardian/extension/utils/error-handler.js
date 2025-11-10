/**
 * Voice Guardian - Centralized Error Handling
 * All errors flow through here for consistent handling
 * 
 * TODO: Implement comprehensive error handling
 * - Error categorization
 * - User-friendly messages
 * - Error logging
 */

class ErrorHandler {
  /**
   * Handle error and return user-friendly message
   * @param {Error} error - Error object
   * @param {Object} context - Additional context
   * @returns {string} User-friendly error message
   */
  static handle(error, context = {}) {
    // Categorize error
    const errorType = this.categorize(error);
    
    // Log to console
    console.error(`[${errorType}]`, error, context);
    
    // Return user-friendly message
    return this.getUserMessage(errorType, error);
  }

  /**
   * Categorize error type
   * @param {Error} error - Error object
   * @returns {string} Error type
   */
  static categorize(error) {
    if (error.message?.includes('network') || error.message?.includes('fetch')) {
      return 'NETWORK_ERROR';
    }
    if (error.status === 401 || error.message?.includes('auth')) {
      return 'AUTH_ERROR';
    }
    if (error.status === 429 || error.message?.includes('rate limit')) {
      return 'RATE_LIMIT';
    }
    if (error.message?.includes('speech') || error.message?.includes('recognition')) {
      return 'SPEECH_ERROR';
    }
    return 'UNKNOWN_ERROR';
  }

  /**
   * Get user-friendly error message
   * @param {string} errorType - Error type
   * @param {Error} error - Original error
   * @returns {string} User-friendly message
   */
  static getUserMessage(errorType, error) {
    const messages = {
      NETWORK_ERROR: 'Unable to connect. Please check your internet.',
      AUTH_ERROR: 'Session expired. Please sign in again.',
      RATE_LIMIT: 'Too many requests. Please wait a moment.',
      SPEECH_ERROR: 'Could not understand. Please try again.',
      UNKNOWN_ERROR: 'Something went wrong. Please try again.'
    };
    
    return messages[errorType] || messages.UNKNOWN_ERROR;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ErrorHandler;
} else {
  // For ES6 modules
  window.ErrorHandler = ErrorHandler;
}

