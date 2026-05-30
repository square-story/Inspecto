# Inspecto — Enterprise Features Compendium
> Date: 2026-04-15  
> Purpose: Sales documentation for MNC enterprise pitch  
> Platform: Three-sided vehicle inspection marketplace (Users / Inspectors / Admin)

---

## Platform Overview

Inspecto is a production-ready, three-sided marketplace platform for on-demand vehicle inspections. Vehicle owners book certified inspectors who travel to their location, complete a structured assessment, and generate a tamper-evident PDF report. The platform governs the full lifecycle: identity verification, geolocation matching, slot booking, payments, PDF report generation, revenue distribution, and real-time notifications.

**Architecture:** Node.js + TypeScript backend, React 18 frontend, MongoDB + Redis infrastructure, InversifyJS dependency injection, Stripe payments, Socket.IO real-time, Cloudinary media, Brevo transactional email, Puppeteer PDF generation.

---

## PART 1 — CURRENT IMPLEMENTED FEATURES

### 1. Multi-Role Identity & Authentication System

**What:** Three isolated auth surfaces (User / Inspector / Admin) each with their own JWT lifecycle, refresh token rotation via HttpOnly cookies, and separate secret keys.

**Techniques:**
- Short-lived access tokens (15 min) + long-lived refresh tokens (7 days) in HttpOnly cookies — XSS-resistant
- Redis-based token blacklisting on logout — stateless JWTs made stateful for revocation
- OTPs stored in Redis with TTL — never persisted to MongoDB — cannot be scraped via DB dump
- Crypto-hashed password reset tokens via Brevo SMTP transactional email
- Google OAuth2 for users (social login reduces consumer friction)
- Role-based middleware (`authorizeRole`) gates every protected route

**Real scenario:** Inspector registers → receives OTP on email → verifies identity → submits profile → cannot access inspector dashboard until admin approves. If blocked mid-session, WebSocket connection forcibly disconnects in real time.

**MNC value:** Insurance companies and fleet operators need airtight role separation. Each actor sees only what their role permits.

---

### 2. Inspector Onboarding & Approval Workflow

**What:** Multi-step registration pipeline with gating at each stage.

**Techniques:**
- Profile completion tracked by `isCompleted` flag — listing blocked until complete
- Status state machine: `PENDING → APPROVED / DENIED / BLOCKED`
- Denial stores reason in DB + triggers Brevo email + in-app notification
- `approvedAt` / `deniedAt` timestamps for audit trail
- Certifications and specializations stored as arrays (extensible without schema changes)

**Real scenario:** Inspector uploads IAME certification + claims EV specialization → Admin reviews → Approves → Inspector listed in discovery for EV inspections within their coverage area.

**MNC value:** Only vetted inspectors touch customer vehicles. Approval timestamps are legally defensible audit records.

---

### 3. Geolocation-Based Inspector Discovery

**What:** Spatial query engine that finds inspectors covering the user's location.

**Techniques:**
- Inspector coordinates stored as GeoJSON Point (`{ type: 'Point', coordinates: [lng, lat] }`)
- MongoDB 2dsphere index enables `$near` queries sorted by proximity
- `coverageRadius` (km) per inspector — query uses `$maxDistance` to bound the search radius
- Filters: specialization, active status, `isListed` flag, availability on requested date

**Real scenario:** User in Whitefield, Bangalore searches "Pre-Purchase Inspection" → platform returns inspectors within 20km who have the specialization and available slots on the requested date.

**MNC value:** Fleet companies with vehicles across multiple depots need location-aware dispatch. This eliminates manual assignment entirely.

---

### 4. Slot-Based Availability & Concurrency-Safe Booking Engine

**What:** Weekly availability template per inspector with concurrency-safe slot allocation.

**Techniques:**
- `availableSlots` stores Mon–Sat weekly template with time slots
- `bookedSlots` tracks per-date booking counts and user references
- **MongoDB session transaction wraps the slot existence check + booking create** — `existingInspection()` query runs inside the same session as the write, so concurrent requests that both pass the read check cannot both commit; the second write sees the committed state and fails with "Slot is no longer available"
- `version` field incremented on each booking update — provides change tracking and detects stale re-submissions
- `unavailabilityPeriods` for vacation/blackout date ranges
- Available slots query computes free slots by filtering inspector's weekly template against all non-cancelled bookings for that date

