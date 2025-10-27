# ⚙️ Settings Page - Profile & Password Management Guide

## Overview
The Settings page allows users to manage their profile information and change their password securely. It provides a comprehensive interface for personalizing the user experience.

## Features Implemented

### ✅ Profile Management
1. **Personal Information**
   - Full Name
   - Email Address (read-only for security)
   - Current Role
   - Target Role
   - Experience Level (dropdown)
   - Education

2. **Professional Details**
   - Skills (comma-separated list)
   - Professional Bio (multi-line)
   - Career Goals (multi-line)

3. **Auto-load User Data**
   - Fetches existing profile on page load
   - Displays current values in form fields

### ✅ Password Management
1. **Secure Password Change**
   - Current password verification
   - New password with confirmation
   - Minimum 6 characters validation
   - Password mismatch detection

2. **Security Features**
   - Requires current password
   - Password hashed using bcrypt
   - Backend validation
   - Clear success/error messages

### ✅ Additional Tabs (Structure Ready)
1. **Notifications** - Email, weekly reports, job alerts preferences
2. **Privacy & Security** - Profile visibility, data sharing options
3. **Appearance** - Dark mode, language selection

## How to Access

### Navigate to Settings
```
Dashboard → Settings Icon (gear icon in header)
```
Or visit directly:
```
http://localhost:3000/settings
```

## Using the Profile Editor

### 1. Update Profile Information

**Step 1:** Navigate to Settings page
**Step 2:** Ensure "Profile" tab is selected (default)
**Step 3:** Update any fields you want to change:
- Full Name
- Current Role (e.g., "Software Developer")
- Target Role (e.g., "Senior Software Engineer")
- Experience Level (select from dropdown)
- Education (e.g., "B.Tech in Computer Science")
- Skills (comma-separated: "JavaScript, Python, React, Node.js")
- Professional Bio (your background and expertise)
- Career Goals (your aspirations)

**Step 4:** Click "Update Profile" button
**Step 5:** Wait for success message: "Profile updated successfully!"

### 2. Change Password

**Step 1:** Scroll down to "Change Password" section
**Step 2:** Enter your current password
**Step 3:** Enter new password (minimum 6 characters)
**Step 4:** Confirm new password (must match)
**Step 5:** Click "Change Password" button
**Step 6:** Wait for success message: "Password changed successfully!"

**Important Notes:**
- Current password must be correct
- New password must be at least 6 characters
- New password and confirm password must match
- Form clears after successful password change

## API Endpoints

### 1. Get Profile
```http
GET /api/user/profile
Authorization: Bearer <token>

Response:
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "John Doe",
  "experience": "mid",
  "skills": ["JavaScript", "Python", "React"],
  "education": "B.Tech in Computer Science",
  "professionalBio": "Experienced developer...",
  "careerGoals": "Become a senior engineer",
  "currentRole": "Software Developer",
  "targetRole": "Senior Software Engineer",
  "stats": {
    "completedQuizzes": 5,
    "resumesGenerated": 3,
    "interviewsCompleted": 8
  }
}
```

### 2. Update Profile
```http
PUT /api/user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "experience": "mid",
  "skills": ["JavaScript", "Python", "React", "Node.js"],
  "education": "B.Tech in Computer Science",
  "professionalBio": "Experienced full-stack developer...",
  "careerGoals": "Become a senior engineer and tech lead",
  "currentRole": "Software Developer",
  "targetRole": "Senior Software Engineer"
}

Response:
{
  "message": "Profile updated successfully",
  "user": { ...updated user data }
}
```

### 3. Change Password
```http
POST /api/user/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}

Response (Success):
{
  "message": "Password changed successfully"
}

Response (Error - Wrong Current Password):
{
  "message": "Current password is incorrect"
}

Response (Error - Validation):
{
  "message": "New password must be at least 6 characters long"
}
```

## Code Structure

### Frontend (`frontend/src/pages/Settings.tsx`)

**State Management:**
```typescript
const [formData, setFormData] = useState({
  name: '',
  email: '',
  experience: '',
  skills: '',
  education: '',
  professionalBio: '',
  careerGoals: '',
  currentRole: '',
  targetRole: '',
});

const [passwordData, setPasswordData] = useState({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});
```

**Key Functions:**
- `fetchUserProfile()` - Loads user data on component mount
- `handleProfileUpdate()` - Submits profile changes
- `handlePasswordChange()` - Submits password change with validation
- `handleInputChange()` - Updates form data state

### Backend (`backend/src/routes/user.ts`)

