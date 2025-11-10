# 🚀 Quick Start - Understanding Voice Guardian

## **WHAT IS THIS?**

Voice Guardian = Chrome extension that creates Google Calendar events using voice commands.

**Example:**
- User says: "Schedule meeting tomorrow at 2pm"
- Extension creates real Google Calendar event

---

## **HOW IT WORKS (Simple Flow)**

```
1. User clicks microphone → speaks
2. Extension records voice → converts to text
3. Sends text to backend → backend parses intent
4. Guardian validates → checks if safe to execute
5. User confirms → extension creates calendar event
6. Success → shows calendar link
```

---

## **CURRENT STATE**

### ✅ **What Works:**
- Voice recognition (Web Speech API)
- Backend API (FastAPI)
- Intent parsing (OpenAI GPT-4o-mini)
- Basic Guardian validation
- Google Calendar event creation
- Authentication (Google OAuth)

### ❌ **What's Missing (Your Tasks):**
- Enhanced Guardian system (7-layer validation)
- Calendar integration wrapper (frontend)
- Error handling (centralized)
- Performance optimization (caching)
- Security (input validation, rate limiting)
- Demo mode (testing without API)

---

## **YOUR FILES**

### **You Own (Create/Modify):**
```
extension/utils/
├── guardian.js          ❌ CREATE
├── calendar.js          ❌ CREATE
├── nlp.js               ❌ CREATE
├── speech.js            ❌ CREATE
├── api.js               ⚠️ ENHANCE
├── error-handler.js     ❌ CREATE
├── performance.js       ❌ CREATE
├── demo-mode.js         ❌ CREATE
├── security.js          ❌ CREATE
└── storage.js           ⚠️ ENHANCE

extension/background/
└── service-worker.js    ⚠️ ENHANCE
```

### **You DON'T Touch:**
```
extension/popup/
├── popup.html           ❌ Engineer 1
├── popup.css            ❌ Engineer 1
└── popup.js             ❌ Engineer 1
```

---

## **YOUR TASKS (One at a Time)**

### **Phase 1: Understanding** ⭐ START HERE
1. Read `PROJECT_OVERVIEW.md`
2. Test the extension (load in Chrome)
3. Understand the flow

### **Phase 2: Core Logic (Week 1)**
1. **Task 1**: Create Guardian system (`utils/guardian.js`)
2. **Task 2**: Create Calendar integration (`utils/calendar.js`)
3. **Task 3**: Create Error handler (`utils/error-handler.js`)
4. **Task 4**: Enhance API wrapper (`utils/api.js`)

### **Phase 3: Polish (Week 2)**
5. **Task 5**: Performance monitor (`utils/performance.js`)
6. **Task 6**: Demo mode (`utils/demo-mode.js`)
7. **Task 7**: Security manager (`utils/security.js`)
8. **Task 8**: Storage manager (`utils/storage.js`)
9. **Task 9**: Service worker (`background/service-worker.js`)

---

## **HOW TO START**

### **Step 1: Understand**
```bash
# Read the overview
cat PROJECT_OVERVIEW.md

# Read your tasks
cat YOUR_TASKS.md
```

### **Step 2: Test Extension**
```bash
# Load extension in Chrome
# 1. Go to chrome://extensions/
# 2. Enable Developer Mode
# 3. Click "Load unpacked"
# 4. Select extension/ folder
# 5. Try voice command: "Schedule meeting tomorrow at 2pm"
```

### **Step 3: Explore Code**
```bash
# Look at current Guardian (backend)
cat backend/app/services/guardian.py

# Look at voice flow (frontend)
cat extension/popup/popup.js | head -200

# Look at API routes (backend)
cat backend/app/routes/voice.py
```

### **Step 4: Start Task 1**
```bash
# Create Guardian file
touch extension/utils/guardian.js

# Start coding (see YOUR_TASKS.md for details)
```

---

## **KEY CONCEPTS**

### **1. Guardian System**
- **Purpose**: Safety validation before executing actions
- **Current**: Basic (checks confidence, required fields)
- **Your Task**: Build 7-layer system

### **2. Intent Parsing**
- **Current**: Backend uses OpenAI GPT-4o-mini
- **Your Task**: Create frontend wrapper

### **3. Calendar Integration**
- **Current**: Backend creates events via Google Calendar API
- **Your Task**: Create frontend wrapper

### **4. Error Handling**
- **Current**: Basic try/catch
- **Your Task**: Centralized system with user-friendly messages

---

## **IMPORTANT FILES TO READ**

1. **`PROJECT_OVERVIEW.md`** - Full project explanation
2. **`YOUR_TASKS.md`** - Detailed task breakdown
3. **`extension/popup/popup.js`** - Current UI logic (lines 1-200)
4. **`backend/app/routes/voice.py`** - Backend voice endpoint
5. **`backend/app/services/guardian.py`** - Current Guardian logic

---

## **TESTING TIPS**

### **Test Independently**
```html
<!-- test.html -->
<script type="module">
  import Guardian from './utils/guardian.js';
  
  const guardian = new Guardian();
  const result = await guardian.validate({...});
  console.log(result);
</script>
```

### **Use Demo Mode**
```javascript
// Enable demo mode
localStorage.setItem('demo_mode', 'true');

// Test without hitting real APIs
```

---

## **NEXT STEPS**

1. ✅ Read `PROJECT_OVERVIEW.md` (understand the project)
2. ✅ Read `YOUR_TASKS.md` (understand your tasks)
3. ✅ Test the extension (see how it works)
4. ✅ Start Task 1 (Create Guardian system)

---

**Questions? Read `PROJECT_OVERVIEW.md` first, then `YOUR_TASKS.md`.**

