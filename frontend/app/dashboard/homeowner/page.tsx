'use client';

import { useState } from 'react';
import Navbar from '@/components/hardhire/Navbar';
import Footer from '@/components/hardhire/Footer';
import GradeBadge from '@/components/hardhire/GradeBadge';
import { homeownerSavedContractors, gradeColorMap } from '@/lib/mock-data';
import Link from 'next/link';
import { Search, FileText, Bookmark, User, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';

type Tab = 'lookups' | 'saved' | 'reports' | 'account';

const recentLookups = homeownerSavedContractors.map((c) => ({
  ...c,
  lookupDate: '2024-04-12',
}));

export default function HomeownerDashboard() {
  const [tab, setTab] = useState<Tab>('lookups');

  return (
    <div className="min-h-screen bg-hardhire-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-hardhire-text">Your Dashboard</h1>
        <p className="font-inter text-sm text-hardhire-text-secondary mt-1">Homeowner safety lookup tools</p>

        <div className="flex flex-col sm:flex-row gap-6 mt-8">
          {/* Sidebar */}
          <nav className="sm:w-48 shrink-0">
            <ul className="flex sm:flex-col gap-1">
              {([
                { key: 'lookups' as Tab, label: 'Lookups', icon: Search },
                { key: 'saved' as Tab, label: 'Saved', icon: Bookmark },
                { key: 'reports' as Tab, label: 'Reports', icon: FileText },
                { key: 'account' as Tab, label: 'Account', icon: User },
              ]).map(({ key, label, icon: Icon }) => (
                <li key={key}>
                  <button
                    onClick={() => setTab(key)}
                    className={`flex items-center gap-2 font-inter text-sm px-3 py-2 rounded-[4px] w-full transition-colors duration-150 ${
                      tab === key
                        ? 'bg-hardhire-accent text-white'
                        : 'text-hardhire-text-secondary hover:bg-hardhire-surface'
                    }`}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {tab === 'lookups' && (
              <div>
                <h2 className="font-playfair font-bold text-xl text-hardhire-text mb-4">Your Lookups</h2>
                <div className="divide-y divide-hardhire-border border border-hardhire-border rounded-[4px] bg-hardhire-surface">
                  {recentLookups.map((c) => (
                    <Link
                      key={c.id}
                      href={`/contractor/${c.id}`}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-[#2D5A27]/5 transition-colors duration-150"
                    >
                      <GradeBadge grade={c.grade} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="font-inter text-sm font-semibold text-hardhire-text">{c.name}</p>
                        <p className="font-mono text-xs text-hardhire-text-secondary">{c.trade} · {c.location}</p>
                      </div>
                      <span className="font-mono text-xs text-hardhire-neutral-mid">{c.lookupDate}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {tab === 'saved' && (
              <div>
                <h2 className="font-playfair font-bold text-xl text-hardhire-text mb-4">Saved Contractors</h2>
                <div className="divide-y divide-hardhire-border border border-hardhire-border rounded-[4px] bg-hardhire-surface">
                  {homeownerSavedContractors.map((c, i) => (
                    <Link
                      key={c.id}
                      href={`/contractor/${c.id}`}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-[#2D5A27]/5 transition-colors duration-150"
                    >
                      <GradeBadge grade={c.grade} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-inter text-sm font-semibold text-hardhire-text">{c.name}</p>
                          {c.gradeChange === 'down' && (
                            <ArrowDownRight size={14} className="text-hardhire-danger" />
                          )}
                        </div>
                        <p className="font-mono text-xs text-hardhire-text-secondary">{c.trade} · {c.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-xs text-hardhire-neutral-mid">Saved {c.savedDate}</p>
                        {c.gradeChange === 'down' && (
                          <p className="font-mono text-xs text-hardhire-danger">Grade changed</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {tab === 'reports' && (
              <div>
                <h2 className="font-playfair font-bold text-xl text-hardhire-text mb-4">Recent Reports</h2>
                <div className="divide-y divide-hardhire-border border border-hardhire-border rounded-[4px] bg-hardhire-surface">
                  {homeownerSavedContractors.map((c) => (
                    <div key={c.id} className="flex items-center gap-4 px-4 py-3">
                      <GradeBadge grade={c.grade} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="font-inter text-sm font-semibold text-hardhire-text">{c.name}</p>
                        <p className="font-mono text-xs text-hardhire-text-secondary">
                          Full grade report · Generated Apr 12, 2024
                        </p>
                      </div>
                      <button className="inline-flex items-center gap-1 font-inter text-xs font-semibold text-hardhire-accent hover:underline">
                        <Download size={12} /> PDF
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'account' && (
              <div>
                <h2 className="font-playfair font-bold text-xl text-hardhire-text mb-4">Account</h2>
                <div className="bg-hardhire-surface border border-hardhire-border rounded-[4px] p-6">
                  <p className="font-inter text-sm text-hardhire-text">
                    <span className="font-semibold">Plan:</span> Homeowner — $49/month unlimited
                  </p>
                  <p className="font-inter text-sm text-hardhire-text-secondary mt-2">
                    Lookups this month: 4
                  </p>
                  <button className="mt-4 font-inter text-sm font-semibold px-4 py-2 border border-hardhire-border rounded-[4px] hover:bg-hardhire-bg transition-colors duration-150">
                    Manage Subscription
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
