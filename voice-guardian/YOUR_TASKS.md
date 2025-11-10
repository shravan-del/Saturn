# 🎯 Your Tasks - Engineer 2 (Backend/Logic Focus)

## **YOUR IDENTITY**

You are **Engineer 2** - Backend/Logic Focus
- **You own**: Backend logic, APIs, validation, error handling, integrations
- **You DON'T touch**: UI files (popup.html, popup.css, popup.js) - Engineer 1 owns those

---

## **FILE OWNERSHIP**

### ✅ **YOUR FILES (You Own These - Modify Freely)**

```
extension/utils/
├── guardian.js          ❌ CREATE - Guardian validation logic
├── calendar.js          ❌ CREATE - Google Calendar API wrapper
├── nlp.js               ❌ CREATE - Intent parsing wrapper
├── speech.js            ❌ CREATE - Speech recognition wrapper
├── api.js               ⚠️ ENHANCE - Add retry, timeout, error handling
├── error-handler.js     ❌ CREATE - Centralized error handling
├── performance.js       ❌ CREATE - Caching, monitoring
├── demo-mode.js         ❌ CREATE - Testing without API
├── security.js          ❌ CREATE - Input validation, rate limiting
└── storage.js           ⚠️ ENHANCE - Add Chrome Storage API

extension/background/
└── service-worker.js     ⚠️ ENHANCE - Error logging, message handling

extension/config/         ❌ CREATE THIS FOLDER
├── constants.js         ❌ CREATE - App constants
└── api-config.js        ❌ CREATE - API endpoints
```

### 🚫 **DON'T TOUCH (Engineer 1 Owns)**
```
extension/popup/
├── popup.html           ❌ Engineer 1
├── popup.css            ❌ Engineer 1
└── popup.js             ❌ Engineer 1
```

---

## **TASK BREAKDOWN (One at a Time)**

### **PHASE 1: UNDERSTANDING (Do This First)**

#### **Task 0: Understand the Project** ⭐ START HERE
**Goal**: Understand how everything works before building

**Steps:**
1. Read `PROJECT_OVERVIEW.md` (you just created this)
2. Read `extension/popup/popup.js` (lines 1-200) - understand voice flow
3. Read `backend/app/routes/voice.py` - understand backend flow
4. Read `backend/app/services/guardian.py` - understand current validation
5. Test the extension:
   - Load in Chrome (`chrome://extensions/`)
   - Try a voice command: "Schedule meeting tomorrow at 2pm"
   - Watch console logs
   - See what happens end-to-end

**Questions to Answer:**
- [ ] How does voice recognition work?
- [ ] How does the backend parse intents?
- [ ] How does Guardian validation work currently?
- [ ] How are calendar events created?
- [ ] What's the data flow from voice → calendar event?

**Time**: 1-2 hours

---

### **PHASE 2: CORE LOGIC (Week 1)**

#### **Task 1: Create Guardian System** ⭐ DAY 1-2
**File**: `extension/utils/guardian.js` (CREATE)

**Goal**: Build 7-layer validation system

