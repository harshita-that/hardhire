'use client';

import Navbar from '@/components/hardhire/Navbar';
import Footer from '@/components/hardhire/Footer';
import SearchBar from '@/components/hardhire/SearchBar';
import { Star } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-hardhire-bg">
      <Navbar />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12">
        <div className="max-w-4xl">
          <h1 className="font-playfair font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[72px] leading-[1.08] tracking-tight text-hardhire-text">
            Five stars means<br />
            the kitchen looked good.<br />
            <span className="text-hardhire-accent">It says nothing about safety.</span>
          </h1>
          <p className="font-inter text-base sm:text-lg text-hardhire-text-secondary mt-6 max-w-2xl leading-relaxed">
            Hardhire grades contractors A–F using federal OSHA violation records — before you sign the contract.
          </p>
        </div>

        {/* Comparison cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-0">
          <div className="p-6 sm:p-8 bg-hardhire-surface border border-hardhire-border rounded-[4px]">
            <p className="font-inter text-xs uppercase tracking-wider text-hardhire-neutral-mid mb-4">What review sites show you</p>
            <div className="space-y-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={16} fill="#D97706" color="#D97706" />
                ))}
                <span className="font-mono text-sm text-hardhire-text ml-2">5.0</span>
              </div>
              <p className="font-inter text-sm font-semibold text-hardhire-text">Summit Roofing LLC</p>
              <p className="font-inter text-sm text-hardhire-text-secondary leading-relaxed">
                &ldquo;Great crew, clean job site. They finished our roof in two days and left the yard spotless. Would absolutely hire again!&rdquo;
              </p>
              <p className="font-mono text-xs text-hardhire-neutral-mid">— HomeAdvisor, Feb 2024</p>
            </div>
          </div>

          <div className="hidden md:flex items-center px-4">
            <div className="w-px h-full bg-hardhire-border" />
          </div>
          <div className="md:hidden h-px w-full bg-hardhire-border my-6" />

          <div className="p-6 sm:p-8 bg-hardhire-surface border border-hardhire-border rounded-[4px]">
            <p className="font-inter text-xs uppercase tracking-wider text-hardhire-neutral-mid mb-4">What Hardhire shows you</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-playfair font-black text-4xl text-hardhire-grade-d">D</span>
                <div>
                  <p className="font-inter text-sm font-semibold text-hardhire-text">Summit Roofing LLC</p>
                  <p className="font-inter text-xs text-hardhire-text-secondary">Grade D — High Risk</p>
                </div>
              </div>
              <p className="font-mono text-sm text-hardhire-danger leading-relaxed">
                14 violations in 36 months<br />
                2 willful citations<br />
                1 fatality on record
              </p>
              <p className="font-mono text-xs text-hardhire-neutral-mid">— OSHA IMIS Database, Mar 2024</p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <SearchBar />
          <p className="font-mono text-[11px] text-hardhire-neutral-mid mt-3">
            Data sourced from OSHA IMIS & BLS public APIs. Updated weekly.
          </p>
        </div>
      </section>

      {/* The Stakes Strip */}
      <section className="bg-hardhire-code-bg text-hardhire-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            <div>
              <p className="font-mono font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight text-hardhire-bg">5,283</p>
              <p className="font-inter text-sm text-hardhire-neutral-mid mt-2">OSHA construction fatalities last year</p>
            </div>
            <div>
              <p className="font-mono font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight text-hardhire-bg">$15,625</p>
              <p className="font-inter text-sm text-hardhire-neutral-mid mt-2">Median penalty per willful violation</p>
            </div>
            <div>
              <p className="font-mono font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight text-hardhire-bg">87%</p>
              <p className="font-inter text-sm text-hardhire-neutral-mid mt-2">Homeowners who never check safety records</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="font-playfair font-bold text-3xl sm:text-4xl text-hardhire-text tracking-tight">The Methodology</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
          {[
            { num: '01', title: 'OSHA Citation Pull', desc: "We query the federal IMIS database for every citation filed against the contractor's EIN and DBA names." },
            { num: '02', title: 'Severity Weighting', desc: 'Willful violations score 10×. Serious = 3×. Other = 1×. Repeat violations add a multiplier.' },
            { num: '03', title: 'Recency Decay', desc: 'Citations from 36 months ago carry full weight. Citations from 72 months ago carry 40%.' },
            { num: '04', title: 'Peer Benchmarking', desc: 'Each grade is relative to contractors in the same trade and metro area.' },
          ].map((item) => (
            <div key={item.num} className="border-t border-hardhire-border pt-6">
              <span className="font-mono font-bold text-2xl text-hardhire-accent">{item.num}</span>
              <h3 className="font-playfair font-bold text-lg text-hardhire-text mt-2">{item.title}</h3>
              <p className="font-inter text-sm text-hardhire-text-secondary mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dual Persona */}
      <section className="border-t border-hardhire-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-0">
            <div id="homeowners" className="pr-0 md:pr-8">
              <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-hardhire-text">Homeowners</h2>
              <p className="font-inter text-sm text-hardhire-text-secondary mt-4 leading-relaxed">
                You got 3 bids for a roof replacement. All 5 stars on Angi. One has 11 OSHA violations in 4 years including a fall fatality.
              </p>
              <a href="/search?q=Summit+Roofing" className="inline-flex items-center gap-1 font-inter text-sm font-semibold text-hardhire-accent mt-6 hover:gap-2 transition-all duration-150">
                Check before you sign →
              </a>
            </div>
            <div className="hidden md:flex items-center px-8">
              <div className="w-px h-48 bg-hardhire-border" />
            </div>
            <div className="h-px w-full bg-hardhire-border md:hidden my-8" />
            <div id="contractors" className="pl-0 md:pl-8">
              <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-hardhire-text">General Contractors</h2>
              <p className="font-inter text-sm text-hardhire-text-secondary mt-4 leading-relaxed">
                You&apos;re awarding 4 subcontracts next week. Run bulk safety lookups on all bidders. Export to PDF for your insurance carrier.
              </p>
              <a href="/signup?plan=gc" className="inline-flex items-center gap-1 font-inter text-sm font-semibold text-hardhire-accent mt-6 hover:gap-2 transition-all duration-150">
                Start bulk screening →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-hardhire-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h2 className="font-playfair font-bold text-3xl sm:text-4xl text-hardhire-text tracking-tight">Transparent Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <div className="p-8 bg-hardhire-surface border border-hardhire-border rounded-[4px]">
              <h3 className="font-playfair font-bold text-xl text-hardhire-text">Homeowner</h3>
              <p className="font-mono text-2xl font-bold text-hardhire-text mt-3">
                $9<span className="text-base font-normal text-hardhire-text-secondary">/lookup</span>
              </p>
              <p className="font-mono text-base text-hardhire-text-secondary mt-1">or $49/month unlimited</p>
              <p className="font-inter text-sm text-hardhire-text-secondary mt-4 leading-relaxed">
                Instant grade report, full citation history, PDF export.
              </p>
            </div>
            <div className="p-8 bg-hardhire-surface border border-hardhire-border rounded-[4px]">
              <h3 className="font-playfair font-bold text-xl text-hardhire-text">General Contractor</h3>
              <p className="font-mono text-2xl font-bold text-hardhire-text mt-3">
                $299<span className="text-base font-normal text-hardhire-text-secondary">/month</span>
              </p>
              <p className="font-inter text-sm text-hardhire-text-secondary mt-4 leading-relaxed">
                Bulk lookup, team seats, CSV export, API access, insurance-ready reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