**Endpoints:**
- `GET /api/user/profile` - Fetch user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/change-password` - Change password securely

**Security:**
- Uses `authenticateToken` middleware for authentication
- Password field excluded from profile responses using `.select('-password')`
- Current password verification using bcrypt.compare()
- New password hashing with bcrypt (salt rounds: 10)

## Validation Rules

### Profile Update
- **Name**: No restrictions (can be empty or updated)
- **Email**: Read-only, cannot be changed through settings
- **Experience**: Must be one of: entry, junior, mid, senior, lead, executive
- **Skills**: Accepts comma-separated string, converted to array
- **Other text fields**: No character limits, optional

### Password Change
- **Current Password**: Required, must match existing password
- **New Password**: 
  - Required
  - Minimum 6 characters
  - Must match confirmation
- **Confirm Password**: Required, must match new password

## Error Handling

### Common Errors & Solutions

**"Current password is incorrect"**
- Solution: Verify you entered the correct current password
- Check: Caps Lock is off

**"New passwords do not match"**
- Solution: Ensure New Password and Confirm Password fields have identical values
- Check: No extra spaces or characters

**"New password must be at least 6 characters long"**
- Solution: Enter a password with 6 or more characters
- Recommendation: Use a strong password with mix of letters, numbers, symbols

**"Failed to load profile data"**
- Solution: Refresh the page or logout and login again
- Check: Backend server is running
- Check: Valid authentication token

**"Network error. Please try again."**
- Solution: Check internet connection
- Check: Backend server is running on port 5000
- Check: Frontend proxy configuration

## UI Features

### Success Messages
- Green background with checkmark icon
- Displays for 3 seconds then auto-hides
- Shows after successful profile update or password change

### Error Messages
- Red background with warning icon
- Stays visible until next action
- Clear indication of what went wrong

### Loading States
- Button text changes: "Update Profile" → "Updating..."
- Button becomes disabled during submission
- Prevents duplicate submissions

### Form Reset
- Password form clears after successful change
- Profile form retains values after successful update
- Easy to make multiple updates

## Tab Navigation

### Available Tabs
1. **Profile** - Edit personal and professional information
2. **Notifications** - Manage notification preferences (structure ready)
3. **Privacy & Security** - Control privacy settings (structure ready)
4. **Appearance** - Customize UI theme and language (structure ready)

### Navigation
- Sidebar navigation with icons
- Active tab highlighted in blue
- Smooth transitions between tabs
- Mobile-responsive design

## Security Best Practices

### Implemented
✅ Password hashing with bcrypt
✅ Current password verification before change
✅ JWT authentication required for all endpoints
✅ Email field is read-only (cannot be changed)
✅ Password excluded from API responses
✅ Secure error messages (don't leak sensitive info)

### Recommendations for Production
1. **Add Rate Limiting**: Prevent brute force password attempts
2. **Password Strength Indicator**: Visual feedback for password strength
3. **Email Verification**: Verify email before allowing changes
4. **Session Management**: Auto-logout after password change
5. **Audit Log**: Track profile and password changes
6. **Two-Factor Authentication**: Add 2FA option in security settings

## Testing the Features

### Test Profile Update
1. Login to your account
2. Navigate to Settings
3. Change your name to "Test User"
4. Update skills to "JavaScript, React, Node.js, MongoDB"
5. Add professional bio and career goals
6. Click "Update Profile"
7. Verify success message appears
8. Refresh page and confirm changes persisted

### Test Password Change
1. Navigate to Settings → Profile tab
2. Scroll to "Change Password" section
3. Enter current password
4. Enter new password (e.g., "newpass123")
5. Confirm new password
6. Click "Change Password"
7. Verify success message
8. Logout and try logging in with new password

### Test Validation
1. **Try changing password with wrong current password**
   - Expected: "Current password is incorrect"
   
2. **Try new password shorter than 6 characters**
   - Expected: "New password must be at least 6 characters long"
   
3. **Try mismatched confirm password**
   - Expected: "New passwords do not match"

## Troubleshooting

### Profile Not Loading
**Problem:** Settings page shows empty form
**Solution:**
1. Check if you're logged in (token in localStorage)
2. Check backend logs for errors
3. Verify `/api/user/profile` endpoint is working
4. Try logout and login again

### Changes Not Saving
**Problem:** Click "Update Profile" but changes don't persist
**Solution:**
1. Check browser console for errors
2. Verify backend server is running
3. Check network tab for failed requests
4. Ensure all required fields are filled

### Password Change Failed
**Problem:** Password change doesn't work
**Solution:**
1. Verify current password is correct
2. Ensure new password meets requirements (6+ chars)
3. Check confirm password matches new password
4. Look at backend logs for specific error

## Future Enhancements

### Planned Features
- [ ] Profile picture upload
- [ ] Phone number field
- [ ] Location/timezone settings
- [ ] Social media links
- [ ] Resume/CV upload
- [ ] Account deletion option
- [ ] Export user data
- [ ] Password strength meter
- [ ] Two-factor authentication
- [ ] Session management
- [ ] Activity log

### Notification Preferences (To Implement)
- [ ] Email notification toggle
- [ ] Weekly progress reports
- [ ] Job alert preferences
- [ ] In-app notification settings

### Privacy Settings (To Implement)
- [ ] Profile visibility controls
- [ ] Data sharing preferences
- [ ] Cookie consent management
- [ ] Third-party data access

### Appearance Settings (To Implement)
- [ ] Dark mode toggle (functional)
- [ ] Language selection (functional)
- [ ] Font size preferences
- [ ] Color scheme customization

## Summary

The Settings page is fully functional with:
- ✅ **Profile Editing** - Update all personal and professional information
- ✅ **Password Change** - Secure password management with validation
- ✅ **Auto-load** - Existing data loads automatically
- ✅ **Validation** - Client and server-side validation
- ✅ **Security** - Bcrypt hashing, JWT authentication
- ✅ **UX** - Success/error messages, loading states, form reset
- ✅ **Responsive** - Works on mobile, tablet, desktop
- ✅ **Dark Mode** - Full dark theme support

**Start managing your profile now at http://localhost:3000/settings** 🎉

---

**Need Help?**
- Backend errors: Check terminal running `npm run dev` in backend folder
- Frontend errors: Check browser console (F12)
- API testing: Use test files or Postman
- Questions: Check main README.md or project documentation