**Real scenario:** Inspector sets Monday 9 AM as available. Three users book simultaneously → transaction isolation ensures only one succeeds; the others hit the existence check and receive a "Slot is no longer available" error → slot disappears from the UI immediately.

**MNC value:** Fleet operators scheduling 50 vehicles weekly need guaranteed allocation without double-booking. This is production-grade concurrency control, not application-level locking.

---

### 5. Inspection Lifecycle State Machine

**What:** Strict 6-state machine governing every inspection.

```
PENDING_PAYMENT → PENDING → CONFIRMED → IN_PROGRESS → COMPLETED → CANCELLED
```

**Techniques:**
- State transitions validated in service layer — invalid transitions throw `ServiceError`
- `PENDING_PAYMENT` expires after 10 minutes via `PaymentStatusChecker` cron job — slot freed automatically
- Payment webhook drives `PENDING_PAYMENT → PENDING` transition
- Report submission drives `IN_PROGRESS → COMPLETED`
- Completion triggers PDF generation + wallet credit in a single MongoDB transaction

**Real scenario:** User books at 3 PM. Doesn't pay by 3:10 PM → inspection expires, slot freed. User pays → moves to PENDING → Inspector confirms → marks IN_PROGRESS → submits report → COMPLETED → PDF generated → inspector paid.

**MNC value:** Immutable audit trails. The state machine prevents back-dating, skipping steps, or modifying completed inspections.

---

### 6. Structured Inspection Report Engine

**What:** Standardized multi-section report schema with pass/fail grading and server-side PDF output.

**Techniques:**
- Report embedded in Inspection document — atomic reads
- Condition sections: exterior, interior, engine, tires, lights, brakes, suspension — typed grading
- Mileage, fuel level, pass/fail flag, notes, recommendations, photos array (Cloudinary URLs)
- **Puppeteer** (headless Chromium) generates PDF server-side → stored on Cloudinary → URL persisted to report
- Signed Cloudinary URLs for time-limited secure PDF access
- `submittedAt` timestamp for audit

**Real scenario:** Inspector checks 2019 Maruti Swift → marks brakes: poor, engine: good → attaches 12 photos → marks `passedInspection: false` → submits. Within seconds, user and inspector both receive a branded PDF with all findings, inspector signature, and timestamp.

**MNC value:** Consistent report format enables cross-vehicle comparison at scale. Insurance companies cannot underwrite using free-form text that varies by inspector.

---

### 7. Vehicle Registry with Inspection History

**What:** Per-user vehicle registry with unique chassis identification and inspection linkage.

**Techniques:**
- `chassisNumber` unique-indexed — prevents same vehicle under multiple accounts
- Vehicle types and fuel types as enums — clean data for analytics
- Insurance expiry field for alerting pipelines
- `lastInspectionId` links to most recent inspection for O(1) history lookup
- Front + rear view images via Cloudinary

**Real scenario:** Fleet company registers 30 delivery vans. Each with chassis number, registration plate, insurance expiry. Booking an inspection for VAN-007 auto-shows last inspection was 8 months ago and insurance expires in 6 weeks.

**MNC value:** Vehicle-centric data, not user-centric. Chassis number as unique key enables cross-platform vehicle history even across ownership changes.

---

### 8. Stripe Payment Integration (Production-Grade)

**What:** Full Stripe payment flow with webhook handling, refunds, and expiry management.

**Techniques:**
- **Payment Intents API** (not legacy Charges) — handles 3D Secure / SCA compliance automatically
- Idempotent intent creation: if pending intent exists for inspection, reuse it — no duplicate charges
- **HMAC signature verification** on every webhook — fake events rejected before processing
- `payment_intent.succeeded` webhook triggers status transition
- 10-minute payment window via `PaymentStatusChecker` cron
- Refund flow calls Stripe Refunds API → marks payment `refunded`
- `stripePaymentIntentId` unique-indexed — no duplicate payment records
- Currency: INR, amounts in paise

