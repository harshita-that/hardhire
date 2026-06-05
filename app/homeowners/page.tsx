'use client';

import Navbar from '@/components/hardhire/Navbar';
import Footer from '@/components/hardhire/Footer';
import SearchBar from '@/components/hardhire/SearchBar';
import GradeBadge from '@/components/hardhire/GradeBadge';
import { Shield, Search, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function HomeownersPage() {
  return (
    <div className="min-h-screen bg-hardhire-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-playfair font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-hardhire-text leading-[1.1]">
          You wouldn&rsquo;t hire a surgeon<br />
          without checking their license.
        </h1>
        <p className="font-inter text-base sm:text-lg text-hardhire-text-secondary mt-4 max-w-2xl leading-relaxed">
          Every year, thousands of homeowners hire contractors based on online reviews — and discover too late that those reviews said nothing about federal safety violations, fatality records, or repeated OSHA citations.
        </p>

        {/* How it works for homeowners */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              icon: Search,
              title: 'Search a contractor',
              desc: 'Enter the name or license number before you sign the contract. Get an instant safety grade backed by federal data.',
            },
            {
              icon: Shield,
              title: 'Read the grade report',
              desc: 'See the full OSHA violation history, severity scoring, and peer comparison — not marketing copy from the contractor.',
            },
            {
              icon: FileText,
              title: 'Export and share',
              desc: 'Download a PDF report. Share it with your insurance carrier. Keep a record before work begins on your property.',
            },
          ].map((item) => (
            <div key={item.title} className="border-t border-hardhire-border pt-6">
              <item.icon size={20} className="text-hardhire-accent mb-2" />
              <h3 className="font-playfair font-bold text-lg text-hardhire-text">{item.title}</h3>
              <p className="font-inter text-sm text-hardhire-text-secondary mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Scenario */}
        <div className="mt-16 border border-hardhire-border rounded-[4px] bg-hardhire-surface p-6 sm:p-8">
          <p className="font-inter text-xs uppercase tracking-wider text-hardhire-neutral-mid mb-4">A typical scenario</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="font-inter text-sm text-hardhire-text leading-relaxed">
                You got 3 bids for a roof replacement. All 5 stars on Angi. All seem professional. But one has <span className="font-semibold text-hardhire-danger">11 OSHA violations in 4 years</span> including a <span className="font-semibold text-hardhire-danger">fall fatality</span>. Their workers weren&rsquo;t using harnesses. Would you want them on your roof?
              </p>
              <p className="font-inter text-sm text-hardhire-text-secondary mt-4">
                Review sites won&rsquo;t tell you this. Hardhire will.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <GradeBadge grade="D" size="lg" />
                <p className="font-mono text-sm text-hardhire-text-secondary mt-2">
                  Summit Roofing LLC · Grade D<br />
                  14 violations · 2 willful · 1 fatality
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What you get */}
        <div className="mt-16">
          <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-hardhire-text">What you get with every lookup</h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: CheckCircle, text: 'A safety grade from A to F, based on federal OSHA records' },
              { icon: AlertTriangle, text: 'Full violation history with citation type and severity' },
              { icon: FileText, text: 'PDF report for your records or insurance carrier' },
              { icon: Shield, text: 'Peer comparison — how this contractor ranks against competitors' },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3">
                <item.icon size={18} className="text-hardhire-accent shrink-0 mt-0.5" />
                <p className="font-inter text-sm text-hardhire-text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search CTA */}
        <div className="mt-16 text-center">
          <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-hardhire-text">Check a contractor now</h2>
          <div className="mt-6 max-w-xl mx-auto">
            <SearchBar />
          </div>
          <p className="font-mono text-xs text-hardhire-neutral-mid mt-3">
            $9 per lookup or $49/month for unlimited access
          </p>
        </div>

        {/* Back to main */}
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
