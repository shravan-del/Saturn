/**
 * Voice Guardian - Security Utilities
 * Input validation, sanitization, token management
 * 
 * TODO: Implement security features
 * - Input sanitization
 * - Token validation
 * - Rate limiting
 */

class SecurityManager {
  /**
   * Sanitize user input to prevent XSS
   * @param {string} input - User input
   * @returns {string} Sanitized input
   */
  static sanitize(input) {
    if (typeof input !== 'string') return input;
    
    // Remove potential XSS vectors
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Validate token format
   * @param {string} token - JWT token
   * @returns {boolean} Is valid token
   */
  static isValidToken(token) {
    if (!token || typeof token !== 'string') return false;
    
    // JWT format check (rough)
    const parts = token.split('.');
    return parts.length === 3;
  }

  /**
   * Check if token is expired
   * @param {string} token - JWT token
   * @returns {boolean} Is expired
   */
  static isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convert to ms
      return Date.now() >= exp;
    } catch (e) {
      return true; // If can't parse, consider expired
    }
  }

  /**
   * Rate limiter for API calls
   */
  static rateLimiter = {
    calls: new Map(),
    
    /**
     * Check if request can be made
     * @param {string} key - Rate limit key (e.g., user ID)
     * @param {number} maxCalls - Max calls allowed
     * @param {number} windowMs - Time window in milliseconds
     * @returns {boolean} Can make request
     */
    canMakeRequest(key, maxCalls = 10, windowMs = 60000) {
      const now = Date.now();
      const userCalls = this.calls.get(key) || [];
      
      // Remove old calls outside window
      const recentCalls = userCalls.filter(time => now - time < windowMs);
      
      if (recentCalls.length >= maxCalls) {
        return false; // Rate limited
      }
      
      // Add this call
      recentCalls.push(now);
      this.calls.set(key, recentCalls);
      
      return true; // Allowed
    }
  };
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SecurityManager;
} else {
  // For ES6 modules
  window.SecurityManager = SecurityManager;
}

