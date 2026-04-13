'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Command, 
  Users, 
  Building2, 
  Sparkles, 
  Settings, 
  X,
  Plus,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [toggle]);

  const items = [
    { label: 'Ir para Dashboard', href: '/', icon: Settings, category: 'Navegação' },
    { label: 'Gerir Leads', href: '/leads', icon: Users, category: 'Navegação' },
    { label: 'Ver Imóveis', href: '/properties', icon: Building2, category: 'Navegação' },
    { label: 'Destaques de Marketing', href: '/marketing', icon: Sparkles, category: 'Ações' },
    { label: 'Configurações de Perfil', href: '/settings', icon: Settings, category: 'Sistema' },
    { label: 'Novo Lead', action: () => router.push('/leads?new=true'), icon: Plus, category: 'Ações' },
  ];

  const filteredItems = items.filter(item => 
    item.label.toLowerCase().includes(search.toLowerCase()) || 
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-[#05070a]/80 backdrop-blur-md"
        />

        {/* Palette Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="w-full max-w-2xl bg-[#0a0d14] border border-white/10 rounded-[32px] shadow-3xl overflow-hidden relative z-10 luxury-shadow"
        >
          <div className="p-6 border-b border-white/5 flex items-center gap-4">
            <Command className="w-5 h-5 text-[#FE6B00]" />
            <input 
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="O que procuras hoje?"
              className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder:text-white/10 font-medium"
            />
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/5 rounded-xl text-white/20 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
            {filteredItems.length > 0 ? (
                <div className="space-y-6">
                    {['Navegação', 'Ações', 'Sistema'].map(category => {
                        const catItems = filteredItems.filter(i => i.category === category);
                        if (catItems.length === 0) return null;
                        
                        return (
                            <div key={category} className="space-y-2">
                                <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">{category}</h3>
                                {catItems.map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            if (item.href) router.push(item.href);
                                            if (item.action) item.action();
                                            setIsOpen(false);
                                        }}
                                        className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all group text-left"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-[#FE6B00]/10 group-hover:text-[#FE6B00] transition-all">
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold text-white/80 group-hover:text-white transition-colors">{item.label}</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-white/0 group-hover:text-white/20 group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="py-20 text-center space-y-4">
                    <Search className="w-12 h-12 text-white/5 mx-auto" />
                    <p className="text-white/20 font-bold">Nenhum resultado encontrado para "{search}"</p>
                </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[10px] font-black text-white/20 uppercase tracking-[0.1em]">
            <div className="flex gap-4">
                <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded">↑↓</span> Navegar</span>
                <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded">ENTER</span> Selecionar</span>
            </div>
            <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded">ESC</span> Fechar</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
