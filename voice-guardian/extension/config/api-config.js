const APIConfig = {
  BASE_URL: 'http://localhost:8000',
  ENDPOINTS: {
    VOICE_COMMAND: '/voice/command',
    ACTIONS_LIST: '/actions/',
    ACTIONS_EXECUTE: '/actions/execute',
    ACTIONS_UNDO: '/actions/'
  },
  TIMEOUT: 30000,
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,
  RETRY_BACKOFF: 2
};

APIConfig.undoUrl = function(id) {
  return this.BASE_URL + this.ENDPOINTS.ACTIONS_UNDO + id + '/undo';
};

if (typeof window !== 'undefined') window.APIConfig = APIConfig;
if (typeof module !== 'undefined' && module.exports) module.exports = APIConfig;
