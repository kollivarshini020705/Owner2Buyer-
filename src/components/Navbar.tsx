'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Home, MessageSquare, LayoutDashboard, Calendar, Sun, Moon, ArrowLeftRight, PlusCircle } from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
}

export default function Navbar({ onOpenAddModal }: NavbarProps) {
  const { theme, toggleTheme, activeTab, navigate, user, toggleRole, visitsLog } = useApp();

  const pendingVisitsCount = visitsLog.filter(v => v.status === 'Pending Approval').length;

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <div class="flex items-center">
            <button onClick={() => navigate('home')} class="flex items-center space-x-2.5 group focus:outline-none">
              <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
                O2B
              </span>
              <span class="text-xl font-extrabold tracking-tight block text-slate-900 dark:text-white">
                Owner<span class="text-amber-500">2</span>Buyer
              </span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav class="hidden md:flex items-center space-x-1.5">
            <button onClick={() => navigate('properties')} class="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200"
                    style={{ cursor: 'pointer' }}
                    className={activeTab === 'properties' || activeTab === 'details' ? 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20' : 'text-slate-605 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/60'}>
              <Home class="h-4 w-4" />
              <span>Browse Listings</span>
            </button>
            
            <button onClick={() => navigate('chat')} class="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 relative"
                    style={{ cursor: 'pointer' }}
                    className={activeTab === 'chat' ? 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20' : 'text-slate-650 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/60'}>
              <MessageSquare class="h-4 w-4" />
              <span>P2P Deal Chat</span>
              <span class="absolute top-1 right-1 flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-450 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            </button>

            <button onClick={() => navigate('dashboard')} class="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200"
                    style={{ cursor: 'pointer' }}
                    className={activeTab === 'dashboard' ? 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20' : 'text-slate-650 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/60'}>
              <LayoutDashboard class="h-4 w-4" />
              <span>My Dashboard</span>
            </button>

            <button onClick={() => navigate('visits')} class="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200"
                    style={{ cursor: 'pointer' }}
                    className={activeTab === 'visits' ? 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20' : 'text-slate-650 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/60'}>
              <Calendar class="h-4 w-4" />
              <span>Site Visits</span>
              {pendingVisitsCount > 0 && (
                <span class="flex items-center justify-center px-1.5 py-0.5 rounded-full text-[9px] bg-amber-500 text-slate-950 font-black ml-1.5">{pendingVisitsCount}</span>
              )}
            </button>
          </nav>

          {/* Controls */}
          <div class="flex items-center space-x-3">
            
            {/* User Identity switch */}
            {user && (
              <div class="flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl">
                <span class="text-[9px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:inline">Portal:</span>
                <button onClick={toggleRole} class="flex items-center space-x-1.5 focus:outline-none hover:opacity-80 transition-opacity" style={{ cursor: 'pointer' }}>
                  <img src={user.avatar} class="h-5 w-5 rounded-full object-cover border border-amber-500/40" />
                  <span class="text-xs font-black text-amber-600 dark:text-amber-400 uppercase">{user.role}</span>
                </button>
              </div>
            )}

            {/* List Property CTA */}
            <button onClick={onOpenAddModal} class="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1 transition-all shadow-md shadow-amber-500/10 focus:outline-none" style={{ cursor: 'pointer' }}>
              <PlusCircle class="h-4 w-4" />
              <span class="uppercase tracking-wider">List Property</span>
            </button>

            {/* Light/Dark Toggle */}
            <button onClick={toggleTheme} class="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors focus:outline-none" style={{ cursor: 'pointer' }}>
              {theme === 'light' ? <Moon class="h-4.5 w-4.5" /> : <Sun class="h-4.5 w-4.5" />}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
