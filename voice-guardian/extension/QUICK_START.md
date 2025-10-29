# 🚀 Voice Guardian Extension - Quick Start

## ✅ **Icons Fixed!**

The extension icons have been created and the backend is running. You can now load the extension in Chrome.

## 🎯 **Load Extension in Chrome (2 Minutes)**

### Step 1: Open Chrome Extensions
1. **Go to**: `chrome://extensions/`
2. **Enable Developer Mode**: Toggle in top-right corner
3. **Click "Load unpacked"**
4. **Select**: `/Users/sathikinasetti/Saturn/voice-guardian/extension` folder
5. **Click "Select"**

### Step 2: Verify Extension Loaded
- ✅ Voice Guardian should appear in your extensions list
- ✅ Extension icon should appear in Chrome toolbar
- ✅ No error messages should show

### Step 3: Test the Extension
1. **Click the Voice Guardian icon** in toolbar
2. **Sign in with Google** (same account as web app)
3. **Try voice command**: "Schedule a meeting tomorrow at 2pm"
4. **Confirm action** when Guardian shows preview

## 🎙️ **Voice Commands to Try**

- "Schedule team standup for tomorrow at 9am"
- "Create a 30-minute code review Friday at 2pm"
- "Book 1 hour for project planning next Monday"

## 🔧 **If Extension Fails to Load**

### Check These:
1. **Icons exist**: `ls -la /Users/sathikinasetti/Saturn/voice-guardian/extension/icons/`
2. **Backend running**: `curl http://localhost:8000/health`
3. **Chrome Developer Mode**: Enabled in `chrome://extensions/`

### Common Issues:
- **"Could not load icon"**: Icons are now created ✅
- **"Could not load manifest"**: Check manifest.json syntax
- **"API request failed"**: Backend is running ✅

## 🎉 **Success!**

Once loaded, you'll have:
- ✅ Voice commands via popup
- ✅ Gmail integration (voice button in toolbar)
- ✅ Google Calendar integration (floating button)
- ✅ Keyboard shortcut (Ctrl+Shift+V)
- ✅ Settings page
- ✅ Full backend integration

**Your Voice Guardian Chrome Extension is ready to use!** 🎙️✨


