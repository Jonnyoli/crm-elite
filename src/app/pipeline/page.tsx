'use client';

import React, { useState, useMemo, useCallback, memo } from 'react';
import { 
  Kanban as KanbanIcon, 
  Plus, 
  CreditCard,
  Target,
  ArrowRight,
  TrendingUp,
  Search,
  Zap,
  Building2,
  Users,
  Flame,
  Snowflake
} from 'lucide-react';
import { useCRMStore } from '@/lib/store';
import { cn, formatCurrency } from '@/lib/utils';
import { LeadStatus, Deal, Lead, Property } from '@/types';
import AddDealModal from '@/components/forms/AddDealModal';
import DealDetailModal from '@/components/forms/DealDetailModal';

// --------------------------------------------------------------------------
// OPTIMIZED CARD COMPONENT (NATIVE DND)
// --------------------------------------------------------------------------

interface DealCardProps {
    deal: Deal;
    lead?: Lead;
    property?: Property;
    isHighValue: boolean;
    onClick: () => void;
}

const DealCard = memo(({ deal, lead, property, isHighValue, onClick }: DealCardProps) => {
    // ... logic remains
    const createdAt = new Date(deal.createdAt).getTime();
    const now = Date.now();
    const daysOld = (now - createdAt) / (1000 * 60 * 60 * 24);
    const isHot = daysOld < 2;
    const isCold = daysOld > 15;

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('dealId', deal.id);
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => {
            if (e.target instanceof HTMLElement) {
                e.target.style.opacity = '0.5';
            }
        }, 0);
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        if (e.target instanceof HTMLElement) {
            e.target.style.opacity = '1';
        }
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={onClick}
            className={cn(
                "relative bg-[#0D141F] border border-white/10 rounded-3xl group cursor-grab active:cursor-grabbing luxury-shadow mb-4 overflow-hidden transition-all duration-300 hover:-translate-y-1",
                isHighValue && "border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.05)]",
                "hover:bg-[#121B29] hover:border-white/20 hover:shadow-2xl"
            )}
        >
            {property?.imageUrl && (
                <div className="relative w-full h-28 overflow-hidden pointer-events-none">
                    <img 
                        src={property.imageUrl} 
                        alt={property.address} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D141F] to-transparent" />
                    <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
                        {isHighValue && <Badge icon={Zap} label="VIP" className="bg-amber-500 text-black" />}
                        {isHot && <Badge icon={Flame} label="HOT" className="bg-[#FE6B00] text-white" />}
                        {isCold && <Badge icon={Snowflake} label="COLD" className="bg-blue-500/20 text-blue-300" />}
                    </div>
                </div>
            )}

            <div className="p-5 pt-4">
                <div className="flex justify-between items-start mb-3">
                    <h4 className="font-black text-[14px] leading-tight text-white font-outfit group-hover:text-[#FE6B00] transition-colors pr-6 uppercase tracking-tight">
                        {deal.title}
                    </h4>
                    <div className="p-1.5 rounded-lg bg-white/5 text-white/20 opacity-0 group-hover:opacity-100 transition-all">
                        <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-0.5">Valor</span>
                            <div className="flex items-center gap-1.5">
                                <CreditCard className="w-3 h-3 text-[#FE6B00]/50" />
                                <span className="text-xs font-black text-white">{formatCurrency(deal.value)}</span>
                            </div>
                        </div>
                        
                        <div className="text-right">
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-0.5">Prob.</span>
                            <div className="flex items-center justify-end gap-1.5">
                                <Target className={cn("w-3 h-3", deal.probability > 70 ? "text-emerald-500" : "text-amber-500")} />
                                <span className="text-xs font-black text-white">{deal.probability}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div 
                            className={cn(
                                "h-full rounded-full transition-all duration-1000",
                                deal.probability > 70 ? "bg-emerald-500" :
                                deal.probability > 40 ? "bg-[#FE6B00]" : "bg-blue-500"
                            )}
                            style={{ width: `${deal.probability}%` }}
                        />
                    </div>

                    {lead && (
                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-[#0B2A4A] border border-white/5 flex items-center justify-center text-[9px] font-black text-white shadow-xl">
                                    {lead.name.charAt(0)}
                                </div>
                                <span className="text-[10px] font-black text-white/50 uppercase tracking-tight">{lead.name.split(' ')[0]}</span>
                            </div>
                            {property && (
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{property.type}</span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});
DealCard.displayName = 'DealCard';

function Badge({ icon: Icon, label, className }: { icon: any, label: string, className?: string }) {
    return (
        <div className={cn("px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest shadow-xl flex items-center gap-1 pointer-events-none", className)}>
            <Icon className="w-2 h-2 fill-current" />
            {label}
        </div>
    );
}

// --------------------------------------------------------------------------
// PIPELINE COLUMN COMPONENT (NATIVE DND)
// --------------------------------------------------------------------------

interface PipelineColumnProps {
    stage: { id: LeadStatus; label: string; color: string; description: string };
    deals: Deal[];
    leads: Lead[];
    properties: Property[];
    onDropDeal: (dealId: string, stageId: LeadStatus) => void;
    onDealClick: (dealId: string) => void;
}

const PipelineColumn = memo(({ stage, deals, leads, properties, onDropDeal, onDealClick }: PipelineColumnProps) => {
    const totalValue = useMemo(() => deals.reduce((sum, d) => sum + d.value, 0), [deals]);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // Necessary to allow dropping
        e.dataTransfer.dropEffect = 'move';
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        const dealId = e.dataTransfer.getData('dealId');
        if (dealId) {
            onDropDeal(dealId, stage.id);
        }
    };

    return (
        <div className="w-[340px] flex flex-col shrink-0 min-h-full h-full">
            <div className="mb-6 px-2 shrink-0">
                <div className="flex items-center justify-between mb-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                            <div className={cn("w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]", stage.color)} />
                            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-white font-outfit">{stage.label}</h3>
                        </div>
                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest ml-5">{stage.description}</p>
                    </div>
                    <span className="text-[9px] font-black text-white/40 bg-white/5 border border-white/10 px-2 py-1 rounded-lg">
                        {deals.length}
                    </span>
                </div>
                <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/5 backdrop-blur-md flex items-center justify-between">
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Total Acumulado</span>
                    <span className="text-sm font-black text-white font-outfit">{formatCurrency(totalValue)}</span>
                </div>
            </div>

            {/* The Native Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "flex-1 overflow-y-auto custom-scrollbar rounded-[32px] p-4 border transition-all duration-300 min-h-[500px]",
                    isDragOver 
                        ? "bg-white/[0.08] border-white/20 shadow-inner scale-[1.01]" 
                        : "bg-white/[0.02] border-white/5"
                )}
            >
                {deals.map((deal) => {
                    const lead = leads.find(l => l.id === deal.leadId);
                    const property = properties.find(p => p.id === deal.propertyId);
                    return (
                        <DealCard 
                            key={deal.id}
                            deal={deal}
                            lead={lead}
                            property={property}
                            isHighValue={deal.value >= 500000}
                            onClick={() => onDealClick(deal.id)}
                        />
                    );
                })}
                
                {/* Visual indicator when empty */}
                {deals.length === 0 && (
                    <div className="h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl mt-2 text-white/10 font-black uppercase text-[10px] tracking-widest">
                        Soltar Negócio Aqui
                    </div>
                )}
            </div>
        </div>
    );
});
PipelineColumn.displayName = 'PipelineColumn';

// --------------------------------------------------------------------------
// MAIN PAGE COMPONENT (NATIVE DND)
// --------------------------------------------------------------------------

const STAGES: { id: LeadStatus; label: string; color: string; description: string }[] = [
  { id: 'NOVO', label: 'Prospecção', color: 'bg-blue-500', description: 'Leads por qualificar' },
  { id: 'CONTACTADO', label: 'Qualificação', color: 'bg-[#FE6B00]', description: 'Em contacto direto' },
  { id: 'VISITA_AGENDADA', label: 'Visitas', color: 'bg-amber-500', description: 'Visitas ao imóvel' },
  { id: 'PROPOSTA', label: 'Negociação', color: 'bg-indigo-500', description: 'Propostas enviadas' },
  { id: 'FECHADO_GANHO', label: 'Conversão', color: 'bg-emerald-500', description: 'Negócios finalizados' },
];

export default function PipelinePage() {
  const { deals, leads, properties, updateDeal } = useCRMStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeDealId, setActiveDealId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const dealsByStage = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const filtered = searchTerm 
      ? deals.filter(d => d.title.toLowerCase().includes(term) || leads.find(l => l.id === d.leadId)?.name.toLowerCase().includes(term))
      : deals;

    const map: Record<string, Deal[]> = {};
    STAGES.forEach(s => map[s.id] = []);
    filtered.forEach(d => {
        if (map[d.stage]) map[d.stage].push(d);
    });
    return map;
  }, [deals, searchTerm, leads]);

  // Native DnD handler passed to columns
  const handleDropDeal = useCallback((dealId: string, stageId: LeadStatus) => {
      console.log(`Native DnD Update: Deal ${dealId} -> Stage ${stageId}`);
      updateDeal(dealId, { stage: stageId });
      
      if (stageId === 'FECHADO_GANHO') {
          import('canvas-confetti').then((module) => {
              const confetti = module.default;
              confetti({
                  particleCount: 150,
                  spread: 80,
                  origin: { y: 0.6 },
                  colors: ['#FE6B00', '#1B2A57', '#FFFFFF', '#10B981']
              });
          });
      }
  }, [updateDeal]);

  const totalValue = useMemo(() => deals.reduce((sum, d) => sum + d.value, 0), [deals]);

  return (
    <div className="flex flex-col gap-8 h-full overflow-hidden">
      <AddDealModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <DealDetailModal isOpen={activeDealId !== null} onClose={() => setActiveDealId(null)} dealId={activeDealId} />
      
      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 bg-[#0B2A4A]/20 p-8 rounded-[40px] border border-white/5 relative overflow-hidden backdrop-blur-sm shadow-2xl shrink-0">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#FE6B00]/10 rounded-2xl border border-[#FE6B00]/20">
                <KanbanIcon className="w-5 h-5 text-[#FE6B00]" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FE6B00]">Sales Funnel Elite</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white font-outfit uppercase">
            Sales <span className="text-white/20">Pipeline</span>
          </h1>
          <div className="flex items-center gap-8 pt-4">
             <div className="flex flex-col">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Total Funil</span>
                <span className="text-xl font-black text-white">{formatCurrency(totalValue)}</span>
             </div>
             <div className="flex flex-col">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Ativos</span>
                <span className="text-xl font-black text-white">{deals.length}</span>
             </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative group w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#FE6B00] transition-colors" />
            <input 
                type="text" 
                placeholder="Pesquisar..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:bg-white/10 focus:border-[#FE6B00]/50 transition-all font-medium text-white text-sm"
            />
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-4 si-gradient text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" />
            Novo Negócio Elite
          </button>
        </div>
      </div>

      {/* 
        NATIVE DND BOARD
      */}
      <div className="flex-1 overflow-x-auto pb-10 custom-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-6 min-w-max h-full pb-4">
            {STAGES.map((stage) => (
                <PipelineColumn 
                    key={stage.id} 
                    stage={stage} 
                    deals={dealsByStage[stage.id]}
                    leads={leads}
                    properties={properties}
                    onDropDeal={handleDropDeal}
                    onDealClick={(id) => setActiveDealId(id)}
                />
            ))}
        </div>
      </div>
    </div>
  );
}
