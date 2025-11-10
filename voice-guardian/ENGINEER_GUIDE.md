# 👥 Voice Guardian - Engineer Guide

## **PROJECT STRUCTURE**

```
voice-guardian/
├── extension/                    # Chrome Extension
│   ├── popup/                   # UI (Engineer 1 owns)
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── popup.js
│   │
│   ├── utils/                   # Backend/Logic (Engineer 2 owns)
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── storage.js
│   │   ├── voice.js
│   │   ├── guardian.js          # TODO: Implement
│   │   ├── calendar.js          # TODO: Implement
│   │   ├── nlp.js               # TODO: Implement
│   │   ├── speech.js            # TODO: Implement
│   │   ├── error-handler.js     # TODO: Implement
│   │   ├── performance.js       # TODO: Implement
│   │   ├── demo-mode.js         # TODO: Implement
│   │   └── security.js          # TODO: Implement
│   │
│   ├── config/                  # Configuration (Engineer 2 owns)
│   │   ├── constants.js
│   │   └── api-config.js
│   │
│   ├── background/              # Background Worker (Engineer 2 owns)
│   │   └── service-worker.js
│   │
│   ├── content-scripts/         # Content Scripts (Shared)
│   ├── options/                 # Options Page (Engineer 1 owns)
│   └── manifest.json            # Extension Config (Shared)
│
└── backend/                     # FastAPI Backend
    └── app/
        ├── routes/              # API Routes
        ├── services/            # Business Logic
        └── models.py            # Database Models
```

---

## **ENGINEER OWNERSHIP**

### **Engineer 1 - Frontend/UI Focus**
**Owns:**
- `extension/popup/` - All popup UI files
- `extension/options/` - Options page
- UI logic, styling, user interactions
- Onboarding flows, settings UI

**Does NOT touch:**
- `extension/utils/` - Backend logic (Engineer 2)
- `extension/config/` - Configuration (Engineer 2)
- `extension/background/` - Service worker (Engineer 2)

### **Engineer 2 - Backend/Logic Focus**
**Owns:**
- `extension/utils/` - All utility files
- `extension/config/` - Configuration files
- `extension/background/` - Service worker
- API integration, validation, error handling

**Does NOT touch:**
- `extension/popup/` - UI files (Engineer 1)
- `extension/options/` - Options page (Engineer 1)

### **Shared Files (Coordinate Changes)**
- `extension/manifest.json` - Extension configuration
- `extension/content-scripts/` - Content scripts
- `backend/` - Backend code (both can work here)

---

## **QUICK START**

### **For Engineer 1 (UI)**
1. Read `PROJECT_OVERVIEW.md` - Understand the project
2. Work on `extension/popup/` files
3. Coordinate with Engineer 2 for API integration

### **For Engineer 2 (Backend/Logic)**
1. Read `PROJECT_OVERVIEW.md` - Understand the project
2. Read `YOUR_TASKS.md` - See your task breakdown
3. Start with `extension/utils/guardian.js` (Task 1)

---

## **DEVELOPMENT WORKFLOW**

### **Before Starting Work**
1. Pull latest code: `git pull origin main`
2. Create feature branch: `git checkout -b engineer1/feature-name` or `git checkout -b engineer2/feature-name`
3. Check if your files are available (not being worked on by other engineer)

### **During Development**
1. Work on YOUR files only
2. Test independently (don't wait for other engineer)
3. Commit frequently with clear messages
4. Push your branch regularly

### **Before Merging**
1. Test your changes thoroughly
2. Check for conflicts with shared files
3. Coordinate with other engineer if touching shared files
4. Create PR or merge to main

---

## **TESTING**

### **Test Independently**
- Don't wait for other engineer's code
- Create test files (`test.html`) to test your functions
- Use demo mode for testing without API calls

### **Integration Testing**
- Test together after both engineers complete features
- Use Chrome extension popup for end-to-end testing

---

## **COMMUNICATION**

### **When to Communicate**
- Before touching shared files (`manifest.json`, content scripts)
- When your changes affect other engineer's work
- When you need something from the other engineer
- When you're stuck >30 minutes

### **How to Communicate**
- Use clear commit messages
- Add comments in code for coordination points
- Document API changes in code comments

---

## **FILE STATUS**

### **✅ Ready to Use**
- `utils/api.js` - Basic API wrapper
- `utils/auth.js` - Auth helpers
- `utils/storage.js` - Storage wrapper
- `utils/voice.js` - Voice recognition
- `config/constants.js` - Constants
- `config/api-config.js` - API config

### **📝 Needs Implementation (Engineer 2)**
- `utils/guardian.js` - Guardian validation
- `utils/calendar.js` - Calendar integration
- `utils/nlp.js` - NLP wrapper
- `utils/speech.js` - Speech wrapper
- `utils/error-handler.js` - Error handling
- `utils/performance.js` - Performance monitoring
- `utils/demo-mode.js` - Demo mode
- `utils/security.js` - Security utilities

---

## **IMPORTANT DOCUMENTATION**

1. **`PROJECT_OVERVIEW.md`** - Full project explanation
2. **`YOUR_TASKS.md`** - Engineer 2's task breakdown
3. **`README.md`** - Main project README
4. **`ENGINEER_GUIDE.md`** - This file (ownership & workflow)

---

## **QUESTIONS?**

- Read `PROJECT_OVERVIEW.md` first
- Check file ownership in this guide
- Coordinate with other engineer for shared files
- Ask if stuck >30 minutes

---

**Happy coding! 🚀**

