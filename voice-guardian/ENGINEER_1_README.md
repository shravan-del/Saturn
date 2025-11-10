# 👨‍💻 Engineer 1 - Frontend/UI Focus

## **YOUR ROLE**

You are **Engineer 1** - Frontend/UI Focus
- **You own**: All UI files, user interactions, styling, onboarding
- **You work with**: Engineer 2 for API integration and backend logic
- **Your goal**: Build beautiful, intuitive UI that makes voice commands feel magical


---

## **📁 YOUR FILES (You Own These)**

### **Primary Files:**
```
extension/
├── popup/
│   ├── popup.html          ⭐ YOU OWN - UI structure
│   ├── popup.css           ⭐ YOU OWN - Styling & animations
│   └── popup.js            ⭐ YOU OWN - UI logic, event handlers
│
├── options/
│   ├── options.html        ⭐ YOU OWN - Settings page UI
│   ├── options.css         ⭐ YOU OWN - Settings styling
│   └── options.js          ⭐ YOU OWN - Settings logic
│
└── content-scripts/
    ├── calendar-injector.js  🤝 SHARED - Coordinate with Eng 2
    ├── gmail-injector.js     🤝 SHARED - Coordinate with Eng 2
    └── styles.css            ⭐ YOU OWN - Injected styles
```

### **What You DON'T Touch:**
```
extension/utils/              ❌ Engineer 2 owns
extension/config/             ❌ Engineer 2 owns
extension/background/        ❌ Engineer 2 owns
backend/                     🤝 Both can work here
```

---

## **🎯 YOUR TASKS (Week 1-2)**

### **Week 1: Core Features (Days 1-5)**

#### **Days 1-2: Undo Functionality + Settings**
**Goal**: Users can undo actions within 30 seconds and access settings

**Tasks:**
1. **Undo Button** (`popup.js`)
   - Show undo button after action success
   - 30-second countdown timer
   - Call Engineer 2's undo API when clicked
   - Hide button after 30 seconds or if user dismisses

2. **Settings Page** (`options/`)
   - Connect settings UI to storage
   - Default event duration selector
   - Guardian mode selector (auto/confirm/block)
   - Disconnect account button
   - Clear history button
   - Save preferences to Chrome Storage

**Files to Modify:**
- `popup/popup.js` - Add undo button logic
- `popup/popup.html` - Add undo button UI
- `popup/popup.css` - Style undo button
- `options/options.js` - Connect settings to storage
- `options/options.html` - Settings form

**Integration Points:**
- Use Engineer 2's `utils/api.js` for undo API call
- Use Engineer 2's `utils/storage.js` for settings storage

---

#### **Days 3-5: Intent Parser Integration + NLP Logic**
**Goal**: Display parsed intent and confidence scores in UI

**Tasks:**
1. **Intent Display** (`popup.js`)
   - Show parsed intent after voice command
   - Display confidence score with color coding
   - Show extracted entities (title, date, time, duration)
   - Allow user to edit before confirming

2. **NLP Integration** (`popup.js`)
   - Call Engineer 2's `utils/nlp.js` to parse commands
   - Handle parsing errors gracefully
   - Show loading state during parsing
   - Display parsing results in Guardian preview

3. **Guardian Preview** (`popup.js`)
   - Show Guardian validation results
   - Display risk score and warnings
   - Show action preview (what will happen)
   - Color-code by mode (auto=green, confirm=yellow, block=red)

**Files to Modify:**
- `popup/popup.js` - Add intent parsing UI logic
- `popup/popup.html` - Add intent display components
- `popup/popup.css` - Style intent display

**Integration Points:**
- Use Engineer 2's `utils/nlp.js` for intent parsing
- Use Engineer 2's `utils/guardian.js` for validation display

---

### **Week 2: Polish + Launch (Days 6-10)**

#### **Days 6-7: Onboarding Flow + UI Polish**
**Goal**: First-time users understand how to use the extension

**Tasks:**
1. **Onboarding Flow** (`popup.js`)
   - Detect first-time users
   - Show welcome screen with 3-step tutorial
   - Guide user through: sign in → voice command → confirm
   - Skip option for returning users

2. **UI Polish** (`popup.css`, `popup.js`)
   - Smooth animations for all interactions
   - Loading states for all async operations
   - Toast notifications for success/errors
   - Micro-interactions (hover, click, focus)

**Files to Modify:**
- `popup/popup.html` - Add onboarding screens
- `popup/popup.css` - Add animations and polish
- `popup/popup.js` - Add onboarding logic

---

#### **Days 8-9: Action History + Error States**
**Goal**: Users can see past actions and understand errors

**Tasks:**
1. **Action History** (`popup.js`)
   - Display last 50 actions in sidebar
   - Show action details (title, date, status)
   - Click to view in Google Calendar
   - Filter by status (success/failed/pending)

2. **Error States** (`popup.js`, `popup.css`)
   - Show user-friendly error messages
   - Retry buttons for failed actions
   - Clear error states (no technical jargon)
   - Help links for common issues

**Files to Modify:**
- `popup/popup.html` - Add history sidebar
- `popup/popup.css` - Style history and errors
- `popup/popup.js` - Add history display logic

---

#### **Day 10: Final Testing + Chrome Web Store Prep**
**Goal**: Extension is ready for Chrome Web Store submission

