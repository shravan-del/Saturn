# 👨‍💻 Engineer 1 - Voice UI & Calendar Logic

## **YOUR ROLE**

You are **Engineer 1** - Voice Interface & Calendar Integration
- **You own**: Voice UI, calendar logic, onboarding, Guardian frontend
- **You work with**: Engineer 2 on shared components and API integration
- **Your goal**: Build the voice command interface and calendar integration

---

## **📁 YOUR FILES (You Own These)**

### **Frontend Files:**
```
extension/
├── popup/
│   ├── popup.html          ⭐ YOU OWN - Main UI structure
│   ├── popup.css           ⭐ YOU OWN - All styling
│   └── popup.js            ⭐ YOU OWN - Voice UI logic
│
└── content-scripts/
    ├── calendar-injector.js  ⭐ YOU OWN - Calendar page integration
    └── styles.css            🤝 SHARED - Coordinate styling
```

### **Backend Files:**
```
extension/
├── utils/
│   ├── voice.js             ⭐ YOU OWN - Voice recognition
│   ├── calendar.js          ⭐ YOU OWN - Google Calendar API
│   ├── guardian-ui.js       ⭐ YOU OWN - Guardian UI helpers
│   └── speech.js            ⭐ YOU OWN - Speech synthesis
│
└── config/
    └── voice-config.js      ⭐ YOU OWN - Voice settings
```

### **Shared Responsibilities:**
```
extension/utils/
├── api.js                   🤝 Both use, Engineer 2 maintains
├── storage.js               🤝 Both use, Engineer 2 maintains
└── error-handler.js         🤝 Both use, Engineer 2 maintains
```

---

## **🎫 TICKET SYSTEM**

Each ticket below represents a separate branch. Create a branch for each ticket using the format:
```bash
git checkout -b eng1/ticket-XX-short-name
```

---

## **📋 WEEK 1 TICKETS**

### **TICKET #E1-01: Voice Button UI**
**Branch**: `eng1/ticket-01-voice-button-ui`  
**Priority**: High  
**Estimated Time**: 4-6 hours  
**Dependencies**: None

**Description:**
Create the main voice button UI component with animations and states.

**Acceptance Criteria:**
- [ ] 120px circular voice button with purple gradient
- [ ] Pulsing animation when listening
- [ ] Ripple effect on click
- [ ] Waveform visualization during speech
- [ ] Status indicators (idle, listening, processing)
- [ ] Button is responsive and accessible

**Files to Create/Modify:**
- `extension/popup/popup.html` - Add voice button HTML
- `extension/popup/popup.css` - Add voice button styles
- `extension/popup/popup.js` - Add voice button event handlers

**Testing:**
- Test button in Chrome extension popup
- Verify all animations work smoothly
- Test on different screen sizes

---

### **TICKET #E1-02: Voice Recognition Wrapper**
**Branch**: `eng1/ticket-02-voice-recognition`  
**Priority**: High  
**Estimated Time**: 3-4 hours  
**Dependencies**: None

**Description:**
Create voice recognition wrapper using Web Speech API.

**Acceptance Criteria:**
- [ ] VoiceRecognition class created
- [ ] Start/stop listening methods work
- [ ] Real-time transcript callback works
- [ ] Error handling for microphone permissions
- [ ] Error handling for unsupported browsers
- [ ] Returns transcript as promise

**Files to Create:**
- `extension/utils/voice.js` - Voice recognition wrapper

**Code Structure:**
```javascript
class VoiceRecognition {
  constructor() {
    this.recognition = new webkitSpeechRecognition();
    this.setupRecognition();
  }
  
  async start() {
    // Start listening
    // Return promise with transcript
  }
  
  stop() {
    // Stop listening
  }
  
  onResult(callback) {
    // Handle results in real-time
  }
}
```

**Testing:**
- Test in Chrome with real microphone
- Test error cases (no permission, no mic)
- Test transcript accuracy

---

### **TICKET #E1-03: Command Display UI**
**Branch**: `eng1/ticket-03-command-display`  
**Priority**: High  
**Estimated Time**: 3-4 hours  
**Dependencies**: #E1-01, #E1-02

**Description:**
Display transcribed text as user speaks with edit capability.

**Acceptance Criteria:**
- [ ] Show transcribed text in real-time
- [ ] Display confidence score
- [ ] Allow manual text edit before submit
- [ ] Clear button to reset transcript
- [ ] Visual feedback during transcription
- [ ] Edit mode with save/cancel buttons

