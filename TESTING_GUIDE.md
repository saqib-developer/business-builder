# LocalStorage Testing Guide

## How to Test Your Changes

The application has been successfully migrated from Firestore to localStorage. Here's how to verify everything works:

### 1. Test New User Registration (Email/Password)

1. Navigate to: http://localhost:3000/sign-up
2. Fill out the registration form
3. After successful signup, open browser DevTools (F12)
4. Go to: **Application** → **Local Storage** → **http://localhost:3000**
5. **Verify**: You should see a key like `user_abc123...` with your user data

**Expected localStorage entry**:
```json
{
  "id": "firebase-user-id",
  "email": "test@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user",
  "photoURL": "",
  "createdAt": "2025-12-13T...",
  "purchaseHistory": { ... },
  "consent": { ... }
}
```

### 2. Test Google Sign-In

1. Navigate to: http://localhost:3000/sign-in
2. Click "Continue with Google"
3. Complete Google authentication
4. Open DevTools → Application → Local Storage
5. **Verify**: `user_google-id` exists with Google profile data

### 3. Test Onboarding Flow

1. After signup, you'll be redirected to `/onboarding`
2. Complete each step:
   - Business Name
   - Logo Setup
   - Social Media
   - Website Builder
3. Open DevTools → Application → Local Storage
4. **Verify**: `onboarding_userId` contains:
```json
{
  "businessName": "Your Business",
  "logo": { "type": "uploaded", "url": "..." },
  "socialMedia": { ... },
  "website": { "templateId": "modern-shop" },
  "isComplete": true,
  "completedSteps": [1, 2, 3, 4, 5]
}
```

### 4. Test Dashboard

1. Complete onboarding and navigate to `/dashboard`
2. Your business name and progress should display correctly
3. **Verify**: All onboarding data persists after page refresh

### 5. Test Data Persistence

1. Complete some onboarding steps
2. **Refresh the page** (F5)
3. **Verify**: Your progress is still there
4. **Close and reopen the browser**
5. **Verify**: Data persists (localStorage doesn't clear on browser close)

### 6. Test Data Cleanup (Dev Tools)

1. Navigate to: http://localhost:3000/test
2. Enter password: `doxfen-reset-2024`
3. Click "Delete All Data"
4. **Verify**: All localStorage keys are removed
5. Open DevTools → Application → Local Storage
6. **Verify**: Only default keys remain

### 7. Test Authentication Persistence

1. Sign in to your account
2. Close the browser completely
3. Reopen and navigate to http://localhost:3000
4. **Verify**: You're still logged in (Firebase Auth session)
5. Navigate to `/dashboard`
6. **Verify**: Your data loads from localStorage

## What to Look For

### ✅ Success Indicators:

- User data appears in localStorage with key `user_${userId}`
- Onboarding data appears in localStorage with key `onboarding_${userId}`
- Brand settings appear with key `brandSettings`
- Data persists after page refresh
- No console errors related to Firestore
- Dashboard loads correctly with user's business name
- Profile images upload to Firebase Storage (not localStorage)

### ❌ Potential Issues:

- "Firestore is not defined" errors → Firestore was not fully removed
- Data disappears after refresh → localStorage not saving correctly
- Auth fails → Check Firebase Auth configuration
- Images don't upload → Check Firebase Storage configuration

## Browser DevTools Keys to Check

Open DevTools (F12) → Application → Local Storage → http://localhost:3000

**Expected Keys**:
```
user_abc123xyz456...          // User profile data
onboarding_abc123xyz456...    // Onboarding progress
brandSettings                 // Global brand settings
```

## Testing Checklist

- [ ] Register new user with email/password
- [ ] User data saved to localStorage
- [ ] Complete onboarding steps
- [ ] Onboarding data saved to localStorage
- [ ] Refresh page - data persists
- [ ] Sign out and sign back in
- [ ] Data loads correctly from localStorage
- [ ] Upload profile image - saves to Firebase Storage
- [ ] Dashboard shows correct business name
- [ ] No Firestore errors in console
- [ ] Test page clears all localStorage data

## Console Logs to Expect

```
✅ Firebase initialized successfully
✅ Auth emulator connected (dev mode)
✅ Storage emulator connected (dev mode)
New email user data saved to localStorage
User loaded from localStorage: test@example.com
```

## Console Logs to NOT Expect (Removed)

```
❌ Firestore emulator connected
❌ New user document created in Firestore
❌ User loaded from Firestore
```

## Migration Verification

Run this in your browser console to see all app data:

```javascript
// Get all localStorage keys
Object.keys(localStorage)
  .filter(key => key.startsWith('user_') || key.startsWith('onboarding_') || key === 'brandSettings')
  .forEach(key => {
    console.log(key, JSON.parse(localStorage.getItem(key)));
  });
```

## Clean Up Test Data

To reset everything for a fresh test:

1. Go to http://localhost:3000/test
2. Enter password: `doxfen-reset-2024`
3. Click "Delete All Data"
4. Sign out
5. Clear browser cache (optional)
6. Start fresh!

---

## Need Help?

If something isn't working:

1. Check browser console for errors
2. Verify localStorage keys exist in DevTools
3. Check that Firebase Auth is working (sign in/out)
4. Ensure no old Firestore code is running
5. Try clearing `.next` folder and rebuilding: `npm run dev`
