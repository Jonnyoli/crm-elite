'use client';

import React, { useState } from 'react';
import { Building2, CheckCircle2, User, Phone, Mail, Euro } from 'lucide-react';
import { useCRMStore } from '@/lib/store';
import { LeadSource } from '@/types';

export default function OpenHousePage() {
  const { addLead } = useCRMStore();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '' // We will save the budget/comments here
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    await addLead({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      source: 'OPEN_HOUSE' as LeadSource,
      status: 'NOVO',
      notes: `Orçamento/Procura: ${formData.notes}`,
      tags: ['Open House Visitor']
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', phone: '', email: '', notes: '' });
      setIsSubmitted(false);
    }, 4000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#0a0d14] rounded-[40px] p-10 border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)] flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 text-emerald-500">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Bem-vindo!</h2>
          <p className="text-white/60 mb-8">Obrigado pela sua visita. O consultor entrará em contacto consigo brevemente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070a] relative flex items-center justify-center p-6 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#FE6B00]/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#0B2A4A]/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="w-full max-w-xl z-10">
        <div className="bg-[#0a0d14]/80 backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 luxury-shadow flex flex-col">
          <div className="mx-auto mb-10 w-20 h-20 bg-gradient-to-br from-[#FE6B00] to-[#FF8C33] rounded-[24px] flex items-center justify-center shadow-[0_0_30px_rgba(254,107,0,0.3)]">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl text-center font-black text-white font-outfit uppercase tracking-tighter mb-2">
            Open House
          </h1>
          <p className="text-center text-sm font-bold text-white/40 uppercase tracking-widest mb-10">
            Registo de Visita
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FE6B00]" />
                <input 
                  type="text" 
                  placeholder="Nome Completo *" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-16 pr-6 py-5 bg-black/40 border border-white/5 rounded-2xl text-white outline-none focus:border-[#FE6B00] focus:bg-white/5 transition-all text-lg font-medium"
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FE6B00]" />
                <input 
                  type="tel" 
                  placeholder="Número de Telemóvel *" 
                  required
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full pl-16 pr-6 py-5 bg-black/40 border border-white/5 rounded-2xl text-white outline-none focus:border-[#FE6B00] focus:bg-white/5 transition-all text-lg font-medium"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FE6B00]" />
                <input 
                  type="email" 
                  placeholder="Email Profissional/Pessoal" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-16 pr-6 py-5 bg-black/40 border border-white/5 rounded-2xl text-white outline-none focus:border-[#FE6B00] focus:bg-white/5 transition-all text-lg font-medium"
                />
              </div>
              <div className="relative">
                <Euro className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FE6B00]" />
                <input 
                  type="text" 
                  placeholder="Orçamento ou o que procura..." 
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="w-full pl-16 pr-6 py-5 bg-black/40 border border-white/5 rounded-2xl text-white outline-none focus:border-[#FE6B00] focus:bg-white/5 transition-all text-lg font-medium"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all si-gradient text-white shadow-[0_0_30px_rgba(254,107,0,0.3)] hover:scale-[1.02] active:scale-95 mt-6"
            >
              Confirmar Visita
            </button>
          </form>
          <p className="text-center mt-10 text-[10px] text-white/20 uppercase font-black tracking-widest">
            Soluções Ideais Coimbra - Mondego
          </p>
        </div>
      </div>
    </div>
  );
}
