'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Kanban, 
  Calendar, 
  Building2, 
  Settings,
  X,
  Map,
  BarChart3,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Leads', href: '/leads', icon: Users },
  { label: 'Pipeline', href: '/pipeline', icon: Kanban },
  { label: 'Calendário', href: '/calendar', icon: Calendar },
  { label: 'Imóveis', href: '/properties', icon: Building2 },
  { label: 'Mercado', href: '/market', icon: Map },
  { label: 'Comparador', href: '/compare', icon: BarChart3 },
  { label: 'Marketing', href: '/marketing', icon: Sparkles },
];

// Primary items shown in mobile bottom bar (5 max)
const mobileNavItems = [
  { label: 'Início', href: '/', icon: LayoutDashboard },
  { label: 'Leads', href: '/leads', icon: Users },
  { label: 'Pipeline', href: '/pipeline', icon: Kanban },
  { label: 'Agenda', href: '/calendar', icon: Calendar },
  { label: 'Imóveis', href: '/properties', icon: Building2 },
];

function SILogo() {
  return (
    <div className="flex items-center gap-4 group cursor-pointer p-2">
      <div className="w-14 h-14 bg-white rounded-[20px] flex items-center justify-center shadow-2xl group-hover:scale-105 transition-all duration-700 border border-white/20 relative overflow-hidden">
        <span className="text-3xl font-black tracking-tighter flex relative z-10">
          <span className="text-[#FE6B00]">S</span>
          <span className="text-[#0B2A4A]">I</span>
        </span>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#FE6B00]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="flex flex-col">
        <span className="text-white font-black text-xl leading-none tracking-tight font-outfit">SOLUÇÕES IDEAIS</span>
        <span className="text-[#FE6B00] text-[10px] font-black uppercase tracking-[0.2em] mt-2 opacity-80">Coimbra | Mondego</span>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// DESKTOP SIDEBAR
// ────────────────────────────────────────────────
export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay — tap to close */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Desktop/Tablet Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-80 glass-morphism transition-all duration-700 lg:translate-x-0 overflow-y-auto border-r border-white/5",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-10 flex flex-col h-full bg-[#05070a]/40 backdrop-blur-3xl">
          <div className="flex items-center justify-between mb-16 px-2">
            <SILogo />
            <button onClick={onClose} className="lg:hidden text-white/50 hover:text-white p-2">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-2 flex-1 relative">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                  className={cn(
                    "flex items-center gap-4 px-6 py-4 rounded-2xl text-[14px] font-bold transition-all duration-500 group relative overflow-hidden",
                    isActive 
                      ? "text-white bg-white/5 shadow-inner" 
                      : "text-white/40 hover:bg-white/[0.03] hover:text-white/80"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill-desktop"
                      className="absolute left-0 w-1.5 h-6 bg-[#FE6B00] rounded-r-full shadow-[0_0_15px_#FE6B00]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  <item.icon className={cn(
                    "w-5 h-5 transition-all duration-500",
                    isActive ? "text-[#FE6B00] scale-110 drop-shadow-[0_0_8px_#FE6B00]" : "text-white/20 group-hover:text-[#FE6B00]/60"
                  )} />
                  <span className="tracking-tight">{item.label}</span>
                  
                  {isActive && (
                    <div className="ml-auto">
                        <Zap className="w-3 h-3 text-[#FE6B00] animate-pulse" />
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-6 pt-10 border-t border-white/5">
            <Link
              href="/settings"
              onClick={() => { if (window.innerWidth < 1024) onClose(); }}
              className={cn(
                "flex items-center gap-4 px-6 py-4 rounded-2xl text-[14px] font-bold transition-all duration-500 group",
                pathname === '/settings' ? "bg-white/5 text-white" : "text-white/40 hover:text-white/80"
              )}
            >
              <Settings className="w-5 h-5 text-white/20 group-hover:text-[#FE6B00]" />
              <span>Configurações</span>
            </Link>

            <div className="p-6 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 relative overflow-hidden group hover:border-[#FE6B00]/20 transition-all duration-700">
              <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <ShieldCheck className="w-16 h-16 text-white" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FE6B00] mb-3">SI Elite Access</p>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_#10b981]" />
                <span className="text-[11px] font-bold text-white/70 uppercase tracking-tighter">Mondego Active Node</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ────────────────────────────────────────────────
          MOBILE BOTTOM NAVIGATION BAR
      ───────────────────────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-[#05070a]/95 backdrop-blur-2xl border-t border-white/10 safe-area-bottom">
        <div className="flex items-stretch justify-around px-2 pt-2 pb-safe">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center gap-1 flex-1 py-2 px-1 relative min-h-[52px]"
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill-mobile"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#FE6B00] rounded-full shadow-[0_0_8px_#FE6B00]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-300",
                  isActive ? "bg-[#FE6B00]/10" : ""
                )}>
                  <item.icon className={cn(
                    "w-5 h-5 transition-all duration-300",
                    isActive ? "text-[#FE6B00] drop-shadow-[0_0_6px_#FE6B00]" : "text-white/30"
                  )} />
                </div>
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-wider transition-all",
                  isActive ? "text-[#FE6B00]" : "text-white/25"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          {/* More button → opens sidebar */}
          <button
            onClick={onClose}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-2 px-1 min-h-[52px]"
          >
            <div className="p-2 rounded-xl">
              <Settings className="w-5 h-5 text-white/30" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider text-white/25">Mais</span>
          </button>
        </div>
      </nav>
    </>
  );
}
