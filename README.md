# BudgetMate

Personal Budget Tracker web application for Ghanaian students and young professionals — record income/expenses in Ghana Cedi (GH₵), set category budgets, get real-time overspending alerts, and view visual spending reports.

Companion implementation for the final year project *"Personal Budget Tracker Web Application for Financial Management"* (University of Ghana, Dept. of Computer Science).

## Stack

- **Frontend:** React 19 + Vite, Tailwind CSS v4, React Router, Recharts, Axios
- **Backend:** Node.js + Express, Prisma ORM, MongoDB, JWT auth, bcrypt, Zod validation

## Project structure

```
backend/    Express API (auth, transactions, budgets, categories, reports, alerts)
frontend/   React SPA (dashboard, transactions, budgets, reports, settings)
```

## Getting started

### 1. Database

You need a MongoDB connection string. Easiest options:

- **MongoDB Atlas (free):** create an M0 cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas), add a database user, allow your IP, and copy the connection string.
- **Local MongoDB:** install MongoDB Community Server and use `mongodb://localhost:27017/budgetmate`.

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in DATABASE_URL and JWT_SECRET
npx prisma generate
npx prisma db push     # creates collections/indexes from schema.prisma
npm run seed           # seeds default income/expense categories
npm run dev            # starts http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL defaults to http://localhost:5000/api
npm run dev            # starts http://localhost:5173
```

Register a new account in the browser, then add transactions, set budgets, and view reports.

## Functional coverage

Implements the functional requirements (FR01–FR19) from the project report:

- User registration/login with bcrypt + JWT (FR01, FR02, FR05)
- Profile updates (FR04)
- Income/expense transaction CRUD with category, payment method, filtering & pagination (FR06–FR10)
- Monthly per-category budgets with live spend tracking (FR11, FR12)
- Real-time 80%/100% budget alerts + notification centre (FR13–FR15)
- Pie/bar/line reports and monthly summary (FR16–FR18)
- Personalised dashboard (FR19)

**Not implemented (out of scope for this MVP):** FR03 password-reset-via-email (would require an email service like SendGrid).
