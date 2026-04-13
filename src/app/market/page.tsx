'use client';

import React, { useState } from 'react';
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
  BarChart3
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
  area?: number;
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
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [searchParams, setSearchParams] = useState({
    location: 'Coimbra',
    type: 'Apartamento T2',
    maxPrice: '200000'
  });

  const handleSearch = async () => {
    setIsSearching(true);
    setResults([]);
    setLogs(['A iniciar motores de busca...', 'A ligar aos portais imobiliários...']);

    try {
      setLogs(prev => [...prev, `A pesquisar no Imovirtual por ${searchParams.type} em ${searchParams.location}...`]);
      
      const response = await fetch('/api/market/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchParams),
      });

      const data = await response.json();
      
      if (data.success) {
        setResults(data.data);
        setLogs(prev => [...prev, `Sucesso! Encontrados ${data.count} imóveis relevantes.`]);
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Globe className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Pesquisa de Mercado</h1>
        </div>
        <p className="text-muted-foreground">
          Procure imóveis em todos os portais imobiliários (Idealista, Imovirtual, etc.) centralizados num só lugar.
        </p>
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
                  A pesquisar portais...
                </>
              ) : (
                <>
                  <SearchIcon className="w-4 h-4" />
                  Pesquisar agora
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search Logs */}
        {isSearching && (
          <div className="mt-6 border-t border-border pt-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-primary animate-pulse rounded-full" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Scraper Log</span>
            </div>
            <div className="bg-background/50 rounded-lg p-3 font-mono text-[10px] space-y-1">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-primary/50">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results HUD */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Resultados Encontrados</h2>
              <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                {results.length} imóveis frescos
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-card border border-border rounded-xl p-1 mr-4">
                <button 
                  onClick={() => setView('GRID')}
                  className={cn(
                    "p-1.5 rounded-lg transition-all",
                    view === 'GRID' ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setView('MAP')}
                  className={cn(
                    "p-1.5 rounded-lg transition-all",
                    view === 'MAP' ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <MapIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                Resultados capturados há instantes
              </div>
            </div>
          </div>

          {view === 'MAP' ? (
            <MarketMap properties={results} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((item) => (
                <div key={item.id} className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary/50 transition-all shadow-sm flex flex-col">
                  <div className="h-40 relative group-hover:opacity-90 transition-opacity">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-black text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                      <ExternalLink className="w-3 h-3" />
                      {item.source}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-primary text-white text-sm font-bold px-2 py-1 rounded-lg">
                      {formatCurrency(item.price)}
                    </div>
                  </div>
                  
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-sm leading-tight mb-2 line-clamp-2 min-h-[2.5rem]">
                      {item.title}
                    </h3>
                    
                    <div className="mt-auto space-y-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {item.location}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => handleGenerateAd(item, 'SOCIAL')}
                          className="flex items-center justify-center gap-2 py-2 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white rounded-xl text-xs font-bold transition-all"
                        >
                          <Sparkles className="w-3 h-3" />
                          Anúncio AI
                        </button>
                        <button 
                          onClick={() => router.push('/compare')}
                          className="flex items-center justify-center gap-2 py-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl text-xs font-bold transition-all"
                        >
                          <BarChart3 className="w-3 h-3" />
                          Comparar
                        </button>
                      </div>
                      <div className="mt-2">
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="w-full flex items-center justify-center gap-2 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-xs font-bold transition-all"
                        >
                          Ver no Portal Original
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AI Ad Modal */}
      {selectedAd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-card border border-border rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl scale-in-center">
            <div className="p-6 border-b border-border flex items-center justify-between bg-primary/5">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-bold">Anúncio de Redes Sociais Genial</h3>
              </div>
              <button 
                onClick={() => setSelectedAd(null)}
                className="p-2 hover:bg-accent rounded-xl text-muted-foreground"
              >
                <Globe className="w-5 h-5 rotate-45" /> {/* Use rotate for X look if X not available or just use Globe as placeholder */}
              </button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Título Sugerido</label>
                <div className="bg-muted/30 p-4 rounded-2xl border border-border group relative">
                  <p className="text-sm font-bold pr-8">{selectedAd.teaser}</p>
                  <button className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Descrição Criativa</label>
                <div className="bg-muted/30 p-4 rounded-2xl border border-border relative">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedAd.description}</p>
                  <p className="mt-4 text-primary font-medium text-xs">{selectedAd.hashtags}</p>
                  <button className="absolute bottom-4 right-4 p-2 bg-primary text-primary-foreground rounded-lg shadow-lg hover:scale-105 transition-all">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border flex gap-3">
              <button 
                onClick={() => setSelectedAd(null)}
                className="flex-1 py-3 bg-accent hover:bg-muted font-bold rounded-2xl transition-all"
              >
                Fechar
              </button>
              <button 
                onClick={() => alert('Copiado para a área de transferência!')}
                className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
              >
                Copiar Tudo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State / Tips */}
      {!isSearching && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/20 border border-dashed border-border rounded-3xl">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-muted-foreground opacity-50" />
          </div>
          <h3 className="text-xl font-bold">Inicie uma nova pesquisa</h3>
          <p className="text-muted-foreground mt-2 max-w-sm text-center">
            Pode pesquisar por tipologia, cidade ou valor. Iremos verificar nos principais portais para si.
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            <div className="p-4 bg-card border border-border rounded-2xl">
              <div className="text-amber-500 font-bold text-sm mb-1 uppercase tracking-wider">Dica #1</div>
              <p className="text-sm text-muted-foreground italic">"Tente ser específico na localização para encontrar melhores oportunidades."</p>
            </div>
            <div className="p-4 bg-card border border-border rounded-2xl">
              <div className="text-amber-500 font-bold text-sm mb-1 uppercase tracking-wider">Dica #2</div>
              <p className="text-sm text-muted-foreground italic">"Iremos filtrar automaticamente anúncios duplicados entre portais."</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
