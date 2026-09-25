# Read Academy Sahiwal - Node.js + PostgreSQL Backend

Complete production-ready REST API backend for **Read Academy Sahiwal** built with **Node.js, Express, TypeScript, PostgreSQL, and Prisma ORM**.

---

## 🚀 Quick Setup & Run Guide

### 1. Prerequisites
- **Node.js**: v18 or later
- **PostgreSQL**: v14 or later (or free cloud PostgreSQL like Supabase, Neon.tech, or Render)

### 2. Installation
Open your terminal in the backend directory:
```bash
cd "d:\Read Acdmi\backend"
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env` and set your PostgreSQL connection credentials:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/read_academy_db?schema=public"
JWT_SECRET="super_secret_read_academy_jwt_key_2026"
FRONTEND_URL="http://localhost:5173"
```

### 4. Push Schema & Run Migrations
Generate Prisma Client and automatically create all tables, foreign keys, and indexes in PostgreSQL:
```bash
npx prisma migrate dev --name init
```

### 5. Seed Initial Data (Admin, Teachers, Students)
Pre-populate the database with demo users matching the frontend:
```bash
npm run prisma:seed
```

### 6. Start Development Server
```bash
npm run dev
```
The API will be available at: `http://localhost:5000`  
Health check endpoint: `http://localhost:5000/api/health`

### 7. Interactive Database GUI (Prisma Studio)
Inspect, browse, and edit all PostgreSQL tables directly in your browser:
```bash
npx prisma studio
```
(Opens automatically at `http://localhost:5555`)

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service & PostgreSQL connectivity status |
| `POST` | `/api/auth/login` | Portal login with JWT authentication |
| `POST` | `/api/auth/register` | New user/parent account registration |
| `GET` | `/api/students` | Get all enrolled students with class & section |
| `GET` | `/api/students/:idOrRoll` | Full student profile with attendance, fees & marks |
