import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-hardhire-border bg-hardhire-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="font-playfair font-bold text-lg tracking-tight text-hardhire-accent">
            HARDHIRE
          </span>
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <Link href="#" className="font-inter text-xs text-hardhire-text-secondary hover:text-hardhire-text transition-colors duration-150">
              Privacy
            </Link>
            <Link href="#" className="font-inter text-xs text-hardhire-text-secondary hover:text-hardhire-text transition-colors duration-150">
              Terms
            </Link>
            <Link href="#" className="font-inter text-xs text-hardhire-text-secondary hover:text-hardhire-text transition-colors duration-150">
              OSHA Data Attribution
            </Link>
            <Link href="#" className="font-inter text-xs text-hardhire-text-secondary hover:text-hardhire-text transition-colors duration-150">
              Contact
            </Link>
          </div>
        </div>
        <p className="font-mono text-[11px] text-hardhire-neutral-mid mt-4">
          Safety data sourced from U.S. Department of Labor OSHA public records.
        </p>
      </div>
    </footer>
  );
}
