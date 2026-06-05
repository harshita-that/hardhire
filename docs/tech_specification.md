# Hardhire — Tech Specification

---

## System Architecture

```
                          ┌──────────────┐
                          │   Next.js    │
                          │   Frontend   │
                          └──────┬───────┘
                                 │
                          ┌──────▼───────┐
                          │ API Gateway  │
                          │  (Express)   │
                          │              │
                          │ • Auth (JWT) │
                          │ • Rate Limit │
                          │ • Routing    │
                          └──────┬───────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
       ┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐
       │   Lookup      │  │   Scoring    │  │   Billing    │
       │   Service     │  │   Service    │  │   Service    │
       │              │  │              │  │              │
       │ • Search     │  │ • Compute    │  │ • Stripe     │
       │ • Report gen │  │ • Percentile │  │ • Metering   │
       └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
              │                  │                  │
              └──────────────────┼──────────────────┘
                                 │
                          ┌──────▼───────┐
                          │  PostgreSQL  │
                          └──────┬───────┘
                                 │
                          ┌──────▼───────┐
                          │   Workers    │
                          │              │
                          │ • OSHA Sync  │
                          │ • Entity Res │
                          │ • Grade Calc │
                          └──────────────┘
```

### Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | Next.js 14 (App Router) | SSR for SEO, React ecosystem, API routes as BFF |
| Backend | Node.js + Express | Shared language with frontend, fast iteration |
| Database | PostgreSQL 16 | JSONB for raw OSHA data, full-text search, mature |
| Cache | Redis | Rate limiting, session store, search autocomplete |
| Job runner | BullMQ (Redis-backed) | Reliable job queues for ingestion + grade recompute |
| Payments | Stripe | Subscriptions, metered billing, customer portal |
| Hosting | Railway or Render | Managed Postgres + Redis, simple deploys for pilot |
| CI/CD | GitHub Actions | Lint → test → deploy on merge to `main` |
| Monitoring | Sentry + Uptime Robot | Error tracking + uptime alerts |

### Monorepo Structure

```
hardhire/
├── apps/
│   └── web/                 # Next.js frontend
│       ├── app/             # App Router pages
│       ├── components/      # React components
│       └── lib/             # Client utilities
├── packages/
│   ├── api/                 # Express API server
│   │   ├── routes/          # Route handlers
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Auth, rate limit, error handling
│   │   └── workers/         # BullMQ job processors
│   ├── db/                  # Database schema, migrations, queries
│   │   ├── migrations/
│   │   ├── schema/
│   │   └── queries/
│   ├── scoring/             # Scoring algorithm (pure functions)
│   │   ├── compute.ts
│   │   ├── weights.ts
│   │   └── percentile.ts
│   └── entity-resolution/   # Matching pipeline
│       ├── normalize.ts
│       ├── fuzzy-match.ts
│       └── resolve.ts
├── scripts/                 # One-off scripts (backfill, seed)
├── .env.example
├── docker-compose.yml
└── package.json             # Workspace root
```

---

## Database Schema

### `contractors`

```sql
CREATE TABLE contractors (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  name_normalized TEXT NOT NULL,          -- lowercase, stripped suffixes
  address         TEXT,
  city            TEXT NOT NULL,
  state           CHAR(2) NOT NULL,
  zip             VARCHAR(10),
  trade           TEXT NOT NULL,          -- electrical, roofing, plumbing, general, etc.
  metro           TEXT NOT NULL,          -- metro area identifier
  license_number  TEXT,                   -- state/local license ID
  license_status  TEXT DEFAULT 'active',  -- active, expired, suspended
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),

  UNIQUE(license_number, state)
);

CREATE INDEX idx_contractors_name_normalized ON contractors USING gin (name_normalized gin_trgm_ops);
CREATE INDEX idx_contractors_metro ON contractors (metro);
CREATE INDEX idx_contractors_trade ON contractors (trade);
```

