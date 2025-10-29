/**
 * Calendar Injector
 * Injects voice command button into Google Calendar
 */

(function() {
  console.log('Calendar injector loaded');

  // Wait for Calendar to load
  function waitForCalendarLoad() {
    const checkInterval = setInterval(() => {
      const header = document.querySelector('[data-view-heading]');
      if (header) {
        clearInterval(checkInterval);
        injectVoiceButton();
      }
    }, 1000);

    setTimeout(() => clearInterval(checkInterval), 30000);
  }

  /**
   * Inject voice button into Calendar
   */
  function injectVoiceButton() {
    if (document.getElementById('voice-guardian-btn')) {
      return;
    }

    const header = document.querySelector('[data-view-heading]');
    if (!header) {
      console.log('Calendar header not found');
      return;
    }

    // Create floating voice button
    const button = document.createElement('button');
    button.id = 'voice-guardian-btn';
    button.className = 'voice-guardian-floating-btn';
    button.innerHTML = '🎙️';
    button.title = 'Voice Guardian - Quick Command';
    
    button.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'activate-voice' });
    });

    document.body.appendChild(button);
    
    console.log('Voice button injected into Calendar');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForCalendarLoad);
  } else {
    waitForCalendarLoad();
  }
})();


