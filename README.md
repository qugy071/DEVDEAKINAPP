# DEV\@Deakin — Full-Stack App

A modern React + Express project for the SIT313 capstone.
It includes a polished homepage, newsletter signup, auth pages, a **Questions & Articles** hub (with image upload), **Tutorial** showcase, **Stripe** payments, a **contact** form, and an opt-in **AI assistant** using OpenAI.

---

## ✨ Features

* **Responsive UI** with light/dark theme toggle.
* **Navbar**: Home · Plans · Pay · Post · Question\&Articles · Tutorial · Log in.
* **Newsletter** signup (Resend) with welcome email.
* **Footer** links: FAQs, Help, Contact Us, Privacy Policy, Terms, Code of Conduct + real social icons.
* **Questions & Articles**

  * Two tabs (Questions / Articles)
  * Search by keyword, tag, date
  * Create / Delete
  * **Image upload** to Firebase Storage
  * Detail/preview pages via router
* **Tutorial** page with lecturer cards (name, intro, contact).
* **Authentication** page (from Task 9.1c) preserved styling.
* **Stripe Pay** page (PaymentIntent) with server-side allowlist.
* **Contact Us** form → inbox via Resend.
* **AI Assistant** (optional): `/api/ai/chat` and `/api/ai/chat-stream` using OpenAI.

---

## 🗂️ Project Structure

```
.
├─ client/                # Vite + React app
│  ├─ src/
│  │  ├─ pages/           # Home, Plans, Pay, Post, Login, QA, Tutorial, FAQs, Help, Contact
│  │  ├─ components/      # Navbar, NewsletterNav, SiteFooter, Cards, Chat widget
│  │  ├─ lib/             # firebase.ts/js init, helpers
│  │  └─ state/           # local state helpers if any
│  ├─ index.html
│  └─ vite.config.js      # proxies /api → http://localhost:8787 in dev
│
├─ server/                # Express API
│  ├─ index.js            # Stripe, Resend, Contact, OpenAI endpoints
│  └─ .env.example        # server-side env template (no secrets)
│
├─ package.json           # root scripts use concurrently to run client & server
└─ README.md
```

---

## 🔧 Prerequisites

* **Node.js** ≥ 18
* A Firebase project (Firestore + Storage)
* Stripe account (test mode)
* Resend account (Email API)
* (Optional) OpenAI API access for assistant

---

## 🚀 Quick Start (Local Dev)

```bash
# 1) install
npm install

# 2) fill server/.env using the template
cp server/.env.example server/.env
# then edit server/.env with your keys (see next section)

# 3) client Firebase env (if not set yet)
# add these to client/.env or client/.env.local (Vite requires VITE_ prefix)
# see "Firebase setup" below

# 4) run both client and server (concurrently)
npm run dev
```

