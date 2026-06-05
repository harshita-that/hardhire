# Hardhire — Requirements

---

## 1. Data Ingestion

### OSHA Citation Data
- Pull inspection and citation records from OSHA Enforcement API (`enforcedata.dol.gov`)
- Support filtering by: state, establishment type, date range, SIC/NAICS code
- Store raw API response as JSONB alongside normalized fields
- Backfill: ingest 2 years of historical data for pilot metro on first run
- Ongoing: weekly sync to catch new citations (OSHA updates ~monthly, weekly avoids drift)
- Handle API downtime gracefully — retry with exponential backoff, alert after 2 consecutive failures

### Contractor License Data
- Source active license-holder records for pilot metro (state licensing board / open data portal)
- Normalize and store: company name, address, license number, trade classification, license status
- Refresh quarterly or on schema change from source

---

## 2. Entity Resolution

- Match each OSHA citation to a contractor in the local database
- Matching pipeline:
  1. **Exact match** on license number (if present in OSHA record)
  2. **Normalized name match** — strip legal suffixes (LLC, Inc, Corp, Co), lowercase, collapse whitespace
  3. **Fuzzy match** — Jaro-Winkler similarity ≥ 0.88 OR Levenshtein distance ≤ 3
  4. **Address tiebreaker** — city + state must match for fuzzy candidates
- Assign confidence: `high` (auto-link), `medium` (queue for manual review), `low` (skip)
- Provide admin UI for manual review queue — accept, reject, or merge candidates
- Target: ≥ 85% match rate on pilot metro data, validated against 200-record random sample

---

## 3. Scoring Engine

### Grade Computation
- Compute a raw numeric score per contractor using weighted inputs:
  - Severity of citations: **35%**
  - Frequency (citations per year of operation): **30%**
  - Recency (decay factor — citations > 2 years weighted at 50%): **20%**
  - Response time (average days to abatement): **15%**
- Map raw score to letter grade:

| Raw Score | Grade |
|---|---|
| 0–10 | A |
| 11–25 | B |
| 26–45 | C |
| 46–65 | D |
| 66+ | F |

- Zero citations = automatic **A**
- Compute trade-level percentile ranking within the metro (e.g., "safer than 82% of roofers")
- Recompute grades after every ingestion cycle
- Store grade, raw score, percentile, and computation timestamp

### Constraints
- Grade must be deterministic — same input always produces same output
- Scoring weights must be configurable without code changes (stored in config/DB)
- Grade history must be retained (never overwrite — append new computation)

---

## 4. API

### Authentication
- JWT-based auth for direct users (register, login, refresh)
- API key auth for platform integrations (Angi, Thumbtack)
- API keys scoped per partner, individually revocable

### Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | None | Create account (email + password) |
| `POST` | `/api/auth/login` | None | Returns JWT |
| `POST` | `/api/auth/refresh` | JWT | Refresh token |
| `GET` | `/api/lookup` | JWT / Key | Query: `name` (required), `metro` (optional). Returns grade + summary |
| `POST` | `/api/lookup/bulk` | JWT / Key | Body: array of `{name, metro}`. Returns array of grades |
| `GET` | `/api/report/:contractorId` | JWT / Key | Full report: grade, citations, trade percentile, grade history |
| `GET` | `/api/user/profile` | JWT | Account info, plan status, lookup count |
| `GET` | `/api/user/history` | JWT | Past lookups with timestamps |

### Rate Limiting

| Tier | Lookups | Report Access |
|---|---|---|
| Free | 5/month | Summary only (grade + trade percentile) |
| Paid ($50/mo) | Unlimited | Full report with citations |
| API key | Unlimited (metered billing) | Full report |

### Response Format
- All responses: JSON
- Error responses: `{ "error": "message", "code": "ERROR_CODE" }`
- Pagination on list endpoints: cursor-based

---

## 5. Web Application

### Pages

| Route | Purpose | Auth Required |
|---|---|---|
| `/` | Landing page — search bar, value prop, CTA | No |
| `/search` | Search results — list of matching contractors with grades | No (preview) / Yes (full) |
| `/report/:id` | Full contractor report | Yes |
| `/login` | Login form | No |
| `/signup` | Registration form | No |
| `/dashboard` | Past lookups, plan status, account settings | Yes |
| `/bulk` | Bulk CSV upload for GCs — returns table of grades | Yes (paid only) |

### Search Experience
- Autocomplete on contractor name (debounced, 300ms)
- Show grade badge inline in search results
- Support metro/location filter
- Empty state: "No OSHA records found — this contractor may have a clean record or may not be in our database yet"

### Report Page
- Large letter grade (color-coded: A=green → F=red)
- Trade percentile bar chart
- Scrollable citation timeline with plain-language descriptions
- Grade history chart (if multiple computations exist)
- Shareable link (public URL, no auth required to view)

### Bulk Upload
- Accept CSV (columns: company name, city, state)
- Return downloadable CSV with appended grade + score columns
- Show progress indicator for large batches
- Max batch size: 500 contractors per upload

### Responsive Design
- Mobile-first — homeowners search on phones
- Touch-friendly grade badges and citation cards
- Collapse citation details behind expandable sections on small screens

---

## 6. Payments & Billing

- Stripe Checkout for subscription creation ($50/month)
- Stripe Customer Portal for self-service plan management (upgrade, cancel, update payment)
- Webhook handling: `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`, `customer.subscription.updated`
- API key billing: Stripe metered usage — report lookup count daily
- Free tier enforced server-side — reject lookups beyond 5/month with clear upgrade prompt
- Grace period: 3 days after payment failure before downgrade

---

## 7. Admin

- Dashboard: total users, total lookups (daily/weekly/monthly), match rate, revenue
- Entity resolution review queue: accept/reject/merge pending matches
- Manual grade override (with audit log and reason)
- OSHA ingestion status: last run, records processed, errors
- API key management: create, revoke, view usage per partner

---

## 8. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Lookup response time (p95) | < 3 seconds |
| Bulk lookup throughput | 500 contractors in < 60 seconds |
| OSHA data staleness | < 30 days |
| Entity resolution match rate | ≥ 85% |
| Uptime | 99.5% (pilot) |
| Data retention | All grades and lookups retained indefinitely |
| Security | Passwords bcrypt-hashed, JWT with short expiry + refresh, HTTPS only |
| GDPR/privacy | No PII beyond email + password; contractor data is public record |

---

## 9. Success Criteria

| Metric | Target | Measurement |
|---|---|---|
| Hiring behavior change | ≥ 30% | Survey + follow-up with pilot homeowners |
| Entity match rate | ≥ 85% | Manual validation on 200-record sample |
| Lookup latency (p95) | < 3s | Application monitoring |
| Pilot user count | ≥ 20 homeowners, ≥ 5 GCs | User registrations |
| Report clarity | ≥ 80% of users understand grade meaning | Post-lookup survey |

**If hiring behavior change < 30%:** rework entity resolution accuracy or scoring weights before scaling.
