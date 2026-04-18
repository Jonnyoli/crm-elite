'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar as CalendarIcon, 
  Tag as TagIcon,
  MessageCircle,
  Briefcase,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  CalendarDays,
  FileText,
  Upload,
  File
} from 'lucide-react';
import { useCRMStore } from '@/lib/store';
import { cn, formatDate, formatCurrency } from '@/lib/utils';
import Link from 'next/link';

interface LeadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string | null;
}

export default function LeadDetailModal({ isOpen, onClose, leadId }: LeadDetailModalProps) {
  const { leads, deals, tasks, deleteLead } = useCRMStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen || !leadId) return null;

  const lead = leads.find(l => l.id === leadId);
  if (!lead) return null;

  const leadDeals = deals.filter(d => d.leadId === lead.id);
  const leadTasks = tasks.filter(t => t.leadId === lead.id);

  const handleDelete = () => {
    deleteLead(lead.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const cleanPhone = lead.phone.replace(/\s/g, '');
  const baseWaUrl = `https://wa.me/351${cleanPhone}?text=`;
  const firstName = lead.name.split(' ')[0];
  
  const waTemplates = [
    { id: '1', icon: CalendarDays, label: 'Agendar Visita', msg: `Olá ${firstName}, sou o seu consultor na Soluções Ideais. Gostaria de agendar uma visita para ver os imóveis que falámos?` },
    { id: '2', icon: FileText, label: 'Enviar Brochura', msg: `Olá ${firstName}, conforme o nosso contacto, envio em anexo a brochura com todas as informações do imóvel.` },
    { id: '3', icon: Send, label: 'Follow Up', msg: `Olá ${firstName}! Como correu a visita? Teria interesse em avançar com uma proposta?` },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#05070a]/90 backdrop-blur-xl"
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-[900px] max-h-[85vh] bg-[#0a0d14] border border-white/10 rounded-[40px] shadow-3xl overflow-hidden relative z-10 luxury-shadow flex flex-col"
        >
          {/* Header Area */}
          <div className="relative p-8 pb-10 bg-gradient-to-b from-[#0B2A4A] to-[#0a0d14] border-b border-white/5 flex shrink-0">
            <button 
              onClick={onClose} 
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
            >
                <X className="w-5 h-5" />
            </button>
            <div className="flex gap-6 items-end">
                <div className="w-24 h-24 rounded-[32px] bg-[#FE6B00] flex items-center justify-center text-white font-black text-4xl shadow-xl shadow-[#FE6B00]/20 border border-white/10">
                    {lead.name.charAt(0)}
                </div>
                <div>
                   <div className="flex gap-2 mb-3">
                      <span className="px-3 py-1 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                        {lead.status.replace('_', ' ')}
                      </span>
                      <span className="px-3 py-1 bg-white/5 text-white/50 text-[10px] font-black uppercase tracking-widest rounded-lg">
                        Origem: {lead.source}
                      </span>
                   </div>
                   <h2 className="text-3xl lg:text-4xl font-black text-white font-outfit uppercase tracking-tight">{lead.name}</h2>
                </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Left Column: Contact & Metadata */}
             <div className="space-y-6">
                 <div className="bg-white/5 border border-white/5 rounded-3xl p-6">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">Informação de Contacto</h3>
                     <div className="space-y-4">
                         <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#FE6B00]">
                                 <Mail className="w-4 h-4" />
                             </div>
                             <div>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Email</p>
                                 <p className="text-sm font-bold text-white">{lead.email}</p>
                             </div>
                         </div>
                         <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#FE6B00]">
                                 <Phone className="w-4 h-4" />
                             </div>
                             <div>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Telefone</p>
                                 <p className="text-sm font-bold text-white">{lead.phone}</p>
                             </div>
                         </div>
                         <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#FE6B00]">
                                 <CalendarIcon className="w-4 h-4" />
                             </div>
                             <div>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Data de Entrada</p>
                                 <p className="text-sm font-bold text-white">{formatDate(lead.createdAt)}</p>
                             </div>
                         </div>
                     </div>
                     <div className="mt-6 pt-6 border-t border-white/5 space-y-2">
                        <div className="flex items-center gap-2 mb-3">
                           <MessageCircle className="w-4 h-4 text-[#25D366]" />
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-white/50">WhatsApp Actions</h4>
                        </div>
                        {waTemplates.map(t => (
                            <a 
                               key={t.id}
                               href={baseWaUrl + encodeURIComponent(t.msg)}
                               target="_blank"
                               className="w-full flex items-center justify-between px-4 py-2.5 bg-white/5 hover:bg-[#25D366]/10 text-white hover:text-[#25D366] border border-transparent hover:border-[#25D366]/20 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all group"
                            >
                                <span className="flex items-center gap-2">
                                    <t.icon className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                                    {t.label}
                                </span>
                                <Send className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </a>
                        ))}
                     </div>
                 </div>

                 <div className="bg-white/5 border border-white/5 rounded-3xl p-6">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">Notas e Etiquetas (Tags)</h3>
                     {lead.notes ? (
                         <p className="text-sm text-white/60 leading-relaxed mb-6">{lead.notes}</p>
                     ) : (
                         <p className="text-sm text-white/20 italic mb-6">Nenhuma nota associada.</p>
                     )}
                     <div className="flex flex-wrap gap-2">
                        {(lead.tags || []).map(tag => (
                          <span key={tag} className="text-[10px] bg-[#FE6B00]/10 text-[#FE6B00] px-3 py-1 rounded-lg font-black uppercase tracking-widest flex items-center gap-1.5">
                            <TagIcon className="w-3 h-3" /> {tag}
                          </span>
                        ))}
                     </div>
                 </div>
             </div>

             {/* Right Column: Deals & Tasks */}
             <div className="space-y-6 flex flex-col">
                 <div className="bg-white/5 border border-white/5 rounded-3xl p-6">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4 flex items-center gap-2">
                         <Briefcase className="w-4 h-4" /> Negócios Associados ({leadDeals.length})
                     </h3>
                     <div className="space-y-3">
                         {leadDeals.length === 0 ? (
                             <p className="text-xs text-white/30 font-bold uppercase tracking-widest">Nenhum negócio no funil.</p>
                         ) : (
                             leadDeals.map(d => (
                                 <div key={d.id} className="p-3 bg-black/20 rounded-2xl border border-white/5">
                                     <div className="flex justify-between items-start mb-1">
                                         <p className="text-xs font-black text-white">{d.title}</p>
                                         <span className="text-[8px] font-black uppercase tracking-widest text-white/40 bg-white/5 px-2 py-0.5 rounded-md">{d.stage.replace('_', ' ')}</span>
                                     </div>
                                     <p className="text-xs font-bold text-[#FE6B00]">{formatCurrency(d.value)} • {d.probability}% Probabilidade</p>
                                 </div>
                             ))
                         )}
                     </div>
                 </div>

                 <div className="bg-white/5 border border-white/5 rounded-3xl p-6 flex-1">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4 flex items-center gap-2">
                         <Clock className="w-4 h-4" /> Próximas Ações
                     </h3>
                     <div className="space-y-3">
                         {leadTasks.length === 0 ? (
                             <p className="text-xs text-white/30 font-bold uppercase tracking-widest">Nenhuma tarefa pendente.</p>
                         ) : (
                             leadTasks.filter(t => !t.isCompleted).slice(0, 3).map(t => (
                                 <div key={t.id} className="flex gap-3 items-start p-3 bg-black/20 rounded-2xl border border-white/5">
                                     <div className="mt-0.5">
                                         {t.priority === 'ALTA' ? <AlertTriangle className="w-4 h-4 text-red-500" /> : <Clock className="w-4 h-4 text-emerald-500" />}
                                     </div>
                                     <div>
                                         <p className="text-xs font-black text-white">{t.title}</p>
                                         <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold">{new Date(t.dueDate).toLocaleDateString()}</p>
                                     </div>
                                 </div>
                             ))
                         )}
                     </div>
                 </div>

                 <div className="bg-white/5 border border-white/5 rounded-3xl p-6">
                     <div className="flex items-center justify-between mb-4">
                         <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                             <File className="w-4 h-4" /> Documentos Anexos
                         </h3>
                         <button className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-all">
                             <Upload className="w-3.5 h-3.5" />
                         </button>
                     </div>
                     <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer group">
                         <Upload className="w-8 h-8 text-white/20 mx-auto mb-2 group-hover:text-white/50 group-hover:-translate-y-1 transition-all" />
                         <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Arraste PDFs ou Clique</p>
                         <p className="text-[8px] font-bold text-white/20 mt-1">CPCV, Contratos, etc.</p>
                     </div>
                 </div>

                 {/* Delete Action Base */}
                 <div className="mt-4">
                     {showDeleteConfirm ? (
                          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
                              <h4 className="text-red-500 font-bold flex items-center gap-2 mb-2">
                                  <AlertTriangle className="w-4 h-4" /> Tem a certeza?
                              </h4>
                              <p className="text-xs text-white/60 mb-4">Esta ação apagará a Lead e todos os negócios associados a ela da Base de Dados.</p>
                              <div className="flex gap-3">
                                  <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2 text-xs font-bold text-white bg-white/10 rounded-xl hover:bg-white/20 transition-all">Cancelar</button>
                                  <button onClick={handleDelete} className="flex-1 py-2 text-xs font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all">Apagar Tudo</button>
                              </div>
                          </div>
                      ) : (
                          <div className="flex justify-end pt-4 border-t border-white/5">
                             <button 
                                onClick={() => setShowDeleteConfirm(true)}
                                className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center border border-red-500/10"
                             >
                                 <Trash2 className="w-3.5 h-3.5 mr-2" /> Apagar Lead Definitivamente
                             </button>
                          </div>
                      )}
                 </div>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
