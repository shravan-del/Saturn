# 👨‍💻 Engineer 2 - Intelligence & Settings

## **YOUR ROLE**

You are **Engineer 2** - NLP Logic & Settings Management
- **You own**: Intent parsing, Guardian logic, settings UI, error handling
- **You work with**: Engineer 1 on shared components and voice integration
- **Your goal**: Build the intelligence behind voice commands and settings interface

---

## **📁 YOUR FILES (You Own These)**

### **Frontend Files:**
```
extension/
├── options/
│   ├── options.html        ⭐ YOU OWN - Settings page UI
│   ├── options.css         ⭐ YOU OWN - Settings styling
│   └── options.js          ⭐ YOU OWN - Settings logic
│
└── content-scripts/
    └── gmail-injector.js   ⭐ YOU OWN - Gmail integration
```

### **Backend Files:**
```
extension/
├── utils/
│   ├── nlp.js              ⭐ YOU OWN - Intent parsing
│   ├── guardian.js         ⭐ YOU OWN - 7-layer validation
│   ├── api.js              ⭐ YOU OWN - API wrapper
│   ├── storage.js          ⭐ YOU OWN - Chrome Storage
│   ├── error-handler.js    ⭐ YOU OWN - Error handling
│   ├── auth.js             ⭐ YOU OWN - Authentication
│   ├── security.js         ⭐ YOU OWN - Input validation
│   └── performance.js      ⭐ YOU OWN - Caching & monitoring
│
├── config/
│   ├── constants.js        ⭐ YOU OWN - App constants
│   └── api-config.js       ⭐ YOU OWN - API endpoints
│
└── background/
    └── service-worker.js   ⭐ YOU OWN - Background tasks
```

### **Shared Responsibilities:**
```
extension/utils/
├── voice.js                🤝 Engineer 1 owns, you use
├── calendar.js             🤝 Engineer 1 owns, you use
└── speech.js               🤝 Engineer 1 owns, you use
```

---

## **🎫 TICKET SYSTEM**

Each ticket below represents a separate branch. Create a branch for each ticket using the format:
```bash
git checkout -b eng2/ticket-XX-short-name
```

---

## **📋 WEEK 1 TICKETS**

### **TICKET #E2-01: NLP Service - Core Parsing**
**Branch**: `eng2/ticket-01-nlp-core`  
**Priority**: High  
**Estimated Time**: 4-5 hours  
**Dependencies**: None

**Description:**
Create core NLP service to parse voice commands into structured intents.

**Acceptance Criteria:**
- [ ] NLPService class created
- [ ] parse method calls backend API
- [ ] Extracts intent type, confidence, entities
- [ ] Returns structured intent object
- [ ] Error handling for API failures
- [ ] Fallback parsing when API unavailable

**Files to Create:**
- `extension/utils/nlp.js` - Intent parsing service

**Code Structure:**
```javascript
class NLPService {
  async parse(transcript) {
    // Call backend: POST /voice/command
    // Extract intent type, confidence, entities
    // Return structured intent
  }
}
```

**Testing:**
- Test with various voice commands
- Test API integration
- Test fallback parsing
- Test error handling

---

### **TICKET #E2-02: Entity Extraction**
**Branch**: `eng2/ticket-02-entity-extraction`  
**Priority**: High  
**Estimated Time**: 4-5 hours  
**Dependencies**: #E2-01

**Description:**
Extract entities (title, date, time, duration, location) from voice commands.

**Acceptance Criteria:**
- [ ] EntityExtractor class created
- [ ] extractTitle method works
- [ ] extractDateTime method works
- [ ] extractDuration method works
- [ ] extractLocation method works
- [ ] Handles various date formats
- [ ] Handles relative dates (today, tomorrow)

**Files to Modify:**
- `extension/utils/nlp.js` - Add entity extraction

**Code Structure:**
```javascript
class EntityExtractor {
  static extractTitle(text) {
    // Extract event title from command
  }
  
  static extractDateTime(text) {
    // Extract date and time
    // Handle formats: "tomorrow 2pm", "Friday at 3"
  }
  
  static extractDuration(text) {
    // Extract duration: "30 minutes", "1 hour"
  }
}
```