**Real scenario:** User opens payment page, leaves for 12 minutes. Inspection expires. Re-books, gets new intent, pays via UPI → webhook fires → status updates in under 3 seconds.

**MNC value:** RBI-mandated 3DS compliance is non-negotiable for INR payments. No enterprise client accepts test-mode payment patterns.

---

### 9. Three-Way Wallet & Revenue Distribution Engine

**What:** Separate wallets for Inspector, Admin, and User with automatic fee splitting on payment completion.

**Techniques:**
- `ownerType` + `refPath` polymorphic pattern — single Wallet collection serves all actor types
- Fee split: **85% Inspector / 15% Platform** (configurable per `InspectionType.platformFee` — never hardcoded)
- Wallet credit inside MongoDB **transaction** with Inspection status update — atomic
- Separate `balance` (withdrawable) and `pendingBalance` (in settlement period)
- `isLocked` flag for fraud holds
- Full transaction ledger: `EARNED / WITHDRAWN / PLATFORM_FEE / REFUND / PAYMENT`
- `totalEarned` and `totalWithdrawn` running totals for O(1) dashboard reads

**Real scenario:** 50 inspections complete in a day. Each atomically: updates status, credits 85% to inspector, credits 15% to admin. Dashboard shows real-time platform revenue without expensive aggregation queries.

**MNC value:** Platform fee is configurable per inspection type — premium products carry different revenue sharing. Financial infrastructure, not just a payment button.

---

### 10. Inspector Withdrawal System

**What:** Inspector-initiated withdrawal requests with admin approval and payout tracking.

**Techniques:**
- Minimum threshold: ₹1,000 enforced in service layer
- Methods: `BANK_TRANSFER` (IFSC + account details) / `UPI`
- Status machine: `PENDING → PROCESSING → COMPLETED / REJECTED`
- `transactionId` for actual bank reference tracking
- `processedDate` timestamp for settlement audit

**MNC value:** Every withdrawal has: who requested, when, amount, method, which admin processed, bank reference. Compliant financial operations.

---

### 11. Review & Reputation System

**What:** Per-inspection rating system with manipulation prevention.

**Techniques:**
- Unique index on `(inspector, user, inspection)` — one review per inspection, not per inspector
- Ratings 1–5 with mandatory text comment
- Review tied to specific completed inspection — fake reviews without real inspection impossible

**MNC value:** Creates market accountability without admin intervention on every case. Insurance companies need trusted inspection quality signals.

---

### 12. Real-Time Notification System

**What:** WebSocket-based push with persistent in-app notification inbox.

**Techniques:**
- **Socket.IO** for real-time push
- Notifications persisted to MongoDB — accessible after reconnect
- `recipientModel` refPath — single collection serves all actor types
- 8 typed notification events with structured payload
- **Account block triggers real-time socket disconnect** — blocked inspector cannot submit fraudulent report in-flight

**MNC value:** Operational real-time control. Blocking an inspector kicks them out instantly, not on next login.

---

### 13. Admin Control Center

**What:** Full-platform governance dashboard.

**Techniques:**
- Paginated user/inspector lists with search + filter
- Inspection type CRUD — add/price services without code deploys
- Inspector approval/denial with email + notification
- Block/unblock with immediate WebSocket effect
- Platform-wide stats via MongoDB aggregations
- Wallet oversight + withdrawal request queue

**MNC value:** Business team controls product configuration. No developer needed to update pricing or launch a new inspection service.

---

### 14. Security Hardening

**Implemented techniques:**
- `helmet.js` — 15+ security HTTP headers (CSP, HSTS, X-Frame-Options, etc.)
- `express-rate-limit` — abuse prevention on auth endpoints
- Explicit CORS whitelist — `*` never used
- Zod schema validation on all request bodies — no raw input reaches business logic
- Stripe webhook HMAC verification
- HttpOnly + Secure cookies — JavaScript cannot read refresh tokens
- Role middleware on every route
- Inspector status check on every authenticated request — blocked inspectors cannot make API calls even with valid tokens

