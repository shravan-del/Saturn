# 🎤 Voice Guardian

**Enterprise AI Voice Assistant for Autonomous Work Execution**

Voice Guardian is a Chrome extension that enables users to create Google Calendar events using natural voice commands. Built with FastAPI backend and modern web technologies.

---

## **🚀 Quick Start**

### **Prerequisites**
- Python 3.11+
- Node.js 18+ (for frontend)
- Chrome browser
- Google OAuth credentials

### **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp env.example .env
# Edit .env with your API keys
uvicorn app.main:app --reload --port 8000
```

### **Extension Setup**
1. Open Chrome: `chrome://extensions/`
2. Enable Developer Mode
3. Click "Load unpacked"
4. Select `extension/` folder
5. Extension is ready!

### **Test It**
1. Click extension icon
2. Sign in with Google
3. Say: "Schedule meeting tomorrow at 2pm"
4. Confirm action
5. Event created in Google Calendar!

---

## **📁 Project Structure**

```
voice-guardian/
├── extension/          # Chrome Extension
│   ├── popup/         # UI (Engineer 1)
│   ├── utils/         # Backend Logic (Engineer 2)
│   ├── config/        # Configuration (Engineer 2)
│   └── background/    # Service Worker (Engineer 2)
│
├── backend/           # FastAPI Backend
│   └── app/
│       ├── routes/    # API Routes
│       └── services/  # Business Logic
│
└── docs/              # Documentation
```

---

## **👥 For Engineers**

### **Engineer 1 (Frontend/UI)**
- Owns: `extension/popup/`, `extension/options/`
- Focus: UI, styling, user interactions
- See: `ENGINEER_GUIDE.md`

### **Engineer 2 (Backend/Logic)**
- Owns: `extension/utils/`, `extension/config/`, `extension/background/`
- Focus: API integration, validation, error handling
- See: `YOUR_TASKS.md` and `ENGINEER_GUIDE.md`

---

## **📚 Documentation**

- **`PROJECT_OVERVIEW.md`** - Full project explanation
- **`ENGINEER_GUIDE.md`** - Engineer ownership & workflow
- **`YOUR_TASKS.md`** - Engineer 2's task breakdown
- **`GOOGLE_OAUTH_SETUP.md`** - OAuth setup guide
- **`EXTENSION_SETUP.md`** - Extension setup details

---

## **🛠️ Tech Stack**

### **Frontend**
- Chrome Extension (Manifest V3)
- Web Speech API
- Vanilla JavaScript

### **Backend**
- FastAPI
- SQLite (development)
- OpenAI GPT-4o-mini
- Google Calendar API

---

## **✨ Features**

- ✅ Voice recognition (Web Speech API)
- ✅ Intent parsing (OpenAI GPT-4o-mini)
- ✅ Guardian validation (safety checks)
- ✅ Google Calendar integration
- ✅ Google OAuth authentication
- ✅ Chrome extension popup UI

---

## **🔧 Development**

### **Backend**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

### **Extension**
- Load in Chrome (`chrome://extensions/`)
- Changes auto-reload (if using watch mode)

---

## **📝 License**

Enterprise License - Contact for details

---

**Built with ❤️ by the Voice Guardian team**