**Testing:**
- Test with various date formats
- Test with relative dates
- Test duration extraction
- Test edge cases

---

### **TICKET #E2-03: DateTime Normalization**
**Branch**: `eng2/ticket-03-datetime-normalization`  
**Priority**: High  
**Estimated Time**: 3-4 hours  
**Dependencies**: #E2-02

**Description:**
Normalize date/time strings to ISO format for calendar API.

**Acceptance Criteria:**
- [ ] normalizeDateTime method works
- [ ] Converts "tomorrow 2pm" to ISO format
- [ ] Handles relative dates (today, tomorrow, next week)
- [ ] Handles timezone conversion
- [ ] Handles various time formats
- [ ] Returns valid ISO 8601 strings

**Files to Modify:**
- `extension/utils/nlp.js` - Add date normalization

**Testing:**
- Test various date formats
- Test timezone handling
- Test relative dates
- Test edge cases

---

### **TICKET #E2-04: Guardian Core System**
**Branch**: `eng2/ticket-04-guardian-core`  
**Priority**: High  
**Estimated Time**: 4-5 hours  
**Dependencies**: None

**Description:**
Create Guardian core system with 7-layer validation architecture.

**Acceptance Criteria:**
- [ ] Guardian class created
- [ ] validate method processes intents
- [ ] 7-layer architecture implemented
- [ ] Returns validation result object
- [ ] Handles errors gracefully
- [ ] Extensible layer system

**Files to Create:**
- `extension/utils/guardian.js` - Guardian validation system

**Code Structure:**
```javascript
class Guardian {
  constructor() {
    this.layers = [
      new SanityCheckLayer(),
      new ConflictDetectionLayer(),
      new PatternAnalysisLayer(),
      new RiskScoringLayer(),
      new ModeDecisionLayer(),
      new WarningGenerationLayer(),
      new RecommendationLayer()
    ];
  }
  
  async validate(intent) {
    // Run through all 7 layers
    return {
      mode: 'auto' | 'confirm' | 'block',
      risk_score: 0.0-1.0,
      warnings: [],
      blockers: [],
      preview: '...'
    };
  }
}
```

**Testing:**
- Test validation flow
- Test with different intents
- Test error handling
- Test layer execution

---

### **TICKET #E2-05: Guardian Layer 1 - Sanity Checks**
**Branch**: `eng2/ticket-05-guardian-sanity`  
**Priority**: High  
**Estimated Time**: 2-3 hours  
**Dependencies**: #E2-04

**Description:**
Implement Layer 1: Sanity checks for required fields and validation.

**Acceptance Criteria:**
- [ ] SanityCheckLayer class created
- [ ] Checks required fields (title, when)
- [ ] Validates date/time format
- [ ] Checks duration limits (1min - 8hrs)
- [ ] Adds blockers for invalid data
- [ ] Returns updated context

**Files to Modify:**
- `extension/utils/guardian.js` - Add SanityCheckLayer

**Testing:**
- Test with missing fields
- Test with invalid dates
- Test with invalid durations
- Test with valid data

---

### **TICKET #E2-06: Guardian Layer 2 - Conflict Detection**
**Branch**: `eng2/ticket-06-guardian-conflicts`  
**Priority**: High  
**Estimated Time**: 3-4 hours  
**Dependencies**: #E2-04, Engineer 1's calendar service

**Description:**
Implement Layer 2: Conflict detection for calendar overlaps.

**Acceptance Criteria:**
- [ ] ConflictDetectionLayer class created
- [ ] Fetches calendar events
- [ ] Checks for overlapping events
- [ ] Adds conflicts to context
- [ ] Returns conflict details
- [ ] Handles timezone correctly

**Files to Modify:**
- `extension/utils/guardian.js` - Add ConflictDetectionLayer

**Testing:**
- Test with overlapping events
- Test with no conflicts
- Test timezone handling
- Test edge cases

---

### **TICKET #E2-07: Guardian Layer 3 - Pattern Analysis**
**Branch**: `eng2/ticket-07-guardian-patterns`  
**Priority**: Medium  
**Estimated Time**: 2-3 hours  
**Dependencies**: #E2-04

**Description:**
Implement Layer 3: Pattern analysis for unusual patterns.

