/**
 * Options Page Script
 */

// Load settings on page load
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Options page loaded');
  
  await loadUserInfo();
  await loadSettings();
  setupEventListeners();
});

/**
 * Load user information
 */
async function loadUserInfo() {
  const user = await Auth.getUser();
  
  if (user) {
    document.getElementById('user-name').textContent = user.name || 'User';
    document.getElementById('user-email').textContent = user.email || '';
    
    if (user.picture) {
      document.getElementById('user-avatar').src = user.picture;
    }
  }
}

/**
 * Load saved settings
 */
async function loadSettings() {
  // Load auto-start setting
  const autoStart = await Storage.get('auto_start_listening');
  document.getElementById('auto-start').checked = autoStart || false;
  
  // Load confirmation mode
  const confirmMode = await Storage.get('confirmation_mode');
  document.getElementById('confirmation-mode').value = confirmMode || 'smart';
  
  // Load save history setting
  const saveHistory = await Storage.get('save_history');
  document.getElementById('save-history').checked = saveHistory !== false;
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Auto-start checkbox
  document.getElementById('auto-start').addEventListener('change', async (e) => {
    await Storage.set('auto_start_listening', e.target.checked);
    showNotification('Setting saved');
  });
  
  // Confirmation mode
  document.getElementById('confirmation-mode').addEventListener('change', async (e) => {
    await Storage.set('confirmation_mode', e.target.value);
    showNotification('Setting saved');
  });
  
  // Save history checkbox
  document.getElementById('save-history').addEventListener('change', async (e) => {
    await Storage.set('save_history', e.target.checked);
    showNotification('Setting saved');
  });
  
  // Logout button
  document.getElementById('logout-btn').addEventListener('click', async () => {
    if (confirm('Are you sure you want to logout?')) {
      await Auth.logout();
      showNotification('Logged out successfully');
      setTimeout(() => {
        window.close();
      }, 1000);
    }
  });
  
  // Clear data button
  document.getElementById('clear-data-btn').addEventListener('click', async () => {
    if (confirm('This will delete ALL your data. Are you sure?')) {
      await Storage.clear();
      await Auth.logout();
      showNotification('All data cleared');
      setTimeout(() => {
        window.close();
      }, 1000);
    }
  });
  
  // Support link
  document.getElementById('support-link').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'http://localhost:5173/support' });
  });
  
  // Privacy link
  document.getElementById('privacy-link').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'http://localhost:5173/privacy' });
  });
}

/**
 * Show notification
 */
function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);


