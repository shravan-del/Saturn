# 🎤 Voice Guardian - Project Overview

## **WHAT IS THIS PROJECT?**

Voice Guardian is a Chrome extension that lets users create Google Calendar events using voice commands. 

**Simple flow:**
1. User clicks microphone → speaks "Schedule meeting tomorrow at 2pm"
2. Extension records voice → sends to backend
3. Backend parses intent → validates with Guardian → creates action
4. User confirms → Extension creates real Google Calendar event

---

## **CURRENT ARCHITECTURE**

### **Frontend (Chrome Extension)**
```
extension/
├── popup/                    # Main UI (Engineer 1 owns)
│   ├── popup.html           # UI structure
│   ├── popup.css            # Styling
│   └── popup.js             # UI logic, voice recording (1118 lines)
│
├── utils/                    # Backend utilities (YOU own)
│   ├── api.js               # API wrapper (basic)
│   ├── auth.js              # Auth helpers (basic)
│   ├── storage.js           # Storage helpers
│   └── voice.js             # Voice recognition wrapper
│
├── background/
│   └── service-worker.js     # Keyboard shortcuts (basic)
│
└── manifest.json            # Extension config
```

### **Backend (FastAPI)**
```
backend/app/
├── main.py                  # FastAPI app entry
├── routes/
│   ├── voice.py            # POST /voice/command - processes voice
│   ├── actions.py          # POST /actions/execute - executes action
│   └── auth.py             # Google OAuth
│
├── services/
│   ├── intent_parser.py    # Parses voice command → structured intent
│   ├── guardian.py         # Validates intent (basic 7-layer system)
│   └── google_calendar.py  # Creates real calendar events
│
└── models.py               # Database models (User, Action)
```

---

## **HOW IT WORKS (CURRENT FLOW)**

### **Step 1: User Speaks**
- User clicks microphone in `popup.js`
- Web Speech API records voice → converts to text
- Text stored in `state.transcript`

### **Step 2: Send to Backend**
- `popup.js` calls `API.request('/voice/command', { command: transcript })`
- Goes to `backend/app/routes/voice.py` → `POST /voice/command`

### **Step 3: Backend Processing**
```python
# voice.py
intent = intent_parser.parse(command)        # OpenAI GPT-4o-mini parses
guardian_result = guardian.check_action(intent)  # Validates safety
action = Action(...)                          # Saves to database
return { action_id, intent, guardian }
```

### **Step 4: Guardian Validation**
```python
# guardian.py (current - basic)
- Checks confidence score
- Validates required fields (title, when)
- Calculates risk_score
- Returns mode: 'auto' | 'confirm' | 'block'
```

### **Step 5: User Confirms**
- `popup.js` shows Guardian preview
- User clicks "Confirm"
- Calls `POST /actions/execute` with `action_id`

### **Step 6: Execute Action**
```python
# actions.py
if action.intent_type == 'create_event':
    calendar_service = GoogleCalendarService(integration)
    result = calendar_service.create_event(...)  # Real Google Calendar API
    action.status = 'completed'
```

### **Step 7: Success**
- Extension shows success message
- User can click link to view calendar event

---

## **WHAT EXISTS vs WHAT'S MISSING**

### ✅ **WHAT WORKS NOW**
- [x] Voice recognition (Web Speech API)
- [x] Backend API (FastAPI)
- [x] Intent parsing (OpenAI GPT-4o-mini + fallback)
- [x] Basic Guardian validation (confidence, required fields)
- [x] Google Calendar event creation (real API)
- [x] Authentication (Google OAuth)
- [x] Database (SQLite with User, Action models)
- [x] Chrome extension popup UI

### ❌ **WHAT'S MISSING (Your Tasks)**
- [ ] **Guardian system** - Currently basic, needs 7-layer validation
- [ ] **Calendar integration** - No conflict detection, no delete/undo
- [ ] **Error handling** - No retry logic, no user-friendly errors
- [ ] **Performance** - No caching, no optimization
- [ ] **Security** - No input sanitization, no rate limiting
- [ ] **Storage** - Using localStorage, should use Chrome Storage API
- [ ] **Background tasks** - Keyboard shortcuts work but basic
- [ ] **Demo mode** - No way to test without real API calls

---

## **YOUR FILES (Engineer 2 - Backend/Logic)**

### **Files You OWN (Create/Modify Freely)**
```
extension/utils/
├── guardian.js          ❌ MISSING - Create this (7-layer validation)
├── calendar.js           ❌ MISSING - Create this (Calendar API wrapper)
├── nlp.js                ❌ MISSING - Create this (Intent parsing wrapper)
├── speech.js             ❌ MISSING - Create this (Speech recognition wrapper)
├── api.js                ⚠️ EXISTS - Enhance (add retry, timeout, error handling)
├── error-handler.js      ❌ MISSING - Create this (centralized errors)
├── performance.js        ❌ MISSING - Create this (caching, monitoring)
├── demo-mode.js          ❌ MISSING - Create this (testing without API)
├── security.js           ❌ MISSING - Create this (sanitization, rate limiting)
└── storage.js            ⚠️ EXISTS - Enhance (add Chrome Storage API)

extension/background/
└── service-worker.js      ⚠️ EXISTS - Enhance (error logging, message handling)

extension/config/          ❌ MISSING - Create this folder
├── constants.js          ❌ MISSING - App constants
└── api-config.js         ❌ MISSING - API endpoints
```

