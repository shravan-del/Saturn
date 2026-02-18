const APIConfig = typeof window !== 'undefined' && window.APIConfig ? window.APIConfig : {
  BASE_URL: 'http://localhost:8000',
  ENDPOINTS: { VOICE_COMMAND: '/voice/command', ACTIONS_LIST: '/actions/', ACTIONS_EXECUTE: '/actions/execute', ACTIONS_UNDO: '/actions/' },
  TIMEOUT: 30000,
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,
  RETRY_BACKOFF: 2
};

async function getToken() {
  if (typeof Auth !== 'undefined' && Auth.getToken) return await Auth.getToken();
  if (typeof Storage !== 'undefined' && Storage.get) return await Storage.get('vg_token');
  return null;
}

async function requestWithTimeout(url, options, timeoutMs) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: ctrl.signal });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

async function requestOnce(endpoint, options, timeoutMs) {
  const url = endpoint.startsWith('http') ? endpoint : APIConfig.BASE_URL + endpoint;
  const token = await getToken();
  const headers = { 'Content-Type': 'application/json', ...(options && options.headers) };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await requestWithTimeout(url, { ...options, headers }, timeoutMs || APIConfig.TIMEOUT || 30000);
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (_) {}
  if (!res.ok) {
    const err = new Error(data && data.detail ? (typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail)) : 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

async function request(endpoint, options, retriesLeft) {
  const timeout = APIConfig.TIMEOUT || 30000;
  const maxRetries = APIConfig.MAX_RETRIES != null ? APIConfig.MAX_RETRIES : 3;
  const delay = APIConfig.RETRY_DELAY_MS || 1000;
  const backoff = APIConfig.RETRY_BACKOFF || 2;
  let lastErr;
  let attempt = retriesLeft != null ? maxRetries - retriesLeft : 0;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await requestOnce(endpoint, options, timeout);
    } catch (e) {
      lastErr = e;
      const canRetry = (e.name === 'AbortError' || e.status >= 500 || e.status === 429) && attempt < maxRetries;
      if (!canRetry) throw e;
      attempt++;
      await new Promise(r => setTimeout(r, delay * Math.pow(backoff, i)));
    }
  }
  throw lastErr;
}

const API = {
  BASE_URL: APIConfig.BASE_URL,

  async request(endpoint, options) {
    return request(endpoint, options || {});
  },

  async undo(actionId) {
    const url = typeof APIConfig.undoUrl === 'function' ? APIConfig.undoUrl(actionId) : (APIConfig.BASE_URL + '/actions/' + actionId + '/undo');
    return request(url, { method: 'POST' });
  }
};

if (typeof window !== 'undefined') window.API = API;
if (typeof module !== 'undefined' && module.exports) module.exports = API;
