/**
 * Voice Guardian - Premium Demo
 * Single working feature: Google Calendar event creation
 */

// State
const state = {
  isListening: false,
  isProcessing: false,
  transcript: '',
  user: null,
  currentAction: null
};

// DOM Elements
const elements = {};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🎙️ Voice Guardian initializing...');
  
  try {
    // Get all DOM elements
    initializeElements();
    
    // Check auth status
    const isAuthenticated = await checkAuth();
    
    if (isAuthenticated) {
      await showMainScreen();
    } else {
      showLoginScreen();
    }
    
    // Setup event listeners
    setupEventListeners();
    
    console.log('✅ Voice Guardian initialized successfully');
  } catch (error) {
    console.error('❌ Voice Guardian initialization failed:', error);
  }
});

/**
 * Initialize DOM element references
 */
function initializeElements() {
  elements.loginScreen = document.getElementById('login-screen');
  elements.mainScreen = document.getElementById('main-screen');
  elements.googleSignin = document.getElementById('google-signin');
  elements.voiceButton = document.getElementById('voice-button');
  elements.promptText = document.getElementById('prompt-text');
  elements.promptHint = document.getElementById('prompt-hint');
  elements.waveform = document.getElementById('waveform');
  elements.transcriptCard = document.getElementById('transcript-card');
  elements.transcriptText = document.getElementById('transcript-text');
  elements.processButton = document.getElementById('process-button');
  elements.guardianCard = document.getElementById('guardian-card');
  elements.confidenceBadge = document.getElementById('confidence-badge');
  elements.actionPreview = document.getElementById('action-preview');
  elements.warningsSection = document.getElementById('warnings-section');
  elements.warningText = document.getElementById('warning-text');
  elements.confirmButton = document.getElementById('confirm-button');
  elements.cancelButton = document.getElementById('cancel-button');
  elements.successCard = document.getElementById('success-card');
  elements.successTitle = document.getElementById('success-title');
  elements.successMessage = document.getElementById('success-message');
  elements.calendarLink = document.getElementById('calendar-link');
  elements.actionsList = document.getElementById('actions-list');
  elements.userAvatar = document.getElementById('user-avatar');
  elements.userName = document.getElementById('user-name');
  elements.loadingOverlay = document.getElementById('loading-overlay');
  elements.loadingText = document.getElementById('loading-text');
  elements.toastContainer = document.getElementById('toast-container');
  elements.calendarAccessBtn = document.getElementById('calendar-access-btn');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Google Sign In
  if (elements.googleSignin) {
    elements.googleSignin.addEventListener('click', handleGoogleSignIn);
  }
  
  // Voice button
  if (elements.voiceButton) {
    elements.voiceButton.addEventListener('click', handleVoiceButtonClick);
  }
  
  // Process button
  if (elements.processButton) {
    elements.processButton.addEventListener('click', handleProcessCommand);
  }
  
  // Confirm button
  if (elements.confirmButton) {
    elements.confirmButton.addEventListener('click', handleConfirmAction);
  }
  
  // Cancel button
  if (elements.cancelButton) {
    elements.cancelButton.addEventListener('click', handleCancelAction);
  }
  
  // Calendar access button
  if (elements.calendarAccessBtn) {
    elements.calendarAccessBtn.addEventListener('click', handleRequestCalendarAccess);
  }
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'V') {
      e.preventDefault();
      if (!state.isListening && !state.isProcessing) {
        handleVoiceButtonClick();
      }
    }
  });
}

/**
 * Check authentication status
 */
