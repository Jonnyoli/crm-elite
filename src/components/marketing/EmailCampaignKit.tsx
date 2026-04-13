'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Mail, 
  Send,
  Building2,
  CheckCircle2,
  Loader2,
  Star,
  Target,
  MessageSquare,
  Copy,
  Check,
  UserCircle2,
  Paperclip
} from 'lucide-react';
import { useCRMStore } from '@/lib/store';
import { cn, formatCurrency } from '@/lib/utils';

export default function EmailCampaignKit() {
  const { properties, leads } = useCRMStore();
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(properties[0]?.id || null);
  const [tone, setTone] = useState<'SOCIAL' | 'INVESTOR' | 'BUSINESS'>('SOCIAL');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<{ subject: string; htmlContext: string; rawText: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);

  const handleGenerate = async () => {
    if (!selectedProperty) return;
    
    setIsGenerating(true);
    
    try {
      // Simulate API call using existing structure
      const response = await fetch('/api/ai/generate-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          property: {
            title: selectedProperty.address,
            location: selectedProperty.address,
            price: selectedProperty.price,
            rooms: selectedProperty.type,
            features: selectedProperty.features
          }, 
          tone 
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        const baseDesc = data.data.description;
        const teaser = data.data.teaser;
        
        let subject = '';
        if (tone === 'SOCIAL') subject = `✨ Oportunidade Única: Exclusivo ${selectedProperty.type} em Coimbra`;
        if (tone === 'INVESTOR') subject = `📈 Análise de Rentabilidade: ${selectedProperty.type} - Coimbra (${formatCurrency(selectedProperty.price)})`;
        if (tone === 'BUSINESS') subject = `🚀 Novo no Mercado: ${selectedProperty.address}`;

        const rawText = `Caro(a) Cliente,

Temos o prazer de lhe apresentar em primeira mão o nosso mais recente imóvel exclusivo.

${teaser}

${baseDesc}

Detalhes Otimizados:
- Tipologia: ${selectedProperty.type}
- Localização: ${selectedProperty.address}
- Valor: ${formatCurrency(selectedProperty.price)}
${selectedProperty.features.map((f: string) => `- ${f}`).join('\n')}

Se achar que este imóvel pode corresponder ao que procura, responda a este email para agendarmos uma primeira visita virtual sem compromisso.

Atentamente,
Direção Comercial SI Coimbra Mondego`;
        
        setAiResult({
            subject,
            rawText,
            htmlContext: 'Template Premium Aplicado'
        });
      }
    } catch (error) {
      console.error('Erro ao gerar email:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
      if(!aiResult) return;
      navigator.clipboard.writeText(aiResult.subject + '\n\n' + aiResult.rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Control Panel */}
      <div className="lg:col-span-4 space-y-8">
        <div className="bg-card border border-border rounded-[40px] p-8 shadow-sm space-y-8">
          <div>
            <h3 className="text-xl font-black mb-1">Email Marketing (Cold Outreach e Follow up)</h3>
            <p className="text-sm text-muted-foreground">Campanhas diretas super focadas na conversão.</p>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#FE6B00]">1. Imóvel de Destaque</label>
            <div className="space-y-2">
              {properties.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPropertyId(p.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-3xl border transition-all text-left",
                    selectedPropertyId === p.id 
                      ? "bg-emerald-500/10 border-emerald-500/40" 
                      : "bg-background border-border hover:border-white/20"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform",
                    selectedPropertyId === p.id ? "bg-emerald-500 text-white scale-110" : "bg-muted text-muted-foreground"
                  )}>
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className={cn(
                      "text-xs font-black truncate",
                      selectedPropertyId === p.id ? "text-emerald-500" : "text-white"
                    )}>{p.address.split(',')[0]}</p>
                    <p className="text-[10px] text-muted-foreground font-bold">{p.type} • {p.price.toLocaleString()}€</p>
                  </div>
                  {selectedPropertyId === p.id && (
                    <CheckCircle2 className="ml-auto w-5 h-5 text-emerald-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#FE6B00]">2. Tática de Venda</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'SOCIAL', label: 'Emocional', icon: Star },
                { id: 'INVESTOR', label: 'Rentabilidade', icon: Target },
                { id: 'BUSINESS', label: 'Urgência', icon: MessageSquare },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id as any)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all",
                    tone === t.id 
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-500" 
                      : "bg-background border-border text-muted-foreground hover:bg-muted"
                  )}
                >
                  <t.icon className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !selectedPropertyId}
            className={cn(
              "w-full py-5 rounded-[24px] font-black text-sm tracking-tight flex items-center justify-center gap-3 transition-all",
              isGenerating 
                ? "bg-muted text-muted-foreground opacity-50 cursor-not-allowed" 
                : "bg-emerald-500 text-white shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95"
            )}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Estruturando Email...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5" />
                Gerar Draft
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview Area (Email Client Mockup) */}
      <div className="lg:col-span-8">
          {aiResult && selectedProperty ? (
               <div className="bg-[#f0f2f5] text-slate-800 rounded-[32px] overflow-hidden shadow-2xl border border-gray-200 flex flex-col font-sans max-w-4xl mx-auto h-[800px]">
                  {/* Email Client Header Frame */}
                  <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                          <div className="flex gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-red-400" />
                              <div className="w-3 h-3 rounded-full bg-amber-400" />
                              <div className="w-3 h-3 rounded-full bg-green-400" />
                          </div>
                      </div>
                      <div className="flex items-center gap-4 text-gray-500">
                          <Paperclip className="w-4 h-4 cursor-pointer hover:text-slate-800" />
                          <Send className="w-4 h-4 cursor-pointer hover:text-emerald-500" />
                      </div>
                  </div>
                  
                  {/* Email Headers (To, From, Subject) */}
                  <div className="bg-white border-b border-gray-100 flex flex-col">
                      <div className="px-8 py-3 border-b border-gray-100 flex gap-4 text-sm">
                          <span className="text-gray-400 font-medium w-12">De:</span>
                          <span className="font-bold flex items-center gap-2">
                             <span className="w-5 h-5 bg-[#0B2A4A] text-white rounded flex items-center justify-center text-[8px] font-black">SI</span>
                             joao.oliveira@solucoesideais.pt
                          </span>
                      </div>
                      <div className="px-8 py-3 border-b border-gray-100 flex gap-4 text-sm">
                          <span className="text-gray-400 font-medium w-12">Para:</span>
                          <span className="text-gray-500 flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs">
                             <UserCircle2 className="w-3 h-3" />
                             lista_investidores@clients.com
                          </span>
                      </div>
                      <div className="px-8 py-4 flex items-center gap-4">
                          <span className="text-gray-400 font-medium w-12 text-sm">Assunto:</span>
                          <h2 className="font-bold text-lg">{aiResult.subject}</h2>
                      </div>
                  </div>

                  {/* HTML Email Body Container */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
                     <div className="bg-white mx-auto max-w-2xl rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                         {/* Email Template Header */}
                         <div className="bg-[#0B2A4A] p-6 text-center">
                             <h1 className="text-white text-2xl font-black tracking-tighter">SOLUÇÕES IDEAIS</h1>
                             <p className="text-[#FE6B00] text-[10px] font-black uppercase tracking-widest mt-1">Imóveis de Luxo (Elite)</p>
                         </div>
                         
                         {/* Property Image Banner */}
                         <img 
                           src={selectedProperty.imageUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200'} 
                           alt="Destaque" 
                           className="w-full h-64 object-cover"
                         />

                         {/* Text Body */}
                         <div className="p-8 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {aiResult.rawText}
                         </div>

                         {/* Call To Action */}
                         <div className="px-8 pb-8 flex justify-center">
                             <button className="px-8 py-3 bg-[#FE6B00] text-white font-black rounded-lg shadow-xl shadow-[#FE6B00]/20 w-fit">
                                 Ver Propriedade no Site
                             </button>
                         </div>

                         {/* Email Footer */}
                         <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
                             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">João Oliveira • Dir. Comercial</p>
                             <p className="text-[10px] text-gray-400 mt-2">Deseja deixar de receber? <span className="underline cursor-pointer">Unsubscribe</span></p>
                         </div>
                     </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="bg-white p-4 border-t border-gray-200 flex justify-end gap-3 shrink-0">
                      <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                          Gravar como Draft
                      </button>
                      <button 
                          onClick={copyToClipboard}
                          className="px-6 py-2 bg-emerald-500 text-white rounded-lg text-sm font-black flex items-center gap-2 hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                      >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copied ? 'Conteúdo Copiado!' : 'Copiar Texto Raw'}
                      </button>
                  </div>
               </div>
          ) : !isGenerating ? (
              <div className="h-full border-2 border-dashed border-white/5 rounded-[40px] p-20 bg-white/[0.02] flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-[40px] bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-12 h-12 text-emerald-500/50" />
                </div>
                <h3 className="text-2xl font-black text-white/20">Construtor de Newsletters (AI)</h3>
                <p className="text-muted-foreground/40 max-w-sm mx-auto text-sm mt-4">
                  Crie templates de e-mail profissionais para enviar a cold-leads ou investidores, num formato impossível de ignorar.
                </p>
              </div>
          ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-emerald-500 animate-pulse" />
                </div>
                <div className="space-y-2 mt-6">
                    <h3 className="text-xl font-bold">A modelar fluxo de email...</h3>
                    <p className="text-muted-foreground text-sm max-w-xs">A redigir introduções e compor os elementos de atração principal do Imóvel.</p>
                </div>
            </div>
          )}
      </div>
    </div>
  );
}
