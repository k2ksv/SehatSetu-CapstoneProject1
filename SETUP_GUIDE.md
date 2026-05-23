# Database Setup Guide - User ID & Dashboard Integration

## Changes Made

### 1. **Backend - Django Accounts App** ✅
Created a custom User model with the following features:
- **accounts/models.py**: Extended Django's AbstractUser with user_type (patient/doctor/admin), phone_number, age, gender, address, city
- **accounts/views.py**: API endpoints for authentication and user management:
  - `POST /api/auth/register/` - Register new user
  - `POST /api/auth/login/` - Login user
  - `POST /api/auth/logout/` - Logout user
  - `GET /api/auth/current-user/` - Get logged-in user data
  - `GET /api/users/` - List all users
  - `GET /api/users/<id>/` - Get specific user
  - `POST /api/users/<id>/update/` - Update user profile

- **accounts/urls.py**: All auth endpoints mapped
- **accounts/admin.py**: Django admin configuration for User model
- **settings.py**: Updated to use custom User model (`AUTH_USER_MODEL = 'accounts.User'`)
- **sehatsetu/urls.py**: Included accounts URLs

### 2. **Frontend - Dashboard Integration** ✅
- **dashboard-api.js**: New functions to fetch real user data:
  - `getCurrentUser()` - Fetches logged-in user from Django
  - `fetchUsers()` - Fetches all registered users
  - `displayUserGreeting()` - Displays personalized greeting
  - `initializeDashboard()` - Initializes dashboard on page load
  
- **dashboard.html**: Updated greeting to use dynamic user name

## Next Steps to Complete Setup

### Step 1: Create Database Migrations
```bash
cd SehatSetu/backend
python manage.py makemigrations accounts
python manage.py migrate
```

### Step 2: Create Superuser (Admin)
```bash
python manage.py createsuperuser
# Follow prompts to create admin user
```

### Step 3: Run Django Development Server
```bash
python manage.py runserver 0.0.0.0:8000
```

### Step 4: Test the Setup

#### Option A: Create test user via API
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "first_name": "John",
    "last_name": "Doe",
    "user_type": "patient"
  }'
```

#### Option B: Create user via Django Admin
1. Go to `http://localhost:8000/admin/`
2. Login with superuser credentials
3. Click "Users" under Accounts
4. Click "Add User"
5. Fill in username, email, password
6. Click Save
7. Go back to edit and fill in first_name, last_name, user_type, etc.

### Step 5: Test Dashboard
1. Start a simple HTTP server in frontend folder:
```bash
cd SehatSetu/frontend
python -m http.server 3000
```

2. Navigate to `http://localhost:3000/dashboard.html`

## API Endpoints Summary

### Authentication
- **POST** `/api/auth/register/` - Register new user
- **POST** `/api/auth/login/` - Login user
- **POST** `/api/auth/logout/` - Logout user
- **GET** `/api/auth/current-user/` - Get current logged-in user

### User Management
- **GET** `/api/users/` - List all users (optional: ?user_type=patient)
- **GET** `/api/users/<user_id>/` - Get user by ID
- **POST** `/api/users/<user_id>/update/` - Update user profile

## Database Schema

### User Model Fields
- id (auto-generated)
- username (unique)
- email (unique)
- password (hashed)
- first_name
- last_name
- user_type (patient, doctor, admin)
- phone_number
- age
- gender
- address
- city
- date_created
- is_active
- is_staff
- is_superuser

## Features Implemented
✅ Custom User model linked to Django
✅ User authentication (register/login/logout)
✅ User list from database
✅ Current user data in dashboard
✅ Dynamic greeting with user's first name
✅ Session-based authentication
✅ CORS enabled for frontend access
✅ User profile management endpoints
✅ Admin panel for user management

## Important Notes
1. All API calls use `credentials: 'include'` for session-based auth
2. Current setup uses session authentication (not JWT)
3. Users are stored in SQLite database
4. For production, use environment variables for SECRET_KEY
5. CORS is enabled for all origins in development (restrict for production)
