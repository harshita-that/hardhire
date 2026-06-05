'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

type Plan = 'homeowner' | 'gc';

export default function SignUpPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan>('homeowner');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    // Mock: redirect to the appropriate dashboard
    router.push(plan === 'gc' ? '/dashboard/gc' : '/dashboard/homeowner');
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

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <h1 className="font-playfair font-bold text-2xl text-hardhire-text">Create your account</h1>
          <p className="font-inter text-sm text-hardhire-text-secondary mt-2">
            Start screening contractors with federal safety data.
          </p>

          {/* Plan selector */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => setPlan('homeowner')}
              className={`p-4 border rounded-[4px] text-left transition-colors duration-150 ${
                plan === 'homeowner'
                  ? 'border-hardhire-accent bg-hardhire-accent/5'
                  : 'border-hardhire-border bg-hardhire-surface hover:border-hardhire-neutral-mid'
              }`}
            >
              <p className={`font-inter text-sm font-semibold ${plan === 'homeowner' ? 'text-hardhire-accent' : 'text-hardhire-text'}`}>
                Homeowner
              </p>
              <p className="font-mono text-xs text-hardhire-text-secondary mt-1">$9/lookup or $49/mo</p>
            </button>
            <button
              onClick={() => setPlan('gc')}
              className={`p-4 border rounded-[4px] text-left transition-colors duration-150 ${
                plan === 'gc'
                  ? 'border-hardhire-accent bg-hardhire-accent/5'
                  : 'border-hardhire-border bg-hardhire-surface hover:border-hardhire-neutral-mid'
              }`}
            >
              <p className={`font-inter text-sm font-semibold ${plan === 'gc' ? 'text-hardhire-accent' : 'text-hardhire-text'}`}>
                General Contractor
              </p>
              <p className="font-mono text-xs text-hardhire-text-secondary mt-1">$299/mo · Team seats</p>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="p-3 border border-hardhire-danger/30 bg-hardhire-danger/5 rounded-[4px]">
                <p className="font-inter text-sm text-hardhire-danger">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="name" className="font-inter text-sm font-medium text-hardhire-text block mb-1">
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full px-3 py-2.5 font-inter text-sm border border-hardhire-border rounded-[4px] bg-hardhire-surface outline-none focus:border-hardhire-accent transition-colors duration-150"
              />
            </div>

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
                  placeholder="At least 8 characters"
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

            <div className="flex items-start gap-2">
              <input type="checkbox" className="accent-hardhire-accent mt-0.5" id="terms" required />
              <label htmlFor="terms" className="font-inter text-xs text-hardhire-text-secondary leading-relaxed">
                I agree to the{' '}
                <Link href="#" className="text-hardhire-accent hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="#" className="text-hardhire-accent hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-hardhire-accent text-white font-inter text-sm font-semibold rounded-[4px] hover:bg-hardhire-accent-light transition-colors duration-150"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-inter text-sm text-hardhire-text-secondary">
              Already have an account?{' '}
              <Link href="/signin" className="text-hardhire-accent font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-hardhire-border">
            <p className="font-mono text-[11px] text-hardhire-neutral-mid text-center">
              Email confirmation is not required. You can start using Hardhire immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
