'use client';

import React, { useState } from 'react';
import BaseModal from '@/components/ui/BaseModal';
import { useCRMStore } from '@/lib/store';
import { Lead } from '@/types';
import { User, Mail, Phone, Tag, Info } from 'lucide-react';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddLeadModal({ isOpen, onClose }: AddLeadModalProps) {
  const { addLead } = useCRMStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'Website',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newLead: Lead = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      status: 'NOVO',
      tags: [],
      createdAt: new Date().toISOString(),
    };

    addLead(newLead);
    onClose();
    setFormData({ name: '', email: '', phone: '', source: 'Website', notes: '' });
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Novo Lead Elite">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Nome */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Nome Completo</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-white shadow-inner"
                placeholder="Ex: Pedro Alvares Cabral"
              />
            </div>
          </div>

          {/* Contactos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-white shadow-inner"
                  placeholder="exemplo@email.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Telemóvel</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                <input 
                  required
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-white shadow-inner"
                  placeholder="912 345 678"
                />
              </div>
            </div>
          </div>

          {/* Origem */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Origem do Lead</label>
            <div className="relative group">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
              <select 
                value={formData.source}
                onChange={e => setFormData({ ...formData, source: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-white appearance-none cursor-pointer shadow-inner"
              >
                <option value="Website" className="bg-[#0B2A4A]">Website Principal</option>
                <option value="Zillow" className="bg-[#0B2A4A]">Idealista / Imovirtual</option>
                <option value="Facebook" className="bg-[#0B2A4A]">Social Media (Meta ADS)</option>
                <option value="Referral" className="bg-[#0B2A4A]">Recomendação</option>
                <option value="Pipedrive" className="bg-[#0B2A4A]">Sync Pipedrive</option>
              </select>
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Notas Internas</label>
            <div className="relative group">
              <Info className="absolute left-4 top-4 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
              <textarea 
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-white resize-none shadow-inner text-sm"
                placeholder="Detalhes sobre as preferências do cliente..."
              />
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
            className="flex-1 py-4 px-6 si-gradient text-white font-black rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            CRIAR LEAD
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
