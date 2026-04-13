'use client';

import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  Plus, 
  ChevronRight, 
  Sparkles, 
  Printer, 
  RefreshCcw, 
  CheckCircle2,
  Building2,
  Layout,
  MessageSquare,
  Zap,
  Loader2,
  Star,
  Target
} from 'lucide-react';
import { useCRMStore } from '@/lib/store';
import { Property } from '@/types';
import { cn } from '@/lib/utils';
import PremiumFlyerTemplate from './PremiumFlyerTemplate';

export default function FlyerGenerator() {
  const { properties } = useCRMStore();
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(properties[0]?.id || null);
  const [tone, setTone] = useState<'SOCIAL' | 'INVESTOR' | 'BUSINESS'>('SOCIAL');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [aiResult, setAiResult] = useState<{ teaser: string; description: string } | null>(null);

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);

  const handleGenerate = async () => {
    if (!selectedProperty) return;
    
    setIsGenerating(true);
    setShowPreview(false);
    
    try {
      // Usar a API real de geração de AD adaptada para Flyer
      const response = await fetch('/api/ai/generate-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          property: {
            title: selectedProperty.address,
            location: selectedProperty.address, // Simplificado
            price: selectedProperty.price,
            rooms: selectedProperty.type,
          }, 
          tone 
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setAiResult({
          teaser: data.data.teaser,
          description: data.data.description
        });
        setShowPreview(true);
      }
    } catch (error) {
      console.error('Erro ao gerar flyer:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const previewRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = async () => {
    if (!previewRef.current) return;
    
    // Add temporary class to ensure rendering isn't clipped
    const element = previewRef.current;
    
    try {
        const canvas = await html2canvas(element, {
            scale: 2, // High resolution
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });
        
        const imgWidth = 210; // A4 size in mm
        const pageHeight = 297;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
        pdf.save(`Flyer_SI_${selectedProperty?.address.split(',')[0]}.pdf`);
        
    } catch (error) {
        console.error('Erro na exportação para PDF:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Control Panel */}
      <div className="lg:col-span-4 space-y-8 no-print">
        <div className="bg-card border border-border rounded-[40px] p-8 shadow-sm space-y-8">
          <div>
            <h3 className="text-xl font-black mb-1">Configuração do Flyer</h3>
            <p className="text-sm text-muted-foreground">Personalize o seu material de venda.</p>
          </div>

          {/* Property Selector */}
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

          {/* Tone Selector */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#FE6B00]">2. Tom da Comunicação (AI)</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'SOCIAL', label: 'Luxo', icon: Star },
                { id: 'INVESTOR', label: 'Investidor', icon: Target },
                { id: 'BUSINESS', label: 'Comercial', icon: MessageSquare },
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

          {/* Action Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !selectedPropertyId}
            className={cn(
              "w-full py-5 rounded-[24px] font-black text-sm tracking-tight flex items-center justify-center gap-3 transition-all",
              isGenerating 
                ? "bg-muted text-muted-foreground opacity-50 cursor-not-allowed" 
                : "si-gradient text-white shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95"
            )}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Refinando com IA...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Gerar Flyer Inteligente
              </>
            )}
          </button>
        </div>

        {/* Tips / Help */}
        <div className="bg-[#0B2A4A]/50 border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
           <Zap className="absolute top-0 right-0 p-4 w-12 h-12 text-[#FE6B00] opacity-10 group-hover:opacity-20 transition-opacity" />
           <p className="text-[10px] font-black uppercase tracking-widest text-[#FE6B00] mb-2">Dica de Especialista</p>
           <p className="text-xs text-white/60 font-medium leading-relaxed italic">
             "O tom 'Investidor' foca-se em rentabilidade e localização, perfeito para captar gestores de portfólio."
           </p>
        </div>
      </div>

      {/* Preview Area */}
      <div className={cn(
        "lg:col-span-8 flex flex-col gap-6",
        !showPreview && "flex items-center justify-center border-2 border-dashed border-white/5 rounded-[40px] p-20 bg-white/[0.02]"
      )}>
        {showPreview && selectedProperty && aiResult ? (
          <>
            <div className="flex items-center justify-between no-print">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold">Pré-visualização do Flyer</h3>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowPreview(false)}
                  className="flex items-center gap-2 px-6 py-3 bg-muted hover:bg-white/10 rounded-2xl text-sm font-bold transition-all"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Gerar Outro
                </button>
                <button 
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-white/90 rounded-2xl text-sm font-black transition-all shadow-xl"
                >
                  <Printer className="w-4 h-4" />
                  Exportar PDF
                </button>
              </div>
            </div>
            
            <div className="overflow-auto max-h-[1000px] rounded-3xl shadow-3xl bg-white p-4 custom-scrollbar">
               <div ref={previewRef} className="bg-white">
                   <PremiumFlyerTemplate 
                     property={selectedProperty} 
                     aiCopy={aiResult} 
                   />
               </div>
            </div>
            
            <div className="p-8 bg-[#FE6B00]/5 border border-[#FE6B00]/10 rounded-3xl flex items-center justify-between no-print">
                <div className="flex items-center gap-4">
                    <Sparkles className="w-10 h-10 text-[#FE6B00]" />
                    <div>
                        <p className="text-xs font-black uppercase text-[#FE6B00]">Refinado pela Antigravity AI</p>
                        <p className="text-sm text-white/60">O conteúdo foi otimizado para conversão no mercado de Coimbra.</p>
                    </div>
                </div>
                <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0B2A4A] bg-muted overflow-hidden">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 12}`} alt="user" />
                        </div>
                    ))}
                </div>
            </div>
          </>
        ) : !isGenerating && (
          <div className="text-center space-y-4">
            <div className="w-24 h-24 rounded-[40px] bg-slate-100/10 flex items-center justify-center mx-auto mb-6">
              <Layout className="w-12 h-12 text-muted-foreground/30" />
            </div>
            <h3 className="text-2xl font-black text-white/20">Aguardando Geração</h3>
            <p className="text-muted-foreground/40 max-w-xs mx-auto text-sm">
              Configure as opções à esquerda e clique em gerar para criar o material de marketing.
            </p>
          </div>
        )}
        
        {isGenerating && (
            <div className="flex flex-col items-center gap-6 text-center">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary animate-pulse" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold">Gerando Peça de Marketing Premium</h3>
                    <p className="text-muted-foreground text-sm max-w-xs">Analisando caraterísticas do imóvel e adaptando o tom para o público selecionado...</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
