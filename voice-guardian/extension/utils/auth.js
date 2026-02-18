const STORAGE_KEYS = typeof Constants !== 'undefined' && Constants.STORAGE
  ? Constants.STORAGE
  : { TOKEN: 'vg_token', USER: 'vg_user' };

async function getStorage() {
  if (typeof Storage !== 'undefined' && Storage.get) return Storage;
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    return {
      get: async (k) => {
        const o = await chrome.storage.local.get(k);
        if (o[k] != null) return o[k];
        try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return localStorage.getItem(k); }
      },
      set: (k, v) => chrome.storage.local.set({ [k]: v }),
      remove: (k) => chrome.storage.local.remove(k)
    };
  }
  return {
    get: async (k) => {
      try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return localStorage.getItem(k); }
    },
    set: (k, v) => { localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v)); },
    remove: (k) => { localStorage.removeItem(k); }
  };
}

const Auth = {
  async isAuthenticated() {
    const s = await getStorage();
    const token = await s.get(STORAGE_KEYS.TOKEN);
    const user = await s.get(STORAGE_KEYS.USER);
    return !!(token && user);
  },

  async getUser() {
    const s = await getStorage();
    return await s.get(STORAGE_KEYS.USER);
  },

  async getToken() {
    const s = await getStorage();
    return await s.get(STORAGE_KEYS.TOKEN);
  },

  async setSession(token, user) {
    const s = await getStorage();
    await s.set(STORAGE_KEYS.TOKEN, token);
    if (user) await s.set(STORAGE_KEYS.USER, user);
  },

  async logout() {
    const s = await getStorage();
    await s.remove(STORAGE_KEYS.TOKEN);
    await s.remove(STORAGE_KEYS.USER);
    if (typeof Storage !== 'undefined' && Storage.remove) {
      await Storage.remove(STORAGE_KEYS.ACTION_HISTORY || 'vg_action_history');
    }
    return true;
  }
};

if (typeof window !== 'undefined') window.Auth = Auth;
if (typeof module !== 'undefined' && module.exports) module.exports = Auth;