**Files to Create/Modify:**
- `extension/popup/popup.html` - Add transcript display area
- `extension/popup/popup.css` - Style transcript display
- `extension/popup/popup.js` - Add transcript display logic

**Testing:**
- Test real-time transcription
- Test edit functionality
- Test clear button
- Test confidence score display

---

### **TICKET #E1-04: Speech Synthesis**
**Branch**: `eng1/ticket-04-speech-synthesis`  
**Priority**: Medium  
**Estimated Time**: 2-3 hours  
**Dependencies**: None

**Description:**
Create speech synthesis wrapper for text-to-speech confirmations.

**Acceptance Criteria:**
- [ ] SpeechSynthesis class created
- [ ] Speak method with text-to-speech
- [ ] Stop method to cancel speech
- [ ] Configurable voice options
- [ ] Error handling for unsupported browsers

**Files to Create:**
- `extension/utils/speech.js` - Speech synthesis wrapper

**Code Structure:**
```javascript
class SpeechSynthesis {
  speak(text, options = {}) {
    // Text-to-speech for confirmations
  }
  
  stop() {
    // Stop current speech
  }
}
```

**Testing:**
- Test speech output
- Test stop functionality
- Test different voices

---

### **TICKET #E1-05: Calendar Service - Create Event**
**Branch**: `eng1/ticket-05-calendar-create`  
**Priority**: High  
**Estimated Time**: 4-5 hours  
**Dependencies**: Engineer 2's API wrapper

**Description:**
Create Google Calendar service wrapper for event creation.

**Acceptance Criteria:**
- [ ] GoogleCalendarService class created
- [ ] createEvent method calls backend API
- [ ] Event formatting for Google Calendar API
- [ ] Error handling for API failures
- [ ] Returns formatted event response
- [ ] Handles timezone conversion

**Files to Create:**
- `extension/utils/calendar.js` - Calendar API wrapper

**Code Structure:**
```javascript
class GoogleCalendarService {
  async createEvent(eventDetails) {
    // Call backend: POST /actions/execute
    // Parse response
    // Return formatted event
  }
}
```

**Testing:**
- Test event creation with real API
- Test error handling
- Test timezone handling

---

### **TICKET #E1-06: Calendar Service - Conflict Detection**
**Branch**: `eng1/ticket-06-calendar-conflicts`  
**Priority**: Medium  
**Estimated Time**: 3-4 hours  
**Dependencies**: #E1-05

**Description:**
Add conflict detection to calendar service.

**Acceptance Criteria:**
- [ ] checkConflicts method implemented
- [ ] Queries existing calendar events
- [ ] Detects overlapping events
- [ ] Returns conflict list with details
- [ ] Handles timezone correctly

**Files to Modify:**
- `extension/utils/calendar.js` - Add conflict detection

**Code Structure:**
```javascript
async checkConflicts(startTime, endTime) {
  // Query calendar for overlaps
  // Return conflict list
}
```

**Testing:**
- Test with overlapping events
- Test with no conflicts
- Test timezone edge cases

---

### **TICKET #E1-07: Calendar Service - Delete Event (Undo)**
**Branch**: `eng1/ticket-07-calendar-delete`  
**Priority**: Medium  
**Estimated Time**: 2-3 hours  
**Dependencies**: #E1-05

**Description:**
Add delete event method for undo functionality.

**Acceptance Criteria:**
- [ ] deleteEvent method implemented
- [ ] Calls backend API to delete event
- [ ] Handles errors gracefully
- [ ] Returns success/failure status
- [ ] Works with event ID from creation

**Files to Modify:**
- `extension/utils/calendar.js` - Add delete method

**Code Structure:**
```javascript
async deleteEvent(eventId) {
  // For undo functionality
  // Delete event from calendar
}
```

**Testing:**
- Test event deletion
- Test with invalid event ID
- Test error handling

---

### **TICKET #E1-08: Event Preview UI**
**Branch**: `eng1/ticket-08-event-preview`  
**Priority**: High  
**Estimated Time**: 4-5 hours  
**Dependencies**: #E1-05

**Description:**
Display event preview before creation with edit capability.

**Acceptance Criteria:**
- [ ] Show event details (title, date, time, duration)
- [ ] Edit button for each field
- [ ] Color-coded status (auto/confirm/block)
- [ ] Preview matches Guardian validation mode
- [ ] Save/cancel buttons for edits
- [ ] Visual feedback for changes

