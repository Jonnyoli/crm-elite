'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Target, 
  Megaphone, 
  Mail, 
  Share2, 
  FileText, 
  ArrowRight,
  Zap,
  Star,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import FlyerGenerator from '@/components/marketing/FlyerGenerator';
import SocialMediaKit from '@/components/marketing/SocialMediaKit';
import EmailCampaignKit from '@/components/marketing/EmailCampaignKit';

const marketingTools = [
  {
    id: 'flyer',
    title: 'Gerador Automático de Flyers',
    description: 'Crie fichas de imóveis profissionais em segundos com ajuda de IA.',
    icon: FileText,
    color: 'bg-[#FE6B00]',
    status: 'ACTIVE'
  },
  {
    id: 'social',
    title: 'Kits de Redes Sociais',
    description: 'Posts otimizados para Instagram e Facebook da Soluções Ideais.',
    icon: Share2,
    color: 'bg-indigo-500',
    status: 'ACTIVE'
  },
  {
    id: 'email',
    title: 'Campanhas de Email',
    description: 'Templates de luxo para prospecção e acompanhamento de leads.',
    icon: Mail,
    color: 'bg-emerald-500',
    status: 'ACTIVE'
  }
];

export default function MarketingPage() {
  const [activeTool, setActiveTool] = useState<string | null>('flyer');

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Hub */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0B2A4A] p-10 rounded-[40px] relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-[#FE6B00]/20 text-[#FE6B00] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#FE6B00]/30 font-mono">
              Marketing Hub v1.0
            </span>
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            Centro de <span className="text-[#FE6B00]">Marketing</span>
          </h1>
          <p className="text-white/60 font-medium text-lg leading-relaxed max-w-lg">
            Potencie as suas vendas com ferramentas de design e inteligência artificial da SI Coimbra.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Flyers criados</p>
            <p className="text-2xl font-black text-white">124</p>
          </div>
          <div className="bg-[#FE6B00]/10 border border-[#FE6B00]/20 p-4 rounded-2xl backdrop-blur-md">
            <p className="text-[10px] font-bold text-[#FE6B00] uppercase tracking-widest mb-1">Impacto AI</p>
            <p className="text-2xl font-black text-white">+85%</p>
          </div>
        </div>

        {/* Abstract Background Design */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FE6B00] opacity-[0.05] rounded-full blur-[120px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 opacity-[0.05] rounded-full blur-[100px] -ml-20 -mb-20" />
      </div>

      {/* Tools Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {marketingTools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => tool.status === 'ACTIVE' && setActiveTool(tool.id)}
            className={cn(
              "p-8 rounded-[32px] border text-left transition-all duration-500 group relative overflow-hidden",
              activeTool === tool.id 
                ? "bg-card border-[#FE6B00]/40 shadow-xl scale-[1.02]" 
                : "bg-muted/30 border-white/5 hover:border-white/10 opacity-70 hover:opacity-100",
              tool.status === 'UPCOMING' && "cursor-not-allowed grayscale"
            )}
          >
            <div className={cn(
              "p-4 rounded-2xl w-fit mb-6 shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
              tool.color
            )}>
              <tool.icon className="w-6 h-6 text-white" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-xl tracking-tight text-white">{tool.title}</h3>
                {tool.status === 'UPCOMING' && (
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-white/5 rounded-lg text-white/30 border border-white/5 whitespace-nowrap">
                    Em breve
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                {tool.description}
              </p>
            </div>
            
            {activeTool === tool.id && (
              <div className="absolute top-4 right-4 animate-in zoom-in duration-500">
                <Zap className="w-5 h-5 text-[#FE6B00] fill-[#FE6B00] blur-sm animate-pulse" />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-top-4 duration-700 delay-200">
        {activeTool === 'flyer' ? (
          <FlyerGenerator />
        ) : activeTool === 'social' ? (
          <SocialMediaKit />
        ) : activeTool === 'email' ? (
          <EmailCampaignKit />
        ) : (
          <div className="bg-card border border-border rounded-[40px] p-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Selecione uma ferramenta</h3>
            <p className="text-muted-foreground max-w-sm">
              As ferramentas bloqueadas estarão disponíveis na próxima atualização da plataforma SI Coimbra.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