### `citations`

```sql
CREATE TABLE citations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  osha_activity_nr  TEXT UNIQUE NOT NULL,     -- OSHA's unique inspection ID
  contractor_id     UUID REFERENCES contractors(id),  -- NULL until resolved
  match_confidence  TEXT,                     -- high, medium, low, NULL
  raw_company_name  TEXT NOT NULL,
  raw_address       TEXT,
  raw_city          TEXT,
  raw_state         CHAR(2),
  violation_type    TEXT NOT NULL,            -- serious, willful, repeat, other
  severity_score    INT NOT NULL CHECK (severity_score BETWEEN 1 AND 10),
  citation_date     DATE NOT NULL,
  penalty_initial   DECIMAL(10,2),
  penalty_current   DECIMAL(10,2),
  abatement_date    DATE,                    -- NULL if not yet abated
  description_raw   TEXT,                    -- OSHA's original text
  description_plain TEXT,                    -- plain-language rewrite
  sic_code          VARCHAR(10),
  naics_code        VARCHAR(10),
  raw_json          JSONB NOT NULL,          -- full API response
  ingested_at       TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT fk_contractor FOREIGN KEY (contractor_id) REFERENCES contractors(id)
);

CREATE INDEX idx_citations_contractor ON citations (contractor_id);
CREATE INDEX idx_citations_date ON citations (citation_date DESC);
CREATE INDEX idx_citations_unresolved ON citations (id) WHERE contractor_id IS NULL;
```

### `grades`

```sql
CREATE TABLE grades (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_id    UUID NOT NULL REFERENCES contractors(id),
  grade            CHAR(1) NOT NULL CHECK (grade IN ('A','B','C','D','F')),
  raw_score        DECIMAL(6,2) NOT NULL,
  severity_component   DECIMAL(6,2),
  frequency_component  DECIMAL(6,2),
  recency_component    DECIMAL(6,2),
  response_component   DECIMAL(6,2),
  trade_percentile INT CHECK (trade_percentile BETWEEN 0 AND 100),
  citation_count   INT NOT NULL DEFAULT 0,
  computed_at      TIMESTAMPTZ DEFAULT now(),
  is_current       BOOLEAN DEFAULT true
);

CREATE INDEX idx_grades_contractor_current ON grades (contractor_id) WHERE is_current = true;
CREATE UNIQUE INDEX idx_grades_one_current ON grades (contractor_id) WHERE is_current = true;
```

### `users`

```sql
CREATE TABLE users (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email             TEXT UNIQUE NOT NULL,
  password_hash     TEXT NOT NULL,           -- bcrypt
  plan              TEXT NOT NULL DEFAULT 'free',  -- free, paid
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  lookup_count_month INT DEFAULT 0,
  lookup_reset_at    TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);
```

### `api_keys`

```sql
CREATE TABLE api_keys (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_name    TEXT NOT NULL,            -- e.g., "Angi", "Thumbtack"
  key_hash        TEXT UNIQUE NOT NULL,     -- SHA-256 of the actual key
  key_prefix      VARCHAR(8) NOT NULL,      -- first 8 chars for identification
  is_active       BOOLEAN DEFAULT true,
  rate_limit      INT DEFAULT 1000,         -- per hour
  created_at      TIMESTAMPTZ DEFAULT now(),
  revoked_at      TIMESTAMPTZ
);
```

### `lookups`

```sql
CREATE TABLE lookups (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  api_key_id      UUID REFERENCES api_keys(id),
  contractor_id   UUID REFERENCES contractors(id),
  query_name      TEXT NOT NULL,            -- what the user typed
  query_metro     TEXT,
  grade_returned  CHAR(1),
  response_ms     INT,                     -- latency tracking
  looked_up_at    TIMESTAMPTZ DEFAULT now(),

  CHECK (user_id IS NOT NULL OR api_key_id IS NOT NULL)
);

CREATE INDEX idx_lookups_user ON lookups (user_id, looked_up_at DESC);
CREATE INDEX idx_lookups_api_key ON lookups (api_key_id, looked_up_at DESC);
```

