'use client';

import React, { useState } from 'react';
import BaseModal from '@/components/ui/BaseModal';
import { useCRMStore } from '@/lib/store';
import { LeadStatus } from '@/types';
import { Briefcase, CreditCard, Target, Users, Building2 } from 'lucide-react';

import { z } from 'zod';

interface AddDealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const dealSchema = z.object({
  title: z.string().min(3, 'Título tem de ter pelo menos 3 caracteres'),
  value: z.number().min(1, 'Valor deve ser superior a 0'),
  probability: z.number().min(0).max(100),
  leadId: z.string().min(1, 'Selecione uma Lead associada'),
  propertyId: z.string().optional(),
  stage: z.string()
});

export default function AddDealModal({ isOpen, onClose }: AddDealModalProps) {
  const { addDeal, leads, properties } = useCRMStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    probability: '50',
    leadId: '',
    propertyId: '',
    stage: 'NOVO' as LeadStatus,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = dealSchema.safeParse({
        ...formData,
        value: Number(formData.value),
        probability: Number(formData.probability)
    });

    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        if (issue.path[0]) {
          formattedErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    setIsSubmitting(true);
    await addDeal({
      title: formData.title,
      value: Number(formData.value),
      probability: Number(formData.probability),
      leadId: formData.leadId,
      propertyId: formData.propertyId || undefined,
      stage: formData.stage,
    });
    setIsSubmitting(false);
    setErrors({});
    onClose();
    setFormData({ title: '', value: '', probability: '50', leadId: '', propertyId: '', stage: 'NOVO' });
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Novo Negócio SI Elite">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Título do Negócio */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Título do Negócio</label>
            <div className="relative group">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
              <input 
                required
                type="text" 
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-white shadow-inner"
                placeholder="Ex: Venda T2 Centro - Carlos"
              />
            </div>
          </div>

          {/* Valor e Probabilidade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Valor do Imóvel (€)</label>
              <div className="relative group">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                <input 
                  required
                  type="number" 
                  value={formData.value}
                  onChange={e => setFormData({ ...formData, value: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-white shadow-inner"
                  placeholder="250000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Probabilidade (%)</label>
              <div className="relative group">
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                <input 
                  required
                  type="number" 
                  min="0"
                  max="100"
                  value={formData.probability}
                  onChange={e => setFormData({ ...formData, probability: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-white shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Lead e Propriedade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Lead Associado</label>
              <div className="relative group">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                <select 
                  required
                  value={formData.leadId}
                  onChange={e => setFormData({ ...formData, leadId: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-white appearance-none cursor-pointer shadow-inner"
                >
                  <option value="" className="bg-[#0B2A4A]">Selecionar Lead...</option>
                  {leads.map(lead => (
                    <option key={lead.id} value={lead.id} className="bg-[#0B2A4A]">{lead.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Imóvel de Destino</label>
              <div className="relative group">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                <select 
                  value={formData.propertyId}
                  onChange={e => setFormData({ ...formData, propertyId: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-white appearance-none cursor-pointer shadow-inner"
                >
                  <option value="" className="bg-[#0B2A4A]">Opcional: Selecionar Imóvel...</option>
                  {properties.map(prop => (
                    <option key={prop.id} value={prop.id} className="bg-[#0B2A4A]">{prop.address}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Etapa do Pipeline */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Etapa Inicial</label>
            <div className="flex gap-2">
                {['NOVO', 'CONTACTADO', 'VISITA_AGENDADA', 'PROPOSTA'].map((s) => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => setFormData({...formData, stage: s as LeadStatus})}
                        className={cn(
                            "flex-1 py-3 px-2 rounded-xl text-[10px] font-black uppercase transition-all border",
                            formData.stage === s 
                                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                                : "bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10"
                        )}
                    >
                        {s.replace('_', ' ')}
                    </button>
                ))}
            </div>
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <button 
            type="button" 
            onClick={onClose}
            className="flex-1 py-4 px-6 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all border border-white/5"
          >
            CANCELAR
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-4 px-6 si-gradient text-white font-black rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:scale-100"
          >
            {isSubmitting ? 'A CRIAR...' : 'CRIAR NEGÓCIO'}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}

import { cn } from '@/lib/utils';