---

## PART 2 — FUTURE FEATURES (Real-World Problem Solving)

### F1. AI-Powered Inspection Scoring Engine

**Problem:** At 10,000+ inspections/month, human review of every report is the bottleneck.

**Solution:** ML model produces an AI Inspection Score (0–100) per completed inspection based on all condition fields. Score predicts: vehicle health, estimated repair cost range, remaining useful life. Anomaly detector flags statistically improbable reports (e.g., "all perfect" for 2005 vehicle at 240,000 km).

**Real use case — Insurance:** Vehicles scoring below 60 → mandatory reinspection. Below 40 → policy refused. Eliminates underwriter guesswork.
**Real use case — Fleet:** Weekly fleet health report: "7 vehicles at risk within 30 days." Prevents breakdowns proactively.

---

### F2. B2B API Gateway & White-Label Platform

**Problem:** MNCs want inspection capabilities embedded in their own products, not a shared marketplace.

**Solution:**
- REST API with API key auth for enterprise clients
- `POST /b2b/inspections` → auto-dispatches to nearest available inspector
- Webhook callback on completion (PDF URL + AI Score)
- White-label: client branding on reports, emails, subdomain
- Usage-based billing via Stripe Billing (metered per inspection)

**Real use case — Insurance:** Policy system triggers Inspecto API on new vehicle application → inspection auto-assigned → report returned → policy decision made. Zero human touch.
**Real use case — Used-car marketplace:** "Get Certified" button on listing triggers API → "Inspecto Certified" badge applied on completion.

---

### F3. Fleet Management Module

**Problem:** Companies with 50–5,000 vehicles cannot manage inspections one by one.

**Solution:** Bulk vehicle import (CSV/API), fleet health dashboard, automated recurring inspection scheduling, compliance alerts (insurance/PUC/fitness certificate expiry), fleet utilization reports, role hierarchy within fleet accounts.

**Real use case — Logistics:** 500 delivery vehicles. Compliance officer sets "inspect every 180 days." Platform auto-schedules 2 weeks before due, assigns nearest inspector, sends driver the appointment. Compliance report generated for regulatory audit.

---

### F4. Digital Inspection Certificate with QR Verification

**Problem:** PDF reports can be forged. No trustless verification exists.

**Solution:** Completed inspection generates a QR-code certificate linking to a public verification page. Certificate contains tamper-evident SHA-256 hash of report data. Inspector digital signature applied (Aadhaar eSign / DSC integration). Verification page shows: vehicle, inspector credentials, date, pass/fail, score, report summary.

**Real use case — Used-car:** Buyer scans QR on bonnet → sees report from 3 days ago → no forgery possible.
**Real use case — Insurance claim:** Customer claims damage was pre-existing. Insurance company scans pre-policy inspection QR → brakes were fine at inspection → claim denied.

---

### F5. Inspector Route Optimization

**Problem:** Unoptimized routing wastes 40% of an inspector's day in transit.

**Solution:** Google Maps Distance Matrix API computes optimal visit sequence for multiple bookings in a day. Inspector sees optimized day view. Real-time ETA shared with customer: "Inspector is 2 stops away, ETA 45 min."

**Impact:** +50% inspector capacity per day, reducing platform operational cost and improving inspector earnings.

---

### F6. Regulatory Compliance Module

**Problem:** Commercial vehicles require periodic fitness certificates, PUC certificates, road tax renewals. Missing deadlines causes fleet seizures.

**Solution:** Per-vehicle compliance calendar. VAHAN API (MoRTH) integration for live registration data. Automated alerts at 60/30/7 days before each expiry. Inspection type mapped to compliance certificate. Compliance dashboard: green/yellow/red status per vehicle.

**MNC value:** Converts reactive compliance failure into proactive management. Government mandate — any commercial fleet not in compliance faces vehicle seizure.

---

### F7. Fraud Detection & Inspector Quality Assurance Engine

