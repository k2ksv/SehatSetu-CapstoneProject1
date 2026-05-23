# Quick Start Guide - User Authentication & Dashboard

## What Was Done
✅ Created custom User model in Django with extended fields
✅ Created authentication API endpoints (register, login, logout, current user)
✅ Created user management endpoints (list users, get user, update profile)
✅ Integrated frontend with backend API
✅ Connected dashboard to database for real user data
✅ Updated login and register forms to use new API

---

## Step-by-Step Setup (5 minutes)

### Step 1: Create Migrations
```bash
cd SehatSetu/backend
python manage.py makemigrations accounts
python manage.py migrate
```

### Step 2: Create Admin User
```bash
python manage.py createsuperuser
# Enter:
# Username: admin
# Email: admin@example.com
# Password: admin123
```

### Step 3: Start Django Server
```bash
python manage.py runserver 0.0.0.0:8000
```

### Step 4: Start Frontend Server
```bash
# In another terminal, go to frontend directory
cd SehatSetu/frontend
python -m http.server 3000
```

### Step 5: Test the Application

**Register a new user:**
1. Go to: http://localhost:3000/register.html
2. Fill in the form:
   - Full name: John Doe
   - Phone: 9876543210
   - Email: john@example.com
   - City: Mumbai
   - Password: password123
3. Click "Continue to dashboard"
4. You'll be redirected to dashboard with your name displayed!

**Or login via admin:**
1. Go to: http://localhost:8000/admin/
2. Login with admin credentials (admin/admin123)
3. Click "Users" → "Add User"
4. Fill in the form and save
5. Go to http://localhost:3000/login.html
6. Login with the credentials you created
7. Dashboard will show your name and list of users!

---

## What Each File Does

### Backend Files

**accounts/models.py**
- Defines User model with fields like first_name, last_name, user_type, phone_number, etc.
- Stores all user data in database

**accounts/views.py**
- Contains all API endpoint functions
- Handles registration, login, user data retrieval
- Connects to database and returns JSON responses

**accounts/urls.py**
- Maps API endpoints to view functions
- Routes like `/api/auth/register/`, `/api/users/`, etc.

**accounts/admin.py**
- Configures User model in Django admin panel
- Allows admin to create/edit users manually

**settings.py** (updated)
- Added 'accounts' app
- Set `AUTH_USER_MODEL = 'accounts.User'` to use custom User model

**sehatsetu/urls.py** (updated)
- Added accounts URLs to main URL configuration

### Frontend Files

**dashboard-api.js** (completely rewritten)
- `getCurrentUser()` - Fetches logged-in user from Django
- `fetchUsers()` - Fetches all users from database
- `displayUserGreeting()` - Shows personalized greeting
- `initializeDashboard()` - Runs on page load

**dashboard.html** (updated)
- Greeting now shows dynamic user name (e.g., "Good afternoon, John")

**register-api.js** (updated)
- Sends registration data to `/api/auth/register/`
- Stores user data in localStorage
- Redirects to dashboard on success

**login-api.js** (new)
- Sends login data to `/api/auth/login/`
- Stores user data in localStorage
- Redirects to dashboard on success

**login.html** (updated)
- Added login-api.js script
- Changed login button from link to submit button

---

## Key Features

### User Model Fields
- **username** - Unique login identifier
- **email** - User's email (unique)
- **password** - Securely hashed
- **first_name** - User's first name
- **last_name** - User's last name
- **user_type** - Patient, Doctor, or Admin
- **phone_number** - Contact number
- **age** - User's age
- **gender** - Male, Female, Other
- **address** - User's address
- **city** - User's city
- **date_created** - When user registered

### API Endpoints
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/logout/` - Logout user
- `GET /api/auth/current-user/` - Get current logged-in user
- `GET /api/users/` - List all users
- `GET /api/users/<id>/` - Get specific user
- `POST /api/users/<id>/update/` - Update user profile

### Session Management
- Users stay logged in using Django sessions
- Credentials stored in secure HTTP-only cookies
- LocalStorage keeps user info on frontend

---

## Testing Checklist

- [ ] Django server runs on port 8000
- [ ] Frontend server runs on port 3000
- [ ] Can register a new user
- [ ] Dashboard shows new user's first name
- [ ] User list displays in dashboard
- [ ] Can login with registered user
- [ ] Can logout
- [ ] User data persists in database
- [ ] Admin can create users in Django admin

---

## Troubleshooting

**Error: "Could not connect to server"**
- Make sure Django is running on port 8000
- Check if CORS is enabled in settings.py

**Error: "Not authenticated"**
- User session may have expired
- Try registering/logging in again
- Clear browser cookies and try again

**Error: "Module not found"**
- Run: `python manage.py makemigrations accounts`
- Run: `python manage.py migrate`

**Dashboard shows "Good afternoon, User"**
- Check if Django server is running
- Check browser console for errors
- Verify user is logged in

---

## Database Location
- SQLite database: `SehatSetu/backend/db.sqlite3`
- All user data is stored in the `accounts_user` table

---

## Next Steps (Optional)
1. Add password reset functionality
2. Add email verification
3. Add doctor appointment booking
4. Add medical records storage
5. Add notifications
6. Deploy to production server

---

## Support
For API documentation, see: `API_DOCUMENTATION.md`
For detailed setup guide, see: `SETUP_GUIDE.md`

