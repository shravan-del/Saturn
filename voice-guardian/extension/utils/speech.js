/**
 * Voice Guardian - Speech Recognition Wrapper
 * Wraps Web Speech API with error handling
 * 
 * TODO: Enhance speech recognition wrapper
 * - Better error handling
 * - Language detection
 * - Continuous recognition
 */

class SpeechRecognitionService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    
    // Initialize Web Speech API
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
      this.recognition = new SpeechRecognition();
    } else {
      throw new Error('Speech recognition not supported in this browser');
    }
    
    this._configureRecognition();
  }

  /**
   * Configure recognition settings
   * @private
   */
  _configureRecognition() {
    if (!this.recognition) return;
    
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
  }

  /**
   * Start listening
   * @param {Function} onResult - Callback for results
   * @param {Function} onError - Callback for errors
   */
  start(onResult, onError) {
    if (!this.recognition) {
      onError(new Error('Speech recognition not available'));
      return;
    }

    if (this.isListening) {
      console.warn('Already listening');
      return;
    }

    this.isListening = true;
    
    this.recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      onResult(transcript);
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      onError(new Error(event.error));
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    this.recognition.start();
  }

  /**
   * Stop listening
   */
  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Check if currently listening
   */
  getListening() {
    return this.isListening;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SpeechRecognitionService;
} else {
  // For ES6 modules
  window.SpeechRecognitionService = SpeechRecognitionService;
}