**Files to Create/Modify:**
- `extension/popup/popup.html` - Add event preview card
- `extension/popup/popup.css` - Style event preview
- `extension/popup/popup.js` - Add preview display logic

**Testing:**
- Test preview display
- Test edit functionality
- Test color coding
- Test with different Guardian modes

---

### **TICKET #E1-09: Success State UI**
**Branch**: `eng1/ticket-09-success-state`  
**Priority**: High  
**Estimated Time**: 3-4 hours  
**Dependencies**: #E1-05, #E1-07

**Description:**
Create success state UI after event creation with undo button.

**Acceptance Criteria:**
- [ ] Show success message with event details
- [ ] "View in Calendar" link opens Google Calendar
- [ ] Undo button (30-second countdown timer)
- [ ] Confetti animation on success
- [ ] Undo button calls delete event API
- [ ] Timer updates in real-time

**Files to Create/Modify:**
- `extension/popup/popup.html` - Add success card
- `extension/popup/popup.css` - Style success state
- `extension/popup/popup.js` - Add success logic

**Testing:**
- Test success display
- Test undo functionality
- Test countdown timer
- Test calendar link

---

### **TICKET #E1-10: Guardian Preview Card UI**
**Branch**: `eng1/ticket-10-guardian-preview`  
**Priority**: High  
**Estimated Time**: 4-5 hours  
**Dependencies**: Engineer 2's Guardian system

**Description:**
Display Guardian validation results in UI card.

**Acceptance Criteria:**
- [ ] Show validation mode (auto/confirm/block)
- [ ] Display risk score with color coding
- [ ] List warnings and blockers
- [ ] Show action preview text
- [ ] Color coding:
  - Auto mode: green border
  - Confirm mode: yellow border
  - Block mode: red border
- [ ] Icons for each mode

**Files to Create/Modify:**
- `extension/popup/popup.html` - Add Guardian preview card
- `extension/popup/popup.css` - Style Guardian card
- `extension/popup/popup.js` - Add Guardian display logic

**Testing:**
- Test with all three modes
- Test color coding
- Test warning display
- Test blocker display

---

### **TICKET #E1-11: Guardian UI Helpers**
**Branch**: `eng1/ticket-11-guardian-ui-helpers`  
**Priority**: Medium  
**Estimated Time**: 2-3 hours  
**Dependencies**: #E1-10

**Description:**
Create helper functions for Guardian UI formatting.

**Acceptance Criteria:**
- [ ] GuardianUI class created
- [ ] formatMode method returns icon + text
- [ ] formatRiskScore method returns color class
- [ ] formatWarnings method formats warnings list
- [ ] All methods return user-friendly strings

**Files to Create:**
- `extension/utils/guardian-ui.js` - Guardian UI helpers

**Code Structure:**
```javascript
class GuardianUI {
  static formatMode(mode) {
    // Return icon + text for mode
  }
  
  static formatRiskScore(score) {
    // Return color class based on score
  }
  
  static formatWarnings(warnings) {
    // Format warnings list for display
  }
}
```

**Testing:**
- Test all formatting methods
- Test with different inputs
- Test edge cases

---

## **📋 WEEK 2 TICKETS**

### **TICKET #E1-12: Onboarding Welcome Screen**
**Branch**: `eng1/ticket-12-onboarding-welcome`  
**Priority**: Medium  
**Estimated Time**: 3-4 hours  
**Dependencies**: None

**Description:**
Create welcome screen for first-time users.

**Acceptance Criteria:**
- [ ] Welcome screen HTML created
- [ ] 3-step tutorial overlay
- [ ] Step 1: Sign in with Google
- [ ] Step 2: Try a voice command
- [ ] Step 3: Confirm and create
- [ ] Skip button for returning users
- [ ] Styled to match design system

**Files to Create/Modify:**
- `extension/popup/popup.html` - Add welcome screen
- `extension/popup/popup.css` - Style welcome screen
- `extension/popup/popup.js` - Add welcome logic

**Testing:**
- Test first-time user flow
- Test skip functionality
- Test tutorial steps

---

### **TICKET #E1-13: Onboarding Tutorial Logic**
**Branch**: `eng1/ticket-13-onboarding-tutorial`  
**Priority**: Medium  
**Estimated Time**: 4-5 hours  
**Dependencies**: #E1-12

**Description:**
Implement tutorial logic with step-by-step guidance.

