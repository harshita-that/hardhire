# Hardhire — Multiphase Plan

---

## Phase Overview

| # | Phase | Goal | Duration | Status |
|---|---|---|---|---|
| 0 | **Landing Page** | Marketing site, value prop, initial design system | — | ✅ Done |
| 1 | **Project Setup** | Backend scaffold, CI, database, dev environment | 1 week | — |
| 2 | **Data Ingestion** | OSHA citations + contractor licenses in Postgres | 2 weeks | Phase 1 |
| 3 | **Entity Resolution** | Match citations to contractors at ≥ 85% accuracy | 2 weeks | Phase 2 |
| 4 | **Scoring Engine** | A–F grades computed for all resolved contractors | 1 week | Phase 3 |
| 5 | **API** | REST endpoints live — lookup, bulk, reports | 2 weeks | Phase 4 |
| 6 | **Web App** | Frontend — search, reports, auth, dashboard | 3 weeks | Phase 5 |
| 7 | **Payments** | Stripe subscriptions + metered API billing | 1 week | Phase 6 |
| 8 | **Admin & Ops** | Admin dashboard, monitoring, alerting | 1 week | Phase 5 |
| 9 | **Pilot Launch** | Deploy, recruit users, collect feedback | 2 weeks | Phase 7, 8 |
| 10 | **Measure & Iterate** | Track hiring behavior, tune model, decide go/no-go | 4 weeks | Phase 9 |

**Total: ~19 weeks (Phase 0 complete)**

```
Phase 0  ████ DONE (landing page live)

Week  1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17   18   19
      ├─P1─┤
           ├──P2──────┤
                      ├──P3──────┤
                                 ├─P4─┤
                                      ├──P5──────┤
                                           ├──P6──────────┤
                                                          ├─P7─┤
                                      ├──P8──────┤             │
                                                               ├──P9──────┤
                                                                          ├──P10─────────────┤
```

---

## Phase 0 — Landing Page ✅ DONE

### What was delivered
- Next.js 13 marketing site with Tailwind CSS + Framer Motion
- Pages: landing (`/`), homeowners, contractors, contractor detail, search, signin, signup, dashboards
- Components: Navbar, Footer, SearchBar, GradeBadge
- Deployed to Netlify
- Design system established (colors, typography, grade badges)

### Location
All landing page code lives in `frontend/`.

---

## Phase 1 — Project Setup (Week 1)

### Goal
Backend scaffold, CI pipeline, database, and local dev environment.

### Tasks
- [ ] Set up Express server in `backend/src/`
- [ ] Initialize `backend/package.json` with TypeScript, Express, Zod, BullMQ
- [ ] Set up PostgreSQL with Docker Compose (`docker-compose.yml` at repo root)
- [ ] Set up Redis with Docker Compose
- [ ] Create all database tables and migrations in `backend/src/db/migrations/`
  - contractors, citations, grades, users, api_keys, lookups, entity_review_queue
- [ ] Set up GitHub Actions: lint → typecheck → test → build (both frontend + backend)
- [ ] Configure ESLint, Prettier, TypeScript for backend
- [ ] Create `.env.example` with all required vars
- [ ] Provision staging environment (Railway/Render)
- [ ] Create `backend/src/index.ts` entry point with health check route

### Deliverables
- `docker-compose up` starts Postgres + Redis + backend locally
- `cd frontend && npm run dev` starts the landing page
- CI pipeline passes on both packages
- Staging environment accessible

### Exit Criteria
- All tables created via migration
- CI green on `main`
- `GET /api/health` returns 200

---

## Phase 2 — Data Ingestion (Weeks 2–3)

### Goal
Two years of OSHA citations for the pilot metro loaded into Postgres. Active contractor licenses imported.

### Tasks
- [ ] Select pilot metro (criteria: contractor density, accessible license data, OSHA citation volume)
- [ ] Build OSHA API client
  - [ ] Fetch inspections by state + date range
  - [ ] Handle pagination
  - [ ] Retry with exponential backoff on failures
- [ ] Backfill 2 years of citation data for pilot metro
- [ ] Normalize severity scores from violation types (willful=9-10, repeat=7-8, serious=5-6, other=2-3, de minimis=1)
- [ ] Generate plain-language descriptions (template-based for v1)
- [ ] Store raw JSON alongside normalized fields
- [ ] Source and import contractor license data for pilot metro
  - [ ] Normalize names (strip suffixes, lowercase, collapse whitespace)
  - [ ] Deduplicate by license number
- [ ] Build weekly sync worker (BullMQ job)
  - [ ] Fetch new citations since `last_sync_date`
  - [ ] Upsert into `citations`
  - [ ] Track sync history and failure count