**Acceptance Criteria:**
- [ ] PatternAnalysisLayer class created
- [ ] Detects unusual patterns
- [ ] Flags very short events (<15min)
- [ ] Flags very long events (>4hrs)
- [ ] Adds pattern warnings
- [ ] Returns updated context

**Files to Modify:**
- `extension/utils/guardian.js` - Add PatternAnalysisLayer

**Testing:**
- Test with short events
- Test with long events
- Test with normal events
- Test pattern detection

---

### **TICKET #E2-08: Guardian Layer 4 - Risk Scoring**
**Branch**: `eng2/ticket-08-guardian-risk`  
**Priority**: High  
**Estimated Time**: 3-4 hours  
**Dependencies**: #E2-04, #E2-05, #E2-06, #E2-07

**Description:**
Implement Layer 4: Risk scoring algorithm.

**Acceptance Criteria:**
- [ ] RiskScoringLayer class created
- [ ] Calculates risk score (0.0 - 1.0)
- [ ] Weights: confidence, conflicts, patterns
- [ ] Low confidence increases risk
- [ ] Conflicts increase risk
- [ ] Unusual patterns increase risk
- [ ] Returns risk score in context

**Files to Modify:**
- `extension/utils/guardian.js` - Add RiskScoringLayer

**Testing:**
- Test risk calculation
- Test with different scenarios
- Test edge cases
- Test risk thresholds

---

### **TICKET #E2-09: Guardian Layer 5 - Mode Decision**
**Branch**: `eng2/ticket-09-guardian-mode`  
**Priority**: High  
**Estimated Time**: 2-3 hours  
**Dependencies**: #E2-04, #E2-08

**Description:**
Implement Layer 5: Mode decision (auto/confirm/block).

**Acceptance Criteria:**
- [ ] ModeDecisionLayer class created
- [ ] Determines mode based on risk score
- [ ] Auto mode: risk_score < 0.19
- [ ] Confirm mode: 0.19 <= risk_score < 0.49
- [ ] Block mode: risk_score >= 0.49
- [ ] Returns mode in context

**Files to Modify:**
- `extension/utils/guardian.js` - Add ModeDecisionLayer

**Testing:**
- Test mode determination
- Test with different risk scores
- Test threshold boundaries
- Test edge cases

---

### **TICKET #E2-10: Guardian Layer 6 - Warning Generation**
**Branch**: `eng2/ticket-10-guardian-warnings`  
**Priority**: Medium  
**Estimated Time**: 2-3 hours  
**Dependencies**: #E2-04

**Description:**
Implement Layer 6: Warning generation for user feedback.

**Acceptance Criteria:**
- [ ] WarningGenerationLayer class created
- [ ] Generates user-friendly warnings
- [ ] Warns about conflicts
- [ ] Warns about low confidence
- [ ] Warns about unusual patterns
- [ ] Returns warnings in context

**Files to Modify:**
- `extension/utils/guardian.js` - Add WarningGenerationLayer

**Testing:**
- Test warning generation
- Test with different scenarios
- Test warning messages
- Test edge cases

---

### **TICKET #E2-11: Guardian Layer 7 - Recommendations**
**Branch**: `eng2/ticket-11-guardian-recommendations`  
**Priority**: Medium  
**Estimated Time**: 2-3 hours  
**Dependencies**: #E2-04

**Description:**
Implement Layer 7: Recommendation generation for action preview.

**Acceptance Criteria:**
- [ ] RecommendationLayer class created
- [ ] Generates helpful preview text
- [ ] Includes event details (title, when, duration)
- [ ] User-friendly format
- [ ] Returns preview in context

**Files to Modify:**
- `extension/utils/guardian.js` - Add RecommendationLayer

**Testing:**
- Test preview generation
- Test with different events
- Test preview format
- Test edge cases

---

### **TICKET #E2-12: Settings Page UI**
**Branch**: `eng2/ticket-12-settings-ui`  
**Priority**: High  
**Estimated Time**: 3-4 hours  
**Dependencies**: None

**Description:**
Create settings page UI with all configuration options.

**Acceptance Criteria:**
- [ ] Settings page HTML created
- [ ] Default event settings section
- [ ] Guardian mode selector
- [ ] Account management section
- [ ] Styled to match design system
- [ ] Responsive layout

