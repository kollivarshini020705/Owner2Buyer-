'use client';

import React from 'react';
import { Property } from '@/lib/mockData';
import { useApp } from '@/context/AppContext';
import { MapPin, Bed, Maximize2 } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { selectProperty, formatPrice } = useApp();

  const id = (property as any)._id || property.id;

  return (
    <div onClick={() => selectProperty(id)} class="group rounded-3xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900/40 overflow-hidden hover:shadow-xl hover:border-amber-500/35 transition-all duration-300 flex flex-col cursor-pointer">
      
      {/* Thumbnail */}
      <div class="relative aspect-[16/10] bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img src={property.images[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'} class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        
        <span class="absolute top-4 left-4 px-2.5 py-1 rounded-xl text-[9px] font-black bg-slate-950 text-white tracking-widest uppercase shadow-md">
          verified title
        </span>

        <div class="absolute bottom-4 left-4 bg-slate-950/90 backdrop-blur-sm border border-slate-800/60 px-3 py-1.5 rounded-xl shadow">
          <span class="text-amber-500 font-extrabold text-sm">
            {formatPrice(property.price)}{property.type === 'rent' ? '/mo' : ''}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div class="p-5 space-y-4 flex-grow flex flex-col justify-between">
        <div class="space-y-1.5">
          <span class="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">
            {property.category} • {property.location.city}
          </span>
          <h3 class="font-extrabold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-amber-500 transition-colors">
            {property.title}
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 flex items-center font-medium">
            <MapPin class="h-3.5 w-3.5 mr-1 text-amber-500 shrink-0" />
            <span class="truncate">{property.location.address}</span>
          </p>
        </div>

        {/* Specs footer row */}
        <div class="flex justify-between items-center pt-3.5 border-t border-slate-150 dark:border-slate-800/80">
          <div class="flex items-center space-x-3.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
            <span class="flex items-center"><Bed class="h-3.5 w-3.5 mr-1 text-slate-400" /> <span>{property.beds ? property.beds + ' BHK' : 'N/A'}</span></span>
            <span class="flex items-center"><Maximize2 class="h-3.5 w-3.5 mr-1 text-slate-400" /> <span>{property.area} sf</span></span>
          </div>

          <div class="flex items-center space-x-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
            <span class="h-1 w-1 rounded-full bg-emerald-500"></span>
            <span class="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400">
              Trust {property.sellerRating * 20}%
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
