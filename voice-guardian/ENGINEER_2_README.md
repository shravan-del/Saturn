# 👨‍💻 Engineer 2 - Backend/Logic Focus

## **YOUR ROLE**

You are **Engineer 2** - Backend/Logic Focus
- **You own**: All backend logic, APIs, validation, error handling, integrations
- **You work with**: Engineer 1 for UI integration and user experience
- **Your goal**: Build robust, reliable backend logic that makes voice commands work flawlessly

---

## **📁 YOUR FILES (You Own These)**

### **Primary Files:**
```
extension/
├── utils/
│   ├── api.js               ⚠️ ENHANCE - Add retry, timeout, error handling
│   ├── auth.js              ✅ EXISTS - Token refresh, OAuth
│   ├── storage.js           ⚠️ ENHANCE - Add Chrome Storage API
│   ├── voice.js             ✅ EXISTS - Voice recognition wrapper
│   ├── guardian.js          ❌ CREATE - 7-layer validation system
│   ├── calendar.js          ❌ CREATE - Google Calendar API wrapper
│   ├── nlp.js               ❌ CREATE - Intent parsing wrapper
│   ├── speech.js            ❌ CREATE - Speech recognition wrapper
│   ├── error-handler.js     ❌ CREATE - Centralized error handling
│   ├── performance.js        ❌ CREATE - Caching, monitoring
│   ├── demo-mode.js         ❌ CREATE - Testing without API
│   └── security.js           ❌ CREATE - Input validation, rate limiting
│
├── config/
│   ├── constants.js         ✅ CREATED - App constants
│   └── api-config.js        ✅ CREATED - API endpoints
│
└── background/
    └── service-worker.js    ⚠️ ENHANCE - Error logging, message handling
```

### **What You DON'T Touch:**
```
extension/popup/              ❌ Engineer 1 owns
extension/options/            ❌ Engineer 1 owns
extension/content-scripts/    🤝 Shared - Coordinate changes
```

---

## **🎯 YOUR TASKS (Week 1-2)**

### **Week 1: Core Logic (Days 1-5)**

#### **Days 1-3: Guardian Validation System + Calendar Integration**
**Goal**: Build 7-layer validation system and Google Calendar API wrapper

**Task 1: Guardian System** (`utils/guardian.js`)
```javascript
class Guardian {
  async validate(intent) {
    // Layer 1: Sanity checks (required fields)
    // Layer 2: Conflict detection (calendar overlaps)
    // Layer 3: Pattern analysis (unusual patterns)
    // Layer 4: Risk scoring (calculate risk)
    // Layer 5: Mode determination (auto/confirm/block)
    // Layer 6: Warning generation (user warnings)
    // Layer 7: Recommendation (suggestions)
    
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

**Task 2: Calendar Integration** (`utils/calendar.js`)
```javascript
class GoogleCalendarService {
  async createEvent(eventDetails) {
    // Call backend API: POST /actions/execute
    // Handle errors gracefully
    // Return formatted response
  }

  async checkConflicts(startTime, endTime) {
    // Query existing events
    // Check for overlaps
    // Return conflict details
  }

