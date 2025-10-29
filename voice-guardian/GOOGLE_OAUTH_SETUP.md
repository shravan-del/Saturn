# 🔧 Google OAuth Setup for Voice Guardian

## 🚨 **Current Issue**
Google is blocking OAuth requests because the app isn't verified. This is normal for development.

## 🚀 **Quick Fix: Development Mode Setup**

### **Option 1: Add Test Users (Recommended)**

1. **Go to [Google Cloud Console](https://console.cloud.google.com)**
2. **Select your project** (Client ID: `984983934441-3b580m9ftdld3l523bcass7rjdq02t5e`)
3. **Navigate to**: APIs & Services → OAuth consent screen
4. **Configure**:
   - **User Type**: External
   - **Publishing status**: Testing
   - **Test users**: Add `shravan.athikinasetti@gmail.com`
5. **Save and try again**

### **Option 2: Create New OAuth Client (If Option 1 fails)**

1. **Go to**: APIs & Services → Credentials
2. **Click**: "+ CREATE CREDENTIALS" → "OAuth client ID"
3. **Application type**: Web application
4. **Name**: Voice Guardian Dev
5. **Authorized redirect URIs**:
   - `http://localhost:8000/auth/google/callback`
   - `http://127.0.0.1:8000/auth/google/callback`
6. **Copy the new Client ID and Secret**
7. **Update your `.env` file** with the new credentials

### **Option 3: Use Internal User Type (Easiest)**

1. **Go to**: APIs & Services → OAuth consent screen
2. **Change User Type**: From "External" to "Internal"
3. **This only works if you're using a Google Workspace account**

## 🔄 **After Making Changes**

1. **Restart the backend**:
   ```bash
   cd /Users/sathikinasetti/Saturn/voice-guardian/backend
   uvicorn app.main:app --reload --port 8000
   ```

2. **Reload the extension** in Chrome

3. **Test the OAuth flow** again

## 🎯 **Expected Result**

After configuration, you should see:
- ✅ Google OAuth page loads without "Access blocked" error
- ✅ You can complete the OAuth flow
- ✅ Extension shows "Signed in successfully!"
- ✅ Voice commands work and create real calendar events

## 🆘 **If Still Not Working**

Try this temporary workaround:

1. **Use a different Google account** (personal vs work)
2. **Clear browser cache and cookies**
3. **Try incognito mode**
4. **Check if your organization has OAuth restrictions**

## 📞 **Need Help?**

The most common issue is the OAuth consent screen configuration. Make sure:
- Your email is added as a test user
- The redirect URI is exactly: `http://localhost:8000/auth/google/callback`
- The app is in "Testing" mode, not "In production"


