# Sehat Setu API Documentation

## Overview
This document describes the complete user authentication and management API for Sehat Setu, which connects Django backend to the frontend dashboard.

## Base URL
```
http://localhost:8000
```

## Database Connection Flow
```
Frontend (Login/Register) → Django API Endpoints → SQLite Database → Dashboard Display
```

## Authentication Endpoints

### 1. Register User
**Endpoint:** `POST /api/auth/register/`

**Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepass123",
  "first_name": "John",
  "last_name": "Doe",
  "user_type": "patient",
  "phone_number": "9876543210",
  "age": 28,
  "gender": "M",
  "address": "123 Main St",
  "city": "Mumbai"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "user_type": "patient"
  }
}
```

**Response (Error - 400):**
```json
{
  "error": "Username already exists"
}
```

---

### 2. Login User
**Endpoint:** `POST /api/auth/login/`

**Request:**
```json
{
  "username": "john_doe",
  "password": "securepass123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "user_type": "patient"
  }
}
```

**Response (Error - 401):**
```json
{
  "error": "Invalid username or password"
}
```

---

### 3. Get Current User
**Endpoint:** `GET /api/auth/current-user/`

**Headers:**
```
Content-Type: application/json
Cookie: sessionid=<session_id>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "user_type": "patient",
    "phone_number": "9876543210",
    "age": 28,
    "gender": "M",
    "address": "123 Main St",
    "city": "Mumbai"
  }
}
```

**Response (Error - 401):**
```json
{
  "error": "Not authenticated"
}
```

---

### 4. Logout User
**Endpoint:** `POST /api/auth/logout/`

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## User Management Endpoints

### 5. List All Users
**Endpoint:** `GET /api/users/`

**Query Parameters:**
- `user_type` (optional): Filter by user type (patient, doctor, admin)

**Example:** `GET /api/users/?user_type=patient`

**Response (Success - 200):**
```json
{
  "success": true,
  "count": 5,
  "users": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "name": "John Doe",
      "first_name": "John",
      "last_name": "Doe",
      "user_type": "patient",
      "phone_number": "9876543210",
      "city": "Mumbai"
    },
    {
      "id": 2,
      "username": "jane_smith",
      "email": "jane@example.com",
      "name": "Jane Smith",
      "first_name": "Jane",
      "last_name": "Smith",
      "user_type": "doctor",
      "phone_number": "9876543211",
      "city": "Delhi"
    }
  ]
}
```

---

### 6. Get User by ID
**Endpoint:** `GET /api/users/<user_id>/`

**Example:** `GET /api/users/1/`

**Response (Success - 200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "name": "John Doe",
    "first_name": "John",
    "last_name": "Doe",
    "user_type": "patient",
    "phone_number": "9876543210",
    "age": 28,
    "gender": "M",
    "address": "123 Main St",
    "city": "Mumbai"
  }
}
```

---

### 7. Update User Profile
**Endpoint:** `POST /api/users/<user_id>/update/`

**Example:** `POST /api/users/1/update/`

**Request:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "9999999999",
  "age": 30,
  "gender": "M",
  "address": "456 New St",
  "city": "Bangalore"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "user_type": "patient",
    "phone_number": "9999999999",
    "age": 30,
    "gender": "M",
    "address": "456 New St",
    "city": "Bangalore"
  }
}
```

---

## Testing with cURL

### Register a new user:
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "first_name": "Test",
    "last_name": "User",
    "user_type": "patient"
  }'
```

### Login:
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'
```

### Get current user (after login):
```bash
curl -X GET http://localhost:8000/api/auth/current-user/ \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

### List all users:
```bash
curl -X GET http://localhost:8000/api/users/ \
  -H "Content-Type: application/json"
```

### List patients only:
```bash
curl -X GET "http://localhost:8000/api/users/?user_type=patient" \
  -H "Content-Type: application/json"
```

### Get specific user:
```bash
curl -X GET http://localhost:8000/api/users/1/ \
  -H "Content-Type: application/json"
```

---

## JavaScript Usage

### Register new user (from register.html):
```javascript
const response = await fetch('http://localhost:8000/api/auth/register/', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'john_doe',
    email: 'john@example.com',
    password: 'securepass123',
    first_name: 'John',
    last_name: 'Doe',
    user_type: 'patient'
  })
});

const data = await response.json();
if (response.ok) {
  localStorage.setItem('currentUser', JSON.stringify(data.user));
  window.location.href = 'dashboard.html';
}
```

### Login (from login.html):
```javascript
const response = await fetch('http://localhost:8000/api/auth/login/', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'john_doe',
    password: 'securepass123'
  })
});

const data = await response.json();
if (response.ok) {
  localStorage.setItem('currentUser', JSON.stringify(data.user));
  window.location.href = 'dashboard.html';
}
```

### Get current user and display in dashboard:
```javascript
const response = await fetch('http://localhost:8000/api/auth/current-user/', {
  method: 'GET',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' }
});

if (response.ok) {
  const data = await response.json();
  const user = data.user;
  document.querySelector('h1').textContent = `Good afternoon, ${user.first_name}`;
}
```

### List all users in dashboard:
```javascript
const response = await fetch('http://localhost:8000/api/users/', {
  credentials: 'include'
});

const data = await response.json();
const users = data.users;
const html = users.map(u => `
  <li><strong>${u.name}</strong> (${u.user_type})</li>
`).join('');

document.getElementById('user-list').innerHTML = html;
```

---

## User Types
- **patient**: Regular patient user
- **doctor**: Medical professional
- **admin**: Administrator with full access

---

## Security Notes
1. All passwords are hashed using Django's default PBKDF2 algorithm
2. Session-based authentication is used (cookies)
3. CSRF protection is enabled for state-changing requests
4. CORS is enabled for development (restrict in production)
5. For production, enable HTTPS and set secure cookies

---

## Error Codes
- **200**: Success
- **201**: Created (user registered)
- **400**: Bad Request (invalid data)
- **401**: Unauthorized (not authenticated)
- **403**: Forbidden (permission denied)
- **404**: Not Found (user doesn't exist)
- **500**: Server Error

---

## Database Schema
All users are stored in `auth_accounts_user` table with the following fields:
- id (Primary Key)
- username (Unique)
- email (Unique)
- password (Hashed)
- first_name
- last_name
- user_type
- phone_number
- age
- gender
- address
- city
- is_active
- is_staff
- is_superuser
- date_joined
- date_created

