# Voice Guardian Web App

A full-page web application version of Voice Guardian - your AI voice assistant.

## 🚀 Quick Start

### 1. Start the Backend Server
```bash
cd /Users/sathikinasetti/Saturn/voice-guardian/backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

### 2. Start the Web App Server
```bash
cd /Users/sathikinasetti/Saturn/voice-guardian/web-app
python3 server.py
```

### 3. Open in Browser
The web app will automatically open at: http://localhost:3000

## ✨ Features

- **Full-Page Interface**: Complete web application instead of browser extension
- **Google OAuth**: Secure authentication with Google
- **Voice Commands**: Click the microphone to start voice recognition
- **Real-time Actions**: View and manage your voice-created actions
- **Quick Actions**: Pre-defined voice commands for common tasks
- **Responsive Design**: Works on desktop and mobile devices

## 🎯 How to Use

1. **Sign In**: Click "Sign in with Google" to authenticate
2. **Voice Commands**: Click the microphone button and speak
3. **View Actions**: See your created actions in the "Recent Actions" section
4. **Quick Actions**: Use the quick action buttons for common tasks

## 🗣️ Voice Commands

Try saying:
- "Schedule a meeting with John tomorrow at 2 PM"
- "Create a calendar event for team standup"
- "Send an email to the team about the project"
- "Set a reminder to call Sarah at 3 PM"

## 🔧 Technical Details

- **Frontend**: Pure HTML, CSS, JavaScript (no frameworks)
- **Backend**: FastAPI with SQLite database
- **Authentication**: Google OAuth 2.0
- **Voice Recognition**: Web Speech API
- **API**: RESTful endpoints for actions and voice processing

## 📱 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🚨 Troubleshooting

### Backend Not Running
Make sure the backend server is running on port 8000:
```bash
cd /Users/sathikinasetti/Saturn/voice-guardian/backend
uvicorn app.main:app --reload --port 8000
```

### CORS Issues
The web app server includes CORS headers to allow communication with the backend.

### Voice Recognition Not Working
- Ensure you're using a supported browser (Chrome recommended)
- Check that your microphone permissions are enabled
- Try refreshing the page

## 🎨 Customization

The web app is built with vanilla HTML, CSS, and JavaScript, making it easy to customize:

- **Styling**: Edit `styles.css` to change the appearance
- **Functionality**: Modify `app.js` to add new features
- **Layout**: Update `index.html` to change the structure

## 🔄 Development

To make changes to the web app:

1. Edit the files in the `web-app` directory
2. Refresh the browser to see changes
3. The server will serve the updated files automatically

## 📞 Support

If you encounter any issues:

1. Check the browser console (F12) for error messages
2. Ensure the backend server is running
3. Verify your Google OAuth configuration
4. Check microphone permissions

---

**Voice Guardian Web App** - Your AI voice assistant, now in full-page glory! 🎤✨


