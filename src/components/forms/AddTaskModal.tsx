'use client';

import React, { useState } from 'react';
import BaseModal from '@/components/ui/BaseModal';
import { useCRMStore } from '@/lib/store';
import { Task, Priority } from '@/types';
import { CheckSquare, Clock, AlertCircle, Users, AlignLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTaskModal({ isOpen, onClose }: AddTaskModalProps) {
  const { addTask, leads } = useCRMStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'MEDIA' as Priority,
    leadId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      priority: formData.priority,
      isCompleted: false,
      leadId: formData.leadId || undefined,
    };

    addTask(newTask);
    onClose();
    setFormData({ title: '', description: '', dueDate: new Date().toISOString().split('T')[0], priority: 'MEDIA', leadId: '' });
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Novo Follow-up Elite">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Título da Tarefa */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">O que precisas de fazer?</label>
            <div className="relative group">
              <CheckSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
              <input 
                required
                type="text" 
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-white shadow-inner"
                placeholder="Ex: Ligar para confirmar visita"
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Detalhes (Opcional)</label>
            <div className="relative group">
              <AlignLeft className="absolute left-4 top-4 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
              <textarea 
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-white shadow-inner resize-none text-sm"
                placeholder="Notas adicionais sobre a tarefa..."
              />
            </div>
          </div>

          {/* Data e Prioridade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Data Limite</label>
              <div className="relative group">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                <input 
                  required
                  type="date" 
                  value={formData.dueDate}
                  onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-white shadow-inner appearance-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Prioridade</label>
              <div className="flex gap-2">
                {[
                  { id: 'BAIXA', color: 'bg-emerald-500' },
                  { id: 'MEDIA', color: 'bg-amber-500' },
                  { id: 'ALTA', color: 'bg-[#FE6B00]' }
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setFormData({...formData, priority: p.id as Priority})}
                    className={cn(
                      "flex-1 py-4 px-2 rounded-xl text-[10px] font-black uppercase transition-all border flex flex-col items-center gap-1",
                      formData.priority === p.id 
                        ? "bg-white/10 border-white/20 text-white" 
                        : "bg-white/5 border-white/5 text-white/20"
                    )}
                  >
                    <div className={cn("w-2 h-2 rounded-full", p.id === formData.priority ? p.color : 'bg-white/10')} />
                    {p.id}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lead Relacionado */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Associar a Lead</label>
            <div className="relative group">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
              <select 
                value={formData.leadId}
                onChange={e => setFormData({ ...formData, leadId: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-white appearance-none cursor-pointer shadow-inner"
              >
                <option value="" className="bg-[#0B2A4A]">Opcional: Selecionar Lead...</option>
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
            CRIAR TAREFA
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
