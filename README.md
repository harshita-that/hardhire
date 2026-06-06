# Hardhire

A-to-F safety grade for homeowners hiring contractors.

Hardhire pulls a contractor's OSHA violation history and grades it from A to F — based on severity, frequency, recency, and response time. The grade arrives before the contract is signed.


## How It Works

1. Type a contractor name → get a safety grade in seconds
2. See the letter grade, recent citations in plain English, and how they compare to peers in the same trade
3. General contractors can run bulk lookups before awarding subcontracts

Review stars tell you the kitchen looked good. They say nothing about fall protection violations or trench collapses. That data is public — Hardhire surfaces it at decision time.


## Project Structure
hardhire/
├── frontend/          # Next.js app — landing, search, reports, dashboard
├── backend/           # API server — scoring engine, OSHA ingestion, entity resolution
└── docs/              # Idea, requirements, tech spec, implementation plan

## Stack

- Frontend — Next.js, Tailwind CSS, Framer Motion
- Backend — Node.js, Express
- Database — Neon Postgres, Drizzle ORM

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)





