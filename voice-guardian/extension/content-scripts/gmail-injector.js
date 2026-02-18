(function() {
  'use strict';

  function waitForToolbar(cb, maxWait) {
    const deadline = Date.now() + (maxWait || 15000);
    function check() {
      const toolbar = document.querySelector('[role="toolbar"]');
      if (toolbar) {
        cb(toolbar);
        return;
      }
      if (Date.now() < deadline) setTimeout(check, 500);
    }
    check();
  }

  function injectButton(toolbar) {
    if (document.getElementById('voice-guardian-gmail-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'voice-guardian-gmail-btn';
    btn.type = 'button';
    btn.title = 'Voice Guardian (Ctrl+Shift+V)';
    btn.textContent = 'Voice';
    btn.style.cssText = 'margin-right:8px;padding:6px 10px;cursor:pointer;';
    btn.addEventListener('click', function() {
      chrome.runtime.sendMessage({ action: 'activate-voice' });
    });
    toolbar.insertBefore(btn, toolbar.firstChild);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { waitForToolbar(injectButton); });
  } else {
    waitForToolbar(injectButton);
  }
})();
