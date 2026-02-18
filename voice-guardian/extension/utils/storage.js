const C = typeof Constants !== 'undefined' ? Constants : { STORAGE: {}, ACTION_HISTORY_MAX: 50, UNDO_WINDOW_MS: 30000 };

const StorageManager = {
  async get(key) {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        const o = await chrome.storage.local.get(key);
        return o[key];
      }
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      return null;
    }
  },

  async set(key, value) {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        await chrome.storage.local.set({ [key]: value });
        return true;
      }
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  },

  async remove(key) {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        await chrome.storage.local.remove(key);
        return true;
      }
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  },

  async clear() {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        await chrome.storage.local.clear();
        return true;
      }
      localStorage.clear();
      return true;
    } catch (e) {
      return false;
    }
  }
};

const ActionHistory = {
  KEY: (C.STORAGE && C.STORAGE.ACTION_HISTORY) || 'vg_action_history',
  MAX: C.ACTION_HISTORY_MAX || 50,
  UNDO_MS: C.UNDO_WINDOW_MS || 30000,

  async add(entry) {
    const list = (await StorageManager.get(this.KEY)) || [];
    list.unshift({ ...entry, createdAt: Date.now() });
    const trimmed = list.slice(0, this.MAX);
    await StorageManager.set(this.KEY, trimmed);
    return trimmed;
  },

  async getAll() {
    return (await StorageManager.get(this.KEY)) || [];
  },

  async clear() {
    await StorageManager.set(this.KEY, []);
    return true;
  },

  canUndo(createdAt) {
    return createdAt && (Date.now() - createdAt) < this.UNDO_MS;
  }
};

const Storage = { ...StorageManager, ActionHistory };

if (typeof window !== 'undefined') {
  window.StorageManager = StorageManager;
  window.ActionHistory = ActionHistory;
  window.Storage = Storage;
}
if (typeof module !== 'undefined' && module.exports) module.exports = { StorageManager, ActionHistory, Storage };
