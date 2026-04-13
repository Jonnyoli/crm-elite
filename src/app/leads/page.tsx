'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Mail, 
  Phone,
  Calendar as CalendarIcon,
  Tag,
  MessageCircle,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { useCRMStore } from '@/lib/store';
import { cn, formatDate } from '@/lib/utils';
import { LeadStatus } from '@/types';
import CreateLeadModal from '@/components/leads/CreateLeadModal';
import LeadDetailModal from '@/components/forms/LeadDetailModal';
import { motion } from 'framer-motion';

const statusLabels: Record<LeadStatus, string> = {
  'NOVO': 'Novo',
  'CONTACTADO': 'Contactado',
  'VISITA_AGENDADA': 'Visita Agendada',
  'PROPOSTA': 'Proposta',
  'FECHADO_GANHO': 'Fechado/Ganho',
  'PERDIDO': 'Perdido',
};

export default function LeadsPage() {
  const { leads } = useCRMStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-10 pb-20">
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 bg-[#0B2A4A]/20 p-10 rounded-[40px] border border-white/5 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FE6B00] mb-2">Gestão de Portfólio</p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white font-outfit uppercase">Leads <span className="text-white/20">&</span> Contactos</h1>
            <p className="text-white/40 font-medium text-lg leading-relaxed max-w-lg">
                Gerencie os seus potenciais clientes com inteligência e precisão.
            </p>
        </div>

        <div className="relative z-10">
            <button 
                onClick={() => setIsModalOpen(true)}
                className="group flex items-center justify-center gap-4 px-8 py-5 si-gradient text-white rounded-[24px] font-black text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
                <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                Novo Lead Profissional
            </button>
        </div>
        
        {/* Background glow shadow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FE6B00] opacity-5 rounded-full blur-[100px] -mr-32 -mt-32" />
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="flex-1 w-full relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#FE6B00] transition-colors" />
          <input 
            type="text" 
            placeholder="Pesquisar por nome ou email..." 
            className="w-full pl-16 pr-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl outline-none focus:bg-white/[0.07] focus:border-[#FE6B00]/40 transition-all text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 group hover:border-white/10 transition-all w-full lg:w-fit">
          <Filter className="w-4 h-4 text-white/20 group-hover:text-[#FE6B00] transition-colors" />
          <select 
            className="bg-transparent text-sm font-black uppercase tracking-widest outline-none border-none pr-8 cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Todo o Funil</option>
            {Object.entries(statusLabels).map(([val, label]) => (
              <option key={val} value={val}>{label.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Leads Dynamic List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredLeads.map((lead, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            key={lead.id} 
            className="bg-card border border-white/5 rounded-[32px] p-8 hover:border-[#FE6B00]/30 transition-all duration-500 group relative overflow-hidden glass-card luxury-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-[24px] bg-[#0B2A4A] flex items-center justify-center text-white font-black text-2xl shadow-xl group-hover:rotate-6 transition-transform duration-500 border border-white/10">
                  {lead.name.charAt(0)}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-4 flex-wrap">
                    <h3 className="text-2xl font-black font-outfit tracking-tight group-hover:text-[#FE6B00] transition-colors">{lead.name}</h3>
                    <StatusBadge status={lead.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                    <div className="flex items-center gap-2.5 text-sm font-bold text-white/40">
                      <Mail className="w-4 h-4 text-[#FE6B00]" />
                      {lead.email}
                    </div>
                    <div className="flex items-center gap-2.5 text-sm font-bold text-white/40">
                      <Phone className="w-4 h-4 text-[#FE6B00]" />
                      {lead.phone}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-10">
                <div className="hidden xl:block">
                  <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.2em] mb-1">Origem</p>
                  <p className="text-[14px] font-black text-white/60">{lead.source}</p>
                </div>
                <div className="hidden xl:block">
                  <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.2em] mb-1">Entrada</p>
                  <p className="text-[14px] font-black text-white/60 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-[#FE6B00]/50" />
                    {formatDate(lead.createdAt)}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <a 
                    href={`https://wa.me/${lead.phone.replace(/\s/g, '')}?text=Olá ${lead.name}, fala o João da SI Coimbra...`}
                    target="_blank"
                    className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-xl"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </a>
                  <button 
                    onClick={() => setActiveLeadId(lead.id)}
                    className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/5 text-white/80 hover:bg-[#FE6B00] hover:text-white rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all group/btn shadow-xl"
                  >
                    Detalhes SI
                    <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tags area */}
            <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-4">
              <Zap className="w-3.5 h-3.5 text-[#FE6B00] animate-pulse" />
              <div className="flex flex-wrap gap-2">
                {(lead.tags || []).map(tag => (
                  <span key={tag} className="text-[10px] bg-white/5 px-4 py-1.5 rounded-xl text-white/40 font-black uppercase tracking-widest border border-white/5 group-hover:border-[#FE6B00]/20 transition-all">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                <Users className="w-32 h-32 text-white" />
            </div>
          </motion.div>
        ))}

        {filteredLeads.length === 0 && (
          <div className="bg-card border border-dashed border-white/5 rounded-[40px] p-32 text-center luxury-shadow glass-card">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-[32px] bg-white/5 mb-8">
              <Users className="w-12 h-12 text-white/20" />
            </div>
            <h3 className="text-2xl font-black font-outfit">Nenhum lead encontrado</h3>
            <p className="text-white/40 mt-3 font-bold max-w-xs mx-auto text-sm leading-relaxed">
              Tente ajustar os seus filtros ou a sua pesquisa para encontrar o potencial cliente.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateLeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      <LeadDetailModal
        isOpen={activeLeadId !== null}
        onClose={() => setActiveLeadId(null)}
        leadId={activeLeadId}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    'NOVO': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'CONTACTADO': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    'VISITA_AGENDADA': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'PROPOSTA': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'FECHADO_GANHO': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'PERDIDO': 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <span className={cn(
      "text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg border shadow-xl",
      styles[status] || styles['NOVO']
    )}>
      {status.replace('_', ' ')}
    </span>
  );
}