**Files to Create/Modify:**
- `extension/options/options.html` - Settings page UI
- `extension/options/options.css` - Settings styling

**Testing:**
- Test settings page layout
- Test form elements
- Test styling
- Test responsiveness

---

### **TICKET #E2-13: Settings Logic**
**Branch**: `eng2/ticket-13-settings-logic`  
**Priority**: High  
**Estimated Time**: 3-4 hours  
**Dependencies**: #E2-12, #E2-14

**Description:**
Implement settings page logic for loading and saving settings.

**Acceptance Criteria:**
- [ ] SettingsManager class created
- [ ] loadSettings method works
- [ ] saveSettings method works
- [ ] Form data population works
- [ ] Form data collection works
- [ ] Save confirmation shown
- [ ] Disconnect account works

**Files to Create/Modify:**
- `extension/options/options.js` - Settings logic

**Code Structure:**
```javascript
class SettingsManager {
  async loadSettings() {
    // Load from storage
    // Populate form
  }
  
  async saveSettings() {
    // Get form data
    // Save to storage
    // Show confirmation
  }
}
```

**Testing:**
- Test settings loading
- Test settings saving
- Test form population
- Test disconnect functionality

---

### **TICKET #E2-14: Storage Manager**
**Branch**: `eng2/ticket-14-storage-manager`  
**Priority**: High  
**Estimated Time**: 3-4 hours  
**Dependencies**: None

**Description:**
Create Chrome Storage API wrapper for data persistence.

**Acceptance Criteria:**
- [ ] StorageManager class created
- [ ] get method works
- [ ] set method works
- [ ] remove method works
- [ ] clear method works
- [ ] Uses Chrome Storage API (sync)
- [ ] Fallback to localStorage if needed
- [ ] Promise-based API

**Files to Create/Modify:**
- `extension/utils/storage.js` - Chrome Storage wrapper

**Code Structure:**
```javascript
class StorageManager {
  static async get(key) {
    // Get from Chrome Storage
  }
  
  static async set(key, value) {
    // Set in Chrome Storage
  }
  
  static async remove(key) {
    // Remove from Chrome Storage
  }
  
  static async clear() {
    // Clear all storage
  }
}
```

**Testing:**
- Test storage operations
- Test Chrome Storage API
- Test fallback to localStorage
- Test error handling

---

## **📋 WEEK 2 TICKETS**

### **TICKET #E2-15: Error Handler**
**Branch**: `eng2/ticket-15-error-handler`  
**Priority**: High  
**Estimated Time**: 3-4 hours  
**Dependencies**: None

**Description:**
Create centralized error handling system.

**Acceptance Criteria:**
- [ ] ErrorHandler class created
- [ ] handle method categorizes errors
- [ ] getUserMessage returns user-friendly messages
- [ ] canRetry method determines retry capability
- [ ] Categorizes: network, auth, rate limit, server errors
- [ ] Logs errors for debugging

**Files to Create:**
- `extension/utils/error-handler.js` - Error handling

**Code Structure:**
```javascript
class ErrorHandler {
  static handle(error, context = {}) {
    // Categorize error
    // Return user-friendly message
  }
  
  static categorize(error) {
    // Return error type
  }
  
  static getUserMessage(errorType, error) {
    // Return friendly message
  }
}
```

**Testing:**
- Test error categorization
- Test user messages
- Test retry logic
- Test error logging

---

### **TICKET #E2-16: API Wrapper Enhancement**
**Branch**: `eng2/ticket-16-api-enhancement`  
**Priority**: High  
**Estimated Time**: 4-5 hours  
**Dependencies**: #E2-15

**Description:**
Enhance API wrapper with retry logic, timeout, and error handling.

**Acceptance Criteria:**
- [ ] Retry logic with exponential backoff
- [ ] Request timeout handling (30 seconds)
- [ ] Token refresh on 401 errors
- [ ] Better error messages
- [ ] Network error detection
- [ ] Rate limit handling

**Files to Modify:**
- `extension/utils/api.js` - Enhance API wrapper

**Testing:**
- Test retry logic
- Test timeout handling
- Test token refresh
- Test error handling

---

