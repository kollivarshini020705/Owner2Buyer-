'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import { 
  Search, Sparkles, MapPin, Bed, Maximize2, 
  ChevronRight, ArrowLeft, Bookmark, MessageSquare, 
  Phone, Calendar, Clock, User, PiggyBank, 
  LayoutDashboard, Inbox, FileText, FileSignature, 
  Check, CheckCircle, Calculator, SlidersHorizontal, Sliders, Map, TrendingUp, PlusCircle
} from 'lucide-react';

export default function Page() {
  const {
    activeTab, navigate, theme, toggleTheme, user, toggleRole,
    properties, fetchProperties, addProperty, selectedProperty, selectProperty,
    activeRecipientId, setActiveRecipientId, activePropertyId, setActivePropertyId,
    chatMessages, sendMessage, postAgreement, signAgreement,
    visitsLog, bookVisit, updateVisitStatus, favorites, toggleFavorite, isFavorite, formatPrice
  } = useApp();

  // Navigation states
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);

  // Search & Filter parameters
  const [searchCity, setSearchCity] = useState('Hyderabad');
  const [searchType, setSearchType] = useState<'sale' | 'rent'>('sale');
  const [searchCategory, setSearchCategory] = useState('All');
  const [searchBhk, setSearchBhk] = useState('All');
  const [searchBudget, setSearchBudget] = useState(50000000);
  const [searchQuery, setSearchQuery] = useState('');

  // Agreement generator fields
  const [agreementStamp, setAgreementStamp] = useState(100);
  const [agreementRent, setAgreementRent] = useState(45000);
  const [agreementDeposit, setAgreementDeposit] = useState(180000);
  const [agreementDuration, setAgreementDuration] = useState(11);
  const [agreementNotice, setAgreementNotice] = useState(2);
  const [agreementCommencement, setAgreementCommencement] = useState('2026-07-01');

  // Mortgage parameters
  const [mortgageLoan, setMortgageLoan] = useState(19600000);
  const [mortgageTenure, setMortgageTenure] = useState(20);
  const [mortgageRate, setMortgageRate] = useState('8.5');

  // Rent affordability parameters
  const [rentIncome, setRentIncome] = useState(150000);

  // Send message parameter
  const [chatInput, setChatInput] = useState('');

  // New property form bindings
  const [newProp, setNewProp] = useState({
    title: '',
    description: '',
    type: 'sale',
    category: 'Apartment',
    city: 'Hyderabad',
    price: '',
    area: '',
    beds: '',
    baths: '',
    address: '',
    imageUrl: '',
    amenitiesList: [] as string[]
  });

  // Keep filters updated on transaction type change
  useEffect(() => {
    if (searchType === 'rent') {
      setSearchBudget(150000);
    } else {
      setSearchBudget(60000000);
    }
  }, [searchType]);

  // Adjust mortgage loan amount on property selection
  useEffect(() => {
    if (selectedProperty) {
      setMortgageLoan(Math.round(selectedProperty.price * 0.8));
    }
  }, [selectedProperty]);

  // Filter listings
  const filteredProperties = properties.filter(p => {
    if (p.location.city.toLowerCase() !== searchCity.toLowerCase()) return false;
    if (p.type !== searchType) return false;
    if (searchCategory !== 'All' && p.category !== searchCategory) return false;
    if (searchBhk !== 'All' && p.beds !== parseInt(searchBhk)) return false;
    if (p.price > searchBudget) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = p.title.toLowerCase().includes(q);
      const inDesc = p.description.toLowerCase().includes(q);
      const inAddr = p.location.address.toLowerCase().includes(q);
      if (!inTitle && !inDesc && !inAddr) return false;
    }
    return true;
  });

  // Handlers
  const handleResetFilters = () => {
    setSearchCategory('All');
    setSearchBhk('All');
    setSearchQuery('');
    setSearchBudget(searchType === 'rent' ? 150000 : 50000000);
  };

  const handleOpenAgreementBuilder = () => {
    const prop = properties.find(p => p.id === activePropertyId || (p as any)._id === activePropertyId);
    if (prop) {
      setAgreementRent(prop.price);
      setAgreementDeposit(prop.type === 'rent' ? prop.price * 4 : Math.round(prop.price * 0.1));
    }
    setShowAgreementModal(true);
  };

  const handlePostAgreement = async (e: React.FormEvent) => {
    e.preventDefault();
    await postAgreement({
      stampDuty: agreementStamp,
      rent: agreementRent,
      deposit: agreementDeposit,
      duration: agreementDuration,
      notice: agreementNotice,
      commencementDate: agreementCommencement
    });
    setShowAgreementModal(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    await sendMessage(chatInput);
    setChatInput('');
  };

  const handleAddPropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addProperty({
      title: newProp.title,
      description: newProp.description,
      price: newProp.price,
      type: newProp.type,
      category: newProp.category,
      beds: newProp.beds,
      baths: newProp.baths,
      area: newProp.area,
      address: newProp.address,
      city: newProp.city,
      imageUrl: newProp.imageUrl,
      amenities: newProp.amenitiesList.length > 0 ? newProp.amenitiesList : undefined
    });

    if (success) {
      setNewProp({
        title: '',
        description: '',
        type: 'sale',
        category: 'Apartment',
        city: 'Hyderabad',
        price: '',
        area: '',
        beds: '',
        baths: '',
        address: '',
        imageUrl: '',
        amenitiesList: []
      });
      setShowAddPropertyModal(false);
      alert("Property published successfully!");
      navigate('properties');
    }
  };

  const handleCheckboxChange = (amenity: string) => {
    setNewProp(prev => {
      const list = prev.amenitiesList.includes(amenity)
        ? prev.amenitiesList.filter(item => item !== amenity)
        : [...prev.amenitiesList, amenity];
      return { ...prev, amenitiesList: list };
    });
  };

  // Helper getters
  const activeRecipient = () => {
    if (activeRecipientId === 'user_1') {
      return { name: 'Anjali Sharma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', role: 'owner' };
    }
    if (activeRecipientId === 'user_2') {
      return { name: 'Rahul Verma', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', role: 'tenant' };
    }
    return { name: 'Direct Owner', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', role: 'owner' };
  };

  const pAddress = (id: string) => {
    const prop = properties.find(p => p.id === id || (p as any)._id === id);
    return prop ? prop.title : 'Direct Property';
  };

  const activeThread = () => {
    const recipient = activeRecipient();
    const prop = properties.find(p => p.id === activePropertyId || (p as any)._id === activePropertyId);
    return {
      recipientId: activeRecipientId,
      name: recipient.name,
      avatar: recipient.avatar,
      role: recipient.role,
      propertyId: activePropertyId
    };
  };

  // Calculators
  const calculateEmi = () => {
    const loan = parseFloat(mortgageLoan.toString());
    const ratePercent = parseFloat(mortgageRate);
    const years = parseFloat(mortgageTenure.toString());
    
    if (isNaN(loan) || isNaN(ratePercent) || isNaN(years) || loan <= 0) return 0;
    
    const monthlyRate = (ratePercent / 12) / 100;
    const months = years * 12;
    
    const emi = (loan * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  return (
    <>
      <Navbar onOpenAddModal={() => setShowAddPropertyModal(true)} />

      <main class="flex-grow flex flex-col relative overflow-hidden">

        {/* 1. HOME TAB */}
        {activeTab === 'home' && (
          <div class="flex-grow flex flex-col animate-fade-in">
            
            {/* Hero Screen */}
            <section class="relative overflow-hidden pt-20 pb-16 lg:pt-24 lg:pb-20 bg-slate-950 text-white grid-lines dark border-b border-slate-900">
              <div class="bg-mesh absolute inset-0"></div>
              
              <div class="max-w-7xl mx-auto px-4 relative z-10 text-center space-y-8">
                <div class="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-xs font-bold text-amber-400">
                  <Sparkles class="h-3.5 w-3.5 animate-pulse" />
                  <span>India's Premium Broker-Free Marketplace</span>
                </div>

                <div class="space-y-4 max-w-4xl mx-auto">
                  <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
                    Broker-Free Deals. <span class="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">Direct Contracts.</span> <br />
                    Your Home, Your Agreement.
                  </h1>
                  <p class="text-xs sm:text-sm md:text-base text-slate-350 max-w-2xl mx-auto leading-relaxed font-semibold">
                    Sellers post houses, lands, and shops for free. Buyers connect directly to negotiate rates, schedule visits, and digitally sign stamp papers.
                  </p>
                </div>

                {/* Quick Search */}
                <div class="max-w-4xl mx-auto bg-slate-900/90 p-4 rounded-3xl border border-slate-800 shadow-2xl glow-border">
                  <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div class="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                      <button onClick={() => setSearchType('sale')} class="flex-grow py-2 text-xs font-bold rounded-lg transition-colors focus:outline-none" style={{ cursor: 'pointer' }}
                              className={searchType === 'sale' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}>Buy</button>
                      <button onClick={() => setSearchType('rent')} class="flex-grow py-2 text-xs font-bold rounded-lg transition-colors focus:outline-none" style={{ cursor: 'pointer' }}
                              className={searchType === 'rent' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}>Rent</button>
                    </div>

                    <div class="flex flex-col justify-center text-left bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800">
                      <span class="text-[8px] uppercase font-black tracking-widest text-slate-500">Locality</span>
                      <select value={searchCity} onChange={(e) => setSearchCity(e.target.value)} class="bg-transparent border-none text-white text-xs font-bold focus:outline-none w-full cursor-pointer mt-0.5 outline-none">
                        <option value="Hyderabad" class="bg-slate-950">Hyderabad</option>
                        <option value="Bangalore" class="bg-slate-950">Bangalore</option>
                      </select>
                    </div>

                    <div class="flex flex-col justify-center text-left bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800">
                      <span class="text-[8px] uppercase font-black tracking-widest text-slate-500">Category</span>
                      <select value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)} class="bg-transparent border-none text-white text-xs font-bold focus:outline-none w-full cursor-pointer mt-0.5 outline-none">
                        <option value="All" class="bg-slate-950">All Categories</option>
                        <option value="Apartment" class="bg-slate-950">Apartments</option>
                        <option value="Villa" class="bg-slate-950">Villas</option>
                        <option value="Duplex" class="bg-slate-950">Duplexes</option>
                        <option value="Land" class="bg-slate-950">Land / Plots</option>
                        <option value="Shop" class="bg-slate-950">Shops / Commercial</option>
                      </select>
                    </div>

                    <button onClick={() => navigate('properties')} class="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-amber-500/15 focus:outline-none" style={{ cursor: 'pointer' }}>
                      <Search class="h-4.5 w-4.5" />
                      <span class="text-xs uppercase tracking-wider">Search Portal</span>
                    </button>
                  </div>
                </div>

                <div class="flex justify-center pt-2">
                  <div class="flex items-center space-x-2 bg-slate-900/60 border border-slate-800 rounded-2xl px-4 py-2 text-xs text-slate-450">
                    <span class="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>Direct seller portal online: <strong class="text-white">Active Persistence Mode</strong></span>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats section */}
            <section class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-850 py-10 transition-colors">
              <div class="max-w-7xl mx-auto px-4">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs">
                  <div class="space-y-1">
                    <div class="text-3xl font-black text-amber-500">0%</div>
                    <div class="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Broker Commission</div>
                  </div>
                  <div class="space-y-1 border-l border-slate-200 dark:border-slate-850">
                    <div class="text-3xl font-black text-amber-500">₹2.4 Cr+</div>
                    <div class="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Brokerage Saved</div>
                  </div>
                  <div class="space-y-1 border-l border-slate-200 dark:border-slate-850">
                    <div class="text-3xl font-black text-amber-500">100%</div>
                    <div class="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Legal Verified Titles</div>
                  </div>
                  <div class="space-y-1 border-l border-slate-200 dark:border-slate-850">
                    <div class="text-3xl font-black text-amber-500">P2P</div>
                    <div class="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">E-Stamp Rental Deeds</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Section */}
            <section class="max-w-7xl mx-auto px-4 py-16 w-full flex-grow">
              <div class="flex items-end justify-between mb-8">
                <div>
                  <span class="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest font-black">Handpicked Deals</span>
                  <h2 class="text-2xl font-black tracking-tight mt-1 text-slate-900 dark:text-white">Featured Real Estate listings</h2>
                </div>
                <button onClick={() => navigate('properties')} class="text-amber-550 hover:text-amber-600 text-xs font-bold flex items-center space-x-1.5 focus:outline-none" style={{ cursor: 'pointer' }}>
                  <span>View All</span>
                  <ChevronRight class="h-4 w-4" />
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                {properties.slice(0, 3).map((p) => (
                  <PropertyCard key={p.id || (p as any)._id} property={p} />
                ))}
              </div>
            </section>

          </div>
        )}

        {/* 2. PROPERTIES LISTINGS BROWSER */}
        {activeTab === 'properties' && (
          <div class="flex-grow flex flex-col md:flex-row h-[calc(100vh-64px)] animate-fade-in">
            
            {/* Filter sidebar */}
            <div class="w-full md:w-[30%] lg:w-[25%] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-y-auto p-5 space-y-6">
              <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 class="font-extrabold text-sm flex items-center gap-1.5 dark:text-white">
                  <Sliders class="h-4.5 w-4.5 text-amber-500" /> Filters Configuration
                </h3>
                <button onClick={handleResetFilters} class="text-[10px] font-bold text-slate-450 hover:text-amber-500 focus:outline-none" style={{ cursor: 'pointer' }}>Reset</button>
              </div>

              {/*  */}
              <div class="space-y-2">
                <span class="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Transaction Mode</span>
                <div class="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
                  <button onClick={() => setSearchType('sale')} class="flex-1 py-1.5 rounded-lg transition-all focus:outline-none" style={{ cursor: 'pointer' }}
                          className={searchType === 'sale' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-500 dark:text-slate-400'}>Buy</button>
                  <button onClick={() => setSearchType('rent')} class="flex-1 py-1.5 rounded-lg transition-all focus:outline-none" style={{ cursor: 'pointer' }}
                          className={searchType === 'rent' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-500 dark:text-slate-400'}>Rent</button>
                </div>
              </div>

              {/*  */}
              <div class="space-y-2">
                <span class="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Locality</span>
                <select value={searchCity} onChange={(e) => setSearchCity(e.target.value)} class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500">
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Bangalore">Bangalore</option>
                </select>
              </div>

              {/*  */}
              <div class="space-y-2">
                <span class="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Property Category</span>
                <select value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)} class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500">
                  <option value="All">All Categories</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Duplex">Duplex</option>
                  <option value="Land">Land / Plot</option>
                  <option value="Shop">Shop / Commercial</option>
                </select>
              </div>

              {/*  */}
              <div class="space-y-2">
                <span class="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Bedrooms (BHK)</span>
                <div class="grid grid-cols-5 gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-center font-bold text-[10px]">
                  {['All', '1', '2', '3', '4'].map((b) => (
                    <button key={b} onClick={() => setSearchBhk(b)} class="py-1 rounded-lg focus:outline-none transition-colors" style={{ cursor: 'pointer' }}
                            className={searchBhk === b ? 'bg-amber-500 text-slate-950' : 'text-slate-500 dark:text-slate-400'}>{b}</button>
                  ))}
                </div>
              </div>

              {/*  */}
              <div class="space-y-2">
                <div class="flex justify-between items-center text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  <span>Max Budget Limit</span>
                  <span class="text-amber-500 font-extrabold">{formatPrice(searchBudget)}</span>
                </div>
                <input type="range" 
                       min={searchType === 'rent' ? 10000 : 1500050} 
                       max={searchType === 'rent' ? 300000 : 90000000} 
                       step={searchType === 'rent' ? 5000 : 1000000} 
                       value={searchBudget} 
                       onChange={(e) => setSearchBudget(parseInt(e.target.value))}
                       class="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none" />
              </div>

              {/*  */}
              <div class="space-y-2">
                <span class="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Keyword Search</span>
                <div class="relative">
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search Indiranagar, garden, duplex..." class="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500" />
                  <Search class="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>

            </div>

            {/* Grid of Results */}
            <div class="flex-grow flex flex-col md:w-[40%] lg:w-[45%] h-full overflow-y-auto p-6 space-y-6">
              <div class="pb-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <h2 class="font-extrabold text-lg dark:text-white flex items-center gap-2">
                    <span>Direct Listings Log</span>
                    <span class="text-xs font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">{filteredProperties.length} found</span>
                  </h2>
                  <p class="text-[9px] font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mt-0.5">Broker-free peer-to-peer catalog in {searchCity}</p>
                </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredProperties.map((p) => (
                  <PropertyCard key={p.id || (p as any)._id} property={p} />
                ))}

                {filteredProperties.length === 0 && (
                  <div class="col-span-full py-16 px-4 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl space-y-4">
                    <Home class="h-10 w-10 text-slate-450 mx-auto" />
                    <h4 class="font-extrabold text-sm dark:text-white">No properties matched filters</h4>
                    <p class="text-xs text-slate-400 max-w-xs mx-auto">Try resetting filters or adjusting budget ranges to see default listings.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Vector Map (Right) */}
            <div class="hidden md:block md:w-[30%] lg:w-[30%] bg-slate-100 dark:bg-slate-900/60 border-l border-slate-200 dark:border-slate-800 p-4 h-full relative">
              <div class="absolute inset-0 p-4 flex flex-col justify-between">
                
                <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span class="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center">
                    <Map class="h-4 w-4 mr-1 text-amber-500" /> Locality Map Coordinate Pins
                  </span>
                  <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>

                <div class="flex-grow flex items-center justify-center p-2 relative">
                  <svg viewBox="0 0 200 200" class="w-full max-w-[250px] stroke-slate-300 dark:stroke-slate-800 fill-none stroke-[1.5]">
                    <rect x="10" y="10" width="180" height="180" rx="16" class="fill-slate-50/70 dark:fill-slate-950/45" />
                    
                    <path d="M 10 60 Q 80 50 190 70" />
                    <path d="M 10 140 Q 90 130 190 120" stroke-dasharray="3 3" />
                    <path d="M 50 10 Q 70 100 60 190" />
                    <path d="M 140 10 Q 120 90 150 190" />
                    
                    {filteredProperties.map((p) => {
                      const id = (p as any)._id || p.id;
                      const active = selectedProperty && ((selectedProperty as any)._id === id || selectedProperty.id === id);
                      return (
                        <g key={id} class="cursor-pointer group" onClick={() => selectProperty(id)}>
                          <circle cx={p.coords?.x || 100} cy={p.coords?.y || 100} r="8" 
                                  className={`fill-amber-500/25 stroke-amber-500/45 stroke-[0.5] ${active ? 'animate-ping' : 'hidden'}`} />
                          <circle cx={p.coords?.x || 100} cy={p.coords?.y || 100} r="4.5" 
                                  className={active ? 'fill-red-500 scale-125' : 'fill-amber-500 hover:fill-amber-600 transition-all'} />
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <div class="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl">
                  {selectedProperty ? (
                    <div class="flex items-center space-x-3">
                      <img src={selectedProperty.images[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'} class="h-10 w-10 rounded-lg object-cover border border-slate-200 dark:border-slate-800" />
                      <div class="min-w-0 flex-grow">
                        <p class="font-extrabold text-xs truncate text-slate-900 dark:text-white">{selectedProperty.title}</p>
                        <p class="text-[9px] text-amber-500 font-extrabold uppercase mt-0.5">{formatPrice(selectedProperty.price)}</p>
                      </div>
                      <button onClick={() => navigate('details')} class="p-2 bg-amber-500 text-slate-950 rounded-xl hover:bg-amber-600 focus:outline-none transition-colors" style={{ cursor: 'pointer' }}>
                        <ChevronRight class="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <p class="text-[9px] text-slate-500 text-center font-bold uppercase tracking-wider py-1.5">Select a map pin coordinate to preview specs</p>
                  )}
                </div>

              </div>
            </div>

          </div>
        )}

        {/* 3. PROPERTY DETAILS VIEW */}
        {activeTab === 'details' && selectedProperty && (
          <div class="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in max-w-7xl mx-auto w-full">
            
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-855 pb-5">
              <div class="space-y-1">
                <button onClick={() => navigate('properties')} class="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline mb-1 focus:outline-none" style={{ cursor: 'pointer' }}>
                  <ArrowLeft class="h-3.5 w-3.5" /> <span>Return to listings</span>
                </button>
                <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{selectedProperty.title}</h1>
                <p class="text-xs text-slate-550 dark:text-slate-400 flex items-center font-medium">
                  <MapPin class="h-3.5 w-3.5 mr-1 text-amber-500" /> <span>{selectedProperty.location.address}</span>
                </p>
              </div>

              <div class="flex items-center space-x-2">
                <button onClick={() => toggleFavorite(selectedProperty.id || (selectedProperty as any)._id)} class="p-2.5 border rounded-xl flex items-center justify-center transition-all focus:outline-none border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" style={{ cursor: 'pointer' }}
                        className={isFavorite(selectedProperty.id || (selectedProperty as any)._id) ? 'bg-red-500 border-red-650 text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-100'}>
                  <Bookmark class="h-4.5 w-4.5" className={isFavorite(selectedProperty.id || (selectedProperty as any)._id) ? 'fill-white' : ''} />
                </button>

                <button onClick={() => initiateChat(selectedProperty.sellerId, selectedProperty.id || (selectedProperty as any)._id)} class="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-amber-500/10 focus:outline-none uppercase tracking-wider transition-all" style={{ cursor: 'pointer' }}>
                  <MessageSquare class="h-4.5 w-4.5" />
                  <span>Direct Chat with Landlord</span>
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div class="lg:col-span-2 space-y-6">
                
                <div class="relative aspect-video bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow">
                  <img src={selectedProperty.images[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'} class="h-full w-full object-cover" />
                  <div class="absolute bottom-4 right-4 bg-slate-955/80 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-extrabold text-white tracking-widest uppercase">
                    verified photography deed
                  </div>
                </div>

                <div class="grid grid-cols-4 gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl text-center">
                  <div>
                    <span class="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Pricing Valuation</span>
                    <p class="font-extrabold text-base text-amber-500 mt-1">{formatPrice(selectedProperty.price)}{selectedProperty.type === 'rent' ? '/mo' : ''}</p>
                  </div>
                  <div class="border-l border-slate-150 dark:border-slate-800">
                    <span class="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">BHK Rooms</span>
                    <p class="font-extrabold text-base dark:text-white mt-1">{selectedProperty.beds ? selectedProperty.beds + ' BHK' : 'N/A'}</p>
                  </div>
                  <div class="border-l border-slate-150 dark:border-slate-800">
                    <span class="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Bathrooms</span>
                    <p class="font-extrabold text-base dark:text-white mt-1">{selectedProperty.baths ? selectedProperty.baths + ' Bath' : 'N/A'}</p>
                  </div>
                  <div class="border-l border-slate-150 dark:border-slate-800">
                    <span class="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Area sq.ft</span>
                    <p class="font-extrabold text-base dark:text-white mt-1">{selectedProperty.area} sq.ft</p>
                  </div>
                </div>

                <div class="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl space-y-3">
                  <h3 class="font-extrabold text-sm dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5 flex items-center gap-1.5">
                    <FileText class="h-4.5 w-4.5 text-amber-500" /> Property Overview description
                  </h3>
                  <p class="text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-medium">{selectedProperty.description}</p>
                </div>

                <div class="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl space-y-3.5">
                  <h3 class="font-extrabold text-sm dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5 flex items-center gap-1.5">
                    <Sparkles class="h-4.5 w-4.5 text-amber-500" /> Amenities Checklist
                  </h3>
                  <div class="flex flex-wrap gap-2.5">
                    {selectedProperty.amenities.map((item) => (
                      <span key={item} class="px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-xs font-bold text-slate-700 dark:text-slate-350 rounded-xl flex items-center space-x-1.5">
                        <Check class="h-3.5 w-3.5 text-emerald-500" />
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Capital value index */}
                <div class="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl space-y-4">
                  <div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <h3 class="font-extrabold text-sm dark:text-white flex items-center gap-1.5">
                        <TrendingUp class="h-4.5 w-4.5 text-amber-500" /> Locality Capital Value Index Trends
                      </h3>
                      <p class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mt-0.5">Estimated price variations per sq.ft</p>
                    </div>
                    <span class="text-xs font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                      <ChevronRight class="h-3 w-3" /> +26% 5Y Growth
                    </span>
                  </div>

                  <div class="space-y-4 pt-2">
                    <div class="space-y-1.5">
                      <div class="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        <span>Year 2022</span>
                        <span class="font-extrabold">₹{Math.round((selectedProperty.price / selectedProperty.area) * 0.78)} / sq.ft</span>
                      </div>
                      <div class="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-850">
                        <div class="bg-slate-400 dark:bg-slate-700 h-full rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>

                    <div class="space-y-1.5">
                      <div class="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        <span>Year 2024</span>
                        <span class="font-extrabold">₹{Math.round((selectedProperty.price / selectedProperty.area) * 0.90)} / sq.ft</span>
                      </div>
                      <div class="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-850">
                        <div class="bg-slate-400 dark:bg-slate-700 h-full rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>

                    <div class="space-y-1.5">
                      <div class="flex justify-between text-[11px] font-bold text-slate-650 dark:text-slate-355">
                        <span class="text-amber-500 font-extrabold">Year 2026 (Current Value)</span>
                        <span class="text-amber-500 font-black">₹{Math.round(selectedProperty.price / selectedProperty.area)} / sq.ft</span>
                      </div>
                      <div class="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-850">
                        <div class="bg-amber-500 h-full rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calculators console */}
                <div class="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-855 rounded-2xl space-y-5">
                  <h3 class="font-extrabold text-sm dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5 flex items-center gap-1.5">
                    <Calculator class="h-4.5 w-4.5 text-amber-500" /> Estimator Console
                  </h3>

                  {selectedProperty.type === 'sale' ? (
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 dark:text-slate-300">
                      <div class="space-y-4">
                        <div class="space-y-1">
                          <div class="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-wider">
                            <span>Mortgage Principle Loan</span>
                            <span class="text-amber-500 font-extrabold">{formatPrice(mortgageLoan)}</span>
                          </div>
                          <input type="range" min="100000" max={selectedProperty.price} step="100000" value={mortgageLoan} onChange={(e) => setMortgageLoan(parseInt(e.target.value))} class="w-full h-1 bg-slate-200 dark:bg-slate-800 accent-amber-500 cursor-pointer rounded-lg appearance-none" />
                          <span class="text-[9px] text-slate-500 font-bold block">Downpayment input: {formatPrice(selectedProperty.price - mortgageLoan)}</span>
                        </div>

                        <div class="grid grid-cols-2 gap-3 pt-1">
                          <div>
                            <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Tenure</span>
                            <select value={mortgageTenure} onChange={(e) => setMortgageTenure(parseInt(e.target.value))} class="w-full p-2 bg-slate-55 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 outline-none">
                              <option value="15">15 Years</option>
                              <option value="20">20 Years</option>
                              <option value="30">30 Years</option>
                            </select>
                          </div>
                          <div>
                            <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Interest Rate</span>
                            <select value={mortgageRate} onChange={(e) => setMortgageRate(e.target.value)} class="w-full p-2 bg-slate-55 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 outline-none">
                              <option value="8.0">8.0% p.a.</option>
                              <option value="8.5">8.5% p.a.</option>
                              <option value="9.0">9.0% p.a.</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div class="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl flex flex-col justify-between">
                        <div>
                          <span class="text-[9px] uppercase font-black tracking-widest text-slate-500 dark:text-slate-400 block">Monthly Loan EMI Payment</span>
                          <span class="text-2xl font-black text-amber-500 mt-1 block">{formatPrice(calculateEmi())} /mo</span>
                        </div>
                        <p class="text-[9px] text-slate-500 leading-normal italic mt-4 border-t border-slate-200/50 dark:border-slate-800 pt-2">
                          * Compound EMI logic calculation fallback.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-650 dark:text-slate-350">
                      <div class="space-y-4">
                        <div class="space-y-1">
                          <div class="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-wider">
                            <span>Your Monthly Income</span>
                            <span class="text-amber-500 font-extrabold">{formatPrice(rentIncome)}</span>
                          </div>
                          <input type="range" min="30000" max="1000000" step="5000" value={rentIncome} onChange={(e) => setRentIncome(parseInt(e.target.value))} class="w-full h-1 bg-slate-200 dark:bg-slate-800 accent-amber-500 cursor-pointer rounded-lg appearance-none" />
                        </div>
                        <p class="text-xs font-semibold leading-relaxed">
                          Spending rule suggests keeping monthly rent below <strong class="text-white">30%</strong> of overall income.
                        </p>
                      </div>

                      <div class="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl flex flex-col justify-between">
                        <div>
                          <span class="text-[9px] uppercase font-black tracking-widest text-slate-500 dark:text-slate-400 block">Recommended Rent Limit</span>
                          <span class="text-xl font-black text-emerald-500 mt-1 block">{formatPrice(Math.round(rentIncome * 0.3))} /mo</span>
                        </div>
                        <div class="text-[9px] font-bold mt-3" className={selectedProperty.price <= (rentIncome * 0.3) ? 'text-emerald-500' : 'text-rose-500'}>
                          {selectedProperty.price <= (rentIncome * 0.3) ? (
                            <span>✓ Affordable: Rent sits within budget bounds.</span>
                          ) : (
                            <span>✕ Exceeds suggestion: Rent requires {Math.round((selectedProperty.price / rentIncome) * 100)}% of income.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Sidebar owner connect */}
              <div class="space-y-6">
                <div class="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl shadow-xl space-y-6">
                  
                  <div class="flex items-center space-x-3.5 pb-4 border-b border-slate-150 dark:border-slate-800">
                    <img src={selectedProperty.images[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'} class="h-11 w-11 rounded-full object-cover border border-amber-500/35" />
                    <div>
                      <h4 class="font-extrabold text-sm dark:text-white">{selectedProperty.sellerName}</h4>
                      <span class="text-[10px] text-emerald-500 font-extrabold flex items-center mt-0.5">
                        <CheckCircle class="h-3.5 w-3.5 mr-0.5" /> Direct Verified Landlord
                      </span>
                    </div>
                  </div>

                  <div class="p-4 bg-slate-50 dark:bg-slate-955/60 border border-slate-200 dark:border-slate-850 rounded-xl space-y-3">
                    <div class="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-slate-500 dark:text-slate-400">
                      <span>Legal audit checklists</span>
                      <span class="text-emerald-500 font-extrabold flex items-center uppercase"><CheckCircle class="h-3.5 w-3.5 mr-0.5" /> Cleared</span>
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-[9px] font-extrabold text-slate-700 dark:text-slate-350">
                      <span class="flex items-center"><CheckCircle class="h-3.5 w-3.5 text-emerald-500 mr-1 shrink-0" /> A-Khata Title</span>
                      <span class="flex items-center"><CheckCircle class="h-3.5 w-3.5 text-emerald-500 mr-1 shrink-0" /> RERA Checked</span>
                      <span class="flex items-center"><CheckCircle class="h-3.5 w-3.5 text-emerald-500 mr-1 shrink-0" /> Nil Encumbrance</span>
                      <span class="flex items-center"><CheckCircle class="h-3.5 w-3.5 text-emerald-500 mr-1 shrink-0" /> Tax Clearance</span>
                    </div>
                  </div>

                  <div class="space-y-3">
                    <button onClick={() => initiateChat(selectedProperty.sellerId, selectedProperty.id || (selectedProperty as any)._id)} class="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/10 focus:outline-none uppercase tracking-wider transition-all" style={{ cursor: 'pointer' }}>
                      <MessageSquare class="h-4.5 w-4.5" />
                      <span>Negotiate Terms & Price</span>
                    </button>

                    <button onClick={() => bookVisit(selectedProperty.id || (selectedProperty as any)._id)} class="w-full py-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-350 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all focus:outline-none uppercase tracking-wider" style={{ cursor: 'pointer' }}>
                      <Calendar class="h-4.5 w-4.5" />
                      <span>Schedule Site Visit</span>
                    </button>

                    <a href={`https://api.whatsapp.com/send?phone=${selectedProperty.sellerPhone}&text=Hi%20${encodeURIComponent(selectedProperty.sellerName)},%20I%20am%20interested%20in%20your%20property%20on%20Owner2Buyer.`}
                       target="_blank"
                       class="w-full py-3 border border-emerald-500/40 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all focus:outline-none uppercase tracking-wider">
                      <Phone class="h-4.5 w-4.5 text-emerald-500" />
                      <span>WhatsApp Direct Connect</span>
                    </a>
                  </div>

                </div>
              </div>

            </div>

          </div>
        )}

        {/* 4. P2P MESSAGING & E-STAMP CONTRACT SIGNER */}
        {activeTab === 'chat' && (
          <div class="flex-grow max-w-7xl mx-auto w-full px-4 py-6 flex flex-col md:flex-row h-[calc(100vh-64px)] gap-6 overflow-hidden animate-fade-in">
            
            {/* Thread select sidebar */}
            <div class="w-full md:w-[32%] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col overflow-hidden shadow-sm">
              <h3 class="font-extrabold text-sm dark:text-white mb-4 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <Inbox class="h-4.5 w-4.5 text-amber-500" /> Direct Negotiations Inbox
              </h3>

              <div class="flex-grow overflow-y-auto space-y-2">
                <button onClick={() => { setActiveRecipientId('user_1'); setActivePropertyId('prop_2'); }}
                        class="w-full flex items-center space-x-3.5 p-3 rounded-xl transition-all border text-left focus:outline-none border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/45"
                        className={activeRecipientId === 'user_1' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-transparent border-transparent'}>
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" class="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-800 shrink-0" />
                  <div class="flex-grow min-w-0">
                    <div class="flex justify-between items-center">
                      <p class="font-extrabold text-xs truncate text-slate-900 dark:text-white">Anjali Sharma</p>
                      <span class="text-[9px] font-bold text-slate-400">10:45 AM</span>
                    </div>
                    <p class="text-[9px] font-black text-amber-500 uppercase mt-0.5">Owner • Modern 2BHK flat in Hitech City</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Messaging log */}
            <div class="flex-grow bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-sm">
              {activeRecipientId ? (
                <div class="flex-grow flex flex-col h-full overflow-hidden">
                  
                  <div class="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <img src={activeRecipient().avatar} class="h-10 w-10 rounded-full object-cover border border-amber-500/35" />
                      <div>
                        <h4 class="font-extrabold text-sm dark:text-white">{activeRecipient().name}</h4>
                        <p class="text-[10px] text-emerald-500 font-extrabold flex items-center mt-0.5">
                          <CheckCircle class="h-3.5 w-3.5 mr-0.5" /> Connected Directly
                        </p>
                      </div>
                    </div>

                    <div class="flex items-center space-x-2">
                      <button onClick={handleOpenAgreementBuilder} class="flex items-center space-x-1.5 px-4.5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs shadow-md shadow-amber-500/10 transition-all focus:outline-none uppercase tracking-wider" style={{ cursor: 'pointer' }}>
                        <FileSignature class="h-4 w-4" />
                        <span>Draft Stamp deed</span>
                      </button>
                    </div>
                  </div>

                  {/* Messages Feed */}
                  <div class="flex-grow p-5 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-955/35">
                    {chatMessages.map((m) => {
                      const isOwnerMsg = m.senderId === user?.id;
                      const isAgreement = m.text.startsWith('📜');
                      
                      return (
                        <div key={m.id || (m as any)._id} class="flex" className={isOwnerMsg ? 'justify-end' : 'justify-start'}>
                          {isAgreement ? (
                            (() => {
                              const details = JSON.parse(m.text.replace('📜', ''));
                              const id = (m as any)._id || m.id;
                              
                              return (
                                <div class="p-4 bg-slate-900 text-slate-105 rounded-3xl border-2 border-amber-500/35 space-y-4 max-w-sm sm:max-w-md shadow-2xl text-left dark glow-border">
                                  <div class="border-2 border-slate-700/80 p-3 rounded-2xl bg-amber-955/20 text-center space-y-1 relative overflow-hidden">
                                    <span class="text-[8px] font-black tracking-widest text-amber-500 uppercase block">Government of National Capital Territory of Delhi</span>
                                    <h5 class="text-[11px] font-black text-slate-100 uppercase tracking-widest leading-none">Certificate of Lease Deed Agreement</h5>
                                    <div class="flex items-center justify-between text-[7px] text-slate-500 font-mono mt-2.5 px-1">
                                      <span>CERTIFICATE NO: IN-DL983048509823V</span>
                                      <span>DUTY PAID: ₹{details.stampDuty}</span>
                                    </div>
                                  </div>

                                  <div class="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[10px] font-medium text-slate-300 border-b border-slate-850 pb-3">
                                    <div>
                                      <span class="text-slate-500 text-[8px] uppercase font-black tracking-wider block">First Party (Lessor/Owner)</span>
                                      <span class="font-extrabold text-slate-200">{details.landlord}</span>
                                    </div>
                                    <div>
                                      <span class="text-slate-500 text-[8px] uppercase font-black tracking-wider block">Second Party (Lessee/Tenant)</span>
                                      <span class="font-extrabold text-slate-200">{details.tenant}</span>
                                    </div>
                                    <div class="col-span-2">
                                      <span class="text-slate-500 text-[8px] uppercase font-black tracking-wider block">Property Address</span>
                                      <span class="font-extrabold text-slate-200">{details.propertyAddress}</span>
                                    </div>
                                  </div>

                                  <div class="grid grid-cols-3 gap-2.5 bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-center">
                                    <div>
                                      <span class="text-[8px] text-slate-500 uppercase font-black tracking-wider block">Rent Price</span>
                                      <span class="font-extrabold text-amber-500 text-xs">₹{details.rent?.toLocaleString()}</span>
                                    </div>
                                    <div class="border-x border-slate-800">
                                      <span class="text-[8px] text-slate-550 uppercase font-black tracking-wider block">Security Deposit</span>
                                      <span class="font-extrabold text-slate-200 text-xs">₹{details.deposit?.toLocaleString()}</span>
                                    </div>
                                    <div>
                                      <span class="text-[8px] text-slate-550 uppercase font-black tracking-wider block">Deed Period</span>
                                      <span class="font-extrabold text-slate-200 text-xs">{details.duration} Mo</span>
                                    </div>
                                  </div>

                                  <div class="space-y-4 pt-1">
                                    <div class="flex justify-between items-center text-[9px] text-slate-405 font-bold uppercase tracking-wider">
                                      <span>Commences: <strong class="text-slate-200">{details.commencementDate}</strong></span>
                                      <span>Notice Period: <strong class="text-slate-200">{details.notice} Mo</strong></span>
                                    </div>

                                    <div class="grid grid-cols-2 gap-3 pt-1">
                                      <div class="flex flex-col space-y-1.5">
                                        <button onClick={() => signAgreement(id, 'landlord')} 
                                                disabled={details.signatures.landlordSigned || user?.name !== details.landlord}
                                                class="p-2.5 rounded-xl text-[10px] font-black border transition-all text-center flex items-center justify-center gap-1 focus:outline-none" style={{ cursor: 'pointer' }}
                                                className={details.signatures.landlordSigned ? 'bg-slate-800 text-emerald-450 border-slate-700' : (user?.name === details.landlord ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-600 shadow' : 'bg-slate-955 text-slate-600 border-slate-800/80 cursor-not-allowed')}>
                                          <Check class="h-3.5 w-3.5" />
                                          <span>{details.signatures.landlordSigned ? 'Owner Signed ✓' : 'Sign as Owner'}</span>
                                        </button>
                                        <span class="text-[8px] text-slate-500 text-center font-bold">Requires switch to Anjali</span>
                                      </div>

                                      <div class="flex flex-col space-y-1.5">
                                        <button onClick={() => signAgreement(id, 'tenant')} 
                                                disabled={details.signatures.tenantSigned || user?.name !== details.tenant}
                                                class="p-2.5 rounded-xl text-[10px] font-black border transition-all text-center flex items-center justify-center gap-1 focus:outline-none" style={{ cursor: 'pointer' }}
                                                className={details.signatures.tenantSigned ? 'bg-slate-800 text-emerald-450 border-slate-700' : (user?.name === details.tenant ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-600 shadow' : 'bg-slate-955 text-slate-600 border-slate-800/80 cursor-not-allowed')}>
                                          <Check class="h-3.5 w-3.5" />
                                          <span>{details.signatures.tenantSigned ? 'Tenant Signed ✓' : 'Sign as Tenant'}</span>
                                        </button>
                                        <span class="text-[8px] text-slate-500 text-center font-bold">Requires switch to Rahul</span>
                                      </div>
                                    </div>

                                    {details.signatures.landlordSigned && details.signatures.tenantSigned && (
                                      <div class="p-2 bg-emerald-500/10 border border-emerald-500/35 rounded-xl text-center text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                                        ✓ fully Executed Deed Agreement
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })()
                          ) : (
                            <div class="max-w-[75%] px-4 py-3 rounded-2xl text-xs shadow-sm font-medium"
                                 className={isOwnerMsg ? 'bg-amber-500 text-slate-950 rounded-tr-none' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-855 text-slate-900 dark:text-slate-200 rounded-tl-none'}>
                              <p class="leading-relaxed">{m.text}</p>
                              <span class="text-[8px] text-slate-450 dark:text-slate-500 mt-1 block text-right font-bold">Sent 10:45 AM</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Chat Input form */}
                  <form onSubmit={handleSendMessage} class="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center space-x-2">
                    <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type a message to negotiate details..." class="flex-grow px-4 py-3 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl focus:outline-none focus:border-amber-500 text-slate-900 dark:text-slate-200 font-medium" />
                    <button type="submit" class="p-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl focus:outline-none" style={{ cursor: 'pointer' }}><MessageSquare class="h-4.5 w-4.5" /></button>
                  </form>
                </div>
              ) : (
                <div class="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <MessageSquare class="h-12 w-12 text-slate-400" />
                  <h4 class="font-extrabold text-sm dark:text-white">Start a Direct Negotiation</h4>
                  <p class="text-xs text-slate-400 max-w-xs mx-auto">Select a chat inbox thread to negotiate rates and draft agreements.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* 5. DASHBOARD VIEW */}
        {activeTab === 'dashboard' && user && (
          <div class="flex-grow max-w-7xl mx-auto w-full px-4 py-8 space-y-8 animate-fade-in">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-850">
              <div>
                <h2 class="text-xl font-black dark:text-white">{user.role === 'seller' ? 'Owner Listing Dashboard' : 'Direct Buyer Dashboard'}</h2>
                <p class="text-xs text-slate-500 dark:text-slate-450 font-semibold mt-0.5">Track listing activity, commission savings, and site visits leads</p>
              </div>
              <span class="px-3 py-1 bg-amber-500/10 border border-amber-500/25 text-amber-650 dark:text-amber-400 font-black rounded-xl text-xs uppercase tracking-widest shadow-sm">
                verified account
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-900 dark:text-white">
              <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 rounded-2xl flex items-center justify-between shadow-sm">
                <div class="space-y-1">
                  <span class="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider block">Brokerage Saved</span>
                  <span class="text-2xl font-black text-amber-500">{user.role === 'seller' ? '₹1,85,000' : '₹90,000'}</span>
                </div>
                <div class="h-10 w-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
                  <PiggyBank class="h-5 w-5" />
                </div>
              </div>

              <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 rounded-2xl flex items-center justify-between shadow-sm">
                <div class="space-y-1">
                  <span class="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider block">Inspections Booked</span>
                  <span class="text-2xl font-black">{visitsLog.length} tours</span>
                </div>
                <div class="h-10 w-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
                  <Calendar class="h-5 w-5" />
                </div>
              </div>

              <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 rounded-2xl flex items-center justify-between shadow-sm">
                <div class="space-y-1">
                  <span class="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider block">Active listed properties</span>
                  <span class="text-2xl font-black">{user.role === 'seller' ? properties.filter(p => p.sellerId === user.id).length : 0} Listings</span>
                </div>
                <div class="h-10 w-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
                  <Home class="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Listed Property status log */}
            <div class="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="font-extrabold text-sm dark:text-white flex items-center gap-1.5">
                  <LayoutDashboard class="h-4.5 w-4.5 text-amber-500" /> Property Status Log
                </h3>
                <button onClick={() => setShowAddPropertyModal(true)} class="px-3 py-1.5 bg-amber-500 text-slate-950 font-black rounded-lg text-[10px] uppercase tracking-wider focus:outline-none" style={{ cursor: 'pointer' }}>
                  Add listing
                </button>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full text-xs text-left text-slate-600 dark:text-slate-305">
                  <thead class="text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-200 dark:border-slate-800 font-black">
                    <tr>
                      <th scope="col" class="py-3 px-4">Listed Property</th>
                      <th scope="col" class="py-3 px-4">Transaction</th>
                      <th scope="col" class="py-3 px-4">City</th>
                      <th scope="col" class="py-3 px-4">Price / Rent</th>
                      <th scope="col" class="py-3 px-4">Owner Name</th>
                      <th scope="col" class="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80 font-semibold">
                    {properties.map((p) => (
                      <tr key={p.id || (p as any)._id}>
                        <td class="py-4 px-4 font-extrabold text-slate-900 dark:text-white">{p.title}</td>
                        <td class="py-4 px-4 uppercase text-[10px] text-slate-500">{p.type}</td>
                        <td class="py-4 px-4">{p.location.city}</td>
                        <td class="py-4 px-4 font-bold text-amber-500">{formatPrice(p.price)}{p.type === 'rent' ? '/mo' : ''}</td>
                        <td class="py-4 px-4">{p.sellerName}</td>
                        <td class="py-4 px-4">
                          <span class="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Active</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 6. SITE VISITS TAB */}
        {activeTab === 'visits' && (
          <div class="flex-grow max-w-7xl mx-auto w-full px-4 py-8 space-y-6 animate-fade-in">
            <div class="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-850">
              <div>
                <h2 class="text-xl font-black dark:text-white">Site Visits Logbook</h2>
                <p class="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">Track inspect bookings scheduled between buyer and owner parties</p>
              </div>
            </div>

            <div class="space-y-4">
              {visitsLog.map((v) => {
                const id = (v as any)._id || v.id;
                return (
                  <div key={id} class="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-855 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div class="flex items-center space-x-4">
                      <div class="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/15">
                        <Calendar class="h-5 w-5" />
                      </div>
                      <div>
                        <h4 class="font-extrabold text-sm dark:text-white">{pAddress(v.propertyId)}</h4>
                        <div class="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                          <span class="flex items-center"><Clock class="h-3.5 w-3.5 mr-1 text-slate-450" /> Date: {v.date}</span>
                          <span class="flex items-center"><User class="h-3.5 w-3.5 mr-1 text-slate-450" /> Visitor: {v.buyerName}</span>
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
                      <span class="text-xs font-bold px-3 py-1 rounded-xl border uppercase tracking-wider text-[10px]"
                            className={v.status === 'Approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-650 dark:text-emerald-450' : 'bg-amber-500/10 border-amber-500/20 text-amber-650 dark:text-amber-450'}>
                        {v.status}
                      </span>

                      {v.status === 'Pending Approval' && user?.role === 'seller' && (
                        <div class="flex items-center space-x-2">
                          <button onClick={() => updateVisitStatus(id, 'Approved')} class="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-650 text-slate-950 font-black rounded-lg text-[10px] uppercase tracking-wider focus:outline-none transition-colors" style={{ cursor: 'pointer' }}>Approve</button>
                          <button onClick={() => updateVisitStatus(id, 'Declined')} class="px-3 py-1.5 bg-slate-100 hover:bg-slate-205 dark:bg-slate-950 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350 font-bold rounded-lg text-[10px] uppercase tracking-wider focus:outline-none border border-slate-200 dark:border-slate-800" style={{ cursor: 'pointer' }}>Decline</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {visitsLog.length === 0 && (
                <div class="py-16 px-4 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl space-y-3">
                  <Calendar class="h-8 w-8 text-slate-450 mx-auto" />
                  <p class="text-xs text-slate-500 font-bold uppercase">No site tour inspection bookings logged</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* MODAL 1: ADD PROPERTY MODAL */}
        {showAddPropertyModal && (
          <div class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto text-left">
              
              <div class="flex items-center justify-between border-b border-slate-150 dark:border-slate-850 pb-3.5 mb-5">
                <h3 class="font-extrabold text-base dark:text-white flex items-center gap-1.5">
                  <PlusCircle class="h-5 w-5 text-amber-500" /> List Your Property (Land, House, Shop)
                </h3>
                <button onClick={() => setShowAddPropertyModal(false)} class="text-slate-400 hover:text-slate-650 dark:hover:text-white focus:outline-none" style={{ cursor: 'pointer' }}>✕</button>
              </div>

              <form onSubmit={handleAddPropertySubmit} class="space-y-4 text-xs text-slate-700 dark:text-slate-300">
                <div class="space-y-1.5">
                  <label class="block font-black uppercase text-[9px] tracking-wider text-slate-500 dark:text-slate-405">Listing Title / Headline</label>
                  <input type="text" value={newProp.title} onChange={(e) => setNewProp(prev => ({ ...prev, title: e.target.value }))} placeholder="e.g. Spacious 2BHK Flat with Balcony in Hitech City" required class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-bold" />
                </div>

                <div class="space-y-1.5">
                  <label class="block font-black uppercase text-[9px] tracking-wider text-slate-500 dark:text-slate-405">Description Details</label>
                  <textarea value={newProp.description} onChange={(e) => setNewProp(prev => ({ ...prev, description: e.target.value }))} placeholder="Provide details about rooms, location perks, zero broker terms..." required rows={3} class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-medium"></textarea>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div class="space-y-1.5">
                    <label class="block font-black uppercase text-[9px] tracking-wider text-slate-500 dark:text-slate-405">Transaction Mode</label>
                    <select value={newProp.type} onChange={(e) => setNewProp(prev => ({ ...prev, type: e.target.value as any }))} class="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 outline-none">
                      <option value="sale">For Sale (Buy)</option>
                      <option value="rent">For Rent</option>
                    </select>
                  </div>
                  
                  <div class="space-y-1.5">
                    <label class="block font-black uppercase text-[9px] tracking-wider text-slate-500 dark:text-slate-405">Property Category</label>
                    <select value={newProp.category} onChange={(e) => setNewProp(prev => ({ ...prev, category: e.target.value as any }))} class="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 outline-none">
                      <option value="Apartment">Apartment / Flat</option>
                      <option value="Villa">Independent Villa</option>
                      <option value="Duplex">Duplex House</option>
                      <option value="Land">Land / Plot Area</option>
                      <option value="Shop">Commercial Shop</option>
                    </select>
                  </div>

                  <div class="space-y-1.5">
                    <label class="block font-black uppercase text-[9px] tracking-wider text-slate-500 dark:text-slate-405">Locality City</label>
                    <select value={newProp.city} onChange={(e) => setNewProp(prev => ({ ...prev, city: e.target.value }))} class="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 outline-none">
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Bangalore">Bangalore</option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div class="space-y-1.5">
                    <label class="block font-black uppercase text-[9px] tracking-wider text-slate-500 dark:text-slate-405">Price / Rent (₹)</label>
                    <input type="number" value={newProp.price} onChange={(e) => setNewProp(prev => ({ ...prev, price: e.target.value }))} placeholder="Valuation ₹" required class="w-full px-3 py-2.5 bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-extrabold" />
                  </div>

                  <div class="space-y-1.5">
                    <label class="block font-black uppercase text-[9px] tracking-wider text-slate-500 dark:text-slate-405">Area (sq.ft)</label>
                    <input type="number" value={newProp.area} onChange={(e) => setNewProp(prev => ({ ...prev, area: e.target.value }))} placeholder="sq.ft size" required class="w-full px-3 py-2.5 bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-bold" />
                  </div>

                  <div class="space-y-1.5">
                    <label class="block font-black uppercase text-[9px] tracking-wider text-slate-500 dark:text-slate-405">BHK Beds</label>
                    <input type="number" value={newProp.beds} onChange={(e) => setNewProp(prev => ({ ...prev, beds: e.target.value }))} placeholder="e.g. 3" class="w-full px-3 py-2.5 bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-bold" />
                  </div>

                  <div class="space-y-1.5">
                    <label class="block font-black uppercase text-[9px] tracking-wider text-slate-500 dark:text-slate-405">Bathrooms</label>
                    <input type="number" value={newProp.baths} onChange={(e) => setNewProp(prev => ({ ...prev, baths: e.target.value }))} placeholder="e.g. 2" class="w-full px-3 py-2.5 bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-bold" />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="block font-black uppercase text-[9px] tracking-wider text-slate-500 dark:text-slate-405">Exact Address</label>
                    <input type="text" value={newProp.address} onChange={(e) => setNewProp(prev => ({ ...prev, address: e.target.value }))} placeholder="Sector, road number, etc..." required class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-xl text-slate-905 dark:text-white focus:outline-none focus:border-amber-500 font-semibold" />
                  </div>

                  <div class="space-y-1.5">
                    <label class="block font-black uppercase text-[9px] tracking-wider text-slate-500 dark:text-slate-405">Image Link URL</label>
                    <input type="url" value={newProp.imageUrl} onChange={(e) => setNewProp(prev => ({ ...prev, imageUrl: e.target.value }))} placeholder="http://url..." class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-xl text-slate-905 dark:text-white focus:outline-none focus:border-amber-500 font-medium" />
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="block font-black uppercase text-[9px] tracking-wider text-slate-500 dark:text-slate-405">Select Amenities</label>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 font-bold text-xs text-slate-700 dark:text-slate-350">
                    {['Gym', 'Power Backup', 'Security', 'Water Facility'].map(a => (
                      <label key={a} class="flex items-center space-x-1.5"><input type="checkbox" checked={newProp.amenitiesList.includes(a)} onChange={() => handleCheckboxChange(a)} class="rounded accent-amber-500" /> <span>{a}</span></label>
                    ))}
                  </div>
                </div>

                <button type="submit" class="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl uppercase tracking-wider transition-all shadow-lg focus:outline-none" style={{ cursor: 'pointer' }}>
                  Publish Direct Listing
                </button>
              </form>

            </div>
          </div>
        )}

        {/* MODAL 2: AGREEMENT STAMP DEED MODAL */}
        {showAgreementModal && (
          <div class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto text-left">
              
              <div class="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-3 mb-4">
                <h4 class="font-bold text-sm dark:text-white flex items-center gap-1.5">
                  <FileText class="h-4.5 w-4.5 text-amber-500" /> Draft Peer-to-Peer Lease Deed
                </h4>
                <button onClick={() => setShowAgreementModal(false)} class="text-slate-450 hover:text-slate-650 dark:hover:text-white focus:outline-none" style={{ cursor: 'pointer' }}>✕</button>
              </div>

              <form onSubmit={handlePostAgreement} class="space-y-4 text-xs text-slate-700 dark:text-slate-350">
                <div class="space-y-2">
                  <label class="block font-black uppercase text-[9px] tracking-wider text-slate-500 dark:text-slate-400">Stamp Duty Value</label>
                  <div class="grid grid-cols-3 gap-2.5">
                    {[100, 200, 500].map(val => (
                      <button key={val} type="button" onClick={() => setAgreementStamp(val)} class="py-2.5 border rounded-xl font-bold transition-all focus:outline-none" style={{ cursor: 'pointer' }}
                              className={agreementStamp === val ? 'bg-amber-500 text-slate-950 border-amber-600' : 'bg-slate-50 dark:bg-slate-955 border-slate-200 dark:border-slate-800'}>₹{val}</button>
                    ))}
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="block font-black uppercase text-[9px] tracking-wider text-slate-500 dark:text-slate-400">Monthly Rent (₹)</label>
                    <input type="number" value={agreementRent} onChange={(e) => setAgreementRent(parseInt(e.target.value))} class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-xl focus:outline-none focus:border-amber-500 font-extrabold text-slate-900 dark:text-white" />
                  </div>
                  <div class="space-y-1.5">
                    <label class="block font-black uppercase text-[9px] tracking-wider text-slate-550 dark:text-slate-400">Security Deposit (₹)</label>
                    <input type="number" value={agreementDeposit} onChange={(e) => setAgreementDeposit(parseInt(e.target.value))} class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-xl focus:outline-none focus:border-amber-500 font-extrabold text-slate-900 dark:text-white" />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="block font-black uppercase text-[9px] tracking-wider text-slate-500 dark:text-slate-400">Notice Period (Months)</label>
                    <input type="number" value={agreementNotice} onChange={(e) => setAgreementNotice(parseInt(e.target.value))} class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-xl focus:outline-none focus:border-amber-500 font-bold text-slate-900 dark:text-white" />
                  </div>
                  <div class="space-y-1.5">
                    <label class="block font-black uppercase text-[9px] tracking-wider text-slate-500 dark:text-slate-400">Commencement Date</label>
                    <input type="date" value={agreementCommencement} onChange={(e) => setAgreementCommencement(e.target.value)} class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-xl focus:outline-none focus:border-amber-500 font-bold text-slate-900 dark:text-white" />
                  </div>
                </div>

                <button type="submit" class="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-955 font-black rounded-xl uppercase tracking-wider transition-all focus:outline-none shadow" style={{ cursor: 'pointer' }}>
                  Generate Stamp Certificate
                </button>
              </form>

            </div>
          </div>
        )}

      </main>

      <Footer />
    </>
  );
}