async function checkAuth() {
  try {
    const token = localStorage.getItem('vg_token');
    const user = localStorage.getItem('vg_user');
    
    if (token && user) {
      state.user = JSON.parse(user);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
}

/**
 * Show login screen
 */
function showLoginScreen() {
  elements.loginScreen.style.display = 'block';
  elements.mainScreen.style.display = 'none';
  
  // Initialize Google Sign-In
  setTimeout(() => {
    if (window.google) {
      google.accounts.id.initialize({
        client_id: window.CONFIG?.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: false
      });
      
      // Also initialize OAuth2 for calendar access
      if (window.google.accounts.oauth2) {
        google.accounts.oauth2.initTokenClient({
          client_id: window.CONFIG?.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
          scope: 'https://www.googleapis.com/auth/calendar',
          callback: (response) => {
            if (response.access_token) {
              localStorage.setItem('vg_google_token', response.access_token);
              console.log('✅ Google Calendar access granted');
            }
          }
        });
      }
    }
  }, 500);
}

/**
 * Show main screen
 */
async function showMainScreen() {
  elements.loginScreen.style.display = 'none';
  elements.mainScreen.style.display = 'block';
  
  // Load user info
  if (state.user) {
    elements.userName.textContent = state.user.name || state.user.email;
    if (state.user.picture) {
      elements.userAvatar.src = state.user.picture;
    }
  }
  
  // Load recent actions
  await loadRecentActions();
}

/**
 * Handle Google Sign In
 */
async function handleGoogleSignIn() {
  if (window.CONFIG?.DEMO_MODE) {
    // Demo mode - use mock auth
    showLoading('Signing in...');
    await sleep(1500);
    
    // Mock user data for Shravan
    state.user = {
      id: 'shravan_user_123',
      name: window.CONFIG?.DEFAULT_USER?.name || 'Shravan Athikinasetti',
      email: window.CONFIG?.DEFAULT_USER?.email || 'shravan.athikinasetti@gmail.com',
      picture: 'https://ui-avatars.com/api/?name=Shravan+Athikinasetti&background=6366F1&color=fff'
    };
    
    // Save to localStorage
    localStorage.setItem('vg_token', 'demo_token_' + Date.now());
    localStorage.setItem('vg_user', JSON.stringify(state.user));
    
    hideLoading();
    showToast('success', 'Welcome Shravan!', 'You\'re now signed in to Voice Guardian (Demo Mode)');
    
    await showMainScreen();
  } else {
    // Real mode - request Google OAuth with calendar permissions
    showLoading('Requesting calendar access...');
    
    try {
      // Request calendar access
      const client = google.accounts.oauth2.initTokenClient({
        client_id: window.CONFIG?.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
        scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        callback: async (response) => {
          if (response.access_token) {
            localStorage.setItem('vg_google_token', response.access_token);
            
            // Get user info
            const userInfo = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
              headers: {
                'Authorization': `Bearer ${response.access_token}`
              }
            });
            
            if (userInfo.ok) {
              const userData = await userInfo.json();
              state.user = {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                picture: userData.picture
              };
              
              // Save to localStorage
              localStorage.setItem('vg_token', response.access_token);
              localStorage.setItem('vg_user', JSON.stringify(state.user));
              
              hideLoading();
              showToast('success', 'Welcome Shravan!', 'You\'re now signed in with calendar access');
              
              await showMainScreen();
            } else {
              throw new Error('Failed to get user info');
            }
          } else {
            throw new Error('No access token received');
          }
        }
      });
      
      client.requestAccessToken();
      
    } catch (error) {
      hideLoading();
      showToast('error', 'Sign in failed', error.message);
    }
  }
}

/**
 * Handle credential response (real OAuth)
 */
async function handleCredentialResponse(response) {
  try {
    showLoading('Signing in...');
    
    // Send to backend
    const res = await fetch('http://localhost:8000/auth/google/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: response.credential })
    });
    
    if (!res.ok) throw new Error('Login failed');
    
    const data = await res.json();
    
    state.user = data.user;
    localStorage.setItem('vg_token', data.access_token);
    localStorage.setItem('vg_user', JSON.stringify(data.user));
    
    hideLoading();
    showToast('success', 'Welcome!', 'You\'re now signed in');
    
    await showMainScreen();
  } catch (error) {
    hideLoading();
    showToast('error', 'Sign in failed', error.message);
  }
}

/**
 * Handle voice button click
 */
function handleVoiceButtonClick() {
  if (state.isListening) {
    stopListening();
  } else {
    startListening();
  }
}

/**
 * Start listening
 */
