# 🧩 Employee Management System

A full-stack web application built using **React (frontend)** and **Django REST Framework (backend)** that allows users to create dynamic forms, manage employees, and handle authentication using JWT.

---

# 🚀 Features

## 🔐 Authentication
- User Registration
- Login with JWT (Access + Refresh Token)
- Logout (Token removal)
- Change Password
- Profile API (username & email)

---

## 📝 Dynamic Form Builder
- Create custom forms
- Add unlimited fields dynamically
- Field types supported:
  - Text
  - Textarea
  - Number
  - Email
  - Date
  - Password
  - Phone
- Drag & Drop field ordering (@dnd-kit)
- Save form structure to backend

---

## 👤 Employee Management
- Create employee based on selected form
- Dynamic input rendering
- Store values as label-value pairs
- Edit employee data
- Delete employee
- List all employees

---

## 🔎 Search Functionality
- Search employees by:
  - Form title
  - Field label
  - Field value

Example:/api/employees/?search=john



---

# 🧱 Tech Stack

## Frontend
- React (Vite)
- React Router DOM
- Axios
- React Toastify
- @dnd-kit (drag & drop)

## Backend
- Django
- Django REST Framework
- SimpleJWT Authentication
- SQLite / PostgreSQL

---

# ⚙️ Backend Setup

## 1. Clone repository
```bash id="b1"
git clone <your-repo-url>
cd backend

2. Create virtual environment

  python -m venv venv
  source venv/bin/activate   # Windows: venv\Scripts\activate

3. Install dependencies
  pip install -r requirements.txt

4. Run migrations
  python manage.py makemigrations
  python manage.py migrate


5. Start server
  python manage.py runserver


🌐 Frontend Setup
1. Install dependencies
  cd frontend
  npm install

2. Start frontend
  npm run dev

🔐 Authentication Flow
Login Response
  {
    "success": true,
    "access": "ACCESS_TOKEN",
    "refresh": "REFRESH_TOKEN",
    "message": "Login successful"
  }

Axios Interceptor
  
  Automatically attaches token:

    api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
  
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  
    return config;
  });