### `entity_review_queue`

```sql
CREATE TABLE entity_review_queue (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citation_id     UUID NOT NULL REFERENCES citations(id),
  candidate_id    UUID NOT NULL REFERENCES contractors(id),
  similarity_score DECIMAL(4,3),           -- Jaro-Winkler score
  status          TEXT DEFAULT 'pending',   -- pending, accepted, rejected
  reviewed_by     UUID REFERENCES users(id),
  reviewed_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_review_pending ON entity_review_queue (status) WHERE status = 'pending';
```

---

## Entity Resolution Pipeline

### Step-by-step flow

```
OSHA Citation (raw_company_name, raw_address, raw_city, raw_state)
  │
  ▼
[1. Normalize]
  • Lowercase
  • Strip: LLC, Inc, Corp, Co, Ltd, L.L.C., etc.
  • Collapse whitespace, remove punctuation
  • Expand common abbreviations (Constr → Construction, Elec → Electric)
  │
  ▼
[2. Exact match]
  • Query: name_normalized = normalized_input AND state = raw_state
  • If single match → confidence = HIGH → auto-link
  • If multiple matches → proceed to step 3
  │
  ▼
[3. Fuzzy match]
  • Query: pg_trgm similarity against name_normalized (threshold ≥ 0.4)
  • Compute Jaro-Winkler for top 10 candidates
  • Filter: Jaro-Winkler ≥ 0.88
  │
  ▼
[4. Address tiebreaker]
  • Among fuzzy candidates, require city + state match
  • If single candidate survives → confidence = HIGH → auto-link
  • If multiple survive → confidence = MEDIUM → review queue
  • If none survive → confidence = LOW → skip
  │
  ▼
[5. License linkage] (when available)
  • If OSHA record contains a license number → direct match
  • Overrides name-based matching
```

### Confidence thresholds

| Confidence | Action | Criteria |
|---|---|---|
| **High** | Auto-link citation to contractor | Exact name match, or single fuzzy match with address match |
| **Medium** | Add to review queue | Multiple fuzzy candidates survive, or Jaro-Winkler 0.82–0.87 |
| **Low** | Skip (unresolved) | No candidates above threshold |

---

## Scoring Algorithm

### Input computation

```typescript
interface ScoringInput {
  citations: Citation[];          // all linked citations for this contractor
  yearsActive: number;            // years since earliest citation or license date
  tradeGroup: string;             // for percentile computation
  metro: string;
}

function computeGrade(input: ScoringInput): GradeResult {
  const severityAvg = avgSeverity(input.citations);              // 1–10 scale
  const frequency = input.citations.length / input.yearsActive;  // citations/year
  const recencyFactor = computeRecencyDecay(input.citations);    // 0–1
  const avgResponseDays = avgAbatementDays(input.citations);     // days

  // Normalize each component to 0–100
  const severityNorm = (severityAvg / 10) * 100;
  const frequencyNorm = Math.min(frequency / 5, 1) * 100;       // cap at 5/year
  const recencyNorm = recencyFactor * 100;
  const responseNorm = Math.min(avgResponseDays / 365, 1) * 100; // cap at 1 year

  const rawScore =
    severityNorm  * 0.35 +
    frequencyNorm * 0.30 +
    recencyNorm   * 0.20 +
    responseNorm  * 0.15;

  return {
    rawScore,
    grade: scoreToGrade(rawScore),
    components: { severityNorm, frequencyNorm, recencyNorm, responseNorm },
    percentile: computePercentile(rawScore, input.tradeGroup, input.metro),
  };
}
```

### Recency decay

