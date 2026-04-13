'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Check, 
  X, 
  HelpCircle,
  BarChart3,
  Euro,
  Maximize,
  MapPin
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatCurrency, cn } from '@/lib/utils';

export default function ComparePage() {
  const router = useRouter();
  
  // Dados simulados para o comparador (em prod viriam da store ou URL)
  const [properties] = useState([
    {
      id: '1',
      title: 'T2 Quinta das Lágrimas',
      price: 185000,
      location: 'Coimbra, Santo António',
      rooms: 'T2',
      area: 85,
      year: 2018,
      energy: 'A',
      extras: ['Garagem', 'Elevador', 'Varanda'],
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: '2',
      title: 'Apartamento T2 Centro',
      price: 198000,
      location: 'Coimbra, Sé Nova',
      rooms: 'T2',
      area: 92,
      year: 2022,
      energy: 'A+',
      extras: ['Garagem Dupla', 'Domótica', 'Varanda'],
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=400'
    }
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all group"
        >
          <div className="p-2 rounded-xl bg-muted group-hover:bg-accent transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="font-semibold text-sm">Voltar à Pesquisa</span>
        </button>

        <h1 className="text-2xl font-bold flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-primary" />
          Comparação de Imóveis
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Labels Column */}
        <div className="hidden md:block space-y-0 text-sm font-bold text-muted-foreground pt-[180px]">
          <div className="h-16 flex items-center border-b border-border/50 px-4">PREÇO</div>
          <div className="h-16 flex items-center border-b border-border/50 px-4">TIPOLOGIA</div>
          <div className="h-16 flex items-center border-b border-border/50 px-4">ÁREA ÚTIL</div>
          <div className="h-16 flex items-center border-b border-border/50 px-4">PREÇO/M²</div>
          <div className="h-16 flex items-center border-b border-border/50 px-4">ANO CONST.</div>
          <div className="h-16 flex items-center border-b border-border/50 px-4">CERT. ENERGÉTICA</div>
          <div className="h-16 flex items-center border-b border-border/50 px-4">EXTRAS</div>
        </div>

        {/* Property Columns */}
        {properties.map((prop) => (
          <div key={prop.id} className="bg-card border border-border rounded-3xl overflow-hidden shadow-lg relative group">
            <div className="h-40 relative">
              <img src={prop.image} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-bold text-sm truncate w-40">{prop.title}</h3>
                <p className="text-[10px] opacity-80 flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5" />
                  {prop.location}
                </p>
              </div>
            </div>

            <div className="p-0">
              <div className={cn(
                "h-16 flex items-center px-6 font-extrabold text-primary border-b border-border/50",
                prop.price === Math.min(...properties.map(p => p.price)) && "bg-emerald-500/5 text-emerald-600"
              )}>
                {formatCurrency(prop.price)}
              </div>
              <div className="h-16 flex items-center px-6 font-bold border-b border-border/50">
                {prop.rooms}
              </div>
              <div className="h-16 flex items-center px-6 font-bold border-b border-border/50">
                {prop.area} m²
              </div>
              <div className="h-16 flex items-center px-6 font-bold border-b border-border/50 text-muted-foreground italic">
                {formatCurrency(Math.round(prop.price / prop.area))}/m²
              </div>
              <div className="h-16 flex items-center px-6 font-bold border-b border-border/50">
                {prop.year}
              </div>
              <div className="h-16 flex items-center px-6 font-bold border-b border-border/50">
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-[10px]">Classe {prop.energy}</span>
              </div>
              <div className="p-6 space-y-2">
                {prop.extras.map(e => (
                  <div key={e} className="flex items-center gap-2 text-xs font-medium">
                    <Check className="w-3 h-3 text-emerald-500" />
                    {e}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Empty Slot */}
        <div className="border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center p-10 text-center space-y-4 opacity-50">
          <div className="p-4 bg-muted rounded-full">
            <Maximize className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">Adicione outro imóvel<br/>para comparar</p>
          <button 
            onClick={() => router.push('/market')}
            className="px-4 py-2 bg-accent hover:bg-muted font-bold rounded-xl text-xs transition-all"
          >
            Voltar à Pesquisa
          </button>
        </div>
      </div>
    </div>
  );
}
