const SettingsManager = {
  keys: {
    autoStart: 'auto_start_listening',
    confirmMode: 'confirmation_mode',
    saveHistory: 'save_history'
  },

  async loadSettings() {
    const storage = typeof Storage !== 'undefined' ? Storage : await getStorageFallback();
    const autoStart = await storage.get(this.keys.autoStart);
    const confirmMode = await storage.get(this.keys.confirmMode);
    const saveHistory = await storage.get(this.keys.saveHistory);

    const autoEl = document.getElementById('auto-start');
    const modeEl = document.getElementById('confirmation-mode');
    const historyEl = document.getElementById('save-history');
    if (autoEl) autoEl.checked = !!autoStart;
    if (modeEl) modeEl.value = confirmMode || 'smart';
    if (historyEl) historyEl.checked = saveHistory !== false;
  },

  async saveSettings(data) {
    const storage = typeof Storage !== 'undefined' ? Storage : await getStorageFallback();
    if (data.autoStart != null) await storage.set(this.keys.autoStart, data.autoStart);
    if (data.confirmMode != null) await storage.set(this.keys.confirmMode, data.confirmMode);
    if (data.saveHistory != null) await storage.set(this.keys.saveHistory, data.saveHistory);
  }
};

async function getStorageFallback() {
  if (typeof Storage !== 'undefined' && Storage.get) return Storage;
  const C = typeof Constants !== 'undefined' ? Constants : {};
  return {
    get: async (k) => {
      try {
        if (chrome.storage && chrome.storage.local) return (await chrome.storage.local.get(k))[k];
      } catch (e) {}
      try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return localStorage.getItem(k); }
    },
    set: async (k, v) => {
      try {
        if (chrome.storage && chrome.storage.local) return chrome.storage.local.set({ [k]: v });
      } catch (e) {}
      localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
    }
  };
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadUserInfo();
  await SettingsManager.loadSettings();
  setupEventListeners();
});

async function loadUserInfo() {
  const user = await Auth.getUser();
  const nameEl = document.getElementById('user-name');
  const emailEl = document.getElementById('user-email');
  const avatarEl = document.getElementById('user-avatar');
  if (nameEl) nameEl.textContent = (user && user.name) ? user.name : 'User';
  if (emailEl) emailEl.textContent = (user && user.email) ? user.email : '';
  if (avatarEl && user && user.picture) avatarEl.src = user.picture;
}

function setupEventListeners() {
  const autoEl = document.getElementById('auto-start');
  const modeEl = document.getElementById('confirmation-mode');
  const historyEl = document.getElementById('save-history');
  if (autoEl) {
    autoEl.addEventListener('change', async (e) => {
      await SettingsManager.saveSettings({ autoStart: e.target.checked });
      showNotification('Setting saved');
    });
  }
  if (modeEl) {
    modeEl.addEventListener('change', async (e) => {
      await SettingsManager.saveSettings({ confirmMode: e.target.value });
      showNotification('Setting saved');
    });
  }
  if (historyEl) {
    historyEl.addEventListener('change', async (e) => {
      await SettingsManager.saveSettings({ saveHistory: e.target.checked });
      showNotification('Setting saved');
    });
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      if (confirm('Log out?')) {
        await Auth.logout();
        showNotification('Logged out');
        setTimeout(() => window.close(), 1000);
      }
    });
  }

  const clearBtn = document.getElementById('clear-data-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', async () => {
      if (confirm('Clear all data? This cannot be undone.')) {
        if (typeof Storage !== 'undefined' && Storage.clear) await Storage.clear();
        await Auth.logout();
        showNotification('Data cleared');
        setTimeout(() => window.close(), 1000);
      }
    });
  }

  const supportLink = document.getElementById('support-link');
  if (supportLink) supportLink.addEventListener('click', (e) => { e.preventDefault(); chrome.tabs.create({ url: 'http://localhost:5173/support' }); });
  const privacyLink = document.getElementById('privacy-link');
  if (privacyLink) privacyLink.addEventListener('click', (e) => { e.preventDefault(); chrome.tabs.create({ url: 'http://localhost:5173/privacy' }); });
}

function showNotification(message) {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:#fff;padding:1rem 1.5rem;border-radius:8px;z-index:1000;';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}
