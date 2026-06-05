'use client';

import { useState } from 'react';
import Navbar from '@/components/hardhire/Navbar';
import Footer from '@/components/hardhire/Footer';
import GradeBadge from '@/components/hardhire/GradeBadge';
import { summitRoofing, gradeColorMap, Citation, Grade } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { Download, Link2, Send, ChevronUp, ChevronDown, ArrowUpRight } from 'lucide-react';

const citationTypeColor: Record<string, string> = {
  Willful: '#B91C1C',
  Serious: '#D97706',
  Other: '#8A8A85',
};

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = score >= 70 ? '#B91C1C' : score >= 50 ? '#D97706' : score >= 30 ? '#4A7C43' : '#2D5A27';
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="font-inter text-sm text-hardhire-text">{label}</span>
        <span className="font-mono text-sm font-bold" style={{ color }}>{score}/100</span>
      </div>
      <div className="h-2 bg-hardhire-border rounded-[2px] overflow-hidden">
        <motion.div
          className="h-full rounded-[2px]"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

type SortKey = 'date' | 'citationType' | 'standard' | 'penalty' | 'status';
const sortDir = (a: string, b: string, dir: 1 | -1) => dir * a.localeCompare(b);

export default function ContractorPage() {
  const c = summitRoofing;
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(0);
  const perPage = 25;

  const sorted = [...c.citations].sort((a, b) => {
    const dir = sortAsc ? 1 : -1;
    if (sortKey === 'date') return dir * (new Date(a.date).getTime() - new Date(b.date).getTime());
    if (sortKey === 'penalty') return dir * (a.penalty - b.penalty);
    const av = a[sortKey as keyof Citation] as string;
    const bv = b[sortKey as keyof Citation] as string;
    return sortDir(av, bv, dir);
  });

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (col !== sortKey) return null;
    return sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  const peerTotal = c.peerGradeDistribution.reduce((s, d) => s + d.count, 0);
  const peerPosition = c.peerGradeDistribution
    .filter((d) => gradeColorMap[d.grade] > gradeColorMap[c.grade])
    .reduce((s, d) => s + d.count, 0);

  const trendDirection = c.trendData.length >= 2 && c.trendData[c.trendData.length - 1].score > c.trendData[c.trendData.length - 4]?.score;

  return (
    <div className="min-h-screen bg-hardhire-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Report Header */}
        <div className="border-b border-hardhire-border pb-6">
          <h1 className="font-playfair font-bold text-3xl sm:text-4xl text-hardhire-text">{c.name}</h1>
          <p className="font-inter text-base text-hardhire-text-secondary mt-1">{c.trade} · {c.location}</p>
          <p className="font-mono text-sm text-hardhire-neutral-mid mt-2">EIN: {c.ein}</p>
          <p className="font-mono text-sm text-hardhire-neutral-mid">License: {c.licenseNumber}</p>
          <div className="flex flex-wrap gap-3 mt-3">
            {[
              `${c.trade}`,
              `${c.city}, ${c.state}`,
              `Licensed since ${c.licensedSince}`,
              `${c.employees} employees`,
            ].map((tag) => (
              <span key={tag} className="font-inter text-xs px-2 py-1 border border-hardhire-border rounded-[4px] text-hardhire-text-secondary">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Grade Card */}
        <div className="py-8 text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <GradeBadge grade={c.grade} size="xl" />
          </motion.div>
          <p className="font-inter text-lg font-semibold mt-2" style={{ color: gradeColorMap[c.grade] }}>
            Grade {c.grade} — {c.gradeLabel}
          </p>
          <p className="font-mono text-sm text-hardhire-text-secondary mt-1">
            {c.gradeSummary}
          </p>

          {/* Sub-scores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto mt-8 text-left">
            <ScoreBar label="Severity Score" score={c.severityScore} />
            <ScoreBar label="Frequency Score" score={c.frequencyScore} />
            <ScoreBar label="Recency Score" score={c.recencyScore} />
            <ScoreBar label="Response Score" score={c.responseScore} />
          </div>

          <p className="font-mono text-sm text-hardhire-text-secondary mt-6">
            {c.peerComparison}
          </p>
        </div>

        {/* Violation Timeline */}
        <section className="border-t border-hardhire-border pt-8">
          <h2 className="font-playfair font-bold text-2xl text-hardhire-text">6-Year Violation History</h2>
          <div className="mt-6 bg-hardhire-code-bg rounded-[4px] p-4 sm:p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={c.quarterlyViolations} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3a3a38" />
                <XAxis dataKey="quarter" tick={{ fill: '#F2F0EB', fontSize: 11, fontFamily: 'IBM Plex Mono' }} />
                <YAxis tick={{ fill: '#F2F0EB', fontSize: 11, fontFamily: 'IBM Plex Mono' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1C1C1A', border: '1px solid #D4D0C8', borderRadius: '4px', fontFamily: 'IBM Plex Mono', fontSize: 12, color: '#F2F0EB' }}
                  labelStyle={{ color: '#8A8A85' }}
                />
                <Bar dataKey="willful" stackId="a" fill="#B91C1C" name="Willful" />
                <Bar dataKey="serious" stackId="a" fill="#D97706" name="Serious" />
                <Bar dataKey="other" stackId="a" fill="#8A8A85" name="Other" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Trend Analysis */}
        <section className="border-t border-hardhire-border pt-8 mt-8">
          <h2 className="font-playfair font-bold text-2xl text-hardhire-text">Trend Analysis</h2>
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={c.trendData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D4D0C8" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono', fill: '#5C5C58' }} />
                <YAxis tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono', fill: '#5C5C58' }} domain={[0, 100]} />
                <Tooltip contentStyle={{ fontSize: 12, fontFamily: 'IBM Plex Mono', borderRadius: '4px' }} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke={trendDirection ? '#B91C1C' : '#2D5A27'}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="font-mono text-sm mt-2" style={{ color: trendDirection ? '#B91C1C' : '#2D5A27' }}>
              {trendDirection ? 'Trending worse ↑' : 'Trending better ↓'}
            </p>
          </div>
        </section>

        {/* Peer Comparison */}
        <section className="border-t border-hardhire-border pt-8 mt-8">
          <h2 className="font-playfair font-bold text-2xl text-hardhire-text">
            How {c.name} compares to {c.city} {c.trade.toLowerCase()}ers
          </h2>
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={c.peerGradeDistribution}
                layout="vertical"
                margin={{ top: 5, right: 20, bottom: 5, left: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#D4D0C8" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono', fill: '#5C5C58' }} />
                <YAxis type="category" dataKey="grade" tick={{ fontSize: 14, fontFamily: 'Playfair Display', fontWeight: 700, fill: '#1C1C1A' }} width={30} />
                <Tooltip contentStyle={{ fontSize: 12, fontFamily: 'IBM Plex Mono', borderRadius: '4px' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {c.peerGradeDistribution.map((entry) => (
                    <rect key={entry.grade} fill={gradeColorMap[entry.grade]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Citation Table */}
        <section className="border-t border-hardhire-border pt-8 mt-8">
          <h2 className="font-playfair font-bold text-2xl text-hardhire-text">All Citations on Record</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-hardhire-border">
                  {([
                    ['date', 'Date'],
                    ['citationType', 'Type'],
                    ['standard', 'Standard'],
                    ['penalty', 'Penalty'],
                    ['status', 'Status'],
                  ] as [SortKey, string][]).map(([key, label]) => (
                    <th
                      key={key}
                      className="font-inter text-xs uppercase tracking-wider text-hardhire-neutral-mid py-3 px-2 cursor-pointer select-none hover:text-hardhire-text transition-colors duration-150"
                      onClick={() => toggleSort(key)}
                    >
                      <span className="inline-flex items-center gap-1">
                        {label} <SortIcon col={key} />
                      </span>
                    </th>
                  ))}
                  <th className="font-inter text-xs uppercase tracking-wider text-hardhire-neutral-mid py-3 px-2">Activity</th>
                  <th className="font-inter text-xs uppercase tracking-wider text-hardhire-neutral-mid py-3 px-2">Contested?</th>
                </tr>
              </thead>
              <tbody>
                {sorted.slice(page * perPage, (page + 1) * perPage).map((cit) => (
                  <tr key={cit.id} className="border-b border-hardhire-border hover:bg-[#2D5A27]/5 transition-colors duration-150">
                    <td className="font-mono text-sm py-3 px-2">{cit.date}</td>
                    <td className="py-3 px-2">
                      <span
                        className="font-inter text-xs font-semibold px-2 py-0.5 rounded-[4px]"
                        style={{
                          color: citationTypeColor[cit.citationType],
                          backgroundColor: citationTypeColor[cit.citationType] + '18',
                        }}
                      >
                        {cit.citationType}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <a
                        href={`https://www.osha.gov/laws-regs/standardnumber/${cit.standard}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-sm text-hardhire-accent hover:underline inline-flex items-center gap-1"
                      >
                        {cit.standard} <ArrowUpRight size={10} />
                      </a>
                      <p className="font-inter text-xs text-hardhire-text-secondary mt-0.5">{cit.standardDescription}</p>
                    </td>
                    <td className="font-mono text-sm py-3 px-2">${cit.penalty.toLocaleString()}</td>
                    <td className="font-inter text-sm py-3 px-2">{cit.status}</td>
                    <td className="font-inter text-sm py-3 px-2 text-hardhire-text-secondary max-w-[200px] truncate">{cit.activity}</td>
                    <td className="font-mono text-sm py-3 px-2">{cit.contested ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Inspector Narratives */}
        {c.citations.filter((cit) => cit.inspectorNarrative).length > 0 && (
          <section className="border-t border-hardhire-border pt-8 mt-8">
            <h2 className="font-playfair font-bold text-2xl text-hardhire-text">Inspector Narratives</h2>
            <div className="space-y-4 mt-6">
              {c.citations
                .filter((cit) => cit.inspectorNarrative)
                .map((cit) => (
                  <div key={cit.id} className="terminal-block">
                    <p className="font-mono text-xs text-hardhire-neutral-mid mb-2">
                      Inspector Narrative — Verbatim OSHA Record · {cit.id} · {cit.date}
                    </p>
                    <p className="font-mono text-sm leading-relaxed text-[#F2F0EB]">
                      {cit.inspectorNarrative}
                    </p>
                  </div>
                ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky Export Bar */}
      <div className="sticky bottom-0 bg-hardhire-surface border-t border-hardhire-border z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 font-inter text-sm font-semibold px-4 py-2 bg-hardhire-accent text-white rounded-[4px] hover:bg-hardhire-accent-light transition-colors duration-150">
              <Download size={14} /> Export Full Report
            </button>
            <button className="inline-flex items-center gap-2 font-inter text-sm px-4 py-2 border border-hardhire-border rounded-[4px] hover:bg-hardhire-bg transition-colors duration-150">
              <Link2 size={14} /> Copy Link
            </button>
            <button className="inline-flex items-center gap-2 font-inter text-sm px-4 py-2 border border-hardhire-border rounded-[4px] hover:bg-hardhire-bg transition-colors duration-150">
              <Send size={14} /> Share with Insurance Carrier
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
