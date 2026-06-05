'use client';

import Navbar from '@/components/hardhire/Navbar';
import Footer from '@/components/hardhire/Footer';
import SearchBar from '@/components/hardhire/SearchBar';
import GradeBadge from '@/components/hardhire/GradeBadge';
import { Users, FileSpreadsheet, Shield, Zap, Building2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { allContractors, gradeColorMap } from '@/lib/mock-data';

export default function ContractorsPage() {
  const dorF = allContractors.filter((c) => c.grade === 'D' || c.grade === 'F');

  return (
    <div className="min-h-screen bg-hardhire-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-playfair font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-hardhire-text leading-[1.1]">
          You&rsquo;re awarding subcontracts.<br />
          <span className="text-hardhire-accent">Do you know their safety record?</span>
        </h1>
        <p className="font-inter text-base sm:text-lg text-hardhire-text-secondary mt-4 max-w-2xl leading-relaxed">
          General contractors carry liability for their subs. One unsafe subcontractor can trigger OSHA inspections, project shutdowns, insurance claims, and lawsuits. Hardhire lets you screen every bidder before you sign.
        </p>

        {/* Key features */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Zap,
              title: 'Bulk Lookup',
              desc: 'Paste a list of contractor names or EINs. Get safety grades on all of them in seconds.',
            },
            {
              icon: FileSpreadsheet,
              title: 'CSV Export',
              desc: 'Export your full screening results to CSV for your insurance carrier, compliance files, or procurement team.',
            },
            {
              icon: Users,
              title: 'Team Seats',
              desc: 'Give your project managers and safety officers their own accounts with shared screening data.',
            },
            {
              icon: Shield,
              title: 'API Access',
              desc: 'Integrate safety grades into your procurement workflow. Automated screening at the bid stage.',
            },
          ].map((item) => (
            <div key={item.title} className="border-t border-hardhire-border pt-6">
              <item.icon size={20} className="text-hardhire-accent mb-2" />
              <h3 className="font-playfair font-bold text-lg text-hardhire-text">{item.title}</h3>
              <p className="font-inter text-sm text-hardhire-text-secondary mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Insurance-ready reports */}
        <div className="mt-16 border border-hardhire-border rounded-[4px] bg-hardhire-surface p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <h2 className="font-playfair font-bold text-xl text-hardhire-text">Insurance-ready reports</h2>
              <p className="font-inter text-sm text-hardhire-text-secondary mt-2 leading-relaxed">
                Every Hardhire report includes the contractor&rsquo;s grade, full OSHA citation history, severity-weighted scoring, and peer benchmarking. Export as PDF or CSV — formatted for insurance carriers and compliance departments.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href="/dashboard/gc"
                className="inline-flex items-center gap-2 font-inter text-sm font-semibold px-6 py-3 bg-hardhire-accent text-white rounded-[4px] hover:bg-hardhire-accent-light transition-colors duration-150"
              >
                Start bulk screening <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Sample screening table */}
        <div className="mt-16">
          <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-hardhire-text">Sample screening results</h2>
          <p className="font-inter text-sm text-hardhire-text-secondary mt-2">
            This is what your contractor screening dashboard looks like.
          </p>
          <div className="mt-6 overflow-x-auto border border-hardhire-border rounded-[4px] bg-hardhire-surface">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-hardhire-border bg-hardhire-bg">
                  <th className="font-inter text-xs uppercase tracking-wider text-hardhire-neutral-mid py-3 px-3">Contractor</th>
                  <th className="font-inter text-xs uppercase tracking-wider text-hardhire-neutral-mid py-3 px-3">Grade</th>
                  <th className="font-inter text-xs uppercase tracking-wider text-hardhire-neutral-mid py-3 px-3">Violations (36mo)</th>
                  <th className="font-inter text-xs uppercase tracking-wider text-hardhire-neutral-mid py-3 px-3">Willful</th>
                  <th className="font-inter text-xs uppercase tracking-wider text-hardhire-neutral-mid py-3 px-3">Fatality</th>
                </tr>
              </thead>
              <tbody>
                {allContractors.slice(0, 6).map((c) => (
                  <tr key={c.id} className="border-b border-hardhire-border">
                    <td className="py-3 px-3">
                      <p className="font-inter text-sm font-semibold text-hardhire-text">{c.name}</p>
                      <p className="font-mono text-xs text-hardhire-text-secondary">{c.trade} · {c.location}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-playfair font-black text-lg" style={{ color: gradeColorMap[c.grade] }}>{c.grade}</span>
                    </td>
                    <td className="font-mono text-sm py-3 px-3">{c.violations36mo}</td>
                    <td className="font-mono text-sm py-3 px-3">
                      {c.willfulViolations > 0 ? (
                        <span className="text-hardhire-danger font-bold">{c.willfulViolations}</span>
                      ) : (
                        <span className="text-hardhire-neutral-mid">0</span>
                      )}
                    </td>
                    <td className="font-mono text-sm py-3 px-3">
                      {c.fatalityRecord ? (
                        <span className="text-hardhire-danger font-bold">Yes</span>
                      ) : (
                        <span className="text-hardhire-neutral-mid">No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="font-mono text-xs text-hardhire-neutral-mid mt-2">
            {allContractors.length} contractors screened · {dorF.length} Grade D or F · Full data in dashboard
          </p>
        </div>

        {/* Pricing reminder */}
        <div className="mt-16 border-t border-hardhire-border pt-8">
          <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-hardhire-text">General Contractor plan</h2>
          <div className="mt-4 max-w-md border border-hardhire-border rounded-[4px] bg-hardhire-surface p-6">
            <p className="font-mono text-2xl font-bold text-hardhire-text">
              $299<span className="text-base font-normal text-hardhire-text-secondary">/month</span>
            </p>
            <p className="font-inter text-sm text-hardhire-text-secondary mt-3 leading-relaxed">
              Bulk lookup, team seats, CSV export, API access, insurance-ready reports. No per-lookup fees.
            </p>
            <Link
              href="/dashboard/gc"
              className="inline-flex items-center gap-2 font-inter text-sm font-semibold mt-4 px-4 py-2 bg-hardhire-accent text-white rounded-[4px] hover:bg-hardhire-accent-light transition-colors duration-150"
            >
              Get started <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="font-inter text-sm text-hardhire-accent hover:underline">
            ← Back to Hardhire home
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
