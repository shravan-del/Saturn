const ErrorHandler = {
  handle(error, context) {
    const type = this.categorize(error);
    if (typeof console !== 'undefined' && console.error) console.error('[' + type + ']', error, context || '');
    return this.getUserMessage(type, error);
  },

  categorize(error) {
    const msg = (error && error.message) ? String(error.message).toLowerCase() : '';
    const status = error && error.status;
    if (msg.indexOf('network') >= 0 || msg.indexOf('fetch') >= 0 || status === 0) return 'NETWORK_ERROR';
    if (status === 401 || msg.indexOf('auth') >= 0 || msg.indexOf('token') >= 0) return 'AUTH_ERROR';
    if (status === 429 || msg.indexOf('rate limit') >= 0) return 'RATE_LIMIT';
    if (msg.indexOf('speech') >= 0 || msg.indexOf('recognition') >= 0) return 'SPEECH_ERROR';
    if (status >= 500) return 'SERVER_ERROR';
    if (status >= 400) return 'CLIENT_ERROR';
    return 'UNKNOWN_ERROR';
  },

  getUserMessage(type, error) {
    const map = {
      NETWORK_ERROR: 'Unable to connect. Check your internet.',
      AUTH_ERROR: 'Session expired. Please sign in again.',
      RATE_LIMIT: 'Too many requests. Wait a moment.',
      SPEECH_ERROR: 'Could not understand. Try again.',
      SERVER_ERROR: 'Server error. Try again later.',
      CLIENT_ERROR: (error && error.message) ? error.message : 'Invalid request. Try again.',
      UNKNOWN_ERROR: 'Something went wrong. Try again.'
    };
    return map[type] || map.UNKNOWN_ERROR;
  },

  canRetry(error) {
    const type = this.categorize(error);
    return type === 'NETWORK_ERROR' || type === 'SERVER_ERROR' || type === 'RATE_LIMIT';
  }
};

if (typeof window !== 'undefined') window.ErrorHandler = ErrorHandler;
if (typeof module !== 'undefined' && module.exports) module.exports = ErrorHandler;
