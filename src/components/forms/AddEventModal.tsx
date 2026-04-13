'use client';

import React, { useState } from 'react';
import BaseModal from '@/components/ui/BaseModal';
import { useCRMStore } from '@/lib/store';
import { Calendar as CalendarIcon, Clock, MapPin, Users, Info, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddEventModal({ isOpen, onClose }: AddEventModalProps) {
  const { leads } = useCRMStore();
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    location: '',
    leadId: '',
    type: 'VISITA' as 'VISITA' | 'REUNIAO' | 'OUTRO',
    isOnline: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In this simulation, we just close the modal.
    // In a real app, this would update the store/backend.
    alert('Evento agendado com sucesso! (Simulação)');
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Agendar Evento Elite">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Título do Evento */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Título do Compromisso</label>
            <div className="relative group">
              <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
              <input 
                required
                type="text" 
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-white shadow-inner"
                placeholder="Ex: Visita ao T2 Quinta das Lágrimas"
              />
            </div>
          </div>

          {/* Tipo de Evento */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Natureza do Evento</label>
            <div className="flex gap-2">
                {[
                  { id: 'VISITA', label: 'Visita Imóvel' },
                  { id: 'REUNIAO', label: 'Reunião Venda' },
                  { id: 'OUTRO', label: 'Prospecção' }
                ].map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => setFormData({...formData, type: t.id as any})}
                        className={cn(
                            "flex-1 py-3 px-2 rounded-xl text-[10px] font-black uppercase transition-all border",
                            formData.type === t.id 
                                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                                : "bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10"
                        )}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
          </div>

          {/* Data e Hora */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Data</label>
              <div className="relative group">
                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                <input 
                  required
                  type="date" 
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-white shadow-inner appearance-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Hora</label>
              <div className="relative group">
                <Clock className="absolute left-4 top-1/2 -translate-y-1-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                <input 
                  required
                  type="time" 
                  value={formData.time}
                  onChange={e => setFormData({ ...formData, time: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-white shadow-inner appearance-none"
                />
              </div>
            </div>
          </div>

          {/* Localização e Link Online */}
          <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Localização</label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-primary transition-colors">Digital / Link</span>
                      <input 
                        type="checkbox" 
                        checked={formData.isOnline} 
                        onChange={e => setFormData({...formData, isOnline: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-white/5 border border-white/10 rounded-full relative transition-all peer-checked:bg-primary/20 peer-checked:border-primary/50">
                          <div className={cn(
                              "absolute top-1 left-1 w-3 h-3 bg-white/20 rounded-full transition-all",
                              formData.isOnline && "translate-x-5 bg-primary shadow-[0_0_8px_#FE6B00]"
                          )} />
                      </div>
                  </label>
              </div>
              <div className="relative group">
                {formData.isOnline ? (
                    <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-pulse" />
                ) : (
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                )}
                <input 
                  required
                  type="text" 
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-white shadow-inner"
                  placeholder={formData.isOnline ? "Link da videochamada (Meet/Zoom)..." : "Ex: Rua da Sofia, Coimbra"}
                />
              </div>
          </div>

          {/* Lead Associado */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Cliente Associado</label>
            <div className="relative group">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
              <select 
                value={formData.leadId}
                onChange={e => setFormData({ ...formData, leadId: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-white appearance-none cursor-pointer shadow-inner"
              >
                <option value="" className="bg-[#0B2A4A]">Selecionar Cliente...</option>
                {leads.map(lead => (
                  <option key={lead.id} value={lead.id} className="bg-[#0B2A4A]">{lead.name}</option>
                ))}
              </select>
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
            AGENDAR AGORA
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