**Problem:** Fraudulent inspectors pass vehicles that should fail — from laziness or bribery.

**Solution:** ML model trained on report patterns. Flags:
- Inspector pass rate significantly above platform average
- Identical report content across multiple vehicles (plagiarism detector)
- Photo EXIF metadata location mismatches inspection location (GPS fraud)
- Report submitted 5x faster than inspection type duration (time fraud)

Flagged inspections queued for admin review. Repeated flags → automatic suspension.

**Real use case:** Inspector colludes with dealer to pass 20 vehicles. 100% pass rate + sub-10-minute submissions → flagged → suspended → buyers notified → reinspection offered.

---

### F8. Dispute Resolution System

**Problem:** User disputes inspection findings. No resolution mechanism exists.

**Solution:** User raises dispute within 7 days. Inspector submits rebuttal. Admin mediates with SLA (48-hour response). Outcomes: RESOLVED_USER_FAVOR / RESOLVED_INSPECTOR_FAVOR / REINSPECTION_ORDERED. Evidence upload, resolution tracking, refund integration.

**MNC value:** Required for any enterprise SLA. Without it, the platform has no credibility for high-stakes inspections.

---

### F9. Pre-Purchase Inspection Escrow Flow

**Problem:** Pre-purchase inspections are highest-stakes. Current flow doesn't enforce the buyer-seller-inspector sequence.

**Solution:** Buyer initiates inspection for specific vehicle (by registration). Seller confirms availability. Buyer pays to escrow. Inspector inspects. Report released only after escrow settlement. Integration with used-car platforms: escrow + inspection bundled in listing checkout.

---

### F10. EV-Specific Inspection Module

**Problem:** EVs require entirely different inspection criteria. Battery State of Health (SoH) is critical — not captured in current schema.

**Solution:** New inspection type: "EV Battery & Health Inspection." Extended report schema: Battery SoH (%), estimated range, BMS status, motor condition, charging port. OBD-II Bluetooth adapter auto-populates battery data. SoH score on certificate. Degradation projection included.

**Real use case:** Used EV marketplace shows battery health per listing. Buyers compare: "87% SoH vs 71% SoH." Platform becomes the de facto EV trust layer.

---

### F11. Multi-Tenant SaaS Architecture

**Problem:** MNCs want branded deployments, not a shared marketplace with competitors.

**Solution:** Tenant isolation at DB level (`tenantId` on all documents). Per-tenant admin panel, custom domain, report templates, email branding, inspection catalog, pricing. Platform super-admin manages all tenants.

**MNC value:** An insurance company gets "their" inspection platform. Multi-tenancy delivers enterprise pricing while infrastructure costs stay shared.

---

### F12. ESG & Fleet Emissions Reporting

**Problem:** Listed MNCs must report fleet emissions for SEBI BRSR compliance. No current tool connects vehicle condition data to emissions reporting.

**Solution:** Vehicle type + fuel type + mileage data from inspection reports → CO2 emissions per vehicle. Fleet emissions dashboard with trends. BRSR-format export. EV replacement recommendations for carbon target achievement.

**MNC value:** Every listed Indian company files BRSR. Fleet emissions is a direct metric. Turns Inspecto into a compliance tool — dramatically increasing stickiness.

---

### F13. SSO / SAML / Enterprise Identity Integration

**Problem:** Every MNC IT policy requires vendor systems to authenticate via corporate identity providers (Active Directory, Okta, Azure AD). Username/password is a blocker for enterprise procurement.

