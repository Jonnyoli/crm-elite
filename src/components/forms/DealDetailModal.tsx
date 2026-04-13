'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Trash2, 
  Building2, 
  Users, 
  CreditCard,
  Target,
  FileText,
  AlertTriangle,
  MessageCircle,
  Sparkles,
  UploadCloud,
  File
} from 'lucide-react';
import { useCRMStore } from '@/lib/store';
import { Deal } from '@/types';
import { cn, formatCurrency } from '@/lib/utils';
import BaseModal from '@/components/ui/BaseModal';

interface DealDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealId: string | null;
}

import LeadDetailModal from './LeadDetailModal';

export default function DealDetailModal({ isOpen, onClose, dealId }: DealDetailModalProps) {
  const { deals, leads, properties, deleteDeal } = useCRMStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDraggingDoc, setIsDraggingDoc] = useState(false);
  const [docs, setDocs] = useState<string[]>(['Ficha_Imovel.pdf']);
  const [showLeadModal, setShowLeadModal] = useState(false);

  if (!isOpen || !dealId) return null;

  const deal = deals.find(d => d.id === dealId);
  if (!deal) return null;

  const lead = leads.find(l => l.id === deal.leadId);
  const property = properties.find(p => p.id === deal.propertyId);

  const handleDelete = () => {
    deleteDeal(deal.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  // AI Assistant Logic
  const dealAgeDays = Math.floor((Date.now() - new Date(deal.createdAt).getTime()) / (1000 * 60 * 60 * 24));
  const isStagnant = dealAgeDays > 10;
  
  let aiSuggestion = "Este negócio está quente. Recomendamos validar a pré-aprovação de crédito do cliente para acelerar o fecho.";
  let whatsappMessage = `Olá ${lead?.name?.split(' ')[0]}, tudo bem? Como correu a análise da documentação que enviámos? Podemos ligar hoje ao final do dia para tirar dúvidas?`;
  
  if (isStagnant) {
      aiSuggestion = `O negócio está parado há ${dealAgeDays} dias na fase ${deal.stage}. Aconselhamos um check-in amigável por WhatsApp para reativar o interesse.`;
      whatsappMessage = `Olá ${lead?.name?.split(' ')[0]}! Há algum tempo que não falamos sobre a proposta. Tem alguma novidade ou dúvida que possamos ajudar a esclarecer? A equipa da Soluções Ideais está à sua disposição!`;
  }

  const handleWhatsApp = () => {
      if (!lead?.phone) return;
      // Strip spaces from phone
      const cleanPhone = lead.phone.replace(/\s/g, '');
      const url = `https://wa.me/351${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(url, '_blank');
  };

  const handleDocDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDraggingDoc(false);
      // Simulate taking the first file
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          const newDoc = e.dataTransfer.files[0].name;
          setDocs(prev => [...prev, newDoc]);
      }
  };

  return (
    <>
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
          className="w-full max-w-[1200px] h-[85vh] bg-[#0a0d14] border border-white/10 rounded-[40px] shadow-3xl overflow-hidden relative z-10 luxury-shadow flex flex-col lg:flex-row"
        >
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
            {/* Header Area */}
            <div className="relative h-48 lg:h-56 bg-[#0B2A4A] p-8 flex items-end overflow-hidden shrink-0">
              {property?.imageUrl && (
                <img 
                  src={property.imageUrl} 
                  alt="Property" 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-[#0a0d14]/80 to-transparent" />
              
              <button 
                onClick={onClose} 
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all z-20 lg:hidden"
              >
                  <X className="w-5 h-5" />
              </button>

              <div className="relative z-10 w-full">
                 <div className="flex gap-2 mb-3">
                    <span className="px-3 py-1 bg-[#FE6B00] text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                      {deal.stage.replace('_', ' ')}
                    </span>
                    {isStagnant && (
                        <span className="px-3 py-1 bg-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-red-500/20">
                          Estagnado ({dealAgeDays}d)
                        </span>
                    )}
                 </div>
                 <h2 className="text-3xl lg:text-5xl font-black text-white font-outfit uppercase tracking-tight">{deal.title}</h2>
              </div>
            </div>

            {/* Core Info Grid */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 grow">
              <div className="space-y-8">
                  {/* Financials */}
                  <div className="p-6 bg-white/5 border border-white/5 rounded-3xl">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4 flex items-center gap-2">
                          <CreditCard className="w-4 h-4" /> Detalhes Financeiros
                      </h3>
                      <div className="space-y-4">
                          <div>
                              <p className="text-sm font-medium text-white/50 mb-1">Valor do Negócio</p>
                              <p className="text-3xl font-black text-white">{formatCurrency(deal.value)}</p>
                          </div>
                          <div>
                              <p className="text-sm font-medium text-white/50 mb-1">Probabilidade de Fecho</p>
                              <div className="flex items-center gap-3">
                                  <span className={cn("text-xl font-black", deal.probability > 70 ? "text-emerald-500" : "text-amber-500")}>
                                      {deal.probability}%
                                  </span>
                                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                      <div 
                                          className={cn("h-full rounded-full transition-all duration-1000", deal.probability > 70 ? "bg-emerald-500" : "bg-amber-500")} 
                                          style={{ width: `${deal.probability}%` }}
                                      />
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Vault (Documents) */}
                  <div className="p-6 bg-white/5 border border-white/5 rounded-3xl flex flex-col overflow-hidden">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4 flex items-center gap-2">
                          <FileText className="w-4 h-4" /> Cofre do Negócio
                      </h3>
                      
                      {/* Dropzone */}
                      <div 
                          onDragOver={(e) => { e.preventDefault(); setIsDraggingDoc(true); }}
                          onDragLeave={() => setIsDraggingDoc(false)}
                          onDrop={handleDocDrop}
                          className={cn(
                              "border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center gap-2 text-center",
                              isDraggingDoc ? "border-primary bg-primary/5" : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                          )}
                      >
                          <UploadCloud className={cn("w-8 h-8 transition-colors", isDraggingDoc ? "text-primary" : "text-white/20")} />
                          <div>
                              <p className="text-sm font-bold text-white">Arrastar Documento</p>
                              <p className="text-xs text-white/40">CPCV, Identificação, Propostas</p>
                          </div>
                      </div>

                      {/* File List */}
                      {docs.length > 0 && (
                          <div className="mt-4 space-y-2">
                              {docs.map((doc, idx) => (
                                  <div key={idx} className="flex items-center gap-3 p-3 bg-black/20 rounded-xl border border-white/5">
                                      <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                                          <File className="w-4 h-4" />
                                      </div>
                                      <p className="text-xs font-bold text-white truncate flex-1">{doc}</p>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              </div>

              <div className="space-y-8 flex flex-col">
                  {/* Lead Info */}
                  <div 
                     onClick={() => { if (lead) setShowLeadModal(true) }}
                     className="p-6 bg-white/5 border border-white/5 rounded-3xl hover:border-[#FE6B00]/40 transition-all cursor-pointer group"
                  >
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4 flex items-center justify-between">
                          <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Lead Associado</span>
                          <span className="text-[#FE6B00] group-hover:underline">VER FICHA</span>
                      </h3>
                      {lead ? (
                          <div>
                              <p className="text-lg font-black text-white">{lead.name}</p>
                              <p className="text-sm text-white/60 mt-1">{lead.email}</p>
                              <p className="text-sm text-white/60">{lead.phone}</p>
                          </div>
                      ) : (
                          <p className="text-sm text-white/40">Sem lead associado.</p>
                      )}
                  </div>

                  {/* Property Info */}
                  <div className="p-6 bg-white/5 border border-white/5 rounded-3xl">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4 flex items-center gap-2">
                          <Building2 className="w-4 h-4" /> Imóvel
                      </h3>
                      {property ? (
                          <div>
                              <p className="text-lg font-black text-white">{property.address}</p>
                              <div className="flex gap-2 mt-2">
                                  <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold text-white/80 uppercase">{property.type}</span>
                                  <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold text-white/80 uppercase">{formatCurrency(property.price)}</span>
                              </div>
                          </div>
                      ) : (
                          <p className="text-sm text-white/40">Nenhum imóvel específico associado ainda.</p>
                      )}
                  </div>

                  {/* Actions */}
                  <div className="flex-1 flex flex-col justify-end mt-4">
                      {showDeleteConfirm ? (
                          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
                              <h4 className="text-red-500 font-bold flex items-center gap-2 mb-2">
                                  <AlertTriangle className="w-4 h-4" /> Tem a certeza?
                              </h4>
                              <p className="text-xs text-white/60 mb-4">Esta ação é irreversível e removerá este negócio da base de dados.</p>
                              <div className="flex gap-3">
                                  <button 
                                      onClick={() => setShowDeleteConfirm(false)}
                                      className="flex-1 py-2 text-xs font-bold text-white bg-white/10 rounded-xl hover:bg-white/20 transition-all"
                                  >
                                      Cancelar
                                  </button>
                                  <button 
                                      onClick={handleDelete}
                                      className="flex-1 py-2 text-xs font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all"
                                  >
                                      Apagar
                                  </button>
                              </div>
                          </div>
                      ) : (
                          <div className="flex gap-4">
                              <button className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all">
                                  Editar Negócio
                              </button>
                              <button 
                                  onClick={() => setShowDeleteConfirm(true)}
                                  className="px-5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl transition-all flex items-center justify-center border border-red-500/10"
                              >
                                  <Trash2 className="w-5 h-5" />
                              </button>
                          </div>
                      )}
                  </div>
              </div>
            </div>
          </div>

          {/* AI Companion Sidebar */}
          <div className="w-full lg:w-[380px] bg-white/[0.02] border-l border-white/5 flex flex-col shrink-0">
             <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                 <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FE6B00] to-amber-500 flex items-center justify-center shadow-lg shadow-primary/20">
                         <Sparkles className="w-5 h-5 text-white" />
                     </div>
                     <div>
                         <h3 className="font-black text-white uppercase tracking-tight text-lg">AI Assistant</h3>
                         <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Conselheiro Virtual</p>
                     </div>
                 </div>
                 <button 
                    onClick={onClose} 
                    className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all hidden lg:block"
                 >
                    <X className="w-4 h-4" />
                 </button>
             </div>

             <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
                 {/* Analysis Card */}
                 <div className="bg-black/20 border border-white/5 rounded-2xl p-5 space-y-3">
                     <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black uppercase tracking-widest text-[#FE6B00]">Análise de Viabilidade</span>
                         <div className="flex space-x-1">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-75" />
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-150" />
                         </div>
                     </div>
                     <p className="text-sm text-white/80 leading-relaxed font-medium">
                         {aiSuggestion}
                     </p>
                 </div>

                 {/* Recommended Action */}
                 <div className="space-y-3">
                     <span className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Ação Recomendada</span>
                     <div className="bg-[#25D366]/10 border border-[#25D366]/20 rounded-2xl p-5 relative overflow-hidden group">
                         <MessageCircle className="absolute -right-4 -bottom-4 w-24 h-24 text-[#25D366]/10 group-hover:scale-110 transition-transform duration-500" />
                         
                         <div className="relative z-10">
                             <p className="text-xs text-white/60 mb-4 line-clamp-3 italic">
                                "{whatsappMessage}"
                             </p>
                             <button 
                                onClick={handleWhatsApp}
                                className="w-full py-3 bg-[#25D366] hover:bg-[#20BE5C] text-black font-black uppercase text-[10px] tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,211,102,0.2)]"
                             >
                                 <MessageCircle className="w-4 h-4" />
                                 Abrir WhatsApp
                             </button>
                         </div>
                     </div>
                 </div>

                 {/* History / Feed mock */}
                 <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
                     <span className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Timeline de Fecho</span>
                     <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-white/10">
                         <div className="relative pl-8">
                             <div className="absolute left-0 top-1 w-[22px] h-[22px] rounded-full bg-[#0a0d14] border-2 border-[#FE6B00] flex items-center justify-center">
                                 <div className="w-1.5 h-1.5 rounded-full bg-[#FE6B00]" />
                             </div>
                             <p className="text-xs font-bold text-white">Negócio Criado</p>
                             <p className="text-[10px] text-white/40">{new Date(deal.createdAt).toLocaleDateString()}</p>
                         </div>
                         <div className="relative pl-8 opacity-50">
                             <div className="absolute left-0 top-1 w-[22px] h-[22px] rounded-full bg-[#0a0d14] border-2 border-white/20" />
                             <p className="text-xs font-bold text-white">Assinatura CPCV</p>
                             <p className="text-[10px] text-white/40">Pendente</p>
                         </div>
                     </div>
                 </div>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>

    {/* Lead Details Child Modal */}
    <LeadDetailModal 
       isOpen={showLeadModal}
       onClose={() => setShowLeadModal(false)}
       leadId={lead?.id || null}
    />
    </>
  );
}
