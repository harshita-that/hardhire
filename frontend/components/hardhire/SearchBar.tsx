'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ placeholder = 'Enter contractor name or license number...', className = '' }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex border border-hardhire-border rounded-[4px] overflow-hidden bg-hardhire-surface ${className}`}>
      <div className="flex-1 flex items-center px-4">
        <Search size={18} className="text-hardhire-neutral-mid mr-3 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full py-3 text-sm font-inter text-hardhire-text placeholder-hardhire-neutral-mid bg-transparent outline-none"
        />
      </div>
      <button
        type="submit"
        className="px-6 py-3 bg-hardhire-accent text-white font-inter text-sm font-semibold hover:bg-hardhire-accent-light transition-colors duration-150 shrink-0"
      >
        Look Up →
      </button>
    </form>
  );
}
