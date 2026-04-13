'use client';

import React from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  MapPin, 
  Euro, 
  Home, 
  Maximize,
  ArrowUpRight,
  MoreHorizontal
} from 'lucide-react';
import { useCRMStore } from '@/lib/store';
import { cn, formatCurrency } from '@/lib/utils';
import AddPropertyModal from '@/components/forms/AddPropertyModal';
import PropertyDetailModal from '@/components/forms/PropertyDetailModal';
import { useState } from 'react';


export default function PropertiesPage() {
  const { properties } = useCRMStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activePropertyId, setActivePropertyId] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AddPropertyModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <PropertyDetailModal 
         isOpen={activePropertyId !== null} 
         onClose={() => setActivePropertyId(null)} 
         propertyId={activePropertyId} 
      />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Imóveis</h1>
          <p className="text-muted-foreground mt-1">Gira o seu portfólio de imóveis e associe leads interessados.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
        >
          <Plus className="w-5 h-5" />
          Novo Imóvel
        </button>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Pesquisar por morada ou tipo..." 
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
          />
        </div>
        <select className="bg-card border border-border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20">
          <option>Todos os Tipos</option>
          <option>T0 / T1</option>
          <option>T2</option>
          <option>T3+</option>
          <option>Moradia</option>
        </select>
        <select className="bg-card border border-border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20">
          <option>Estado: Todos</option>
          <option>Disponível</option>
          <option>Reservado</option>
          <option>Vendido</option>
        </select>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary transition-all shadow-sm">
            {/* Image Placeholder */}
            <div className="h-48 bg-muted relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <img 
                src={property.imageUrl || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800"} 
                alt={property.address}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 z-20">
                <StatusBadge status={property.status} />
              </div>
              <div className="absolute bottom-3 left-3 z-20 text-white">
                <p className="text-xl font-bold tracking-tight">{formatCurrency(property.price)}</p>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
                    {property.address}
                  </h3>
                  <button className="p-1.5 text-muted-foreground hover:bg-accent rounded-lg transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Lisboa, Portugal</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-muted-foreground">
                    <Home className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{property.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-muted-foreground">
                    <Maximize className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">--</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {property.features.map(f => (
                  <span key={f} className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-bold uppercase tracking-wider">
                    {f}
                  </span>
                ))}
              </div>

              <button 
                 onClick={() => setActivePropertyId(property.id)}
                 className="w-full py-2.5 bg-accent text-foreground font-bold rounded-xl hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2 text-sm mt-2"
              >
                Ver Ficha Completa
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Add New Card */}
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-muted/30 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center p-8 gap-3 hover:bg-muted/50 transition-all group min-h-[400px]"
        >
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all text-muted-foreground group-hover:text-primary">
            <Plus className="w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="font-bold">Adicionar novo imóvel</p>
            <p className="text-xs text-muted-foreground mt-1">Comece a angariação</p>
          </div>
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    'DISPONIVEL': 'bg-emerald-500 text-white',
    'RESERVADO': 'bg-amber-500 text-white',
    'VENDIDO': 'bg-gray-500 text-white',
  };

  return (
    <span className={cn(
      "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-lg",
      styles[status]
    )}>
      {status}
    </span>
  );
}
