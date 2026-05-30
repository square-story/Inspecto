# Inspecto — CLAUDE.md

> Vehicle inspection marketplace platform. Three-sided marketplace: Users (vehicle owners), Inspectors (service providers), Admins (platform managers).

---

## Project Structure

Monorepo. Backend in `/backend`, frontend in `/frontend`. Never mix them.

```
Inspecto/
├── backend/src/
│   ├── config/           — env config, DB, Redis, Logger (app.config.ts)
│   ├── controllers/      — route handlers only, no business logic
│   ├── core/
│   │   ├── abstracts/    — BaseRepository, BaseService
│   │   ├── errors/       — ServiceError class
│   │   ├── interfaces/
│   │   │   ├── repositories/  — repository interface contracts
│   │   │   └── services/      — service interface contracts
│   │   └── types/        — shared TypeScript types
│   ├── di/               — InversifyJS container (container.ts) and TYPES symbols
│   ├── middlewares/      — authenticateToken, authorizeRole, errorHandler
│   ├── models/           — Mongoose schemas (User, Inspector, Inspection, etc.)
│   ├── repositories/     — DB access implementations
│   ├── routes/           — Express router definitions
│   ├── scripts/          — seed-admin.ts, seed-inspection-types.ts
│   ├── services/
│   │   └── auth/         — user.auth.service.ts, inspector.auth.service.ts, admin.auth.service.ts
│   ├── utils/            — token utils, email, OTP, PDF (Puppeteer), checkPaymentStatus
│   ├── app.ts            — Express app setup (CORS, middleware, routes)
│   └── server.ts         — server startup, DB + Redis connection
└── frontend/src/
    ├── api/              — Axios instance + interceptors (axiosInstance.ts)
    ├── app/              — Redux store setup
    ├── components/       — reusable UI (shadcn/ui wrappers, shared widgets)
    ├── components/ui/    — shadcn/ui primitive components
    ├── features/         — Redux Toolkit slices (auth, user, inspector, admin)
    ├── pages/            — route-level page components
    ├── routes/           — React Router v6 configuration
    ├── services/         — typed API call functions (use axiosInstance)
    └── types/            — TypeScript interfaces matching backend models
```

Root level: only `docker-compose.yml`, `.github/`, `README.md`, `CLAUDE.md`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend runtime | Node.js + TypeScript |
| Backend framework | Express.js |
| DI | InversifyJS |
| Database | MongoDB + Mongoose |
| Cache | Redis |
| PDF | Puppeteer |
| Auth | JWT + Google OAuth2 |
| Payments | Stripe (Payment Intents) |
| Email | Brevo SMTP API |
| Media | Cloudinary |
| Frontend framework | React 18.3.1 + Vite 6.0.5 |
| State | Redux Toolkit 2.5.0 |
| HTTP | Axios 1.7.9 |
| Styling | Tailwind CSS 3.4.17 + shadcn/ui + Radix UI |
| Forms | React Hook Form v7 + Zod v3 |
| Hosting | Render (backend), Docker, GitHub Actions CI/CD |

---

## Backend Architecture Rules

### Dependency Injection (InversifyJS) — mandatory

- Every service and repository **must** be registered in `backend/src/di/container.ts`.
- Use `TYPES` symbols from `backend/src/di/types.ts` — never string literals.
- Decorate classes with `@injectable()`. Inject with `@inject(TYPES.XxxSymbol)`.
- Never instantiate services/repositories with `new` in business code.
- New service/repository workflow: (1) define interface in `core/interfaces`, (2) implement class, (3) add TYPES symbol, (4) bind in container.

### Controller → Service → Repository layering

- **Controllers**: validate input → call service → return JSON. Nothing else.
- **Services**: all business logic, call repositories. Never touch `req`/`res`.
- **Repositories**: all Mongoose/DB operations. No business rules.
- Every controller method: wrapped in `try/catch` → pass errors to `next(err)`.
- Services throw `ServiceError` — never throw raw `Error`.
- Central error-handling middleware in `app.ts` is the single place errors become HTTP responses.

### HTTP Response Shape

```ts
{ success: boolean, message: string, data?: any }
```

Use standard HTTP status codes via `HTTP_STATUS` constants. Use `RESPONSE_MESSAGES` constants for all message strings.

### Express conventions

- Versioned prefix: `/api/v1/`
- Route namespaces: `/api/v1/user/*`, `/api/v1/inspector/*`, `/api/v1/admin/*`
- List endpoints must support `page` + `limit` + filtering query params.
- CORS whitelist configured in `app.ts` — never use `*` in production.
- `helmet` + `express-rate-limit` for security headers and abuse prevention.

### Authentication & Authorization

- JWT: short-lived access tokens + long-lived refresh tokens in HttpOnly cookies.
- Token blacklisting on logout via Redis.
- OTPs stored in Redis with TTL — never in MongoDB.
- Password reset: crypto-hashed tokens sent via Brevo SMTP.
- Google OAuth for Users only.
- All protected routes: `authenticateToken` middleware.
- Role-gating: `authorizeRole(['user' | 'inspector' | 'admin'])` — never hardcode role checks in controllers.
- Admin: single account seeded via `scripts/seed-admin.ts`.

### MongoDB / Mongoose

- Schemas in `backend/src/models/`.
- Strict TypeScript typing: define Document interface as generic.
- `{ strict: true }` on all schemas.
- `lean()` on read-only queries.
- Transactions for any write to more than one collection.
- Key models: `User`, `Inspector`, `Inspection`, `InspectionType`, `Payment`, `Wallet`, `Vehicle`, `Review`.
- `InspectionType` has configurable `platformFee` — never hardcode fee splits (platform: 15%, inspector: 85%).

### Redis

