'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal,
  Building2,
  CheckCircle2,
  Loader2,
  Star,
  Target,
  MessageSquare,
  Copy,
  Check
} from 'lucide-react';
import { useCRMStore } from '@/lib/store';
import { cn, formatCurrency } from '@/lib/utils';

export default function SocialMediaKit() {
  const { properties } = useCRMStore();
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(properties[0]?.id || null);
  const [tone, setTone] = useState<'SOCIAL' | 'INVESTOR' | 'BUSINESS'>('SOCIAL');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<{ instagram: string; facebook: string; hashtags: string } | null>(null);
  const [copiedStates, setCopiedStates] = useState<{ig: boolean, fb: boolean}>({ig: false, fb: false});

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);

  const handleGenerate = async () => {
    if (!selectedProperty) return;
    
    setIsGenerating(true);
    
    try {
      // Usar a mesma API mas obter a publicidade adaptada
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
        // Mock adapting the description into social formats since the API currently returns teaser/description
        // In a real app we would have a specific prompt for IG/FB
        const baseDesc = data.data.description;
        const teaser = data.data.teaser;
        
        setAiResult({
            instagram: `✨ ${teaser}\n\n🏡 Novo imóvel Exclusivo em Coimbra!\n${baseDesc.substring(0, 120)}...\n\nDescubra este fantástico ${selectedProperty.type} por ${formatCurrency(selectedProperty.price)}.\n\n👉 Link na bio para visita virtual!`,
            facebook: `🚀 Acabou de entrar no mercado!\n\n${teaser}\n\n📍 ${selectedProperty.address}\n\n${baseDesc}\n\nCaracterísticas principais:\n${selectedProperty.features.map(f => `✅ ${f}`).join('\n')}\n\n💰 Valor de investimento: ${formatCurrency(selectedProperty.price)}\n\nEntre em contacto com a nossa equipa especializada na SI Coimbra Mondego para agendar a sua visita, ou clique no link partilhado abaixo para explorar em 3D.`,
            hashtags: '#solucoesideais #imobiliariacoimbra #luxurymarket #realestate #coimbracity'
        });
      }
    } catch (error) {
      console.error('Erro ao gerar posts:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, type: 'ig' | 'fb') => {
      navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({...prev, [type]: true}));
      setTimeout(() => {
          setCopiedStates(prev => ({...prev, [type]: false}));
      }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Control Panel */}
      <div className="lg:col-span-4 space-y-8">
        <div className="bg-card border border-border rounded-[40px] p-8 shadow-sm space-y-8">
          <div>
            <h3 className="text-xl font-black mb-1">Posts Redes Sociais</h3>
            <p className="text-sm text-muted-foreground">Conteúdo otimizado automaticamente.</p>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#FE6B00]">1. Selecionar Imóvel</label>
            <div className="space-y-2">
              {properties.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPropertyId(p.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-3xl border transition-all text-left",
                    selectedPropertyId === p.id 
                      ? "bg-primary/5 border-primary/40" 
                      : "bg-background border-border hover:border-white/20"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform",
                    selectedPropertyId === p.id ? "bg-primary text-white scale-110" : "bg-muted text-muted-foreground"
                  )}>
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className={cn(
                      "text-xs font-black truncate",
                      selectedPropertyId === p.id ? "text-primary" : "text-white"
                    )}>{p.address.split(',')[0]}</p>
                    <p className="text-[10px] text-muted-foreground font-bold">{p.type} • {p.price.toLocaleString()}€</p>
                  </div>
                  {selectedPropertyId === p.id && (
                    <CheckCircle2 className="ml-auto w-5 h-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#FE6B00]">2. Tom de Voz</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'SOCIAL', label: 'Inspirador', icon: Star },
                { id: 'INVESTOR', label: 'Analítico', icon: Target },
                { id: 'BUSINESS', label: 'Urgência', icon: MessageSquare },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id as any)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all",
                    tone === t.id 
                      ? "bg-primary/10 border-primary text-primary" 
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
                : "bg-indigo-500 text-white shadow-2xl shadow-indigo-500/40 hover:scale-105 active:scale-95"
            )}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Criando Copy...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Gerar Posts
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="lg:col-span-8">
          {aiResult && selectedProperty ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Instagram Mockup */}
                  <div className="bg-white text-black rounded-[32px] overflow-hidden shadow-2xl border border-gray-200 flex flex-col font-sans">
                      <div className="p-4 flex items-center justify-between border-b border-gray-100">
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600 p-0.5">
                                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center border-2 border-white overflow-hidden">
                                       <span className="text-[10px] font-black tracking-tighter text-[#0B2A4A]">SI</span>
                                  </div>
                              </div>
                              <span className="font-bold text-xs">solucoes.ideais.coimbra</span>
                          </div>
                          <MoreHorizontal className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="aspect-square bg-gray-100 relative group overflow-hidden">
                          <img src={selectedProperty.imageUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800'} alt="Property" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute top-4 right-4 bg-indigo-500 text-white p-2 rounded-full shadow-xl">
                              <InstagramIcon className="w-5 h-5" />
                          </div>
                      </div>
                      <div className="p-4 space-y-3 flex-1 flex flex-col">
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                  <Heart className="w-6 h-6" />
                                  <MessageCircle className="w-6 h-6" />
                                  <Send className="w-6 h-6" />
                              </div>
                              <Bookmark className="w-6 h-6" />
                          </div>
                          <p className="text-xs font-bold">124 Likes</p>
                          <div className="text-sm whitespace-pre-wrap flex-1">
                              <span className="font-bold mr-2">solucoes.ideais.coimbra</span>
                              {aiResult.instagram}
                              <p className="text-indigo-500 mt-2 text-xs">{aiResult.hashtags}</p>
                          </div>
                          <button 
                              onClick={() => copyToClipboard(aiResult.instagram + '\n' + aiResult.hashtags, 'ig')}
                              className="w-full py-3 mt-4 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition-colors"
                          >
                              {copiedStates.ig ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                              {copiedStates.ig ? 'Copiado!' : 'Copiar Texto IG'}
                          </button>
                      </div>
                  </div>

                  {/* Facebook Mockup */}
                  <div className="bg-white text-black rounded-[32px] overflow-hidden shadow-2xl border border-gray-200 flex flex-col font-sans">
                      <div className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#0B2A4A] flex items-center justify-center text-white">
                                  <span className="text-[12px] font-black tracking-tighter">SI</span>
                              </div>
                              <div>
                                  <h4 className="font-bold text-sm leading-tight text-[#1877F2]">Soluções Ideais Coimbra</h4>
                                  <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                      <span>Patrocinado</span> • <GlobeIcon className="w-3 h-3" />
                                  </div>
                              </div>
                          </div>
                          <MoreHorizontal className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="p-4 pt-0 text-sm whitespace-pre-wrap flex-1">
                          {aiResult.facebook}
                      </div>
                      <div className="aspect-[4/3] bg-gray-100 relative group overflow-hidden">
                          <img src={selectedProperty.imageUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800'} alt="Property" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-x-0 bottom-0 bg-gray-100 p-3 flex justify-between items-center border-t border-gray-200">
                              <div>
                                  <p className="text-[10px] text-gray-500 uppercase">SOLUCOESIDEAIS.PT</p>
                                  <p className="font-bold text-sm">Descubra em 3D</p>
                              </div>
                              <button className="px-4 py-1.5 bg-gray-300 font-bold text-xs rounded-lg">Saber mais</button>
                          </div>
                          <div className="absolute top-4 right-4 bg-[#1877F2] text-white p-2 rounded-full shadow-xl">
                              <FacebookIcon className="w-5 h-5" />
                          </div>
                      </div>
                      <div className="p-4 pt-2">
                           <button 
                              onClick={() => copyToClipboard(aiResult.facebook, 'fb')}
                              className="w-full py-3 bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition-colors"
                          >
                              {copiedStates.fb ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              {copiedStates.fb ? 'Copiado!' : 'Copiar Texto FB'}
                          </button>
                      </div>
                  </div>
              </div>
          ) : !isGenerating ? (
              <div className="h-full border-2 border-dashed border-white/5 rounded-[40px] p-20 bg-white/[0.02] flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-[40px] bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
                  <Share2Icon className="w-12 h-12 text-indigo-500/50" />
                </div>
                <h3 className="text-2xl font-black text-white/20">Social Media Kit</h3>
                <p className="text-muted-foreground/40 max-w-sm mx-auto text-sm mt-4">
                  Selecione um imóvel predefinido e a nossa IA irá escrever copy altamente envolvente para o Instagram e Facebook, otimizado para o seu público em Coimbra.
                </p>
              </div>
          ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-500 animate-pulse" />
                </div>
                <div className="space-y-2 mt-6">
                    <h3 className="text-xl font-bold">A criar magia...</h3>
                    <p className="text-muted-foreground text-sm max-w-xs">Analisando o tom e formulando as hashtags ideais para o algoritmo.</p>
                </div>
            </div>
          )}
      </div>
    </div>
  );
}

// Pequenos icons complementares para Mockups
function GlobeIcon(props: any) {
    return <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>;
}

function Share2Icon(props: any) {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
}

function FacebookIcon(props: any) {
    return <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>;
}

function InstagramIcon(props: any) {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
}
