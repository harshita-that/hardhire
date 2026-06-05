'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Navbar from '@/components/hardhire/Navbar';
import Footer from '@/components/hardhire/Footer';
import GradeBadge from '@/components/hardhire/GradeBadge';
import SearchBar from '@/components/hardhire/SearchBar';
import { searchResults, gradeColorMap } from '@/lib/mock-data';
import Link from 'next/link';
import { motion } from 'framer-motion';

function SearchContent() {
  const params = useSearchParams();
  const query = params.get('q') || '';

  return (
    <div className="min-h-screen bg-hardhire-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-hardhire-text">
          Results for &ldquo;{query}&rdquo;
        </h1>

        <div className="mt-6">
          <SearchBar />
        </div>

        <div className="mt-8">
          <p className="font-mono text-xs text-hardhire-neutral-mid">
            {searchResults.length} contractor{searchResults.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="mt-4 divide-y divide-hardhire-border">
          {searchResults.map((contractor, i) => (
            <motion.div
              key={contractor.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <Link
                href={`/contractor/${contractor.id}`}
                className="flex items-center gap-4 py-5 px-2 hover:bg-white/60 transition-colors duration-150 group"
              >
                <GradeBadge grade={contractor.grade} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-inter text-base font-semibold text-hardhire-text group-hover:text-hardhire-accent transition-colors duration-150">
                    {contractor.name}
                  </p>
                  <p className="font-inter text-sm text-hardhire-text-secondary">
                    {contractor.trade} · {contractor.location}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-4">
                  <p className="font-mono text-sm text-hardhire-text-secondary">
                    {contractor.violations36mo} violations · Last citation: {contractor.lastCitationDate} · Grade:{' '}
                    <span style={{ color: gradeColorMap[contractor.grade] }} className="font-bold">
                      {contractor.grade}
                    </span>
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-hardhire-bg" />}>
      <SearchContent />
    </Suspense>
  );
}
