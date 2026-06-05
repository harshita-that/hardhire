# Hardhire

**A-to-F safety grade for homeowners hiring contractors.**

Hardhire pulls a contractor's OSHA violation history and grades it from A to F based on severity, frequency, recency, and response time. The grade arrives before the contract is signed.

---

## How It Works

1. **Homeowner types a contractor name** → gets a safety grade in seconds
2. **Report shows:** letter grade, recent citations in plain English, trade comparison
3. **General contractors** can run bulk lookups before awarding subcontracts

## Why It Matters

Review stars tell you the kitchen looked good. They say nothing about fall protection violations, trench collapses, or electrical permit history. That data is public — it just isn't surfaced at decision time. Hardhire fixes that.

---

## Project Structure

```
hardhire/
├── frontend/          # Next.js landing page & web app
│   ├── app/           # Pages (landing, search, reports, auth, dashboard)
│   ├── components/    # React components (Navbar, Footer, GradeBadge, etc.)
│   ├── hooks/         # Custom React hooks
│   └── lib/           # Utilities and mock data
│
├── backend/           # API server (coming in Phase 2+)
│   ├── src/
│   │   ├── routes/    # Express route handlers
│   │   ├── services/  # Business logic (scoring, entity resolution)
│   │   ├── workers/   # OSHA ingestion, grade recomputation
│   │   ├── db/        # Schema, migrations, queries
│   │   └── middleware/ # Auth, rate limiting, error handling
│   └── package.json
│
└── docs/              # Project documentation
    ├── idea.md        # Vision, market, business model
    ├── requirements.md # Functional & non-functional requirements
    ├── tech_specification.md # Architecture, schema, API contracts
    └── plan.md        # Multiphase implementation plan
```

## Getting Started

### Frontend (Landing Page)

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Backend (Coming Soon)

Backend API development begins in Phase 2. See [docs/plan.md](docs/plan.md) for the full roadmap.

---

## Documentation

| Document | Description |
|---|---|
| [Idea](docs/idea.md) | Problem, solution, market, business model, risks |
| [Requirements](docs/requirements.md) | Functional & non-functional requirements |
| [Tech Spec](docs/tech_specification.md) | Architecture, database schema, API contracts, scoring algorithm |
| [Plan](docs/plan.md) | 10-phase implementation roadmap |

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 13, React 18, Tailwind CSS, Framer Motion, Recharts |
| Backend | Node.js, Express (planned) |
| Database | PostgreSQL (planned) |
| Cache | Redis (planned) |
| Payments | Stripe (planned) |
| Hosting | Netlify (frontend), Railway/Render (backend — planned) |

## Current Status

- [x] **Phase 0** — Landing page (live)
- [ ] **Phase 1** — Project setup & backend scaffold
- [ ] **Phase 2** — OSHA data ingestion
- [ ] **Phase 3** — Entity resolution
- [ ] **Phase 4** — Scoring engine
- [ ] **Phase 5** — REST API
- [ ] **Phase 6** — Web app (search, reports, dashboard)
- [ ] **Phase 7** — Payments & billing
- [ ] **Phase 8** — Admin & ops
- [ ] **Phase 9** — Pilot launch
- [ ] **Phase 10** — Measure & iterate

---

## License

MIT
