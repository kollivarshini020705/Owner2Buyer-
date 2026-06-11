'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';

export default function RegisterPage() {
  const { theme } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Account registered successfully! Please sign in.');
        window.location.href = '/login';
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-955 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 grid-lines transition-colors duration-300">
      <div className="bg-mesh absolute inset-0"></div>
      
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl p-8 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20 mx-auto">
            O2B
          </span>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-3">Create Account</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Join India's premium broker-free network</p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-semibold text-center animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-755 dark:text-slate-350">
          <div className="space-y-1.5">
            <label className="block uppercase text-[9px] tracking-wider text-slate-500 dark:text-slate-400">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" 
                   className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl focus:outline-none focus:border-amber-500 text-slate-905 dark:text-white" />
          </div>

          <div className="space-y-1.5">
            <label className="block uppercase text-[9px] tracking-wider text-slate-500 dark:text-slate-400">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@email.com" 
                   className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl focus:outline-none focus:border-amber-500 text-slate-905 dark:text-white" />
          </div>

          <div className="space-y-1.5">
            <label className="block uppercase text-[9px] tracking-wider text-slate-500 dark:text-slate-400">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" 
                   className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-xl focus:outline-none focus:border-amber-500 text-slate-905 dark:text-white" />
          </div>

          <div className="space-y-1.5">
            <label className="block uppercase text-[9px] tracking-wider text-slate-500 dark:text-slate-400">Account Type / Role</label>
            <div className="flex bg-slate-100 dark:bg-slate-955 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
              <button type="button" onClick={() => setRole('buyer')} className="flex-grow py-2 rounded-lg transition-colors focus:outline-none" style={{ cursor: 'pointer' }}
                      className={role === 'buyer' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-500 dark:text-slate-400'}>Buyer / Tenant</button>
              <button type="button" onClick={() => setRole('seller')} className="flex-grow py-2 rounded-lg transition-colors focus:outline-none" style={{ cursor: 'pointer' }}
                      className={role === 'seller' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-500 dark:text-slate-400'}>Landlord / Seller</button>
            </div>
          </div>

          <button type="submit" disabled={loading} 
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-955 font-black rounded-xl uppercase tracking-wider transition-all focus:outline-none shadow" style={{ cursor: 'pointer' }}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          <span>Already have an account? </span>
          <Link href="/login" className="text-amber-550 dark:text-amber-400 font-extrabold hover:underline">Sign In</Link>
        </div>

      </div>
    </div>
  );
}