### **TICKET #E2-17: Action History Storage**
**Branch**: `eng2/ticket-17-action-history`  
**Priority**: Medium  
**Estimated Time**: 3-4 hours  
**Dependencies**: #E2-14

**Description:**
Create action history storage system for tracking past actions.

**Acceptance Criteria:**
- [ ] ActionHistory class created
- [ ] add method stores actions
- [ ] getAll method retrieves history
- [ ] clear method removes history
- [ ] Keeps last 50 actions
- [ ] Tracks undo capability (30-second window)
- [ ] Stores action metadata

**Files to Modify:**
- `extension/utils/storage.js` - Add ActionHistory class

**Testing:**
- Test action storage
- Test history retrieval
- Test history limits
- Test undo capability tracking

---

### **TICKET #E2-18: Undo System API**
**Branch**: `eng2/ticket-18-undo-system`  
**Priority**: Medium  
**Estimated Time**: 2-3 hours  
**Dependencies**: #E2-16, #E2-17

**Description:**
Add undo API method for deleting events within 30 seconds.

**Acceptance Criteria:**
- [ ] undo method added to API
- [ ] Calls backend: POST /actions/{id}/undo
- [ ] Handles undo response
- [ ] Updates action history
- [ ] Marks action as undone
- [ ] Error handling for expired undo window

**Files to Modify:**
- `extension/utils/api.js` - Add undo method

**Testing:**
- Test undo API call
- Test undo within 30 seconds
- Test undo after expiration
- Test error handling

---

### **TICKET #E2-19: Performance Monitor**
**Branch**: `eng2/ticket-19-performance-monitor`  
**Priority**: Medium  
**Estimated Time**: 3-4 hours  
**Dependencies**: None

**Description:**
Create performance monitoring system for tracking operation times.

**Acceptance Criteria:**
- [ ] PerformanceMonitor class created
- [ ] startTimer method works
- [ ] endTimer method works
- [ ] measureAsync method works
- [ ] Logs performance metrics
- [ ] Tracks operation durations

**Files to Create:**
- `extension/utils/performance.js` - Performance monitoring

**Testing:**
- Test timer functionality
- Test async measurement
- Test performance logging
- Test metric tracking

---

### **TICKET #E2-20: Cache Manager**
**Branch**: `eng2/ticket-20-cache-manager`  
**Priority**: Medium  
**Estimated Time**: 2-3 hours  
**Dependencies**: #E2-19

**Description:**
Create cache manager for in-memory caching with TTL.

**Acceptance Criteria:**
- [ ] CacheManager class created
- [ ] set method with TTL works
- [ ] get method retrieves cached values
- [ ] clear method clears cache
- [ ] TTL expiration works
- [ ] Memory-efficient implementation

**Files to Modify:**
- `extension/utils/performance.js` - Add CacheManager

**Testing:**
- Test cache operations
- Test TTL expiration
- Test cache clearing
- Test memory usage

---

### **TICKET #E2-21: Security Manager**
**Branch**: `eng2/ticket-21-security-manager`  
**Priority**: High  
**Estimated Time**: 3-4 hours  
**Dependencies**: None

**Description:**
Create security manager for input validation and sanitization.

**Acceptance Criteria:**
- [ ] SecurityManager class created
- [ ] sanitize method removes XSS vectors
- [ ] validateToken method validates JWT format
- [ ] isTokenExpired method checks expiration
- [ ] rateLimiter prevents abuse
- [ ] Input validation for all user inputs

**Files to Create:**
- `extension/utils/security.js` - Security utilities

**Testing:**
- Test input sanitization
- Test token validation
- Test rate limiting
- Test security measures

---

### **TICKET #E2-22: Service Worker Enhancement**
**Branch**: `eng2/ticket-22-service-worker`  
**Priority**: Medium  
**Estimated Time**: 3-4 hours  
**Dependencies**: None

**Description:**
Enhance service worker with error logging and message handling.

**Acceptance Criteria:**
- [ ] Error logging implemented
- [ ] Message handling for popup communication
- [ ] Keyboard shortcut handling improved
- [ ] Background task management
- [ ] Service worker keeps alive
- [ ] Error recovery mechanisms

**Files to Modify:**
- `extension/background/service-worker.js` - Enhance service worker