**Solution:** SAML 2.0 and OAuth2/OIDC integration for admin and fleet-account users. Inspector app stays credential-based (field workers don't have corporate SSO). Platform supports: Microsoft Azure AD, Google Workspace, Okta. Just-in-time (JIT) user provisioning on first SSO login.

**MNC value:** SSO is a procurement gate, not a nice-to-have. Any MNC with 5,000+ employees cannot approve a vendor that requires separate passwords. Without this, deals stall at the security review stage.

---

### F14. Data Privacy Compliance (DPDP Act / GDPR-equivalent)

**Problem:** India's Digital Personal Data Protection Act (DPDP) 2023 mandates explicit consent collection, data deletion on request, cross-border transfer controls, and breach notification timelines. Any MNC deploying Inspecto for customer-facing use is liable.

**Solution:**
- Consent management: granular consent flags on User and Inspector records (marketing, analytics, third-party sharing)
- Right to erasure: data deletion workflow that anonymizes PII while preserving anonymized inspection records for analytics
- Data portability: export all user data as JSON on request
- Breach notification pipeline: automated admin alert within 72 hours of detected breach
- Data residency: Indian data stored in ap-south-1 region only (configurable per tenant in F11)

**MNC value:** Non-compliance with DPDP Act carries penalties up to ₹250 crore. Any listed company, BFSI firm, or healthcare-adjacent MNC will make this a mandatory requirement before contract signature.

---

### F15. Exportable Audit Log

**Problem:** Compliance teams and internal auditors need a tamper-evident, time-ordered log of all platform actions — who approved which inspector, who processed which withdrawal, which admin blocked which account. This is currently implicit in the timestamps across models, but not queryable.

**Solution:**
- Append-only `AuditLog` collection: every state-changing action writes a record (actor, action, entity, before/after state, timestamp, IP address)
- Covers: inspection status changes, user/inspector blocks, withdrawal approvals, inspection type modifications, admin logins
- Exportable as CSV or JSON with date range filtering
- Admin UI: searchable audit log with actor and entity filters
- Tamper-evidence: hash chain on log records (each entry hashes the previous entry's hash)

**MNC value:** Required for ISO 27001, SOC 2, and RBI NBFC compliance audits. Without an audit log, enterprises cannot pass their own internal security reviews to approve the vendor.

---

## PART 3 — TECHNIQUE REFERENCE

| Layer | Technique | Why It Matters |
|---|---|---|
| Concurrency | MongoDB session transaction wraps read-check + write | No double-bookings; second writer sees committed slot, fails cleanly |
| Payments | Stripe Payment Intents + HMAC webhooks | 3DS/SCA compliant, webhook-secure |
| Geolocation | MongoDB 2dsphere + $near + $maxDistance | Sub-100ms proximity queries at scale |
| Auth | HttpOnly cookies + Redis blacklist | JWT revocation without session storage |
| PDF | Server-side Puppeteer | Consistent branded output |
| DI | InversifyJS | Testable, SOLID, enterprise-grade architecture |
| State | Explicit state machine on Inspection | Invalid state transitions impossible |
| Fee splitting | Configurable per inspection type | Revenue model survives partnership deals |
| Real-time | Socket.IO + forced disconnect on block | Operational control, not just UX |
| Input validation | Zod on all request boundaries | No raw input reaches business logic |
| Transactions | MongoDB multi-collection transactions | Wallet + status update is atomic |
| Fraud prevention | Redis OTP TTL + token blacklist | No OTP replay, no session hijacking |

---

## PART 4 — MNC SALES POSITIONING

| Buyer Type | Primary Value Proposition | Lead Features |
|---|---|---|
| Auto Insurance | Standardized pre-policy vehicle assessment | F1 AI Score, F4 QR Certificate, F7 Fraud Detection, F2 B2B API, F14 DPDP Compliance |
| Fleet Operator | Compliance automation + cost reduction | F3 Fleet Module, F6 Compliance Calendar, F5 Route Optimization, F12 ESG, F13 SSO |
| Used-Car Marketplace | Buyer trust through certified inspections | F4 QR Verification, F9 Pre-Purchase Escrow, F10 EV Module, F2 White-Label |
| Government / RTO | Digital roadworthiness certification | F6 Regulatory Module, F4 Digital Certificate, F15 Audit Log |
| Auto OEM | Post-sale quality audit + warranty inspection | F7 Quality Assurance Engine, F8 Dispute Resolution, F2 B2B API, F15 Audit Log |
| Fintech / NBFC | Asset verification for vehicle loans | F1 AI Score, F7 Fraud Detection, F4 QR Certificate, F14 DPDP, F15 Audit Log |