### **Files You DON'T Touch**
```
extension/popup/
├── popup.html            ❌ Engineer 1 owns
├── popup.css             ❌ Engineer 1 owns
└── popup.js              ❌ Engineer 1 owns (but you'll integrate with it)
```

---

## **SIMPLIFIED TASK BREAKDOWN**

### **Phase 1: Understanding (NOW)**
1. ✅ Understand current architecture
2. ✅ Understand data flow
3. ✅ Identify what exists vs missing
4. ✅ Plan your file structure

### **Phase 2: Core Logic (Week 1)**
1. **Day 1-2: Guardian System** (`utils/guardian.js`)
   - 7-layer validation logic
   - Risk scoring
   - Mode determination (auto/confirm/block)

2. **Day 3: Calendar Integration** (`utils/calendar.js`)
   - Google Calendar API wrapper
   - Create event
   - Check conflicts
   - Delete event (for undo)

3. **Day 4: Error Handling** (`utils/error-handler.js`)
   - Centralized error handling
   - User-friendly messages
   - Error categorization

4. **Day 5: API Enhancement** (`utils/api.js`)
   - Retry logic
   - Timeout handling
   - Better error messages

### **Phase 3: Polish (Week 2)**
1. **Day 6-7: Performance & Demo Mode**
   - Caching (`utils/performance.js`)
   - Demo mode (`utils/demo-mode.js`)

2. **Day 8-9: Security & Storage**
   - Input validation (`utils/security.js`)
   - Chrome Storage API (`utils/storage.js`)

3. **Day 10: Integration & Testing**
   - Connect all pieces
   - Test end-to-end
   - Fix bugs

---

## **KEY CONCEPTS TO UNDERSTAND**

### **1. Guardian System**
- **Purpose**: Safety validation before executing actions
- **Current**: Basic (checks confidence, required fields)
- **Your Task**: Build 7-layer system
  - Layer 1: Sanity checks
  - Layer 2: Conflict detection
  - Layer 3: Pattern analysis
  - Layer 4: Risk scoring
  - Layer 5: Mode determination
  - Layer 6: Warning generation
  - Layer 7: Recommendation

### **2. Intent Parsing**
- **Current**: Backend (`intent_parser.py`) uses OpenAI
- **Your Task**: Create frontend wrapper (`utils/nlp.js`)
  - Call backend API
  - Handle errors
  - Fallback logic

### **3. Calendar Integration**
- **Current**: Backend (`google_calendar.py`) creates events
- **Your Task**: Create frontend wrapper (`utils/calendar.js`)
  - Call backend API
  - Handle conflicts
  - Support undo (delete event)

### **4. Error Handling**
- **Current**: Basic try/catch, console.error
- **Your Task**: Centralized system
  - Categorize errors (network, auth, rate limit)
  - User-friendly messages
  - Logging

---

## **DATA FLOW DIAGRAM**

```
User Voice
    ↓
popup.js (records with Web Speech API)
    ↓
API.request('/voice/command')
    ↓
Backend: voice.py
    ↓
intent_parser.parse() → { intent_type, entities, confidence }
    ↓
guardian.check_action() → { mode, risk_score, warnings }
    ↓
Action saved to database
    ↓
Return to popup.js
    ↓
Show Guardian preview
    ↓
User confirms
    ↓
API.request('/actions/execute')
    ↓
Backend: actions.py
    ↓
google_calendar.create_event() → Real Google Calendar API
    ↓
Success → Show calendar link
```

---

## **NEXT STEPS**

1. **Read this document** - Understand the architecture
2. **Explore the code** - Look at `popup.js`, `voice.py`, `guardian.py`
3. **Test the extension** - Load it in Chrome, try a voice command
4. **Start with Guardian** - Create `utils/guardian.js` (Day 1 task)

---

## **QUESTIONS TO ANSWER**

Before starting tasks, make sure you understand:
- [ ] How does voice recognition work? (Web Speech API)
- [ ] How does the backend parse intents? (OpenAI GPT-4o-mini)
- [ ] How does Guardian validation work? (Basic checks)
- [ ] How are calendar events created? (Google Calendar API)
- [ ] What's the data flow from voice → calendar event?
- [ ] What files do you own vs Engineer 1?

---

**Ready to start? Begin with understanding the current Guardian system, then build your enhanced version.**