**Testing:**
- Test error logging
- Test message handling
- Test keyboard shortcuts
- Test background tasks

---

### **TICKET #E2-23: Authentication Enhancement**
**Branch**: `eng2/ticket-23-auth-enhancement`  
**Priority**: High  
**Estimated Time**: 3-4 hours  
**Dependencies**: #E2-14, #E2-16

**Description:**
Enhance authentication with token refresh and session management.

**Acceptance Criteria:**
- [ ] Token refresh logic implemented
- [ ] Session persistence works
- [ ] Token expiration handling
- [ ] Automatic token refresh
- [ ] Logout functionality
- [ ] Auth state management

**Files to Modify:**
- `extension/utils/auth.js` - Enhance authentication

**Testing:**
- Test token refresh
- Test session persistence
- Test token expiration
- Test logout

---

### **TICKET #E2-24: Final Testing & Bug Fixes**
**Branch**: `eng2/ticket-24-final-testing`  
**Priority**: High  
**Estimated Time**: 4-6 hours  
**Dependencies**: All previous tickets

**Description:**
Final testing and bug fixes before launch.

**Acceptance Criteria:**
- [ ] All backend logic tested
- [ ] All bugs fixed
- [ ] API integration verified
- [ ] Error handling comprehensive
- [ ] Performance optimized
- [ ] Security audit complete

**Files to Modify:**
- All files as needed for bug fixes

**Testing:**
- Full end-to-end testing
- API integration testing
- Error scenario testing
- Performance testing

---

## **🔌 INTEGRATION WITH ENGINEER 1**

### **What Engineer 1 Calls from Your Code:**

1. **NLP Parsing**
   ```javascript
   // Engineer 1 uses this in popup.js
   import NLPService from '../utils/nlp.js';
   
   const nlp = new NLPService();
   const intent = await nlp.parse(voiceTranscript);
   // Engineer 1 displays intent to user
   ```

2. **Guardian Validation**
   ```javascript
   // Engineer 1 uses this in popup.js
   import Guardian from '../utils/guardian.js';
   
   const guardian = new Guardian();
   const validation = await guardian.validate(intent);
   // Engineer 1 shows validation.mode, validation.warnings
   ```

3. **Settings**
   ```javascript
   // Engineer 1 reads settings
   import Storage from '../utils/storage.js';
   
   const settings = await Storage.get('settings');
   const guardianMode = settings.guardian_mode;  // auto/confirm/cautious
   ```

---

## **✅ SUCCESS CRITERIA**

### **Week 1:**
- [ ] NLP parsing extracts all entities correctly
- [ ] Guardian validation works (all 7 layers)
- [ ] Settings page is functional
- [ ] Storage syncs across devices
- [ ] API wrapper handles errors gracefully

### **Week 2:**
- [ ] Error handling covers all cases
- [ ] Action history displays correctly
- [ ] Undo system works (30-second window)
- [ ] Performance is optimized
- [ ] Security measures in place

### **Launch Ready:**
- [ ] All backend logic is tested
- [ ] Zero critical bugs
- [ ] API calls are reliable
- [ ] Settings persist correctly

---

## **💡 TIPS FOR SUCCESS**

1. **Test Independently**: Create test HTML files
2. **Mock Responses**: Build demo mode early
3. **Log Everything**: Use console.log liberally
4. **Handle Errors**: Always return user-friendly messages
5. **Cache Aggressively**: Minimize API calls
6. **Validate Inputs**: Never trust user data
7. **Document APIs**: Write clear JSDoc comments

---

## **🚀 QUICK START**

**Day 1 Morning:**
1. Read this README
2. Review PROJECT_OVERVIEW.md
3. Start with Ticket #E2-01 (NLP Core)
4. Create branch: `git checkout -b eng2/ticket-01-nlp-core`

**Remember**: You're building the intelligence that makes voice commands work reliably!

---

## **📚 KEY FILES YOU'LL WORK WITH**

**Your Main Files:**
- `utils/nlp.js` - 20% of your time
- `utils/guardian.js` - 25% of your time
- `options/options.js` - 15% of your time
- `utils/api.js` - 15% of your time
- `utils/error-handler.js` - 10% of your time
- `utils/storage.js` - 10% of your time
- Other utils - 5% of your time