  async deleteEvent(eventId) {
    // For undo functionality
    // Delete from calendar
  }
}
```

**Files to Create:**
- `utils/guardian.js` - Guardian validation system
- `utils/calendar.js` - Calendar API wrapper

**Integration Points:**
- Engineer 1 will call `guardian.validate()` to show validation results
- Engineer 1 will call `calendar.createEvent()` to create events

---

#### **Days 4-5: Error Handling + API Enhancement**
**Goal**: Comprehensive error handling and robust API wrapper

**Task 3: Error Handler** (`utils/error-handler.js`)
```javascript
class ErrorHandler {
  static handle(error, context = {}) {
    // Categorize error (network, auth, rate limit, etc.)
    // Log to console
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

**Task 4: API Enhancement** (`utils/api.js`)
```javascript
const API = {
  async request(endpoint, options = {}) {
    // Add retry logic with exponential backoff
    // Add request timeout handling
    // Add network error detection
    // Add token refresh on 401
    // Add better error messages
  }
};
```

**Files to Create/Enhance:**
- `utils/error-handler.js` - Centralized error handling
- `utils/api.js` - Enhance existing file

**Integration Points:**
- Engineer 1 will use `API.request()` for all API calls
- Engineer 1 will use `ErrorHandler.handle()` for error messages

---

### **Week 2: Polish + Launch (Days 6-10)**

#### **Days 6-7: Performance + Demo Mode**
**Goal**: Optimize performance and enable testing without API calls

**Task 5: Performance Monitor** (`utils/performance.js`)
```javascript
class PerformanceMonitor {
  static startTimer(label) { }
  static endTimer(label) { }
  static async measureAsync(label, fn) { }
}

class CacheManager {
  static set(key, value, ttlMs) { }
  static get(key) { }
  static clear() { }
}
```

**Task 6: Demo Mode** (`utils/demo-mode.js`)
```javascript
class DemoMode {
  static isEnabled() {
    return localStorage.getItem('demo_mode') === 'true';
  }

  static async mockCalendarCreate(eventDetails) {
    // Simulate API delay
    // Return mock success
  }
}
```

**Files to Create:**
- `utils/performance.js` - Performance monitoring
- `utils/demo-mode.js` - Demo mode for testing

---

#### **Days 8-9: Security + Storage Enhancement**
**Goal**: Input validation, rate limiting, and better storage

**Task 7: Security Manager** (`utils/security.js`)
```javascript
class SecurityManager {
  static sanitize(input) {
    // Remove XSS vectors
  }

  static isValidToken(token) {
    // Validate JWT format
  }

  static isTokenExpired(token) {
    // Check expiration
  }

  static rateLimiter = {
    canMakeRequest(key, maxCalls, windowMs) { }
  };
}
```

**Task 8: Storage Enhancement** (`utils/storage.js`)
```javascript
class StorageManager {
  // Use Chrome Storage API instead of localStorage
  // Fallback to localStorage if Chrome Storage unavailable
  static async get(key) { }
  static async set(key, value) { }
  static async remove(key) { }
  static async clear() { }
}
```

**Files to Create/Enhance:**
- `utils/security.js` - Security utilities
- `utils/storage.js` - Enhance existing file

---

#### **Day 10: Service Worker + Final Testing**
**Goal**: Background worker enhancements and final testing

**Task 9: Service Worker** (`background/service-worker.js`)
```javascript
// Enhance existing service worker
// Add error logging
// Add message handling
// Add better keyboard shortcut handling
```

**Files to Enhance:**
- `background/service-worker.js` - Enhance existing file

---

## **🔧 TECHNICAL SPECIFICATIONS**

### **Guardian Validation System (7 Layers)**

1. **Layer 1: Sanity Checks**
   - Required fields present (title, when)
   - Valid date/time format
   - Duration within limits (1 min - 8 hours)

2. **Layer 2: Conflict Detection**
   - Check calendar for overlapping events
   - Detect scheduling conflicts
   - Suggest alternative times

3. **Layer 3: Pattern Analysis**
   - Detect unusual patterns (very short/long events)
   - Flag suspicious commands
   - Identify potential mistakes

4. **Layer 4: Risk Scoring**
   - Calculate risk score (0.0 - 1.0)
   - Based on confidence, conflicts, patterns
   - Weighted algorithm

5. **Layer 5: Mode Determination**
   - `auto`: risk_score < 0.19 (execute immediately)
   - `confirm`: 0.19 <= risk_score < 0.49 (ask user)
   - `block`: risk_score >= 0.49 (don't allow)

6. **Layer 6: Warning Generation**
   - Generate user-friendly warnings
   - Explain risks clearly
   - Suggest fixes

7. **Layer 7: Recommendation**
   - Suggest alternative actions
   - Provide helpful hints
   - Generate action preview

---

### **API Integration**

**Backend Endpoints:**
```
POST /voice/command          - Parse voice command
POST /actions/execute        - Execute action (create calendar event)
POST /actions/{id}/undo      - Undo action (delete event)
GET  /actions/               - List user actions
GET  /auth/me                - Get current user
POST /auth/logout            - Logout
```

**Error Handling:**
- Network errors → Retry with exponential backoff
- 401 errors → Refresh token, retry
- 429 errors → Rate limit, wait and retry
- 500 errors → Show user-friendly message

---

## **🔌 INTEGRATION WITH ENGINEER 1**

### **How Engineer 1 Uses Your Code:**

1. **Guardian Validation**
   ```javascript
   // Engineer 1 calls this in popup.js
   import Guardian from '../utils/guardian.js';
   
   const guardian = new Guardian();
   const result = await guardian.validate(intent);
   // Engineer 1 displays result.mode, result.warnings, etc.
   ```

2. **Calendar Integration**
   ```javascript
   // Engineer 1 calls this in popup.js
   import GoogleCalendarService from '../utils/calendar.js';
   
   const calendar = new GoogleCalendarService();
   const result = await calendar.createEvent(eventDetails);
   // Engineer 1 shows result.event_url
   ```

3. **Error Handling**
   ```javascript
   // Engineer 1 uses this in popup.js
   import ErrorHandler from '../utils/error-handler.js';
   
   try {
     // API call
   } catch (error) {
     const message = ErrorHandler.handle(error);
     // Engineer 1 shows message in toast
   }
   ```

4. **API Calls**
   ```javascript
   // Engineer 1 uses this in popup.js
   import API from '../utils/api.js';
   
   const result = await API.request('/actions/execute', {
     method: 'POST',
     body: JSON.stringify({ action_id: id })
   });
   ```

---

## **✅ YOUR SUCCESS CRITERIA**

### **Week 1 Goals:**
- [ ] Guardian validation system working (7 layers)
- [ ] Calendar integration complete (create + delete)
- [ ] Error handling comprehensive (all edge cases)
- [ ] API wrapper enhanced (retry, timeout)
- [ ] All files tested independently

### **Week 2 Goals:**
- [ ] Performance optimized (caching, monitoring)
- [ ] Demo mode working (test without API)
- [ ] Security audit complete (validation, rate limiting)
- [ ] Storage manager working (Chrome Storage API)
- [ ] All edge cases handled

### **Launch Ready:**
- [ ] All backend logic tested
- [ ] Zero critical bugs
- [ ] Error handling covers all cases
- [ ] Performance is optimized (<3s response time)

---

## **🚀 QUICK START**

### **Day 1 Morning:**
1. Read this README fully
2. Review `PROJECT_OVERVIEW.md` for context
3. Review `YOUR_TASKS.md` for detailed breakdown
4. Start with `utils/guardian.js` (Day 1 task)

### **Daily Routine:**
1. **Morning**: Review tasks for the day
2. **During**: Work on your files, test independently
3. **Evening**: Commit changes, update progress
4. **Blockers**: Communicate with Engineer 1 immediately

---

## **💡 TIPS FOR SUCCESS**

1. **Test Independently**: Create `test.html` files to test your functions
2. **Use Demo Mode**: Build `demo-mode.js` early for faster iteration
3. **Export Clearly**: Use ES6 modules, clear exports
4. **Comment Code**: JSDoc comments for all functions
5. **Handle Errors**: Always return user-friendly messages
6. **Performance**: Cache API responses, optimize queries
7. **Security**: Validate all inputs, sanitize user data

---

## **🧪 TESTING**

### **Test Your Functions Independently:**
```html
<!-- test-guardian.html -->
<script type="module">
  import Guardian from './utils/guardian.js';
  
  const guardian = new Guardian();
  const result = await guardian.validate({
    intent_type: 'create_event',
    confidence: 0.8,
    entities: {
      title: 'Meeting',
      when: 'tomorrow 2pm',
      duration_minutes: 60
    }
  });
  
  console.log(result);
</script>
```

### **Use Demo Mode:**
```javascript
// Enable demo mode
localStorage.setItem('demo_mode', 'true');

// Test without hitting real APIs
const result = await DemoMode.mockCalendarCreate({
  title: 'Test Meeting',
  when: 'tomorrow 2pm'
});
```

---

## **📚 KEY DOCUMENTS**

1. **This README** - Your guide
2. **YOUR_TASKS.md** - Detailed task breakdown
3. **PROJECT_OVERVIEW.md** - Full project context
4. **ENGINEER_GUIDE.md** - Ownership & workflow
5. **Master Context Summary** - Full project plan

---

## **❓ WHEN YOU'RE STUCK**

1. **API Questions**: Check `backend/app/routes/` for endpoints
2. **Guardian Questions**: Review `backend/app/services/guardian.py`
3. **Integration Questions**: Check integration examples above
4. **Scope Questions**: Check master context summary
5. **Stuck >30 min**: Ask Engineer 1 or team lead

---

## **🎯 REMEMBER**

**Your job is to make voice commands work flawlessly.**

**Every function should be:**
- ✅ Reliable (handles all edge cases)
- ✅ Fast (optimized, cached)
- ✅ Secure (validated, sanitized)
- ✅ Helpful (clear error messages)

**Focus on backend logic, Engineer 1 handles the UI.**

**Now go build something robust! 🚀**

