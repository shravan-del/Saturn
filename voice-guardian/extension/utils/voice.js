/**
 * Voice Recognition Utilities
 * Handles Web Speech API for voice input
 */

const Voice = {
  recognition: null,
  isListening: false,

  /**
   * Initialize speech recognition
   */
  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      throw new Error('Speech recognition not supported in this browser');
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    return this.recognition;
  },

  /**
   * Start listening
   */
  startListening(onResult, onError) {
    if (!this.recognition) {
      this.init();
    }

    if (this.isListening) {
      console.warn('Already listening');
      return;
    }

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      this.isListening = false;
      
      if (onResult) {
        onResult(transcript, confidence);
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      
      if (onError) {
        onError(event.error);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      console.error('Failed to start recognition:', error);
      this.isListening = false;
      if (onError) {
        onError(error);
      }
    }
  },

  /**
   * Stop listening
   */
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  },

  /**
   * Check if currently listening
   */
  getIsListening() {
    return this.isListening;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Voice;
}


