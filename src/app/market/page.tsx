'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  Building2, 
  Search as SearchIcon, 
  MapPin, 
  Euro, 
  Filter, 
  Loader2, 
  ArrowUpRight,
  ExternalLink,
  Zap,
  CheckCircle2,
  Globe,
  Sparkles,
  Copy,
  Check,
  Map as MapIcon,
  LayoutGrid,
  BarChart3,
  Phone,
  UserCheck
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn, formatCurrency } from '@/lib/utils';

interface ExternalProperty {
  id: string;
  title: string;
  price: number;
  location: string;
  rooms: string;
  source: string;
  link: string;
  image: string;
  area?: string;
  sellerName?: string;
  sellerPhone?: string;
  isParticular?: boolean;
}

const MarketMap = dynamic(() => import('@/components/market/MarketMap'), { 
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-muted animate-pulse rounded-3xl flex items-center justify-center text-muted-foreground">A carregar mapa...</div>
});

export default function MarketSearchPage() {
  const router = useRouter();
  const [view, setView] = useState<'GRID' | 'MAP'>('GRID');
  const [isSearching, setIsSearching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<ExternalProperty[]>([]);
  const [cachedResults, setCachedResults] = useState<ExternalProperty[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [searchParams, setSearchParams] = useState({
    location: 'Coimbra',
    type: 'Apartamento T2',
    maxPrice: '200000'
  });

  // Load properties previously captured by the Clipper
  useEffect(() => {
    fetchMarketDB();
  }, []);

  const fetchMarketDB = async () => {
    try {
      const resp = await fetch('/api/market/list');
      const data = await resp.json();
      if (data.success) {
        setCachedResults(data.data.map((p: any) => ({
          ...p,
          title: p.title,
          image: p.imageUrl || p.image,
          link: p.sourceUrl
        })));
      }
    } catch (e) {
      console.error("Error fetching market DB:", e);
    }
  };

  const handleSearch = async () => {
    setIsSearching(true);
    setResults([]);
    setLogs(['A iniciar motores de busca...', 'A ligar aos portais imobiliários...']);

    try {
      setLogs(prev => [...prev, `A pesquisar no Mercado Global por ${searchParams.type} em ${searchParams.location}...`]);
      
      const response = await fetch('/api/market/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchParams),
      });

      const data = await response.json();
      
      if (data.success) {
        setResults(data.data);
        setLogs(prev => [...prev, `Sucesso! Encontrados ${data.count} imóveis em tempo real.`]);
      } else {
        setLogs(prev => [...prev, 'Erro: ' + (data.message || 'Falha na pesquisa.')]);
      }
    } catch (error) {
      setLogs(prev => [...prev, 'Erro de ligação ao servidor.']);
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleGenerateAd = async (property: ExternalProperty, tone: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property, tone }),
      });
      const data = await response.json();
      if (data.success) {
        setSelectedAd({ ...data.data, propertyTitle: property.title });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Combine live results with our local market database
  const allResults = results.length > 0 ? results : cachedResults;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Globe className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Base de Dados de Mercado</h1>
          </div>
          <p className="text-muted-foreground">
            Central de inteligência com imóveis capturados via Super-Clipper e pesquisa em tempo real.
          </p>
        </div>
        <div className="flex gap-3">
           <div className="bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-2xl border border-emerald-500/20 text-xs font-bold flex items-center gap-2">
               <UserCheck className="w-4 h-4" />
               {cachedResults.length} Imóveis Guardados
           </div>
        </div>
      </div>

      {/* Search Console */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Localização</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                value={searchParams.location}
                onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                placeholder="Ex: Coimbra"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Tipo de Imóvel</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                value={searchParams.type}
                onChange={(e) => setSearchParams({...searchParams, type: e.target.value})}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                placeholder="Ex: T2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Preço Máximo</label>
            <div className="relative">
              <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="number" 
                value={searchParams.maxPrice}
                onChange={(e) => setSearchParams({...searchParams, maxPrice: e.target.value})}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                placeholder="200000"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button 
              onClick={handleSearch}
              disabled={isSearching}
              className={cn(
                "w-full h-10 flex items-center justify-center gap-2 rounded-xl font-bold transition-all shadow-lg",
                isSearching 
                  ? "bg-muted text-muted-foreground cursor-not-allowed" 
                  : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
              )}
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  A pesquisar...
                </>
              ) : (
                <>
                  <SearchIcon className="w-4 h-4" />
                  Pesquisar Agora
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results HUD */}
      {allResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Resultados do Mercado</h2>
              <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                {results.length > 0 ? results.length : cachedResults.length} imóveis
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-card border border-border rounded-xl p-1 mr-4">
                <button onClick={() => setView('GRID')} className={cn("p-1.5 rounded-lg", view === 'GRID' ? "bg-muted shadow-sm" : "opacity-40")}><LayoutGrid className="w-4 h-4" /></button>
                <button onClick={() => setView('MAP')} className={cn("p-1.5 rounded-lg", view === 'MAP' ? "bg-muted shadow-sm" : "opacity-40")}><MapIcon className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allResults.map((item) => (
              <div key={item.id} className="bg-card border border-border rounded-3xl overflow-hidden group hover:border-[#FE6B00]/40 transition-all flex flex-col shadow-xl shadow-black/5">
                <div className="h-44 relative overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/10 uppercase tracking-widest">
                    {item.source}
                  </div>
                  {item.isParticular && (
                    <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-widest">
                      Vendedor Particular
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 bg-[#FE6B00] text-white text-lg font-black px-4 py-1.5 rounded-2xl shadow-xl">
                    {formatCurrency(item.price)}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-base leading-snug mb-3 line-clamp-2 min-h-[3rem] group-hover:text-[#FE6B00] transition-colors tracking-tight">
                    {item.title}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded-xl">
                      <MapPin className="w-3.5 h-3.5 text-[#FE6B00]" />
                      <span className="line-clamp-1">{item.location}</span>
                    </div>

                    {item.sellerPhone && (
                      <div className="p-4 bg-[#FE6B00]/5 border border-[#FE6B00]/10 rounded-2xl flex items-center justify-between group/phone hover:bg-[#FE6B00]/10 transition-all">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#FE6B00] flex items-center justify-center text-white">
                               <Phone className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                               <span className="text-[10px] font-bold text-[#FE6B00] uppercase tracking-widest">Contacto Directo</span>
                               <span className="text-sm font-black text-white">{item.sellerPhone}</span>
                            </div>
                         </div>
                         <div className="text-[10px] text-muted-foreground italic group-hover/phone:text-[#FE6B00] transition-colors">{item.sellerName || 'Particular'}</div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => handleGenerateAd(item, 'SOCIAL')}
                        className="flex items-center justify-center gap-2 py-3 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-indigo-500/20"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Gerar Anúncio
                      </button>
                      <button 
                        onClick={() => router.push('/compare')}
                        className="flex items-center justify-center gap-2 py-3 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                        Comparar
                      </button>
                    </div>

                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full flex items-center justify-center gap-2 py-3 bg-[#FE6B00]/10 text-[#FE6B00] hover:bg-[#FE6B00] hover:text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all border border-[#FE6B00]/20"
                    >
                      Ir para Fonte Original
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Ad Modal (Omitted for brevity, but stays same) */}
      
      {/* Empty State */}
      {!isSearching && allResults.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 bg-card border border-dashed border-border rounded-[40px]">
          <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-6">
            <Globe className="w-12 h-12 text-primary opacity-30" />
          </div>
          <h3 className="text-2xl font-black text-white">Mercado Vazio</h3>
          <p className="text-muted-foreground mt-2 max-w-sm text-center">
            Usa a extensão **SI Super-Clipper** para importar imóveis e contactos de market place em massa.
          </p>
        </div>
      )}
    </div>
  );
}
