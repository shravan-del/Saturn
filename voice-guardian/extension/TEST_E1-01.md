# 🧪 Testing Guide: E1-01 Voice Button UI

## Quick Start

1. **Load Extension in Chrome:**
   - Open `chrome://extensions/`
   - Enable "Developer mode" (toggle top-right)
   - Click "Load unpacked"
   - Select: `/Users/rohan/Saturn/voice-guardian/extension`
   - Extension icon should appear in toolbar

2. **Open Extension:**
   - Click the Voice Guardian icon in Chrome toolbar
   - You should see the login screen or main interface

## Test Cases

### ✅ Test 1: Idle State
**Expected:**
- Voice button shows purple gradient (indigo to purple)
- Button is 120px circular
- No animations running
- Status indicator is empty/hidden
- Prompt says "Press to speak"

**How to test:**
- Open extension popup
- Look at voice button in center

---

### ✅ Test 2: Click Ripple Effect
**Expected:**
- When clicking button, ripple animation appears
- Ripple expands outward from center
- Animation completes in ~0.6 seconds

**How to test:**
- Click the voice button
- Watch for ripple effect

---

### ✅ Test 3: Listening State
**Expected:**
- Button changes to gold gradient
- Pulsing glow animation (1.5s cycle)
- 3 ripple layers animating continuously
- Waveform bars appear below button
- Status indicator shows "Listening" in gold
- Prompt changes to "Listening..."
- Mic icon visible

**How to test:**
- Click voice button
- Grant microphone permission if prompted
- Observe all visual changes

---

### ✅ Test 4: Processing State
**Expected:**
- Button shows spinning animation with glow
- Status indicator shows "Processing" in purple
- Mic icon pulses
- Waveform hidden
- Button opacity slightly reduced

**How to test:**
- After speaking, click "Process Command"
- Observe processing state

---

### ✅ Test 5: Keyboard Accessibility
**Expected:**
- Tab key focuses button (shows outline)
- Enter key activates button
- Space key activates button
- Screen reader announces states

**How to test:**
- Tab to voice button
- Press Enter or Space
- Use screen reader (if available)

---

### ✅ Test 6: Keyboard Shortcut
**Expected:**
- Ctrl+Shift+V (Cmd+Shift+V on Mac) activates voice button
- Works from any page

**How to test:**
- Press keyboard shortcut
- Extension popup should open and activate voice

---

### ✅ Test 7: State Transitions
**Expected:**
- Smooth transitions between states
- No flickering or jumps
- Animations are smooth (60fps)

**How to test:**
- Click button → observe transition to listening
- Speak → observe transition to idle
- Process → observe transition to processing
- Complete → observe return to idle

---

## Common Issues

### Issue: Button doesn't respond
**Fix:**
- Check browser console for errors (F12)
- Verify microphone permissions granted
- Reload extension

### Issue: Animations not smooth
**Fix:**
- Check browser performance
- Disable other extensions
- Test in incognito mode

### Issue: Status indicator not showing
**Fix:**
- Check if `status-indicator` element exists in HTML
- Verify JavaScript is updating textContent
- Check CSS for visibility

### Issue: Waveform not appearing
**Fix:**
- Verify `waveform` element exists
- Check CSS `display: flex` is applied
- Verify JavaScript sets `display = 'flex'`

---

## Success Criteria

✅ All states work correctly
✅ Animations are smooth
✅ Accessibility features work
✅ Keyboard navigation works
✅ Visual feedback is clear
✅ No console errors

---

## Next Steps After Testing

If all tests pass:
- ✅ Mark E1-01 as complete
- Move to E1-02 (Voice Recognition Wrapper)

If issues found:
- Document bugs
- Fix and retest
- Update implementation