```typescript
function computeRecencyDecay(citations: Citation[]): number {
  const now = new Date();
  return citations.reduce((sum, c) => {
    const ageYears = (now - c.citationDate) / (365.25 * 24 * 60 * 60 * 1000);
    const weight = ageYears > 2 ? 0.5 : 1.0;
    return sum + (c.severityScore * weight);
  }, 0) / citations.length;
}
```

### Grade mapping

| Raw Score | Grade | Color |
|---|---|---|
| 0 (no citations) | **A** | `#22c55e` (green) |
| 1–10 | **A** | `#22c55e` |
| 11–25 | **B** | `#84cc16` |
| 26–45 | **C** | `#eab308` |
| 46–65 | **D** | `#f97316` |
| 66–100 | **F** | `#ef4444` |

### Percentile computation

- Group all graded contractors by `(trade, metro)`
- Rank by `rawScore` ascending (lower = safer)
- Percentile = `(rank / total_in_group) * 100`
- Returned as: "Safer than {percentile}% of {trade} contractors in {metro}"

---

## API Specification

### Authentication

**JWT flow:**
```
POST /api/auth/register → { email, password } → 201 { userId }
POST /api/auth/login    → { email, password } → 200 { accessToken, refreshToken }
POST /api/auth/refresh  → { refreshToken }    → 200 { accessToken }
```

- Access token: 15-minute expiry, signed with RS256
- Refresh token: 7-day expiry, stored in httpOnly cookie
- Password: bcrypt, cost factor 12

**API key flow:**
- Key sent in `X-API-Key` header
- Server hashes key with SHA-256, looks up `api_keys.key_hash`
- Reject if `is_active = false` or `revoked_at IS NOT NULL`

### Lookup endpoint

```
GET /api/lookup?name=Smith+Roofing&metro=atlanta
```

**Response (200):**
```json
{
  "contractor": {
    "id": "uuid",
    "name": "Smith Roofing LLC",
    "trade": "roofing",
    "metro": "atlanta"
  },
  "grade": {
    "letter": "C",
    "score": 38.2,
    "percentile": 45,
    "percentileLabel": "Safer than 45% of roofers in Atlanta",
    "computedAt": "2025-12-01T00:00:00Z"
  },
  "citationCount": 4,
  "recentCitations": [
    {
      "date": "2025-06-15",
      "type": "serious",
      "description": "Failure to provide fall protection on residential roof work",
      "penalty": 15625.00
    }
  ]
}
```

**No match (200):**
```json
{
  "contractor": null,
  "message": "No contractor found matching this name. They may have a clean record or not be in our database yet."
}
```

### Bulk lookup endpoint

```
POST /api/lookup/bulk
Content-Type: application/json

{
  "contractors": [
    { "name": "Smith Roofing", "metro": "atlanta" },
    { "name": "ABC Electric", "metro": "atlanta" }
  ]
}
```

**Response (200):**
```json
{
  "results": [
    { "query": "Smith Roofing", "grade": "C", "contractorId": "uuid" },
    { "query": "ABC Electric", "grade": "A", "contractorId": "uuid" }
  ],
  "matched": 2,
  "unmatched": 0
}
```

### Rate limit headers

```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1735689600
```

### Error codes

| HTTP | Code | Meaning |
|---|---|---|
| 400 | `INVALID_INPUT` | Missing or malformed parameters |
| 401 | `UNAUTHORIZED` | Invalid or expired token |
| 403 | `PLAN_LIMIT_REACHED` | Free tier lookup limit hit |
| 404 | `NOT_FOUND` | Contractor ID doesn't exist |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error |

---

## OSHA Ingestion Worker

### Job: `osha-sync`

```
Schedule: Every Sunday at 2:00 AM UTC
Queue: BullMQ "ingestion" queue
Concurrency: 1 (single worker, sequential processing)
```

### Process

1. **Fetch** — Pull inspections from OSHA API for pilot metro, filtered by `open_date >= last_sync_date`
2. **Deduplicate** — Skip records where `osha_activity_nr` already exists
3. **Normalize severity** — Map violation type to severity score:

