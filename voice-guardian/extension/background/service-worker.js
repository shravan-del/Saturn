/**
 * Background service worker
 */

console.log('Voice Guardian service worker initialized');

// Listen for keyboard command
chrome.commands.onCommand.addListener((command) => {
  if (command === 'activate-voice') {
    console.log('Voice command activated via keyboard');
    
    // Open popup
    chrome.action.openPopup();
  }
});

// Keep service worker alive
const keepAlive = () => {
  setInterval(() => {
    chrome.runtime.getPlatformInfo(() => {
      // Just to keep alive
    });
  }, 20000);
};

keepAlive();