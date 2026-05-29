# NSQTech MPloyChek — Internship Code Challenge

A full-stack Angular + Node.js background verification platform built for NSQTech Private Limited.

---

## 🚀 Overview

MPloyChek is a role-based Background Verification Management System developed as part of the NSQTech Software Engineer Internship Assessment.

The application provides secure authentication, user management, verification record tracking, and role-based access control through a modern Angular Single Page Application (SPA) backed by a Node.js REST API.

---

## 🏗️ Project Structure

```text
nsqtech-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── core/
│   │       ├── features/
│   │       └── shared/
│   └── package.json
│
└── README.md
```

---

## ✨ Features

### 🔐 Authentication & Authorization

- Login using User ID and Password
- Role-based access control
- JWT authentication
- Route Guards
- HTTP Interceptor

### 📊 Dashboard

- Personalized user dashboard
- Verification statistics
- User profile information
- Records overview

### 📋 Verification Records

- View verification records
- Role-based record filtering
- Status tracking
- Priority indicators

### 👨‍💼 Admin Panel

- Add users
- Edit users
- Delete users
- Manage user roles
- User statistics dashboard

### ⚡ Async Processing

- Simulated API delays
- Loading states
- RxJS asynchronous handling
- Demonstration of real-world API behaviour

---

## 🛠️ Technology Stack

### Frontend

- Angular 15
- TypeScript
- RxJS
- HTML5
- CSS3

### Backend

- Node.js
- Express.js
- JWT Authentication
- REST APIs

### Database

- MongoDB
- Mongoose
- In-Memory Fallback Support

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|----------|----------|-------------|
| POST | /api/auth/login | User Login |
| GET | /api/auth/me | Current User |
| GET | /api/records | Get Records |
| GET | /api/records/stats | Get Statistics |
| GET | /api/users | Get Users |
| POST | /api/users | Create User |
| PUT | /api/users/:id | Update User |
| DELETE | /api/users/:id | Delete User |

---

## 🚀 Getting Started

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on:

```text
http://localhost:4200
```

---

## 🔑 Demo Credentials

### Admin

```text
User ID : ADM001
Password: admin123
```

### General User

```text
User ID : USR001
Password: password123
```

---

## 📌 Assessment Requirements Covered

- Angular Single Page Application
- Login with User ID, Password and Role
- Role-Based Access Control
- User Dashboard
- Verification Records Table
- Admin User Management
- Asynchronous API Processing
- Modular Angular Architecture
- REST API Integration
- Clean UI and Code Structure

---


