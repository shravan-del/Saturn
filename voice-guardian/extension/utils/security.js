const SecurityManager = {
  sanitize(input) {
    if (typeof input !== 'string') return input;
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  isValidToken(token) {
    if (!token || typeof token !== 'string') return false;
    return token.split('.').length === 3;
  },

  isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= (payload.exp * 1000);
    } catch (e) {
      return true;
    }
  },

  rateLimiter: {
    calls: new Map(),
    canMakeRequest(key, maxCalls, windowMs) {
      const now = Date.now();
      const limit = maxCalls != null ? maxCalls : 30;
      const window = windowMs != null ? windowMs : 60000;
      let list = this.calls.get(key) || [];
      list = list.filter(t => now - t < window);
      if (list.length >= limit) return false;
      list.push(now);
      this.calls.set(key, list);
      return true;
    }
  }
};

if (typeof window !== 'undefined') window.SecurityManager = SecurityManager;
if (typeof module !== 'undefined' && module.exports) module.exports = SecurityManager;
