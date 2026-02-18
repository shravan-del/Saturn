const Constants = {
  API: {
    BASE_URL: 'http://localhost:8000',
    TIMEOUT: 30000,
    MAX_RETRIES: 3
  },
  GUARDIAN: {
    AUTO: 0.19,
    CONFIRM: 0.49,
    BLOCK: 1.0,
    MIN_DURATION_MIN: 1,
    MAX_DURATION_MIN: 480,
    SHORT_EVENT_MIN: 15,
    LONG_EVENT_MIN: 240
  },
  STORAGE: {
    TOKEN: 'vg_token',
    USER: 'vg_user',
    SETTINGS: 'vg_settings',
    ACTION_HISTORY: 'vg_action_history',
    DEMO_MODE: 'demo_mode',
    AUTO_START: 'auto_start_listening',
    CONFIRM_MODE: 'confirmation_mode',
    SAVE_HISTORY: 'save_history'
  },
  ACTION_HISTORY_MAX: 50,
  UNDO_WINDOW_MS: 30000,
  CACHE_TTL_MS: 60000,
  RATE_LIMIT_CALLS: 30,
  RATE_LIMIT_WINDOW_MS: 60000
};

if (typeof window !== 'undefined') window.Constants = Constants;
if (typeof module !== 'undefined' && module.exports) module.exports = Constants;