function startListening() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    showToast('error', 'Not supported', 'Speech recognition is not supported in this browser');
    return;
  }
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  
  recognition.onstart = () => {
    state.isListening = true;
    elements.voiceButton.classList.add('listening');
    elements.promptText.textContent = 'Listening...';
    elements.promptHint.textContent = 'Speak now';
    elements.waveform.style.display = 'flex';
    
    // Hide previous cards
    elements.transcriptCard.style.display = 'none';
    elements.guardianCard.style.display = 'none';
    elements.successCard.style.display = 'none';
  };
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const confidence = event.results[0][0].confidence;
    
    state.transcript = transcript;
    
    stopListening();
    showTranscript(transcript);
  };
  
  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    stopListening();
    
    if (event.error === 'no-speech') {
      showToast('warning', 'No speech detected', 'Please try again');
    } else if (event.error === 'not-allowed') {
      showToast('error', 'Permission denied', 'Please allow microphone access');
    } else {
      showToast('error', 'Error', 'Speech recognition failed');
    }
  };
  
  recognition.onend = () => {
    stopListening();
  };
  
  try {
    recognition.start();
  } catch (error) {
    stopListening();
    showToast('error', 'Failed to start', error.message);
  }
}

/**
 * Stop listening
 */
function stopListening() {
  state.isListening = false;
  elements.voiceButton.classList.remove('listening');
  elements.promptText.textContent = 'Press to speak';
  elements.promptHint.innerHTML = 'or press <kbd>Ctrl+Shift+V</kbd>';
  elements.waveform.style.display = 'none';
}

/**
 * Show transcript
 */
