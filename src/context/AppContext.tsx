'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property, Visit, ChatMessage } from '@/lib/mockData';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller';
  avatar: string;
}

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  activeTab: string;
  navigate: (tab: string) => void;
  user: UserInfo | null;
  token: string | null;
  login: (userData: UserInfo, token: string) => void;
  logout: () => void;
  toggleRole: () => void;
  properties: Property[];
  fetchProperties: (filters?: any) => Promise<void>;
  addProperty: (propData: any) => Promise<boolean>;
  selectedProperty: Property | null;
  selectProperty: (id: string) => void;
  activeRecipientId: string | null;
  setActiveRecipientId: (id: string | null) => void;
  activePropertyId: string | null;
  setActivePropertyId: (id: string | null) => void;
  chatMessages: ChatMessage[];
  fetchMessages: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  postAgreement: (details: any) => Promise<void>;
  signAgreement: (msgId: string, role: 'landlord' | 'tenant') => Promise<void>;
  visitsLog: Visit[];
  fetchVisits: () => Promise<void>;
  bookVisit: (propId: string) => Promise<void>;
  updateVisitStatus: (visitId: string, status: 'Approved' | 'Declined') => Promise<void>;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [user, setUser] = useState<UserInfo | null>({
    id: 'user_2',
    name: 'Rahul Verma',
    role: 'buyer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  });
  const [token, setToken] = useState<string | null>(null);

  // States from API
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeRecipientId, setActiveRecipientId] = useState<string | null>(null);
  const [activePropertyId, setActivePropertyId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [visitsLog, setVisitsLog] = useState<Visit[]>([]);
  const [favorites, setFavorites] = useState<string[]>(['prop_2']);

  // Mount effects
  useEffect(() => {
    // Sync class list for dark mode
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    fetchProperties();
    fetchVisits();
  }, []);

  useEffect(() => {
    if (activeRecipientId) {
      fetchMessages();
      
      // Auto-poll messages in mock real-time mode every 3 seconds
      const timer = setInterval(() => {
        fetchMessages();
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [activeRecipientId]);

  // Actions
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const navigate = (tab: string) => {
    setActiveTab(tab);
  };

  const login = (userData: UserInfo, sessionToken: string) => {
    setUser(userData);
    setToken(sessionToken);
    localStorage.setItem('o2b_user', JSON.stringify(userData));
    localStorage.setItem('o2b_token', sessionToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('o2b_user');
    localStorage.removeItem('o2b_token');
    navigate('home');
  };

  const toggleRole = () => {
    if (!user) return;
    const newRole = user.role === 'buyer' ? 'seller' : 'buyer';
    const newName = newRole === 'seller' ? 'Anjali Sharma' : 'Rahul Verma';
    const newAvatar = newRole === 'seller' 
      ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' 
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150';
    
    const updated = { ...user, role: newRole, name: newName, avatar: newAvatar };
    setUser(updated);
  };

  const fetchProperties = async (filters: any = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== 'All' && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });

      const res = await fetch(`/api/properties?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProperties(data);
      }
    } catch (err) {
      console.error('Fetch properties error:', err);
    }
  };

  const addProperty = async (propData: any): Promise<boolean> => {
    if (!user) return false;
    try {
      const payload = {
        ...propData,
        sellerId: user.id,
        sellerName: user.name,
        sellerPhone: '9876543210'
      };
      
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await fetchProperties();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Add property error:', err);
      return false;
    }
  };

  const selectProperty = (id: string) => {
    const prop = properties.find(p => p.id === id || (p as any)._id === id);
    if (prop) {
      setSelectedProperty(prop);
      setActivePropertyId(prop.id);
      navigate('details');
    }
  };

  const fetchMessages = async () => {
    if (!user || !activeRecipientId) return;
    try {
      const res = await fetch(`/api/messages?senderId=${user.id}&receiverId=${activeRecipientId}`);
      if (res.ok) {
        const data = await res.json();
        setChatMessages(data);
      }
    } catch (err) {
      console.error('Fetch messages error:', err);
    }
  };

  const sendMessage = async (text: string) => {
    if (!user || !activeRecipientId || !text.trim()) return;
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: activeRecipientId,
          text
        })
      });

      if (res.ok) {
        await fetchMessages();
      }
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  const postAgreement = async (details: any) => {
    if (!user || !activeRecipientId) return;
    const doc = {
      ...details,
      landlord: user.role === 'seller' ? user.name : activeRecipientName(),
      tenant: user.role === 'seller' ? activeRecipientName() : user.name,
      propertyAddress: properties.find(p => p.id === activePropertyId || (p as any)._id === activePropertyId)?.location.address || 'Direct Locality Address',
      signatures: { 
        landlordSigned: user.role === 'seller', 
        tenantSigned: user.role === 'buyer' 
      }
    };

    await sendMessage('📜' + JSON.stringify(doc));
  };

  const signAgreement = async (msgId: string, role: 'landlord' | 'tenant') => {
    const msg = chatMessages.find(m => m.id === msgId || (m as any)._id === msgId);
    if (!msg) return;

    const details = JSON.parse(msg.text.replace('📜', ''));
    if (role === 'landlord') details.signatures.landlordSigned = true;
    if (role === 'tenant') details.signatures.tenantSigned = true;

    const updatedText = '📜' + JSON.stringify(details);
    const id = (msg as any)._id || msg.id;

    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: updatedText })
      });

      if (res.ok) {
        await fetchMessages();
        
        // Trigger confetti celebration on full signature execution
        if (details.signatures.landlordSigned && details.signatures.tenantSigned) {
          const confetti = (window as any).confetti;
          if (confetti) {
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
          }
        }
      }
    } catch (err) {
      console.error('Sign agreement error:', err);
    }
  };

  const fetchVisits = async () => {
    try {
      const res = await fetch('/api/visits');
      if (res.ok) {
        const data = await res.json();
        setVisitsLog(data);
      }
    } catch (err) {
      console.error('Fetch visits error:', err);
    }
  };

  const bookVisit = async (propId: string) => {
    if (!user) return;
    try {
      const res = await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: propId,
          buyerId: user.id,
          buyerName: user.name,
        })
      });

      if (res.ok) {
        await fetchVisits();
        navigate('visits');
      }
    } catch (err) {
      console.error('Book visit error:', err);
    }
  };

  const updateVisitStatus = async (visitId: string, status: 'Approved' | 'Declined') => {
    try {
      const res = await fetch(`/api/visits/${visitId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        await fetchVisits();
      }
    } catch (err) {
      console.error('Update visit status error:', err);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const activeRecipientName = (): string => {
    if (activeRecipientId === 'user_1') return 'Anjali Sharma';
    if (activeRecipientId === 'user_2') return 'Rahul Verma';
    if (activeRecipientId === 'user_3') return 'Vikram Reddy';
    if (activeRecipientId === 'user_4') return 'Karthik Rao';
    return 'Direct Owner';
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme, activeTab, navigate,
      user, token, login, logout, toggleRole,
      properties, fetchProperties, addProperty,
      selectedProperty, selectProperty,
      activeRecipientId, setActiveRecipientId,
      activePropertyId, setActivePropertyId,
      chatMessages, fetchMessages, sendMessage, postAgreement, signAgreement,
      visitsLog, fetchVisits, bookVisit, updateVisitStatus,
      favorites, toggleFavorite, isFavorite
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
