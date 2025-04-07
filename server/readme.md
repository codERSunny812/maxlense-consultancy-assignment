# Backend

## 🧪 Installation & Setup

Backend
bash
Copy
Edit
cd backend
npm install
npm run dev
Make sure MySQL and Redis servers are running locally.

## 🔐 Environment Variables

Create a `.env` file in both `backend` and `frontend` with the following:

### `.env` (Backend)

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
REDIS_URL=redis://localhost:6379
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:5173
.env (Frontend, if needed)
env
Copy
Edit
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## 🧭 Routes Overview

#### Public Routes

- / – Sign Up

- /login – Login

- /verify/:token – Email Verification

- /forgot-password – Request Reset

- /reset-password/:token – Reset Password

#### Protected Routes (Requires Auth)

- /home – Home (Dashboard)

- /profile – User Profile

- /user/:id – View Another User

- /admin/user/:id – Edit User (Admin only)