- Config via `REDIS_HOST`, `REDIS_PORT` env vars.
- Uses: JWT blacklisting, OTP storage, session caching.
- Always set TTL — never store without expiry.
- Wrap Redis operations in `try/catch` — Redis failure must not crash the server.

### Stripe

- All Stripe logic in `backend/src/services/payment.service.ts`.
- Use Payment Intents — never Charges API.
- Verify Stripe webhook signature with `STRIPE_WEBHOOK_SECRET` before processing.
- Payment window: 10-minute expiration enforced by `PaymentStatusChecker` cron job.
- After successful payment: update `Inspection` status + credit inspector `Wallet` in a single transaction.
- `platformFee` read from `InspectionType` — never hardcoded.

### PDF & Media

- PDF reports: Puppeteer only (`backend/src/utils/generatePDF.ts`).
- Images: Cloudinary (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).
- Frontend image uploads: Cloudinary React widgets — do not route through backend.

### TypeScript Path Aliases (backend)

`baseUrl: './src'` in `backend/tsconfig.json`. Use `@/` prefix for all src-relative imports:

```
@/controllers/*  → src/controllers/
@/services/*     → src/services/
@/repositories/* → src/repositories/
@/models/*       → src/models/
@/routes/*       → src/routes/
@/middlewares/*  → src/middlewares/
@/utils/*        → src/utils/
@/config/*       → src/config/
@/validators/*   → src/validators/
@/types/*        → src/types/
@/core/*         → src/core/
@/di/*           → src/di/
```

Runtime: `tsconfig-paths/register`. Production build: `tsc` then `tsc-alias`.

---

## Frontend Architecture Rules

- Functional components and hooks only — no class components.
- Redux Toolkit slices in `frontend/src/features/` — one slice per domain: `auth`, `user`, `inspector`, `admin`.
- Use `createSlice` and `createAsyncThunk`. Never legacy Redux patterns.
- Async data fetching: React Query (TanStack Query) — not Redux thunks unless strictly necessary.
- All HTTP calls via the shared Axios instance at `frontend/src/api/axiosInstance.ts`.
- Interceptors: automatic token refresh + force logout on 'blocked' signal.
- All forms: React Hook Form + Zod. Define Zod schema first, derive type with `z.infer<>`, use `zodResolver`.
- Styling: Tailwind CSS utilities only. Global styles in `frontend/src/index.css`. Extend theme in `tailwind.config.js`.
- shadcn/ui components from `/components/ui` before building custom ones.
- All routes in `frontend/src/routes/`. Three groups: user, inspector, admin. Use `lazy()` + `Suspense` for code splitting.
- `useNavigate` for programmatic navigation — never `window.location`.

---

## Inspection Lifecycle (State Machine)

```
PENDING_PAYMENT → PENDING → CONFIRMED → IN_PROGRESS → COMPLETED → CANCELLED
```

- `PENDING_PAYMENT`: created on booking. Expires after 10 min if not paid (cron job).
- `PENDING`: payment confirmed, waiting for inspector acceptance.
- `CONFIRMED`: inspector accepted.
- `IN_PROGRESS`: inspection underway.
- `COMPLETED`: report submitted → PDF generated → wallet credited.
- `CANCELLED`: either side cancels before completion.

Never skip statuses or allow transitions outside this machine.

---

## Environment Variables

Backend env vars accessed **only** through `backend/src/config/app.config.ts` — never `process.env` directly elsewhere.

**Required backend vars:** `DATABASE_URL`, `REDIS_HOST`, `REDIS_PORT`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `BREVO_API_KEY`, `GOOGLE_CLIENT_ID`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.

**Required frontend vars (all `VITE_` prefixed):** `VITE_API_BASE_URL`, `VITE_STRIPE_PUBLISHABLE_KEY`, `VITE_GOOGLE_CLIENT_ID`, `VITE_CLOUDINARY_CLOUD_NAME`.

Throw a descriptive startup error if any required env var is missing. Never commit `.env` files.

---

## Build & Scripts

**Package manager: pnpm only.**

| Command | Description |
|---|---|
| `pnpm run dev` | Backend: ts-node-dev with tsconfig-paths |
| `pnpm run build` | tsc → tsc-alias → output to `/dist` |
| `node dist/server.js` | Production start |
| `pnpm run seed:admin` | Seed admin account |

---

## TypeScript Conventions

- Always TypeScript — never plain JS.
- `interface` for object shapes; `type` for unions/intersections only.
- No `any`. Use `unknown` + type narrowing.
- `strict: true` in all `tsconfig.json`.
- `async/await` exclusively — no raw Promise chains.
- Optional chaining `?.` and nullish coalescing `??` over manual null checks.
- No `console.log` in production — use the configured Logger (Winston).
- No dead code, unused imports, or commented-out blocks.

---

## Code Generation Rules

- Output only the solution (code + file paths) unless explanation is explicitly requested.
- State target file path as a comment at the top of each code block.
- When generating a new feature, output all layers in order: **interface → repository → service → controller → route**.
- Backend code must follow InversifyJS DI pattern — never skip container registration.
- Frontend code must use the shared Axios instance and RTK slice pattern.
- Never generate test stubs unless tests are explicitly requested.
- Minimal, readable, production-quality code — no boilerplate padding.

---

## Docker & CI/CD

- Backend Dockerfile: `tsc + tsc-alias` → copy `/dist` → `node dist/server.js`.
- Frontend Dockerfile: `vite build` → serve `/dist`.
- Local dev: `docker-compose.yml` at repo root orchestrates backend, frontend, MongoDB, Redis.
- CI/CD: GitHub Actions at `.github/workflows/deploy-backend-render.yml`, triggers on push to `main`.
- Production: Render — no Vercel/Heroku-specific config.
- Never hardcode env values in Dockerfiles.