**Tasks:**
1. **Final Testing**
   - Test all user flows end-to-end
   - Fix any UI bugs
   - Test on Mac, Windows, Linux
   - Verify all animations work

2. **Chrome Web Store Assets**
   - Create extension screenshots (1280x800)
   - Write store description
   - Create promotional images
   - Prepare demo video

**Files to Modify:**
- All popup files - Final polish
- Create `store-assets/` folder with images

---

## **🎨 DESIGN SYSTEM**

### **Color Palette:**
```css
/* Primary Colors */
--primary-purple: #6366F1;
--purple-dark: #4F46E5;
--gold-accent: #F59E0B;
--gold-light: #FBBF24;

/* Backgrounds */
--bg-primary: #0F0F0F;
--bg-secondary: #1A1A1A;
--bg-card: #1E1E1E;

/* Text */
--text-primary: #FFFFFF;
--text-secondary: #A0A0A0;
--text-tertiary: #6B6B6B;

/* Status */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
```

### **Key UI Components:**

1. **Voice Button**
   - 120px circular button
   - Purple gradient background
   - Ripple animation on click
   - Pulsing animation when listening

2. **Cards**
   - Dark background (#1E1E1E)
   - Subtle borders (1px, #2A2A2A)
   - Rounded corners (12px)
   - Subtle shadow

3. **Toast Notifications**
   - Top-right position
   - Auto-dismiss after 3 seconds
   - Slide-in animation
   - Success (green), Error (red), Info (blue)

4. **Loading States**
   - Triple-ring spinner
   - Smooth rotation animation
   - Centered in container

---

## **🔌 INTEGRATION WITH ENGINEER 2**

### **How to Use Engineer 2's Code:**

1. **API Calls** (`utils/api.js`)
   ```javascript
   // In popup.js
   import API from '../utils/api.js';
   
   const result = await API.request('/actions/execute', {
     method: 'POST',
     body: JSON.stringify({ action_id: id })
   });
   ```

2. **Guardian Validation** (`utils/guardian.js`)
   ```javascript
   // In popup.js
   import Guardian from '../utils/guardian.js';
   
   const guardian = new Guardian();
   const validation = await guardian.validate(intent);
   // Show validation.mode, validation.warnings, etc.
   ```

3. **Storage** (`utils/storage.js`)
   ```javascript
   // In popup.js
   import Storage from '../utils/storage.js';
   
   await Storage.set('settings', { duration: 60 });
   const settings = await Storage.get('settings');
   ```

4. **Error Handling** (`utils/error-handler.js`)
   ```javascript
   // In popup.js
   import ErrorHandler from '../utils/error-handler.js';
   
   try {
     // Your code
   } catch (error) {
     const message = ErrorHandler.handle(error);
     showToast(message, 'error');
   }
   ```

---

## **✅ YOUR SUCCESS CRITERIA**

### **Week 1 Goals:**
- [ ] Undo button works (30-second window)
- [ ] Settings page is functional
- [ ] Intent parsing results display correctly
- [ ] Guardian preview shows validation results
- [ ] All UI components are styled consistently

### **Week 2 Goals:**
- [ ] Onboarding flow guides first-time users
- [ ] Action history displays last 50 actions
- [ ] Error states are user-friendly
- [ ] All animations are smooth
- [ ] Extension works on Mac, Windows, Linux

### **Launch Ready:**
- [ ] All user flows work end-to-end
- [ ] Zero UI bugs
- [ ] Chrome Web Store assets ready
- [ ] Demo video recorded

---

## **🚀 QUICK START**

### **Day 1 Morning:**
1. Read this README fully
2. Review `PROJECT_OVERVIEW.md` for context
3. Open `extension/popup/popup.js` in your editor
4. Start with undo button (Day 1 task)

### **Daily Routine:**
1. **Morning**: Review tasks for the day
2. **During**: Work on your files, test as you go
3. **Evening**: Commit changes, update progress
4. **Blockers**: Communicate with Engineer 2 immediately

---

## **💡 TIPS FOR SUCCESS**

1. **Test in Chrome**: Load extension and test every change
2. **Use Console**: `console.log()` everything for debugging
3. **Mobile-First**: Design for desktop (Chrome extension)
4. **Accessibility**: Use semantic HTML, ARIA labels
5. **Performance**: Keep animations smooth (60fps)
6. **Error Handling**: Always show user-friendly messages
7. **Communication**: Coordinate with Engineer 2 for API changes

---

## **📚 KEY DOCUMENTS**

1. **This README** - Your guide
2. **PROJECT_OVERVIEW.md** - Full project context
3. **ENGINEER_GUIDE.md** - Ownership & workflow
4. **Master Context Summary** - Full project plan

---

## **❓ WHEN YOU'RE STUCK**

1. **UI Questions**: Check `popup.css` for existing styles
2. **API Questions**: Ask Engineer 2 or check `utils/api.js`
3. **Integration Questions**: Review integration examples above
4. **Scope Questions**: Check master context summary
5. **Stuck >30 min**: Ask Engineer 2 or team lead

---

## **🎯 REMEMBER**

**Your job is to make voice commands feel magical.**

**Every interaction should be:**
- ✅ Intuitive (users know what to do)
- ✅ Fast (no lag, smooth animations)
- ✅ Beautiful (dark theme, purple/gold accents)
- ✅ Helpful (clear feedback, error messages)

**Focus on user experience, Engineer 2 handles the logic.**

**Now go build something beautiful! 🚀**