**What to Build:**
```javascript
class Guardian {
  constructor() {
    this.riskThresholds = {
      auto: 0.19,      // Execute immediately
      confirm: 0.49,   // Ask user
      block: 1.0       // Don't allow
    };
  }

  async validate(intent) {
    // Layer 1: Sanity checks
    // Layer 2: Conflict detection
    // Layer 3: Pattern analysis
    // Layer 4: Risk scoring
    // Layer 5: Mode determination
    // Layer 6: Warning generation
    // Layer 7: Recommendation
    
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

**Reference**: Look at `backend/app/services/guardian.py` for current logic

**Test**: Create `test.html` to test Guardian.validate() independently

**Time**: 4-6 hours

---

#### **Task 2: Create Calendar Integration** ⭐ DAY 3
**File**: `extension/utils/calendar.js` (CREATE)

**Goal**: Google Calendar API wrapper for frontend

**What to Build:**
```javascript
class GoogleCalendarService {
  async createEvent(eventDetails) {
    // Call backend API: POST /actions/execute
    // Handle errors
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

**Reference**: Look at `backend/app/services/google_calendar.py` for API calls

**Test**: Test calendar.createEvent() independently

**Time**: 3-4 hours

---

#### **Task 3: Create Error Handler** ⭐ DAY 4
**File**: `extension/utils/error-handler.js` (CREATE)

**Goal**: Centralized error handling

**What to Build:**
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

**Test**: Test with various error types

**Time**: 2-3 hours

---

#### **Task 4: Enhance API Wrapper** ⭐ DAY 5
**File**: `extension/utils/api.js` (ENHANCE)

**Goal**: Add retry logic, timeout, better error handling

**What to Add:**
- Retry logic with exponential backoff
- Request timeout handling
- Network error detection
- Token refresh on 401
- Better error messages

**Current Code**: Already exists, just enhance it

**Test**: Test with network failures, timeouts

**Time**: 2-3 hours

---

### **PHASE 3: POLISH (Week 2)**

#### **Task 5: Create Performance Monitor** ⭐ DAY 6
**File**: `extension/utils/performance.js` (CREATE)

**Goal**: Caching and performance monitoring

**What to Build:**
- PerformanceMonitor class (timing)
- CacheManager class (caching)

**Time**: 2-3 hours

---

#### **Task 6: Create Demo Mode** ⭐ DAY 7
**File**: `extension/utils/demo-mode.js` (CREATE)

**Goal**: Test without real API calls

**What to Build:**
- Mock calendar creation
- Mock auth check
- Enable with localStorage flag

**Time**: 2-3 hours

---

#### **Task 7: Create Security Manager** ⭐ DAY 8
**File**: `extension/utils/security.js` (CREATE)

**Goal**: Input validation, sanitization, rate limiting

**What to Build:**
- Input sanitization
- Token validation
- Rate limiting

**Time**: 2-3 hours

---

#### **Task 8: Enhance Storage Manager** ⭐ DAY 9
**File**: `extension/utils/storage.js` (ENHANCE)

**Goal**: Use Chrome Storage API instead of localStorage

**What to Add:**
- Chrome Storage API support
- Fallback to localStorage
- Unified interface

**Time**: 1-2 hours

---

#### **Task 9: Enhance Service Worker** ⭐ DAY 10
**File**: `extension/background/service-worker.js` (ENHANCE)

**Goal**: Error logging, message handling

**What to Add:**
- Error logging
- Message handling
- Better keyboard shortcut handling

**Time**: 1-2 hours

---

## **HOW TO APPROACH EACH TASK**

### **Before Starting Any Task:**

1. **Read the current code**
   - Understand what exists
   - See how it's used
   - Identify what's missing

2. **Plan your approach**
   - What functions do you need?
   - What's the API/interface?
   - How will it be used?

3. **Create the file**
   - Start with basic structure
   - Add one function at a time
   - Test as you go

4. **Test independently**
   - Create `test.html` file
   - Test your functions
   - Don't wait for UI

5. **Integrate**
   - Import in `popup.js` (coordinate with Engineer 1)
   - Test end-to-end
   - Fix bugs

---

## **EXAMPLE: Task 1 (Guardian System)**

### **Step 1: Understand Current Guardian**
```bash
# Read the backend Guardian
cat backend/app/services/guardian.py
```

**Current Logic:**
- Checks confidence score
- Validates required fields (title, when)
- Calculates risk_score
- Returns mode: auto/confirm/block

### **Step 2: Plan Your Guardian**
```javascript
// extension/utils/guardian.js
class Guardian {
  // 7 layers:
  // 1. Sanity checks (required fields)
  // 2. Conflict detection (calendar conflicts)
  // 3. Pattern analysis (unusual patterns)
  // 4. Risk scoring (calculate risk)
  // 5. Mode determination (auto/confirm/block)
  // 6. Warning generation (user warnings)
  // 7. Recommendation (suggestions)
}
```

### **Step 3: Create File**
```bash
touch extension/utils/guardian.js
```

### **Step 4: Write Code**
```javascript
// Start with basic structure
// Add one layer at a time
// Test each layer
```

### **Step 5: Test**
```html
<!-- test.html -->
<script type="module">
  import Guardian from './utils/guardian.js';
  
  const guardian = new Guardian();
  const result = await guardian.validate({
    intent_type: 'create_event',
    confidence: 0.8,
    entities: { title: 'Meeting', when: 'tomorrow 2pm' }
  });
  
  console.log(result);
</script>
```

### **Step 6: Integrate**
```javascript
// In popup.js (coordinate with Engineer 1)
import Guardian from './utils/guardian.js';
const guardian = new Guardian();
const result = await guardian.validate(intent);
```

---

## **IMPORTANT NOTES**

### **1. Test Independently**
- Don't wait for UI to be ready
- Create `test.html` files
- Test your functions in isolation

### **2. Use Demo Mode Early**
- Build `demo-mode.js` early
- Test without hitting real APIs
- Faster iteration

### **3. Export Clearly**
```javascript
// Good
export default Guardian;
export { PerformanceMonitor, CacheManager };

// Bad
module.exports = {...}
```

### **4. Comment Your Code**
```javascript
/**
 * Validates intent before execution
 * @param {Object} intent - Parsed intent from NLP
 * @returns {Object} validation result with risk score
 */
```

### **5. Handle Errors Gracefully**
```javascript
try {
  // Your code
} catch (error) {
  console.error('[Guardian]', error);
  return { success: false, error: 'Friendly message' };
}
```

---

## **SUCCESS CRITERIA**

### **By End of Week 1:**
- [ ] Guardian validation system working (7 layers)
- [ ] Calendar API integration complete (create + delete)
- [ ] Error handling comprehensive (all edge cases)
- [ ] API wrapper enhanced (retry, timeout)
- [ ] All files tested independently

### **By End of Week 2:**
- [ ] Performance optimized (caching, monitoring)
- [ ] Demo mode working (test without API)
- [ ] Security audit complete (validation, rate limiting)
- [ ] Storage manager working (Chrome Storage API)
- [ ] All edge cases handled
- [ ] Documentation written (code comments)

---

## **START HERE**

1. **Read `PROJECT_OVERVIEW.md`** - Understand the project
2. **Test the extension** - See how it works now
3. **Start with Task 1** - Create Guardian system
4. **Work one task at a time** - Don't rush
5. **Test as you go** - Don't wait until the end

---

**Ready? Start with Task 0 (Understanding), then move to Task 1 (Guardian System).**

