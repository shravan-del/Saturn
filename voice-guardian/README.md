# Voice Guardian

Enterprise AI voice assistant for creating Google Calendar events from natural voice commands. Includes a Chrome extension, FastAPI backend, standalone web app, and optional React frontend.

## Prerequisites

- Python 3.11+
- Node.js 18+ (for React frontend if used)
- Chrome browser
- Google OAuth credentials for calendar and auth

## Quick Start

### Backend

```bash
cd voice-guardian/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp env.example .env
# Set API keys in .env
uvicorn app.main:app --reload --port 8000
```

### Chrome Extension

1. Open Chrome and go to chrome://extensions/
2. Turn on Developer mode
3. Click Load unpacked and choose the voice-guardian/extension folder
4. Right-click the extension icon and choose Options to open settings

### Web App (standalone, no extension)

1. Start the backend (see above)
2. From voice-guardian/web-app run: python3 server.py
3. Open http://localhost:3000

### React Frontend (optional)

1. Start the backend on port 8000
2. cd voice-guardian/frontend && npm install && npm run dev
3. Open http://localhost:5173

## Project Structure

- extension/ – Chrome extension (Manifest V3). popup/ is the main UI; utils/ holds NLP, Guardian, API, storage, auth, error handling; config/ holds constants and API endpoints; background/ is the service worker; options/ is the settings page.
- backend/ – FastAPI app. Routes: /voice/command (parse voice), /actions/execute (run action), /auth (Google OAuth). Services: intent parsing, Guardian checks, Google Calendar.
- web-app/ – Standalone HTML/CSS/JS app that talks to the same backend.
- frontend/ – React + Vite + TypeScript app (optional dashboard).

## Flow

1. User speaks (e.g. "Schedule meeting tomorrow at 2pm") in the extension or web app.
2. Client sends the transcript to POST /voice/command.
3. Backend parses intent (OpenAI), runs Guardian validation, and creates a pending action.
4. Client shows a preview; user confirms.
5. Client calls POST /actions/execute with the action id; backend creates the calendar event (or other action).
6. Client can show a link to the event and optional undo within a short window.

## Extension Modules (Engineer 2)

- config/constants.js – Timeouts, retries, Guardian thresholds, storage keys.
- config/api-config.js – Base URL and endpoint paths.
- utils/storage.js – StorageManager (Chrome storage with localStorage fallback), ActionHistory (last N actions, undo window).
- utils/nlp.js – NLPService.parse() calls backend /voice/command; fallback uses EntityExtractor and normalizeDateTime for title, when, duration, location.
- utils/guardian.js – Guardian.validate() runs 7 layers: sanity checks, conflict detection, pattern analysis, risk scoring, mode decision, warning generation, recommendation/preview.
- utils/api.js – request() with retry, timeout, auth header; undo(actionId) for POST actions/{id}/undo.
- utils/error-handler.js – categorize errors, getUserMessage(), canRetry().
- utils/auth.js – getToken(), getUser(), setSession(), logout() using Chrome storage or fallback.
- utils/security.js – sanitize input, token validation, rate limiter.
- utils/performance.js – PerformanceMonitor (timers, measureAsync), CacheManager (TTL cache).
- utils/demo-mode.js – mock calendar, auth, and intent for testing without backend.
- options/ – Settings page: account, voice settings, confirmation mode, clear data. Uses Storage and Auth.
- background/service-worker.js – install log, keyboard command, message handling, error logging.
- content-scripts/gmail-injector.js – Injects a Voice button on Gmail; sends activate-voice to extension.

## API Summary

- POST /voice/command – Body: { command: string }. Returns action_id, intent, guardian (mode, risk_score, warnings, preview).
- POST /actions/execute – Body: { action_id, confirm }. Executes the action (e.g. create calendar event).
- GET /actions/ – Returns list of user actions.
- POST /actions/{id}/undo – Undo an action within the allowed window (if implemented on backend).

## Documentation

- PROJECT_OVERVIEW.md – Architecture and data flow
- ENGINEER_1_NEW_GUIDE.md – Voice UI and calendar integration tasks
- ENGINEER_2_NEW_GUIDE.md – NLP, Guardian, settings, API, storage tickets
- GOOGLE_OAUTH_SETUP.md – OAuth setup
- EXTENSION_SETUP.md – Extension load and test

## License

Enterprise license; contact for terms.
