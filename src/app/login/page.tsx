'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';

export default function LoginPage() {
  const { login, navigate, theme } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [usersList, setUsersList] = useState<any[]>([]);

  useEffect(() => {
    // Ensure styles are synced
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    // Dynamically fetch users
    fetch('/api/auth/users')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsersList(data);
        }
      })
      .catch((err) => console.error('Error fetching users:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        login(data.user, data.token);
        // Direct redirection to home page dashboard
        window.location.href = '/';
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (selectedEmail: string) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: selectedEmail, isQuickLogin: true })
      });

      const data = await res.json();
      if (res.ok) {
        login(data.user, data.token);
        window.location.href = '/';
      } else {
        setError(data.error || 'Quick login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 grid-lines transition-colors duration-300">
      <div className="bg-mesh absolute inset-0 animate-pulse-slow"></div>
      
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl p-8 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-slate-955 font-black shadow-md shadow-amber-500/20 mx-auto">
            O2B
          </span>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-3">Welcome Back</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Sign in to list, negotiate, or sign stamp deeds</p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-semibold text-center animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-350">
          <div className="space-y-1.5">
            <label className="block uppercase text-[9px] tracking-wider text-slate-500 dark:text-slate-400">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@email.com" 
                   className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl focus:outline-none focus:border-amber-500 text-slate-900 dark:text-white" />
          </div>

          <div className="space-y-1.5">
            <label className="block uppercase text-[9px] tracking-wider text-slate-500 dark:text-slate-400">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" 
                   className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-xl focus:outline-none focus:border-amber-500 text-slate-900 dark:text-white" />
          </div>

          <button type="submit" disabled={loading} 
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-955 font-black rounded-xl uppercase tracking-wider transition-all focus:outline-none shadow-md shadow-amber-500/10" style={{ cursor: 'pointer' }}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          <span>Don't have an account? </span>
          <Link href="/register" className="text-amber-550 dark:text-amber-400 font-extrabold hover:underline">Sign Up</Link>
        </div>

        {usersList.length > 0 && (
          <div className="pt-5 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="h-px w-12 bg-slate-200 dark:bg-slate-800"></span>
              <h3 className="text-center text-[10px] font-black uppercase tracking-widest text-amber-500">Quick Demo Sign-In</h3>
              <span className="h-px w-12 bg-slate-200 dark:bg-slate-800"></span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 max-h-[160px] overflow-y-auto pr-1">
              {/* Sellers Section */}
              <div className="space-y-2">
                <span className="block text-[8px] font-extrabold uppercase text-slate-400 dark:text-slate-500 tracking-wider text-center">Sellers / Owners</span>
                <div className="space-y-1.5">
                  {usersList.filter(u => u.role === 'seller').map(u => (
                    <button key={u.id} type="button" onClick={() => handleQuickLogin(u.email)} disabled={loading}
                            className="w-full text-left p-1.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl flex items-center space-x-1.5 transition-all group focus:outline-none" style={{ cursor: 'pointer' }}>
                      <img src={u.avatar} className="h-6 w-6 rounded-full object-cover border border-amber-500/30" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-extrabold text-slate-800 dark:text-white truncate group-hover:text-amber-500 transition-colors">{u.name}</p>
                        <p className="text-[7px] text-slate-400 dark:text-slate-500 truncate">{u.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Buyers Section */}
              <div className="space-y-2">
                <span className="block text-[8px] font-extrabold uppercase text-slate-400 dark:text-slate-500 tracking-wider text-center">Buyers / Tenants</span>
                <div className="space-y-1.5">
                  {usersList.filter(u => u.role === 'buyer').map(u => (
                    <button key={u.id} type="button" onClick={() => handleQuickLogin(u.email)} disabled={loading}
                            className="w-full text-left p-1.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl flex items-center space-x-1.5 transition-all group focus:outline-none" style={{ cursor: 'pointer' }}>
                      <img src={u.avatar} className="h-6 w-6 rounded-full object-cover border border-amber-500/30" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-extrabold text-slate-800 dark:text-white truncate group-hover:text-amber-500 transition-colors">{u.name}</p>
                        <p className="text-[7px] text-slate-400 dark:text-slate-500 truncate">{u.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