| Violation Type | Severity Score |
|---|---|
| Willful | 9–10 |
| Repeat | 7–8 |
| Serious | 5–6 |
| Other-than-serious | 2–3 |
| De minimis | 1 |

4. **Plain-language rewrite** — Generate `description_plain` from raw OSHA description (template-based for v1, LLM for v2)
5. **Insert** — Upsert into `citations` table
6. **Resolve** — Run entity resolution on new unmatched citations
7. **Recompute** — Recalculate grades for all contractors with new/updated citations

### Failure handling

- Retry up to 3 times with exponential backoff (1min, 5min, 15min)
- After 3 failures: mark job as failed, send alert (Sentry + email)
- Track `last_successful_sync` timestamp — alert if > 14 days stale

---

## Frontend Architecture

### Tech

- Next.js 14 with App Router
- Server components by default, client components for interactive elements
- CSS Modules for scoping (no Tailwind unless requested)
- Chart library: Recharts (lightweight, React-native)

### Key components

```
components/
├── GradeBadge.tsx          # Large colored letter grade (A–F)
├── PercentileBar.tsx        # Horizontal bar showing trade comparison
├── CitationCard.tsx         # Single citation with date, type, description
├── CitationTimeline.tsx     # Scrollable list of CitationCards
├── SearchBar.tsx            # Autocomplete contractor search
├── ReportHeader.tsx         # Contractor name + grade + trade
├── GradeHistoryChart.tsx    # Line chart of score over time
├── BulkUploadForm.tsx       # CSV upload + results table
├── PlanGate.tsx             # Wrapper that checks plan tier
└── Layout/
    ├── Navbar.tsx
    └── Footer.tsx
```

### Data fetching

- Server components fetch via internal API (no client-side fetch for initial loads)
- Search autocomplete: client-side fetch with 300ms debounce
- Bulk upload: client-side POST, poll for results

---

## Security

| Area | Measure |
|---|---|
| Passwords | bcrypt, cost factor 12 |
| JWT | RS256, 15-min access / 7-day refresh |
| API keys | SHA-256 hashed in DB, only prefix stored in plaintext |
| HTTPS | Enforced at platform level (Railway/Render) |
| SQL injection | Parameterized queries via ORM (Drizzle or Prisma) |
| Rate limiting | Redis-backed, per-user and per-API-key |
| CORS | Whitelist frontend domain only |
| Input validation | Zod schemas on all request bodies |

---

## Deployment

### Environments

| Env | Purpose | Deploy trigger |
|---|---|---|
| `local` | Development | Manual |
| `staging` | QA and demo | Push to `staging` branch |
| `production` | Live pilot | Merge to `main` |

### Infrastructure (pilot)

```
Railway / Render:
├── Web service (Next.js + Express)     # 1 instance, 512MB RAM
├── Worker service (BullMQ processor)   # 1 instance, 256MB RAM
├── PostgreSQL (managed)                # 1GB storage
├── Redis (managed)                     # 25MB
└── Cron trigger (Railway cron / external)
```

### CI pipeline (GitHub Actions)

```yaml
on push to main:
  1. Install dependencies
  2. Lint (ESLint + Prettier)
  3. Type check (tsc --noEmit)
  4. Unit tests (Vitest)
  5. Build
  6. Deploy to production
```

---

## Monitoring & Observability

| What | Tool | Alert threshold |
|---|---|---|
| Errors | Sentry | Any unhandled exception |
| Uptime | Uptime Robot | Downtime > 5 min |
| Lookup latency (p95) | Custom (logged in `lookups.response_ms`) | > 3 seconds |
| OSHA sync health | BullMQ dashboard + alert | 2 consecutive failures |
| Entity match rate | Weekly cron query | Drops below 80% |
| Disk/DB usage | Platform metrics | > 80% capacity |