**Acceptance Criteria:**
- [ ] Detect first-time users
- [ ] Show/hide tutorial steps
- [ ] Highlight UI elements with spotlight
- [ ] Mark tutorial complete in storage
- [ ] Progress indicator
- [ ] Next/Previous buttons

**Files to Modify:**
- `extension/popup/popup.js` - Add tutorial logic

**Testing:**
- Test tutorial flow
- Test storage persistence
- Test returning users (no tutorial)

---

### **TICKET #E1-14: Calendar Page Detection**
**Branch**: `eng1/ticket-14-calendar-detection`  
**Priority**: Medium  
**Estimated Time**: 2-3 hours  
**Dependencies**: None

**Description:**
Detect when user is on Google Calendar page.

**Acceptance Criteria:**
- [ ] CalendarInjector class created
- [ ] detectCalendarPage method works
- [ ] Detects Google Calendar URL
- [ ] Returns boolean result
- [ ] Handles different calendar URLs

**Files to Create:**
- `extension/content-scripts/calendar-injector.js` - Calendar detection

**Code Structure:**
```javascript
class CalendarInjector {
  detectCalendarPage() {
    // Check if on Google Calendar
  }
}
```

**Testing:**
- Test on Google Calendar page
- Test on other pages
- Test different calendar URLs

---

### **TICKET #E1-15: Calendar Page Quick Add Button**
**Branch**: `eng1/ticket-15-calendar-quick-add`  
**Priority**: Medium  
**Estimated Time**: 4-5 hours  
**Dependencies**: #E1-14

**Description:**
Inject floating voice button on Google Calendar page.

**Acceptance Criteria:**
- [ ] injectQuickAddButton method works
- [ ] Floating voice button on calendar toolbar
- [ ] Matches Google Calendar styling
- [ ] Button opens extension popup
- [ ] Button is responsive
- [ ] Button doesn't interfere with calendar UI

**Files to Modify:**
- `extension/content-scripts/calendar-injector.js` - Add quick add button

**Testing:**
- Test button injection
- Test button functionality
- Test styling matches calendar
- Test on different screen sizes

---

### **TICKET #E1-16: Calendar Page Event Highlighting**
**Branch**: `eng1/ticket-16-calendar-highlighting`  
**Priority**: Low  
**Estimated Time**: 2-3 hours  
**Dependencies**: #E1-14, #E1-05

**Description:**
Highlight events created by extension on calendar page.

**Acceptance Criteria:**
- [ ] highlightNewEvents method works
- [ ] Highlights events created by extension
- [ ] Visual indicator (border, icon, etc.)
- [ ] Doesn't interfere with calendar functionality
- [ ] Removes highlighting after user interaction

**Files to Modify:**
- `extension/content-scripts/calendar-injector.js` - Add highlighting

**Testing:**
- Test event highlighting
- Test on different calendar views
- Test highlighting removal

---

### **TICKET #E1-17: UI Polish - Animations**
**Branch**: `eng1/ticket-17-ui-animations`  
**Priority**: Medium  
**Estimated Time**: 3-4 hours  
**Dependencies**: All previous UI tickets

**Description:**
Polish all animations for smooth 60fps performance.

**Acceptance Criteria:**
- [ ] All animations are smooth (60fps)
- [ ] No jank or stuttering
- [ ] Transitions are consistent
- [ ] Loading states are animated
- [ ] Micro-interactions added
- [ ] Performance optimized

**Files to Modify:**
- `extension/popup/popup.css` - Polish animations
- `extension/popup/popup.js` - Optimize animation triggers

**Testing:**
- Test all animations
- Test performance (60fps)
- Test on different devices

---

### **TICKET #E1-18: Error Handling UI**
**Branch**: `eng1/ticket-18-error-handling-ui`  
**Priority**: High  
**Estimated Time**: 3-4 hours  
**Dependencies**: Engineer 2's error handler

**Description:**
Handle and display errors gracefully in UI.

**Acceptance Criteria:**
- [ ] Handle microphone permission denial
- [ ] Handle no internet connection
- [ ] Handle calendar API errors
- [ ] Show clear, user-friendly error messages
- [ ] Retry buttons for recoverable errors
- [ ] Error states are visually clear

**Files to Modify:**
- `extension/popup/popup.js` - Add error handling
- `extension/popup/popup.css` - Style error states

**Testing:**
- Test all error scenarios
- Test error messages
- Test retry functionality

---

