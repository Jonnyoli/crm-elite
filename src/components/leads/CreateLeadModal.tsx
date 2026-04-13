'use client';

import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Mail, 
  Phone, 
  Target, 
  Tag, 
  MessageSquare,
  Sparkles,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCRMStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { z } from 'zod';

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const leadSchema = z.object({
  name: z.string().min(3, 'Nome tem de ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^(9\d{8}|2\d{8})$/, 'Número inválido (comece por 9 ou 2)'),
  source: z.string().min(1),
  notes: z.string().optional(),
  tags: z.string().optional()
});

export default function CreateLeadModal({ isOpen, onClose }: CreateLeadModalProps) {
  const { addLead } = useCRMStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'Idealista',
    notes: '',
    tags: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const result = leadSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        if (issue.path[0]) {
          formattedErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(formattedErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    await addLead({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      source: formData.source,
      status: 'NOVO',
      notes: formData.notes,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    });

    setIsSubmitting(false);
    setIsSuccess(true);

    // Fechar após sucesso
    setTimeout(() => {
      onClose();
      setIsSuccess(false);
      setFormData({ name: '', email: '', phone: '', source: 'Idealista', notes: '', tags: '' });
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#05070a]/90 backdrop-blur-xl"
        />

        {/* Modal Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-2xl bg-[#0a0d14] border border-white/10 rounded-[40px] shadow-3xl overflow-hidden relative z-10 luxury-shadow flex flex-col md:flex-row"
        >
          {/* Decorative Sidebar */}
          <div className="hidden md:flex w-1/3 bg-[#0B2A4A] p-10 flex-col justify-between relative overflow-hidden">
             <div className="z-10 space-y-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#0B2A4A]">
                    <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-white leading-tight font-outfit">SI Elite Leads</h3>
                <p className="text-white/40 text-xs font-bold leading-relaxed uppercase tracking-widest">
                    Registo exclusivo de potenciais clientes para a agência Mondego.
                </p>
             </div>
             
             <div className="z-10 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
                <p className="text-[10px] font-black text-[#FE6B00] uppercase tracking-[0.2em] mb-1">Dica AI</p>
                <p className="text-[10px] text-white/60 font-medium">Lembre-se de adicionar notas sobre o tipo de imóvel pretendido.</p>
             </div>

             {/* Background Effects */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#FE6B00] opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
             <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full blur-2xl -ml-12 -mb-12" />
          </div>

          {/* Form Content */}
          <div className="flex-1 p-8 lg:p-12">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black tracking-tighter text-white font-outfit uppercase tracking-tight">Novo Lead</h2>
                <button onClick={onClose} className="p-2.5 bg-white/5 text-white/20 hover:text-white rounded-xl transition-all">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {isSuccess ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center space-y-4"
                >
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mb-2">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black">Lead Registado!</h3>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs">A atualizar a sua pipeline...</p>
                </motion.div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6 font-jakarta">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Identificação</label>
                        <div className="relative group">
                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#FE6B00] transition-colors" />
                            <input 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                placeholder="Nome Completo"
                                className={cn(
                                    "w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:bg-white/5 transition-all outline-none",
                                    errors.name ? 'border-red-500/50' : 'focus:border-[#FE6B00]/40'
                                )}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#FE6B00] transition-colors" />
                                <input 
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    placeholder="email@exemplo.pt"
                                    className={cn(
                                        "w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:bg-white/5 transition-all outline-none",
                                        errors.email ? 'border-red-500/50' : 'focus:border-[#FE6B00]/40'
                                    )}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Contacto</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#FE6B00] transition-colors" />
                                <input 
                                    value={formData.phone}
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                    placeholder="9xx xxx xxx"
                                    className={cn(
                                        "w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:bg-white/5 transition-all outline-none",
                                        errors.phone ? 'border-red-500/50' : 'focus:border-[#FE6B00]/40'
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Origem</label>
                            <div className="relative group">
                                <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#FE6B00] transition-colors" />
                                <select 
                                    value={formData.source}
                                    onChange={e => setFormData({...formData, source: e.target.value})}
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3.5 pl-12 pr-10 text-sm text-white focus:bg-white/5 focus:border-[#FE6B00]/40 transition-all outline-none appearance-none"
                                >
                                    <option value="Idealista">Idealista</option>
                                    <option value="Zillow">Zillow</option>
                                    <option value="Social Media">Redes Sociais</option>
                                    <option value="Recomendação">Recomendação</option>
                                    <option value="Outdoor">Outdoor</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Tags (Sép. por vírgula)</label>
                            <div className="relative group">
                                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#FE6B00] transition-colors" />
                                <input 
                                    value={formData.tags}
                                    onChange={e => setFormData({...formData, tags: e.target.value})}
                                    placeholder="Ex: Urgente, T2, Baixa"
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:bg-white/5 focus:border-[#FE6B00]/40 transition-all outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Notas Internas</label>
                        <textarea 
                            value={formData.notes}
                            onChange={e => setFormData({...formData, notes: e.target.value})}
                            placeholder="Descreva as preferências do cliente..."
                            rows={3}
                            className="w-full bg-white/[0.03] border border-white/5 rounded-[24px] p-5 text-sm text-white focus:bg-white/5 focus:border-[#FE6B00]/40 transition-all outline-none resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                            "w-full py-5 rounded-[20px] font-black text-sm tracking-tight flex items-center justify-center gap-3 transition-all",
                            isSubmitting 
                                ? "bg-white/5 text-white/20 cursor-not-allowed" 
                                : "si-gradient text-white shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95"
                        )}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Registo Seguro...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-5 h-5" />
                                Criar Lead Profissional
                            </>
                        )}
                    </button>
                </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
