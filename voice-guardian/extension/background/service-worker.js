const LOG_PREFIX = 'VoiceGuardian';

function log(msg, data) {
  if (typeof console !== 'undefined' && console.log) {
    if (data != null) console.log(LOG_PREFIX, msg, data);
    else console.log(LOG_PREFIX, msg);
  }
}

function logError(msg, err) {
  if (typeof console !== 'undefined' && console.error) console.error(LOG_PREFIX, msg, err || '');
}

chrome.runtime.onInstalled.addListener(() => {
  log('extension installed');
});

chrome.commands.onCommand.addListener((command) => {
  if (command === 'activate-voice') {
    log('keyboard shortcut: activate-voice');
    chrome.action.openPopup?.() || chrome.windows.getCurrent((w) => {
      if (w) chrome.action.openPopup();
    }).catch(() => {});
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.action === 'activate-voice') {
    chrome.action.openPopup?.() || sendResponse({ ok: false });
    return true;
  }
  if (msg && msg.action === 'ping') {
    sendResponse({ ok: true });
    return false;
  }
  return false;
});

chrome.runtime.onError?.addListener((err) => {
  logError('runtime error', err);
});
