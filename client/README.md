# DEV@Deakin - Task 9.2D

**Features**
- Pricing plans page (Free vs Premium) with a payment flow.
- Stripe test integration using `@stripe/react-stripe-js`.
- Post editor using `react-codemirror2` and Preview with `react-markdown`.

## Tech
- Frontend: React + Vite
- Backend: Node + Express (local dev for Stripe secret)
- Payments: Stripe (test mode)

## Prerequisites
- Node 18+
- Stripe test keys

## Setup

### 1) Frontend
```bash
cd client
cp .env.example .env   # if you create one, or fill values directly
# .env:
# VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
# VITE_API_BASE=http://localhost:8787
npm i
npm run dev
