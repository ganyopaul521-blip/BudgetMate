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

### 2. Paystack (for the Make Payment feature)

The "Pay" tab charges through [Paystack](https://paystack.com) in test mode — no real money moves.

1. Sign up free at [dashboard.paystack.com/#/signup](https://dashboard.paystack.com/#/signup).
2. Go to **Settings → API Keys & Webhooks**. You'll see a **Test Secret Key** (`sk_test_...`) and **Test Public Key** (`pk_test_...`) — the dashboard starts in test mode by default.
3. Put the secret key in `backend/.env` as `PAYSTACK_SECRET_KEY`, and the public key in `frontend/.env` as `VITE_PAYSTACK_PUBLIC_KEY`.
4. Test mode uses fake card/Mobile Money numbers — see [Paystack's test cards](https://paystack.com/docs/payments/test-payments/) (e.g. card `4084 0840 8408 4081`, any future expiry, CVV `408`, PIN `0000`, OTP `123456`).

### 3. Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET, PAYSTACK_SECRET_KEY
npx prisma generate
npx prisma db push     # creates collections/indexes from schema.prisma
npm run seed           # seeds default income/expense categories
npm run dev            # starts http://localhost:5000
```

### 4. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # fill in VITE_PAYSTACK_PUBLIC_KEY (VITE_API_URL defaults correctly)
npm run dev            # starts http://localhost:5173
```

Register a new account in the browser, then add transactions, set budgets, view reports, and try a test payment.

## Functional coverage

Implements the functional requirements (FR01–FR19) from the project report:

- User registration/login with bcrypt + JWT (FR01, FR02, FR05)
- Profile updates (FR04)
- Income/expense transaction CRUD with category, payment method, filtering & pagination (FR06–FR10)
- Monthly per-category budgets with live spend tracking (FR11, FR12)
- Real-time 80%/100% budget alerts + notification centre (FR13–FR15)
- Pie/bar/line reports and monthly summary (FR16–FR18)
- Personalised dashboard (FR19)
- Real payment gateway (Paystack) with a **pre-payment budget projection check** — warns before you pay if it would push a category to 80%/100% of its budget, then records a linked expense transaction and post-payment alert on success

**Not implemented (out of scope for this MVP):** FR03 password-reset-via-email (would require an email service like SendGrid).

**Note on scope vs. the report:** the project report (Section 1.6.2, Limitations) states the system will not integrate with banking/Mobile Money APIs and requires manual transaction entry. The Paystack payment feature above goes beyond that documented scope — if this implementation is submitted alongside the report, Chapter 1's scope/limitations section should be updated to reflect it (and Chapter 3's requirements/architecture sections extended to describe the Payment entity and payment flow) so the two stay consistent.
