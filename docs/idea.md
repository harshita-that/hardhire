# Hardhire

**A-to-F safety grade for homeowners hiring contractors.**

---

## Problem

Every year, homeowners hire contractors based on one signal: review stars. A five-star rating tells you the kitchen looked good, the crew showed up on time, and the drywall was painted. It says nothing about:

- Whether the contractor was cited for fall protection failures
- Whether they have a pattern of trench collapses
- Whether they've ignored electrical permit requirements
- Whether OSHA flagged them as a repeat offender

This data exists. It's public. It sits in a federal database that no homeowner has ever checked — and no contractor review platform has ever surfaced.

**The result:** a homeowner standing in their kitchen comparing bids has no way to know which contractor puts workers (and their family) at risk.

---

## Solution

Hardhire pulls a contractor's federal safety record and converts it into a letter grade — **A through F** — that a homeowner can read in seconds.

### What the grade measures

| Input | What it captures | Weight |
|---|---|---|
| **Severity** | Serious vs. willful vs. repeat violations | 35% |
| **Frequency** | How many citations per year of operation | 30% |
| **Recency** | Recent violations weigh more than old ones | 20% |
| **Response time** | How fast the contractor fixed cited hazards | 15% |

### What the report shows

- **Letter grade** (A–F) — the one thing that matters at decision time
- **Recent citations** — translated from OSHA legalese into plain English
- **Trade comparison** — "This electrician is safer than 82% of electricians in your metro"

### How it's used

| User | Workflow | Frequency |
|---|---|---|
| **Homeowner** | Types a company name before signing a contract | One-off |
| **General contractor** | Uploads a CSV of subcontractors before awarding work | Bulk, recurring |

The grade arrives before the contract is signed. That's the entire product.

---

## The Hard Problem

OSHA publishes citation data through a public API. Pulling it is easy. The hard part is **entity resolution** — figuring out which citations belong to which contractor.

### Why matching breaks

- **Name changes:** "Smith Roofing LLC" becomes "Smith & Sons Construction Inc."
- **Mergers:** Two cited companies merge; violations live under separate records
- **DBA aliases:** One entity operates under multiple names across jurisdictions
- **Typos in federal data:** OSHA records contain misspellings, abbreviations, inconsistent formatting

A naive name match misses 30–40% of connections. Hardhire's core IP is the resolution layer that closes that gap — fuzzy name matching, address correlation, and license-number linkage.

---

## Market

### Primary market: Homeowners

- 15M+ home renovation projects started annually in the US (Harvard JCHS)
- Average project cost: $18,000–$75,000 depending on scope
- Current safety due diligence: zero

### Secondary market: General contractors

- GCs subcontract 60–80% of project work
- Subcontractor vetting is manual — references, insurance certificates, gut feel
- One unsafe sub on a jobsite creates liability for the entire project

### Tertiary market: Insurance carriers

- Contractors carry general liability and workers' comp policies
- Carriers price these policies with limited visibility into federal safety records
- A validated safety score becomes a pricing input — not a product, a data feed

---

## Competitive Landscape

| Platform | What they show | Safety data | Hardhire relationship |
|---|---|---|---|
| **Angi** | Reviews, project photos, availability | None | Distribution channel — license API |
| **Thumbtack** | Reviews, quotes, availability | None | Distribution channel — license API |
| **HomeAdvisor** | Reviews, cost estimates | None | Distribution channel — license API |
| **OSHA.gov** | Raw citation records | Yes, but unusable | Data source — Hardhire adds the UX |
| **Hardhire** | Safety grade + citation reports | Yes | — |

These platforms are not competitors. They're distribution partners. They list contractors with no safety signal. Hardhire provides the signal via API. They pay per lookup.

---

## Business Model

### Revenue streams

| Channel | Model | Price | When |
|---|---|---|---|
| **Direct to homeowner** | Monthly subscription | $50/month — unlimited lookups + full reports | Day 1 |
| **Platform API** | Per-lookup fee | $2–5 per lookup to Angi, Thumbtack, etc. | After pilot validation |
| **Insurance data** | Annual license | $50K–200K/year per carrier | After scoring model proves predictive |

### Unit economics (direct)

- CAC target: < $30 (SEO + content marketing around "is my contractor safe?")
- LTV at 4-month retention: $200
- Gross margin: ~90% (data is free, compute is cheap)

### Expansion triggers

| Trigger | Action |
|---|---|
| Pilot metro hit > 85% match rate | Expand to 3 more metros |
| > 30% hiring behavior change | Begin platform API outreach |
| Scoring model validated externally | Begin insurance carrier conversations |

---

## Pilot Design

| Parameter | Value |
|---|---|
| **Metro** | TBD — high contractor density + accessible license data |
| **History window** | 2 years of OSHA citations |
| **Contractor pool** | All active license-holders in pilot metro |
| **Test group** | 20+ homeowners with active renovation projects |
| **Control** | Same homeowners' stated preferences before seeing grades |

### Success metric

> Did homeowners who saw a Hardhire grade make a different hiring decision than they would have with review stars alone?

**Threshold: ≥ 30% change in hiring behavior.**

Below that, either the entity resolution is missing too many records, or the scoring weights don't produce grades that feel meaningful. Fix and retest before scaling.

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Entity resolution accuracy too low | Medium | High | Start with one metro; manually validate; use license numbers as anchor |
| OSHA API rate-limited or restructured | Low | Medium | Cache all data locally; build fallback scraper |
| Homeowners don't change behavior | Medium | High | A/B test grade presentation; iterate on framing and report design |
| Contractors challenge grades legally | Low | Medium | Grades derived from public federal data; add dispute/response flow |
| Review platforms refuse to integrate | Medium | Medium | Direct-to-consumer model works independently |
| Cold start — no data for some contractors | High | Low | No citations = Grade A (clean record); make this explicit in report |

---

## Vision

A contractor with a clean federal record should be able to prove it. A homeowner about to spend $40,000 on a renovation should be able to check.

**The renovation bid lands with the safety grade attached.**

That's the end state. Every bid, every platform, every contractor profile — a letter grade backed by federal data, computed in seconds, understood in one glance.
