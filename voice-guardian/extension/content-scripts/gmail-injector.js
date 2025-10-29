/**
 * Gmail Injector
 * Injects voice command button into Gmail
 */

(function() {
  console.log('Gmail injector loaded');

  // Wait for Gmail to load
  function waitForGmailLoad() {
    const checkInterval = setInterval(() => {
      const toolbar = document.querySelector('[role="toolbar"]');
      if (toolbar) {
        clearInterval(checkInterval);
        injectVoiceButton();
      }
    }, 1000);

    // Give up after 30 seconds
    setTimeout(() => clearInterval(checkInterval), 30000);
  }

  /**
   * Inject voice button into Gmail toolbar
   */
  function injectVoiceButton() {
    // Check if already injected
    if (document.getElementById('voice-guardian-btn')) {
      return;
    }

    const toolbar = document.querySelector('[role="toolbar"]');
    if (!toolbar) {
      console.log('Gmail toolbar not found');
      return;
    }

    // Create voice button
    const button = document.createElement('button');
    button.id = 'voice-guardian-btn';
    button.className = 'voice-guardian-inject-btn';
    button.innerHTML = '🎙️';
    button.title = 'Voice Guardian (Ctrl+Shift+V)';
    
    button.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'activate-voice' });
    });

    // Insert at beginning of toolbar
    toolbar.insertBefore(button, toolbar.firstChild);
    
    console.log('Voice button injected into Gmail');
  }

  // Start injection
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForGmailLoad);
  } else {
    waitForGmailLoad();
  }
})();