### Deliverables
- `citations` table populated with 2 years of pilot metro data
- `contractors` table populated with active license-holders
- Weekly sync worker running on schedule

### Exit Criteria
- Citation count matches expected volume for metro (sanity check against OSHA stats)
- Contractor license count matches public registry
- Weekly sync runs successfully twice in staging

---

## Phase 3 — Entity Resolution (Weeks 4–5)

### Goal
OSHA citations matched to local contractor records with ≥ 85% accuracy.

### Tasks
- [ ] Implement name normalization pipeline
  - [ ] Lowercase, strip LLC/Inc/Corp/Co/Ltd
  - [ ] Collapse whitespace, remove punctuation
  - [ ] Expand abbreviations (Constr → Construction, Elec → Electric)
- [ ] Install and configure `pg_trgm` extension for trigram similarity
- [ ] Implement matching pipeline:
  - [ ] Step 1: Exact match on `name_normalized` + `state`
  - [ ] Step 2: Fuzzy match via `pg_trgm` (threshold ≥ 0.4), rank by Jaro-Winkler
  - [ ] Step 3: Address tiebreaker (city + state must match)
  - [ ] Step 4: License number linkage (when available)
- [ ] Assign confidence scores: high → auto-link, medium → review queue, low → skip
- [ ] Build admin review queue UI (simple table: citation, candidate, similarity score, accept/reject buttons)
- [ ] Run full matching pass on all ingested citations
- [ ] Manually validate 200 random matched citations
- [ ] Iterate on thresholds until ≥ 85% accuracy

### Deliverables
- Entity resolution pipeline operational
- Admin review queue functional
- Match rate validated

### Exit Criteria
- ≥ 85% match rate on 200-record validation sample
- All high-confidence matches auto-linked
- Medium-confidence queue < 500 records (manageable for manual review)

---

## Phase 4 — Scoring Engine (Week 6)

### Goal
Every matched contractor has an A–F grade and trade percentile.

### Tasks
- [ ] Implement scoring formula:
  ```
  rawScore = severity(0.35) + frequency(0.30) + recency(0.20) + response(0.15)
  ```
- [ ] Implement component calculations:
  - [ ] Severity: average severity score of all citations, normalized to 0–100
  - [ ] Frequency: citations per year, capped at 5/year, normalized to 0–100
  - [ ] Recency: weighted by decay (>2 years = 50% weight)
  - [ ] Response: average abatement days, capped at 365, normalized to 0–100
- [ ] Map raw scores to letter grades (A: 0–10, B: 11–25, C: 26–45, D: 46–65, F: 66+)
- [ ] Zero citations = automatic A
- [ ] Compute trade-level percentiles per metro
- [ ] Store grades in `grades` table with `is_current = true` flag
- [ ] Build recompute trigger (called after each ingestion cycle)
- [ ] Make scoring weights configurable (env vars or config table)
- [ ] Write unit tests for edge cases:
  - [ ] No citations
  - [ ] Single citation
  - [ ] All citations > 2 years old
  - [ ] Mix of willful + de minimis
  - [ ] Contractor with no abatement dates

### Deliverables
- Grades computed for all matched contractors
- Trade percentiles calculated
- Scoring weights adjustable without code changes

### Exit Criteria
- All matched contractors graded
- Spot-check 50 grades — scores align with citation severity
- Unit tests pass for all edge cases
- Grade recompute runs < 30 seconds for pilot dataset

---

## Phase 5 — API (Weeks 7–8)

### Goal
All REST endpoints live, authenticated, rate-limited, and tested.

### Tasks
- [ ] Implement auth routes:
  - [ ] `POST /api/auth/register` (email + password, bcrypt)
  - [ ] `POST /api/auth/login` (returns JWT + refresh token)
  - [ ] `POST /api/auth/refresh` (rotate refresh token)
- [ ] Implement JWT middleware (RS256, 15-min expiry)
- [ ] Implement API key middleware (SHA-256 lookup, active check)
- [ ] Implement lookup routes:
  - [ ] `GET /api/lookup?name=X&metro=Y` — fuzzy search → grade + summary
  - [ ] `POST /api/lookup/bulk` — batch input → batch grades (max 500)
  - [ ] `GET /api/report/:contractorId` — full report with citations + percentile + history
- [ ] Implement user routes:
  - [ ] `GET /api/user/profile` — account info, plan, lookup count
  - [ ] `GET /api/user/history` — past lookups (cursor-paginated)