### **TICKET #E1-19: Performance Optimization**
**Branch**: `eng1/ticket-19-performance-optimization`  
**Priority**: Medium  
**Estimated Time**: 3-4 hours  
**Dependencies**: All previous tickets

**Description:**
Optimize performance of voice recognition and calendar operations.

**Acceptance Criteria:**
- [ ] Voice recognition startup optimized
- [ ] Calendar events cached
- [ ] API calls minimized
- [ ] Lazy loading implemented
- [ ] Memory leaks fixed
- [ ] Performance metrics improved

**Files to Modify:**
- `extension/popup/popup.js` - Optimize code
- `extension/utils/voice.js` - Optimize voice recognition
- `extension/utils/calendar.js` - Add caching

**Testing:**
- Test performance metrics
- Test memory usage
- Test on slow devices

---

### **TICKET #E1-20: Final Testing & Bug Fixes**
**Branch**: `eng1/ticket-20-final-testing`  
**Priority**: High  
**Estimated Time**: 4-6 hours  
**Dependencies**: All previous tickets

**Description:**
Final testing and bug fixes before launch.

**Acceptance Criteria:**
- [ ] All user flows tested end-to-end
- [ ] All bugs fixed
- [ ] Tested on Mac, Windows, Linux
- [ ] Tested on different Chrome versions
- [ ] Accessibility tested
- [ ] Performance verified

**Files to Modify:**
- All files as needed for bug fixes

**Testing:**
- Full end-to-end testing
- Cross-platform testing
- Browser compatibility testing

---

## **🔌 INTEGRATION WITH ENGINEER 2**

### **What You Call from Engineer 2's Code:**

1. **NLP Parsing** (Engineer 2's `utils/nlp.js`)
   ```javascript
   import NLPService from '../utils/nlp.js';
   
   const nlp = new NLPService();
   const intent = await nlp.parse(transcript);
   ```

2. **Guardian Validation** (Engineer 2's `utils/guardian.js`)
   ```javascript
   import Guardian from '../utils/guardian.js';
   
   const guardian = new Guardian();
   const validation = await guardian.validate(intent);
   // You display validation.mode, validation.warnings
   ```

3. **API Calls** (Engineer 2's `utils/api.js`)
   ```javascript
   import API from '../utils/api.js';
   
   const result = await API.request('/actions/execute', {
     method: 'POST',
     body: JSON.stringify(eventDetails)
   });
   ```

4. **Storage** (Engineer 2's `utils/storage.js`)
   ```javascript
   import Storage from '../utils/storage.js';
   
   await Storage.set('onboarding_complete', true);
   ```

---

## **✅ SUCCESS CRITERIA**

### **Week 1:**
- [ ] Voice button works smoothly
- [ ] Speech recognition is accurate
- [ ] Calendar events are created correctly
- [ ] Guardian preview displays properly
- [ ] Conflict detection works

### **Week 2:**
- [ ] Onboarding guides new users
- [ ] Calendar page injection works
- [ ] All animations are smooth
- [ ] Error handling is comprehensive
- [ ] Performance is optimized

### **Launch Ready:**
- [ ] Voice commands feel magical
- [ ] Zero UI bugs
- [ ] Calendar integration flawless
- [ ] Works on all major browsers

---

## **💡 TIPS FOR SUCCESS**

1. **Test Voice Early**: Test in Chrome with real microphone
2. **Handle Permissions**: Always check microphone access
3. **Cache Calendar Data**: Avoid unnecessary API calls
4. **Smooth Animations**: 60fps or bust
5. **Clear Feedback**: User always knows what's happening
6. **Error Recovery**: Always provide next steps

---

## **🚀 QUICK START**

**Day 1 Morning:**
1. Read this README
2. Review PROJECT_OVERVIEW.md
3. Start with Ticket #E1-01 (Voice Button UI)
4. Create branch: `git checkout -b eng1/ticket-01-voice-button-ui`

**Remember**: You're building the voice interface that users interact with. Make it feel natural and magical!

---

## **📚 KEY FILES YOU'LL WORK WITH**

**Your Main Files:**
- `popup/popup.js` - 60% of your time
- `utils/voice.js` - 15% of your time
- `utils/calendar.js` - 15% of your time
- `popup/popup.css` - 10% of your time

**Files You'll Use (Engineer 2's):**
- `utils/nlp.js` - For parsing commands
- `utils/guardian.js` - For validation
- `utils/api.js` - For API calls
- `utils/storage.js` - For data persistence