* Client: [http://localhost:5173](http://localhost:5173)
* Server: [http://localhost:8787](http://localhost:8787)

> Dev proxy: `vite.config.js` forwards `/api/*` to the Express server.

---

## 🔐 Environment Variables

### `server/.env` (server-side only — **never commit**)

```env
# OpenAI (optional assistant)
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5-nano   # or gpt-5-mini / gpt-4o-mini

# Stripe
STRIPE_SECRET_KEY=sk_test_...

# Resend (emails)
RESEND_API_KEY=re_...
FROM_EMAIL=DEV@Deakin <onboarding@resend.dev>   # test sender works out of the box
CONTACT_TO_EMAIL=your_inbox@example.com         # where contact form lands

# Port (optional)
PORT=8787
```

> ✅ This repo uses `.gitignore` to keep secrets out of Git.
> If you ever pushed a key by mistake, **rotate the key** and clean history before pushing again.

### `client/.env` (browser-safe; Vite needs `VITE_` prefix)

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Firebase web config is public by design, but keep write rules secure.

---

## 🔥 Firebase Setup (QA)

1. Create a Firebase project.
2. Enable **Firestore** & **Storage**.
3. Add a **Web app** and copy web config into `client/.env`.
4. Suggested **security rules** for development (tighten for prod):

**Firestore (dev example):**

```
// Allow reads for all; restrict writes to authenticated users in real app.
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /qa/{docId} {
      allow read: if true;
      allow write: if request.time < timestamp.date(2099,1,1);
    }
  }
}
```

**Storage (dev example):**

```
// Allow reads for all; allow writes for dev only. Tighten before prod.
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /qaImages/{allPaths=**} {
      allow read: if true;
      allow write: if request.time < timestamp.date(2099,1,1);
    }
  }
}
```

The QA page uploads images to `qaImages/` and stores doc refs in Firestore.

---

## 💳 Stripe Testing

* Use **test key** in `server/.env`.
* Sample cards: `4242 4242 4242 4242`, any future expiry, any CVC/ZIP.
* The server endpoint:

  * `POST /create-payment-intent` with `{ plan: "premium" }` or `{ amount: 999 }`.
  * Amount is validated against a small allowlist (`premium`, `pro`).

---

## ✉️ Email (Resend)

* Put `RESEND_API_KEY` in `server/.env`.
* Use `FROM_EMAIL="DEV@Deakin <onboarding@resend.dev>"` for frictionless testing.
* Endpoints:

  * `POST /api/subscribe` → sends welcome email to subscriber.
  * `POST /api/contact` → forwards contact form to `CONTACT_TO_EMAIL`.

---

## 🤖 AI Assistant (optional)

* Put `OPENAI_API_KEY` and pick a model:

  * **Cheapest**: `gpt-5-nano` (⚠️ temperature fixed at 1; the server handles this automatically)
  * Tunable: `gpt-5-mini` / `gpt-4o-mini`
* Endpoints:

  * `POST /api/ai/chat` → JSON reply
  * `POST /api/ai/chat-stream` → chunked text stream

**Example (curl):**

```bash
curl -X POST http://localhost:8787/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hi!"}]}'
```

---

## 🧭 Main Routes (client)

* `/` Home (carousel + CTA + footer)
* `/plans`, `/pay`, `/post` – basic course pages
* `/login` – preserved 9.1c styling
* `/qa` – Questions & Articles hub

  * `/qa/question/:id` · `/qa/article/:id` detail pages
* `/tutorial` – lecturer cards
* `/faqs` · `/help` · `/contact` – footer pages

---

## 🛠️ Scripts

In root `package.json`:

```json
{
  "scripts": {
    "dev": "concurrently \"npm:dev:client\" \"npm:dev:server\"",
    "dev:client": "npm --prefix client run dev",
    "dev:server": "npm --prefix server run dev",
    "build": "npm --prefix client run build",
    "preview": "npm --prefix client run preview"
  },
  "devDependencies": {
    "concurrently": "^9.x",
    "nodemon": "^3.x"
  }
}
```

* `npm run dev` – start client & server.
* `npm run build` – build client for production.
* `npm run preview` – preview built client.

---

## 🧪 Troubleshooting

* **API 400: temperature unsupported**
  You’re using `gpt-5-nano`. It locks temperature to 1. The server already omits `temperature` for these models.
* **CORS in dev**
  The server uses `cors({ origin: true })` and Vite proxies `/api` to `http://localhost:8787`. Make sure server is running.
* **Didn’t receive email**
  Use `onboarding@resend.dev` as sender for testing. Check logs on the server; verify `RESEND_API_KEY` and inbox spam.
* **Stripe error**
  Use **test** keys and test cards. Make sure amount/plan is allowed by the server allowlist.
* **GitHub push blocked (secrets)**
  Rotate keys, keep secrets only in `server/.env`. Never commit `.env`. If leaked before, clean history or re-init a new repo.

---

## 📦 Deployment (high level)

* **Netlify**: Deploy the `client` build (`npm run build`).
* **Server** (Express): Deploy to Render/Railway/Fly/Serverless of your choice.

  * Update the client’s API base URL (Vite proxy is only for dev).
  * Set server environment variables on the host.

*(You asked to save Netlify steps for later; this is just the outline.)*

---

## 🤝 Contributing

1. Create a branch: `feat/...` or `fix/...`
2. Keep secrets out of Git; use `server/.env.example`.
3. Use concise English comments in code.

---

## 📝 License

MIT — use freely for study and personal projects.

---

## 📧 Credits

Built by StevenQu for SIT313.
Stack: React (Vite) · Express · Firebase · Stripe · Resend · OpenAI.