- [ ] Implement rate limiting (Redis-backed):
  - [ ] Free: 5 lookups/month
  - [ ] Paid: unlimited
  - [ ] API key: configurable per partner
  - [ ] Return `X-RateLimit-*` headers
- [ ] Log every lookup to `lookups` table (query, result, latency)
- [ ] Input validation (Zod schemas on all request bodies)
- [ ] Error handling middleware (consistent error response format)
- [ ] Write integration tests for all endpoints
- [ ] Load test: confirm p95 < 3 seconds

### Deliverables
- All endpoints operational
- Auth working (JWT + API key)
- Rate limiting enforced
- Integration tests passing

### Exit Criteria
- All endpoints return correct responses for happy + error paths
- p95 latency < 3 seconds on 100 concurrent lookups
- Rate limiting correctly blocks over-limit requests

---

## Phase 6 — Web App (Weeks 8–10)

### Goal
Complete frontend — a homeowner can search, view reports, sign up, and manage their account.

### Tasks
- [ ] **Landing page** (`/`)
  - [ ] Hero section with search bar
  - [ ] Value proposition (safety grade explanation)
  - [ ] How-it-works section (3 steps)
  - [ ] CTA to sign up
- [ ] **Search results** (`/search?q=X`)
  - [ ] Autocomplete with 300ms debounce
  - [ ] Results list with inline grade badges
  - [ ] Location filter
  - [ ] Empty state messaging
- [ ] **Report page** (`/report/:id`)
  - [ ] Large color-coded grade badge
  - [ ] Trade percentile bar
  - [ ] Citation timeline (expandable cards)
  - [ ] Grade history line chart
  - [ ] Shareable public link
- [ ] **Auth pages** (`/login`, `/signup`)
  - [ ] Form validation
  - [ ] Error handling
  - [ ] Redirect to dashboard after login
- [ ] **Dashboard** (`/dashboard`)
  - [ ] Past lookups table
  - [ ] Plan status + upgrade CTA
  - [ ] Account settings
- [ ] **Bulk upload** (`/bulk`)
  - [ ] CSV upload form
  - [ ] Progress indicator
  - [ ] Results table with download button
  - [ ] Paid-only gate
- [ ] **Design system**
  - [ ] Grade colors (A=green → F=red)
  - [ ] Typography (Inter or Outfit)
  - [ ] Responsive breakpoints (mobile-first)
  - [ ] Dark mode support
- [ ] SEO: meta tags, OG tags, semantic HTML, single h1 per page

### Deliverables
- All 6 page routes functional
- Mobile-responsive
- Full user flow: signup → search → view report → manage account

### Exit Criteria
- Complete flow works end-to-end on desktop + mobile
- Lighthouse score > 80 (performance, accessibility)
- Bulk upload processes 500-row CSV correctly

---

## Phase 7 — Payments (Week 11)

### Goal
Users can subscribe, upgrade, cancel, and get billed. API partners get metered billing.

### Tasks
- [ ] Integrate Stripe Checkout for $50/month subscription
- [ ] Integrate Stripe Customer Portal (upgrade, cancel, update payment)
- [ ] Implement webhook handlers:
  - [ ] `invoice.paid` → activate/renew subscription
  - [ ] `invoice.payment_failed` → notify user, start grace period
  - [ ] `customer.subscription.deleted` → downgrade to free
  - [ ] `customer.subscription.updated` → sync plan changes
- [ ] Enforce plan limits server-side (reject lookups beyond free tier with upgrade prompt)
- [ ] API key metered billing: report daily lookup counts to Stripe
- [ ] Add upgrade/downgrade UI to dashboard
- [ ] 3-day grace period on payment failure

### Deliverables
- Subscription lifecycle working: create → use → cancel → re-subscribe
- API key metered billing tracking correct counts
- Webhooks handling all state transitions

### Exit Criteria
- Test subscription lifecycle end-to-end (Stripe test mode)
- Free tier correctly blocks at 6th lookup
- Grace period logic verified

---

## Phase 8 — Admin & Ops (Weeks 7–8, parallel with API)

### Goal
Operational visibility and admin tools for running the pilot.

### Tasks
- [ ] **Admin dashboard** (protected route, admin-only)
  - [ ] Total users, daily signups
  - [ ] Total lookups (daily/weekly/monthly trend)
  - [ ] Entity match rate
  - [ ] Revenue (Stripe data)
  - [ ] OSHA sync status (last run, records processed, errors)
- [ ] **Entity review queue** UI
  - [ ] List pending matches with similarity scores
  - [ ] Accept/reject/merge actions
  - [ ] Audit log