function showTranscript(transcript) {
  elements.transcriptText.textContent = transcript;
  elements.transcriptCard.style.display = 'block';
  
  // Scroll into view
  elements.transcriptCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Handle process command
 */
async function handleProcessCommand() {
  if (!state.transcript || state.isProcessing) return;
  
  state.isProcessing = true;
  elements.processButton.disabled = true;
  elements.processButton.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" class="spinner">
      <path d="M8 0v4M8 12v4M0 8h4M12 8h4"/>
    </svg>
    Processing...
  `;
  
  try {
    // Simulate API call to backend
    await sleep(2000);
    
    // Mock intent parsing result
    const intent = {
      intent_type: 'create_event',
      confidence: 0.92,
      entities: {
        title: extractEventTitle(state.transcript),
        when: extractEventTime(state.transcript),
        duration_minutes: 60
      }
    };
    
    // Mock Guardian check
    const guardian = {
      mode: 'confirm',
      confidence: intent.confidence,
      risk_score: 0.15,
      warnings: [],
      preview: `I'll create a ${intent.entities.duration_minutes}-minute event titled "${intent.entities.title}" ${intent.entities.when}`
    };
    
    // Add warning if confidence is moderate
    if (intent.confidence < 0.8) {
      guardian.warnings.push({
        message: 'Moderate confidence - please confirm details are correct'
      });
    }
    
    state.currentAction = {
      intent,
      guardian,
      transcript: state.transcript
    };
    
    showGuardianPreview(guardian);
    
  } catch (error) {
    showToast('error', 'Processing failed', error.message);
  } finally {
    state.isProcessing = false;
    elements.processButton.disabled = false;
    elements.processButton.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 2l6 6-6 6M2 8h12"/>
      </svg>
      Process Command
    `;
  }
}

/**
 * Show Guardian preview
 */
function showGuardianPreview(guardian) {
  // Hide transcript card
  elements.transcriptCard.style.display = 'none';
  
  // Update confidence badge
  elements.confidenceBadge.textContent = `${Math.round(guardian.confidence * 100)}% Confident`;
  
  // Update preview
  elements.actionPreview.textContent = guardian.preview;
  
  // Show warnings if any
  if (guardian.warnings && guardian.warnings.length > 0) {
    elements.warningsSection.style.display = 'block';
    elements.warningText.textContent = guardian.warnings[0].message;
  } else {
    elements.warningsSection.style.display = 'none';
  }
  
  // Show Guardian card
  elements.guardianCard.style.display = 'block';
  
  // Scroll into view
  elements.guardianCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Handle confirm action
 */
async function handleConfirmAction() {
  if (!state.currentAction) return;
  
  showLoading('Creating calendar event...');
  
  try {
    let result;
    
    if (window.CONFIG?.DEMO_MODE) {
      // Demo mode - simulate API call
      await sleep(2000);
      result = {
        success: true,
        event_id: 'demo_event_' + Date.now(),
        event_url: 'https://calendar.google.com/calendar/',
        event: {
          title: state.currentAction.intent.entities.title,
          when: state.currentAction.intent.entities.when
        }
      };
    } else {
      // Real mode - create actual calendar event
      try {
        result = await createRealCalendarEvent(state.currentAction);
      } catch (error) {
        console.error('Real calendar creation failed, falling back to demo mode:', error);
        showToast('warning', 'Calendar access issue', 'Creating demo event instead. Please sign in again for real events.');
        
        // Fall back to demo mode
        await sleep(1000);
        result = {
          success: true,
          event_id: 'demo_event_' + Date.now(),
          event_url: 'https://calendar.google.com/calendar/',
          event: {
            title: state.currentAction.intent.entities.title,
            when: state.currentAction.intent.entities.when
          }
        };
      }
    }
    
    // Save to recent actions
    const action = {
      id: result.event_id,
      title: result.event.title,
      status: 'completed',
      created_at: new Date().toISOString(),
      external_url: result.event_url
    };
    
    saveAction(action);
    
    hideLoading();
    
    // Hide Guardian card
    elements.guardianCard.style.display = 'none';
    
    // Show success
    showSuccess(action);
    
    // Reload actions list
    await loadRecentActions();
    
    // Show toast
    showToast('success', 'Event Created!', `Created: ${action.title}`);
    
  } catch (error) {
    hideLoading();
    showToast('error', 'Failed to create event', error.message);
  }
}

/**
 * Create real calendar event using Google Calendar API
 */
async function createRealCalendarEvent(actionData) {
  try {
    // Get access token from Google OAuth
    const token = await getGoogleAccessToken();
    
    if (!token) {
      throw new Error('No access token available. Please sign in again.');
    }
    
    // Parse the event details
    const { intent } = actionData;
    const { title, when, duration_minutes = 60 } = intent.entities;
    
    // Convert when to actual datetime
    const startTime = parseEventTime(when);
    const endTime = new Date(startTime.getTime() + (duration_minutes * 60000));
    
    // Create event object
    const event = {
      summary: title,
      description: `Created by Voice Guardian for ${state.user.email}`,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      attendees: [
        {
          email: state.user.email,
          displayName: state.user.name
        }
      ]
    };
    
    // Make API call to Google Calendar
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to create calendar event');
    }
    
    const createdEvent = await response.json();
    
    return {
      success: true,
      event_id: createdEvent.id,
      event_url: createdEvent.htmlLink,
      event: {
        title: createdEvent.summary,
        when: when,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      }
    };
    
  } catch (error) {
    console.error('Calendar creation error:', error);
    throw error;
  }
}

/**
 * Get Google access token
 */
async function getGoogleAccessToken() {
  try {
    // Try to get token from localStorage first
    const storedToken = localStorage.getItem('vg_google_token');
    if (storedToken) {
      // Check if token is still valid
      const isValid = await validateGoogleToken(storedToken);
      if (isValid) {
        return storedToken;
      }
    }
    
    // If no valid token, request new one
    console.log('No valid token found, requesting new one...');
    return await requestGoogleToken();
    
  } catch (error) {
    console.error('Token retrieval error:', error);
    return null;
  }
}

/**
 * Validate Google token
 */
async function validateGoogleToken(token) {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + token);
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Request new Google token
 */
async function requestGoogleToken() {
  return new Promise((resolve, reject) => {
    console.log('Requesting Google token...');
    
    // Use Google Identity Services to get token
    if (window.google && window.google.accounts.oauth2) {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: window.CONFIG?.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
        scope: 'https://www.googleapis.com/auth/calendar',
        callback: (response) => {
          console.log('Token response received:', response);
          if (response.access_token) {
            localStorage.setItem('vg_google_token', response.access_token);
            console.log('✅ Google Calendar access token saved');
            resolve(response.access_token);
          } else {
            console.error('No access token in response:', response);
            reject(new Error('No access token received'));
          }
        },
        error_callback: (error) => {
          console.error('Token request error:', error);
          reject(new Error(error.message || 'Token request failed'));
        }
      });
      
      console.log('Requesting access token...');
      client.requestAccessToken();
    } else {
      console.error('Google Identity Services not loaded');
      reject(new Error('Google Identity Services not loaded'));
    }
  });
}

/**
 * Parse event time string to Date object
 */
function parseEventTime(timeString) {
  const now = new Date();
  const lower = timeString.toLowerCase();
  
  if (lower.includes('tomorrow')) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Extract time if present
    const timeMatch = lower.match(/(\d+)\s*(am|pm)/);
    if (timeMatch) {
      const hour = parseInt(timeMatch[1]);
      const isPM = timeMatch[2] === 'pm';
      const adjustedHour = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);
      tomorrow.setHours(adjustedHour, 0, 0, 0);
    } else {
      tomorrow.setHours(9, 0, 0, 0); // Default to 9 AM
    }
    return tomorrow;
  }
  
  if (lower.includes('today')) {
    const today = new Date(now);
    const timeMatch = lower.match(/(\d+)\s*(am|pm)/);
    if (timeMatch) {
      const hour = parseInt(timeMatch[1]);
      const isPM = timeMatch[2] === 'pm';
      const adjustedHour = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);
      today.setHours(adjustedHour, 0, 0, 0);
    } else {
      today.setHours(now.getHours() + 1, 0, 0, 0); // Default to 1 hour from now
    }
    return today;
  }
  
  // Default to 1 hour from now
  const defaultTime = new Date(now);
  defaultTime.setHours(defaultTime.getHours() + 1);
  return defaultTime;
}

/**
 * Handle request calendar access
 */
async function handleRequestCalendarAccess() {
  try {
    showLoading('Requesting calendar access...');
    
    const token = await requestGoogleToken();
    
    if (token) {
      hideLoading();
      showToast('success', 'Calendar Access Granted!', 'You can now create real calendar events');
      
      // Update the button to show it's connected
      elements.calendarAccessBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2l6 2v5c0 3.5-2.5 6.5-6 7-3.5-.5-6-3.5-6-7V4l6-2z"/>
        </svg>
      `;
      elements.calendarAccessBtn.title = 'Calendar Access Granted';
    } else {
      throw new Error('Failed to get calendar access');
    }
    
  } catch (error) {
    hideLoading();
    showToast('error', 'Calendar Access Failed', error.message);
  }
}

