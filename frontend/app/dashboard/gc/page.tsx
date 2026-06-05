'use client';

import { useState } from 'react';
import Navbar from '@/components/hardhire/Navbar';
import Footer from '@/components/hardhire/Footer';
import GradeBadge from '@/components/hardhire/GradeBadge';
import { allContractors, gradeColorMap, Contractor } from '@/lib/mock-data';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, Flag, ArrowUpRight, X, ChevronUp, ChevronDown } from 'lucide-react';

type SortKey = 'name' | 'grade' | 'violations36mo' | 'willfulViolations' | 'lastCitationDate';

const gradeOrder: Record<string, number> = { F: 5, D: 4, C: 3, B: 2, A: 1 };

export default function GCDashboard() {
  const [sortKey, setSortKey] = useState<SortKey>('grade');
  const [sortAsc, setSortAsc] = useState(false);
  const [selected, setSelected] = useState<Contractor | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const sorted = [...allContractors].sort((a, b) => {
    const dir = sortAsc ? 1 : -1;
    if (sortKey === 'name') return dir * a.name.localeCompare(b.name);
    if (sortKey === 'grade') return dir * (gradeOrder[a.grade] - gradeOrder[b.grade]);
    if (sortKey === 'violations36mo') return dir * (a.violations36mo - b.violations36mo);
    if (sortKey === 'willfulViolations') return dir * (a.willfulViolations - b.willfulViolations);
    return dir * a.lastCitationDate.localeCompare(b.lastCitationDate);
  });

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (col !== sortKey) return null;
    return sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const statDorF = allContractors.filter((c) => c.grade === 'D' || c.grade === 'F').length;
  const statWillful = allContractors.filter((c) => c.willfulViolations > 0).length;

  return (
    <div className="min-h-screen bg-hardhire-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-hardhire-text">GC Dashboard</h1>

        {/* Bulk search */}
        <div className="mt-6">
          <label className="font-inter text-xs uppercase tracking-wider text-hardhire-neutral-mid">Bulk Lookup</label>
          <div className="mt-2 flex flex-col sm:flex-row gap-3">
            <textarea
              placeholder="Paste contractor names or EINs (one per line)"
              className="flex-1 font-mono text-sm p-3 border border-hardhire-border rounded-[4px] bg-hardhire-surface resize-none h-20 outline-none focus:border-hardhire-accent transition-colors duration-150"
            />
            <button className="self-start px-6 py-3 bg-hardhire-accent text-white font-inter text-sm font-semibold rounded-[4px] hover:bg-hardhire-accent-light transition-colors duration-150">
              Run Bulk Lookup →
            </button>
          </div>
        </div>

        {/* Summary stats */}
        <div className="mt-6 flex flex-wrap gap-4 font-mono text-sm text-hardhire-text-secondary">
          <span>{allContractors.length} contractors screened</span>
          <span>·</span>
          <span className="text-hardhire-danger">{statDorF} Grade D or F</span>
          <span>·</span>
          <span>{statWillful} with willful violations</span>
          <span>·</span>
          <span>Last updated 2 min ago</span>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-x-auto border border-hardhire-border rounded-[4px] bg-hardhire-surface">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-hardhire-border bg-hardhire-bg">
                <th className="w-10 py-3 px-2">
                  <input
                    type="checkbox"
                    className="accent-hardhire-accent"
                    checked={selectedIds.size === allContractors.length}
                    onChange={() => {
                      if (selectedIds.size === allContractors.length) setSelectedIds(new Set());
                      else setSelectedIds(new Set(allContractors.map((c) => c.id)));
                    }}
                  />
                </th>
                {([
                  ['name', 'Contractor'],
                  ['grade', 'Grade'],
                  ['violations36mo', 'Violations (36mo)'],
                  ['willfulViolations', 'Willful?'],
                  ['lastCitationDate', 'Last Citation'],
                ] as [SortKey, string][]).map(([key, label]) => (
                  <th
                    key={key}
                    className="font-inter text-xs uppercase tracking-wider text-hardhire-neutral-mid py-3 px-2 cursor-pointer select-none hover:text-hardhire-text transition-colors duration-150"
                    onClick={() => toggleSort(key)}
                  >
                    <span className="inline-flex items-center gap-1">{label} <SortIcon col={key} /></span>
                  </th>
                ))}
                <th className="font-inter text-xs uppercase tracking-wider text-hardhire-neutral-mid py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((c) => (
                <tr
                  key={c.id}
                  className={`border-b border-hardhire-border hover:bg-[#2D5A27]/5 transition-colors duration-150 cursor-pointer ${
                    selected?.id === c.id ? 'bg-[#2D5A27]/10' : ''
                  }`}
                  onClick={() => setSelected(selected?.id === c.id ? null : c)}
                >
                  <td className="py-3 px-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="accent-hardhire-accent"
                      checked={selectedIds.has(c.id)}
                      onChange={() => toggleSelect(c.id)}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <p className="font-inter text-sm font-semibold text-hardhire-text">{c.name}</p>
                    <p className="font-mono text-xs text-hardhire-text-secondary">{c.trade} · {c.location}</p>
                  </td>
                  <td className="py-3 px-2">
                    <GradeBadge grade={c.grade} size="sm" />
                  </td>
                  <td className="font-mono text-sm py-3 px-2">{c.violations36mo}</td>
                  <td className="py-3 px-2">
                    {c.willfulViolations > 0 ? (
                      <span className="font-mono text-sm text-hardhire-danger font-bold">Yes ({c.willfulViolations})</span>
                    ) : (
                      <span className="font-mono text-sm text-hardhire-neutral-mid">No</span>
                    )}
                  </td>
                  <td className="font-mono text-sm py-3 px-2">{c.lastCitationDate}</td>
                  <td className="py-3 px-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <Link href={`/contractor/${c.id}`} className="font-inter text-xs text-hardhire-accent hover:underline inline-flex items-center gap-1">
                        Report <ArrowUpRight size={10} />
                      </Link>
                      <button className="font-inter text-xs text-hardhire-neutral-mid hover:text-hardhire-warning">
                        <Flag size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bulk export */}
        {selectedIds.size > 0 && (
          <div className="mt-4 flex items-center gap-3">
            <button className="inline-flex items-center gap-2 font-inter text-sm font-semibold px-4 py-2 bg-hardhire-accent text-white rounded-[4px] hover:bg-hardhire-accent-light transition-colors duration-150">
              <Download size={14} /> Export {selectedIds.size} to CSV
            </button>
            <button className="font-inter text-sm text-hardhire-text-secondary hover:text-hardhire-text transition-colors duration-150" onClick={() => setSelectedIds(new Set())}>
              Clear selection
            </button>
          </div>
        )}
      </div>

      {/* Side panel */}
      <AnimatePresence>
        {selected && (
          <>
            <div
              className="fixed inset-0 bg-black/20 z-40 lg:hidden"
              onClick={() => setSelected(null)}
            />
            <motion.div
              className="fixed right-0 top-0 h-full w-full sm:w-96 bg-hardhire-surface border-l border-hardhire-border z-50 overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-playfair font-bold text-lg text-hardhire-text">Quick Summary</h2>
                  <button onClick={() => setSelected(null)} className="text-hardhire-neutral-mid hover:text-hardhire-text transition-colors duration-150">
                    <X size={18} />
                  </button>
                </div>

                <div className="text-center mb-6">
                  <GradeBadge grade={selected.grade} size="lg" />
                  <p className="font-inter text-sm font-semibold mt-2" style={{ color: gradeColorMap[selected.grade] }}>
                    Grade {selected.grade} — {selected.gradeLabel}
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="font-inter text-sm font-semibold text-hardhire-text">{selected.name}</p>
                    <p className="font-mono text-xs text-hardhire-text-secondary">{selected.trade} · {selected.location}</p>
                    <p className="font-mono text-xs text-hardhire-neutral-mid">EIN: {selected.ein}</p>
                  </div>

                  <div className="border-t border-hardhire-border pt-3">
                    <p className="font-inter text-xs uppercase tracking-wider text-hardhire-neutral-mid mb-2">Top Violations</p>
                    <p className="font-mono text-sm text-hardhire-text">{selected.violations36mo} violations (36mo)</p>
                    <p className="font-mono text-sm text-hardhire-danger">{selected.willfulViolations} willful</p>
                    {selected.fatalityRecord && (
                      <p className="font-mono text-sm text-hardhire-danger">Fatality on record</p>
                    )}
                  </div>

                  <div className="border-t border-hardhire-border pt-3">
                    <p className="font-inter text-xs uppercase tracking-wider text-hardhire-neutral-mid mb-1">Peer Rank</p>
                    <p className="font-mono text-sm text-hardhire-text-secondary">{selected.peerComparison}</p>
                  </div>
                </div>

                <Link
                  href={`/contractor/${selected.id}`}
                  className="inline-flex items-center gap-1 font-inter text-sm font-semibold text-hardhire-accent mt-6 hover:underline"
                >
                  Open Full Report →
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