- [ ] **Manual grade override**
  - [ ] Admin can override a grade with a reason
  - [ ] Logged in audit trail
  - [ ] Flag on report: "Grade manually reviewed"
- [ ] **API key management**
  - [ ] Create new keys (shows full key once, then only prefix)
  - [ ] Revoke keys
  - [ ] View per-key usage stats
- [ ] **Monitoring setup**
  - [ ] Sentry for error tracking
  - [ ] Uptime Robot for endpoint monitoring
  - [ ] Alert on OSHA sync failure (2 consecutive)
  - [ ] Alert on match rate drop below 80%
  - [ ] Alert on p95 latency > 3 seconds

### Deliverables
- Admin dashboard with key metrics
- Review queue operational
- Monitoring and alerting configured

### Exit Criteria
- Admin can view all key metrics in one dashboard
- Review queue processes matches correctly
- Alerts fire on simulated failures

---

## Phase 9 — Pilot Launch (Weeks 12–13)

### Goal
Production deploy. Real users running real lookups.

### Tasks
- [ ] **Deploy to production**
  - [ ] Provision production Postgres + Redis
  - [ ] Configure custom domain + SSL
  - [ ] Set all production env vars
  - [ ] Run full data backfill on production DB
  - [ ] Run entity resolution + grade computation
  - [ ] Verify weekly sync cron is scheduled
- [ ] **Smoke test**
  - [ ] Search for 10 known contractors — grades match expectations
  - [ ] Create account, subscribe, run lookups, cancel
  - [ ] Bulk upload test CSV
  - [ ] Verify rate limiting on free tier
- [ ] **Recruit pilot users**
  - [ ] 20 homeowners (channels: NextDoor, local forums, contractor referrals, Facebook groups)
  - [ ] 5 general contractors (channels: direct outreach, trade associations)
  - [ ] Provide onboarding guide
- [ ] **Collect feedback**
  - [ ] In-app feedback widget (post-lookup)
  - [ ] Exit survey: "Was the grade clear? Did it affect your decision?"
  - [ ] Weekly check-in calls with 5 active users

### Deliverables
- Production environment live and stable
- 20+ real lookups completed in first week
- Feedback collection pipeline active

### Exit Criteria
- No critical bugs in first 7 days
- ≥ 20 homeowners and ≥ 5 GCs registered
- OSHA sync runs successfully in production

---

## Phase 10 — Measure & Iterate (Weeks 14–17)

### Goal
Determine if the product changes hiring behavior. Make the go/no-go decision on scaling.

### Tasks
- [ ] **Track hiring outcomes**
  - [ ] Follow-up survey 2 weeks after lookup: "Did you hire this contractor? Why/why not?"
  - [ ] Compare decisions of users who saw a grade vs. those who only had review stars
  - [ ] Segment by grade shown (A/B users vs. D/F users)
- [ ] **Measure key metrics**

  | Metric | Target | Method |
  |---|---|---|
  | Hiring behavior change | ≥ 30% | Survey comparison |
  | Entity match rate | ≥ 85% | 200-record sample revalidation |
  | Report clarity | ≥ 80% understood grade | Post-lookup survey |
  | Lookup latency (p95) | < 3 seconds | `lookups.response_ms` analysis |
  | User retention (month 2) | ≥ 40% | Stripe active subscriptions |

- [ ] **Iterate on scoring** (if behavior change < 30%)
  - [ ] Analyze which grades trigger action (D/F should drive most change)
  - [ ] Adjust weights if severity doesn't dominate decisions
  - [ ] Improve entity resolution (add more data sources, lower fuzzy threshold)
  - [ ] Redesign report if clarity score < 80%
- [ ] **Prepare for scaling** (if behavior change ≥ 30%)
  - [ ] Select next 3 metros
  - [ ] Begin sourcing license data for those metros
  - [ ] Draft API partnership proposal for Angi/Thumbtack
  - [ ] Scope insurance carrier outreach
- [ ] **Document findings**
  - [ ] Pilot results report (for investors, partners)
  - [ ] Technical lessons learned
  - [ ] Scaling playbook (metro onboarding checklist)

### Deliverables
- Hiring behavior data analyzed
- Go/no-go decision documented
- If go: expansion plan for next 3 metros
- If no-go: rework plan with specific changes

### Exit Criteria

**Go:**
- ≥ 30% hiring behavior change
- ≥ 85% entity match rate maintained
- Clear path to 3 additional metros
- At least 1 platform partner conversation initiated

**No-go:**
- Documented what failed (matching? scoring? UX? market?)
- Specific rework plan with timeline
- Decision: pivot, iterate, or shutdown
