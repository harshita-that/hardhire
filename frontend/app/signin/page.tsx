'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    // Mock auth: accept any valid-looking email
    if (email.includes('@') && password.length >= 6) {
      router.push('/dashboard/homeowner');
    } else {
      setError('Invalid email or password. New here? Create an account.');
    }
  };

  return (
    <div className="min-h-screen bg-hardhire-bg flex flex-col">
      <header className="border-b border-hardhire-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link href="/" className="font-playfair font-bold text-xl tracking-tight text-hardhire-accent">
            HARDHIRE
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <h1 className="font-playfair font-bold text-2xl text-hardhire-text">Sign in to Hardhire</h1>
          <p className="font-inter text-sm text-hardhire-text-secondary mt-2">
            Access your safety lookups, saved contractors, and reports.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <div className="p-3 border border-hardhire-danger/30 bg-hardhire-danger/5 rounded-[4px]">
                <p className="font-inter text-sm text-hardhire-danger">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="font-inter text-sm font-medium text-hardhire-text block mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 font-inter text-sm border border-hardhire-border rounded-[4px] bg-hardhire-surface outline-none focus:border-hardhire-accent transition-colors duration-150"
              />
            </div>

            <div>
              <label htmlFor="password" className="font-inter text-sm font-medium text-hardhire-text block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2.5 pr-10 font-inter text-sm border border-hardhire-border rounded-[4px] bg-hardhire-surface outline-none focus:border-hardhire-accent transition-colors duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-hardhire-neutral-mid hover:text-hardhire-text transition-colors duration-150"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-hardhire-accent" />
                <span className="font-inter text-xs text-hardhire-text-secondary">Remember me</span>
              </label>
              <Link href="#" className="font-inter text-xs text-hardhire-accent hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-hardhire-accent text-white font-inter text-sm font-semibold rounded-[4px] hover:bg-hardhire-accent-light transition-colors duration-150"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-inter text-sm text-hardhire-text-secondary">
              Don&rsquo;t have an account?{' '}
              <Link href="/signup" className="text-hardhire-accent font-semibold hover:underline">
                Create one
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-hardhire-border">
            <p className="font-mono text-[11px] text-hardhire-neutral-mid text-center">
              Your data is encrypted. Hardhire never shares your search history.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
