# NSQTech MPloyChek — Internship Code Challenge

A full-stack Angular + Node.js background verification platform built for NSQTech Private Limited.

---

## 🏗️ Project Structure

```
nsqtech-app/
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── config/seed.js    # DB seeder with dummy data
│   │   ├── controllers/      # auth, user, record logic
│   │   ├── middleware/        # JWT auth + admin guards
│   │   ├── models/           # Mongoose schemas
│   │   └── routes/           # API route definitions
│   ├── .env
│   └── package.json
│
└── frontend/                 # Angular 15 SPA
    └── src/app/
        ├── core/
        │   ├── guards/       # AuthGuard, AdminGuard
        │   ├── interceptors/ # JWT HTTP interceptor
        │   └── services/     # AuthService, UserService, RecordService, AppInitService
        ├── features/
        │   ├── auth/         # Login page
        │   ├── dashboard/    # User dashboard + records table
        │   └── admin/        # Admin user management (CRUD)
        └── shared/
            └── models/       # TypeScript interfaces
```

---

## 🚀 Setup & Running

### Prerequisites
- Node.js v16+
- MongoDB (optional — app falls back to in-memory if not available)

### 1. Backend

```bash
cd backend
npm install
npm run dev        # starts on http://localhost:3000
```

> **Without MongoDB:** The server auto-seeds in-memory data — no MongoDB setup needed for demo.

> **With MongoDB:** Set `MONGO_URI` in `.env` and the DB is auto-seeded on first run.

### 2. Frontend

```bash
cd frontend
npm install
npm start          # starts on http://localhost:4200
```

---

## 🔐 Demo Credentials

| Role         | User ID | Password     |
|--------------|---------|--------------|
| Admin        | ADM001  | admin123     |
| General User | USR001  | password123  |
| General User | USR002  | password123  |

---

## ✨ Features

### Login Page
- User ID, Password, Role selector (General User / Admin)
- Reactive form with validation
- JWT token stored in localStorage
- Error handling for wrong credentials / role mismatch

### Dashboard (Logged-in)
- User profile card with name, email, role, department
- Stats overview (total, verified, in-progress, flagged)
- Records table with role-based filtering:
  - **General User:** sees only their assigned records
  - **Admin:** sees all records
- **Async delay demo** — on page load, records are fetched with a 2-second simulated API delay (pass `?delay=2000`) to showcase RxJS loading states
- Skeleton loader during fetch
- Manual reload buttons (instant and with 2s delay)

### Admin Panel (Admin only)
- Route-guarded via `AdminGuard` — General Users are redirected
- Full user list table
- **Create** new users with validation
- **Edit** existing users
- **Delete** users with confirmation
- Role-based stats (total admins, general users, active count)

---

## 🛠️ Angular Architecture Highlights

| Feature | Implementation |
|---|---|
| Lazy loading | Each feature (auth, dashboard, admin) is a separate lazy-loaded module |
| APP_INITIALIZER | `AppInitService.init()` verifies JWT on every app boot |
| HTTP Interceptor | `AuthInterceptor` attaches `Bearer` token to all outgoing requests |
| Route Guards | `AuthGuard` (login check), `AdminGuard` (role check) |
| RxJS | `BehaviorSubject` for user/record state; `takeUntil` for subscription cleanup |
| Async processing | `?delay=ms` param showcases observable-based async with loading states |
| Services | `AuthService`, `UserService`, `RecordService`, `AppInitService` |

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/login | ❌ | Login with userId + password + role |
| GET | /api/auth/me | ✅ | Get current user profile |
| GET | /api/records?delay=ms | ✅ | Get records (role-filtered) |
| GET | /api/records/stats | ✅ | Get aggregate stats |
| GET | /api/users | ✅ Admin | List all users |
| POST | /api/users | ✅ Admin | Create user |
| PUT | /api/users/:id | ✅ Admin | Update user |
| DELETE | /api/users/:id | ✅ Admin | Delete user |

---

## 🗄️ Database

- **Primary:** MongoDB with Mongoose (set MONGO_URI in .env)
- **Fallback:** In-memory store (auto-used if MongoDB is unavailable)
- Auto-seeded with 5 users and 5 verification records on first run

---

## Submitted by: Priyanga S
