'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-hardhire-bg border-b border-hardhire-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-playfair font-bold text-xl tracking-tight text-hardhire-accent">
            HARDHIRE
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/homeowners" className="font-inter text-sm text-hardhire-text-secondary hover:text-hardhire-text transition-colors duration-150">
              For Homeowners
            </Link>
            <Link href="/contractors" className="font-inter text-sm text-hardhire-text-secondary hover:text-hardhire-text transition-colors duration-150">
              For Contractors
            </Link>
            <Link href="/#pricing" className="font-inter text-sm text-hardhire-text-secondary hover:text-hardhire-text transition-colors duration-150">
              Pricing
            </Link>
            <Link href="/signin" className="font-inter text-sm text-hardhire-text-secondary hover:text-hardhire-text transition-colors duration-150">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="font-inter text-sm font-semibold px-4 py-2 bg-hardhire-accent text-white rounded-[4px] hover:bg-hardhire-accent-light transition-colors duration-150"
            >
              Get Started →
            </Link>
          </div>
          <button
            className="md:hidden text-hardhire-text"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link href="/homeowners" className="block font-inter text-sm text-hardhire-text-secondary" onClick={() => setMobileOpen(false)}>
              For Homeowners
            </Link>
            <Link href="/contractors" className="block font-inter text-sm text-hardhire-text-secondary" onClick={() => setMobileOpen(false)}>
              For Contractors
            </Link>
            <Link href="/#pricing" className="block font-inter text-sm text-hardhire-text-secondary" onClick={() => setMobileOpen(false)}>
              Pricing
            </Link>
            <Link href="/signin" className="block font-inter text-sm text-hardhire-text-secondary" onClick={() => setMobileOpen(false)}>
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-block font-inter text-sm font-semibold px-4 py-2 bg-hardhire-accent text-white rounded-[4px]"
              onClick={() => setMobileOpen(false)}
            >
              Get Started →
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
