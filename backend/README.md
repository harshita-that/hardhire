# Hardhire — Backend

API server for the Hardhire safety grading platform.

## Status

🚧 **Under development** — See [docs/plan.md](../docs/plan.md) for the roadmap.

## Planned Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** PostgreSQL
- **Cache:** Redis
- **Job Queue:** BullMQ
- **Auth:** JWT (RS256) + API keys
- **Payments:** Stripe

## Structure (Planned)

```
src/
├── routes/         # Express route handlers
├── services/       # Business logic
│   ├── scoring/    # A–F grade computation
│   └── resolver/   # Entity resolution pipeline
├── workers/        # Background jobs (OSHA sync, grade recompute)
├── db/             # Schema, migrations, seed data
│   ├── migrations/
│   └── queries/
├── middleware/     # Auth, rate limiting, validation, errors
├── config/        # Environment config
└── index.ts       # Entry point
```
