/**
 * Voice Guardian - Performance Monitoring & Optimization
 * Caching and performance tracking
 * 
 * TODO: Implement performance monitoring
 * - Performance timing
 * - Cache management
 * - Performance metrics
 */

class PerformanceMonitor {
  /**
   * Start performance timer
   * @param {string} label - Timer label
   */
  static startTimer(label) {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`${label}-start`);
    }
  }

  /**
   * End performance timer and log result
   * @param {string} label - Timer label
   * @returns {number} Duration in milliseconds
   */
  static endTimer(label) {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`${label}-end`);
      performance.measure(label, `${label}-start`, `${label}-end`);
      
      const measure = performance.getEntriesByName(label)[0];
      if (measure) {
        console.log(`⏱️ ${label}: ${measure.duration.toFixed(2)}ms`);
        return measure.duration;
      }
    }
    return 0;
  }

  /**
   * Measure async function performance
   * @param {string} label - Timer label
   * @param {Function} fn - Async function to measure
   * @returns {*} Function result
   */
  static async measureAsync(label, fn) {
    this.startTimer(label);
    try {
      const result = await fn();
      this.endTimer(label);
      return result;
    } catch (error) {
      this.endTimer(label);
      throw error;
    }
  }
}

/**
 * Cache Manager
 * Simple in-memory cache with TTL
 */
class CacheManager {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Set cache value with TTL
   * @param {string} key - Cache key
   * @param {*} value - Cache value
   * @param {number} ttlMs - Time to live in milliseconds
   */
  set(key, value, ttlMs = 60000) {
    this.cache.set(key, {
      value,
      expires: Date.now() + ttlMs
    });
  }

  /**
   * Get cache value
   * @param {string} key - Cache key
   * @returns {*} Cached value or null
   */
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  /**
   * Clear cache
   */
  clear() {
    this.cache.clear();
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PerformanceMonitor, CacheManager };
} else {
  // For ES6 modules
  window.PerformanceMonitor = PerformanceMonitor;
  window.CacheManager = CacheManager;
}