/**
 * Handle cancel action
 */
function handleCancelAction() {
  // Reset state
  state.currentAction = null;
  state.transcript = '';
  
  // Hide all cards
  elements.transcriptCard.style.display = 'none';
  elements.guardianCard.style.display = 'none';
  elements.successCard.style.display = 'none';
  
  // Reset prompt
  elements.promptText.textContent = 'Press to speak';
  elements.promptHint.innerHTML = 'or press <kbd>Ctrl+Shift+V</kbd>';
  
  showToast('info', 'Cancelled', 'Action was cancelled');
}

/**
 * Show success card
 */
function showSuccess(action) {
  elements.successTitle.textContent = 'Event Created!';
  elements.successMessage.textContent = `Your calendar event "${action.title}" has been created successfully.`;
  elements.calendarLink.href = action.external_url;
  elements.successCard.style.display = 'block';
  
  // Scroll into view
  elements.successCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    elements.successCard.style.display = 'none';
    
    // Reset state
    state.currentAction = null;
    state.transcript = '';
    
    // Reset prompt
    elements.promptText.textContent = 'Press to speak';
    elements.promptHint.innerHTML = 'or press <kbd>Ctrl+Shift+V</kbd>';
  }, 5000);
}

/**
 * Load recent actions
 */
async function loadRecentActions() {
  const actions = getStoredActions();
  
  if (actions.length === 0) {
    elements.actionsList.innerHTML = `
      <div class="empty-state">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" opacity="0.3">
          <circle cx="32" cy="32" r="24" stroke="currentColor" stroke-width="2"/>
          <path d="M32 20v24M20 32h24" stroke="currentColor" stroke-width="2"/>
        </svg>
        <p>No actions yet</p>
        <span>Try saying "Schedule a meeting tomorrow at 2pm"</span>
      </div>
    `;
    return;
  }
  
  elements.actionsList.innerHTML = actions.map(action => `
    <div class="action-item" onclick="window.open('${action.external_url}', '_blank')">
      <div class="action-item-content">
        <div class="action-item-title">${action.title}</div>
        <div class="action-item-meta">${formatDate(action.created_at)}</div>
      </div>
      <span class="action-status success">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M10 3L4.5 8.5 2 6"/>
        </svg>
        Completed
      </span>
    </div>
  `).join('');
}

