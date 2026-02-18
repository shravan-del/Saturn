const PerformanceMonitor = {
  startTimer(label) {
    if (typeof performance !== 'undefined' && performance.mark) performance.mark(label + '-start');
  },

  endTimer(label) {
    if (typeof performance === 'undefined' || !performance.measure) return 0;
    try {
      performance.mark(label + '-end');
      performance.measure(label, label + '-start', label + '-end');
      const entries = performance.getEntriesByName(label);
      return entries.length ? entries[0].duration : 0;
    } catch (e) {
      return 0;
    }
  },

  async measureAsync(label, fn) {
    this.startTimer(label);
    try {
      const out = await fn();
      this.endTimer(label);
      return out;
    } catch (e) {
      this.endTimer(label);
      throw e;
    }
  }
};

class CacheManager {
  constructor(ttlMs) {
    this.cache = new Map();
    this.ttl = ttlMs != null ? ttlMs : 60000;
  }

  set(key, value, ttlMs) {
    const ttl = ttlMs != null ? ttlMs : this.ttl;
    this.cache.set(key, { value, expires: Date.now() + ttl });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  clear() {
    this.cache.clear();
  }
}

if (typeof window !== 'undefined') {
  window.PerformanceMonitor = PerformanceMonitor;
  window.CacheManager = CacheManager;
}
if (typeof module !== 'undefined' && module.exports) module.exports = { PerformanceMonitor, CacheManager };