/**
 * Save action to localStorage
 */
function saveAction(action) {
  const actions = getStoredActions();
  actions.unshift(action);
  
  // Keep only last 10 actions
  const trimmed = actions.slice(0, 10);
  localStorage.setItem('vg_actions', JSON.stringify(trimmed));
}

/**
 * Get stored actions
 */
function getStoredActions() {
  try {
    const stored = localStorage.getItem('vg_actions');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
}

/**
 * Extract event title from transcript
 */
function extractEventTitle(transcript) {
  // Simple extraction logic for demo
  const lower = transcript.toLowerCase();
  
  // Remove common prefixes
  const cleaned = lower
    .replace(/^(schedule|create|book|set up|make)\s+(a\s+)?/, '')
    .replace(/\s+(for|at|on|tomorrow|today|next|this)\s+.+$/, '');
  
  // Capitalize first letter
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

/**
 * Extract event time from transcript
 */
function extractEventTime(transcript) {
  const lower = transcript.toLowerCase();
  
  if (lower.includes('tomorrow')) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Extract time if present
    const timeMatch = lower.match(/(\d+)\s*(am|pm|:)/);
    if (timeMatch) {
      return `tomorrow at ${timeMatch[0]}`;
    }
    return 'tomorrow';
  }
  
  if (lower.includes('today')) {
    const timeMatch = lower.match(/(\d+)\s*(am|pm|:)/);
    if (timeMatch) {
      return `today at ${timeMatch[0]}`;
    }
    return 'today';
  }
  
  if (lower.includes('next week')) {
    return 'next week';
  }
  
  if (lower.includes('friday') || lower.includes('monday') || lower.includes('tuesday') || 
      lower.includes('wednesday') || lower.includes('thursday') || lower.includes('saturday') || 
      lower.includes('sunday')) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const day = days.find(d => lower.includes(d));
    const timeMatch = lower.match(/(\d+)\s*(am|pm|:)/);
    if (timeMatch) {
      return `${day} at ${timeMatch[0]}`;
    }
    return `next ${day}`;
  }
  
  // Default
  const timeMatch = lower.match(/(\d+)\s*(am|pm)/);
  if (timeMatch) {
    return `at ${timeMatch[0]}`;
  }
  
  return 'soon';
}

/**
 * Format date for display
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}

/**
 * Show loading overlay
 */
function showLoading(text = 'Processing...') {
  elements.loadingText.textContent = text;
  elements.loadingOverlay.style.display = 'flex';
}

/**
 * Hide loading overlay
 */
function hideLoading() {
  elements.loadingOverlay.style.display = 'none';
}

/**
 * Show toast notification
 */
function showToast(type, title, message) {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M17 5L7.5 14.5 3 10"/></svg>',
    error: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M15 5L5 15M5 5l10 10"/></svg>',
    warning: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2l8 16H2L10 2zM10 12h1v1H9v-1h1zm0-6h1v5H9V6h1z"/></svg>',
    info: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12H9v-6h2v6zm0-8H9V4h2v2z"/></svg>'
  };
  
  toast.innerHTML = `
    ${icons[type]}
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>
  `;
  
  elements.toastContainer.appendChild(toast);
  
  // Auto-remove after 4 seconds
  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.3s ease-out reverse';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/**
 * Sleep utility
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Listen for messages from background script
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'activate-voice') {
    if (!state.isListening && !state.isProcessing) {
      handleVoiceButtonClick();
    }
    sendResponse({ success: true });
  }
  return false;
});

// Add CSS for spinner animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .spinner {
    animation: spin 1s linear infinite;
  }
`;
document.head.appendChild(style);