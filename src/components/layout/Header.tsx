'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, Bell, Menu, LayoutGrid, Command, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCRMStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { isToday } from 'date-fns';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { settings, tasks } = useCRMStore();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Filter urgent tasks for notifications
  const urgentTasks = tasks.filter(t => isToday(new Date(t.dueDate)) && !t.isCompleted);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  return (
    <header className="h-16 lg:h-24 border-b border-white/5 bg-[#05070a]/20 backdrop-blur-xl sticky top-0 z-30 px-4 lg:px-12 flex items-center justify-between">
      <div className="flex items-center gap-6 flex-1">
        <button 
          onClick={onMenuClick}
          className="p-3 -ml-2 text-white/40 hover:bg-white/5 hover:text-[#FE6B00] rounded-2xl lg:hidden transition-all"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Global Search - SaaS Style */}
        <div className="flex-1 max-w-xl hidden md:block group">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#FE6B00] group-focus-within:scale-110 transition-all duration-500" />
            <input 
              type="text" 
              placeholder="Pesquisa rápida..."
              className="w-full bg-white/[0.03] border border-white/5 rounded-[20px] py-3.5 pl-14 pr-16 text-sm text-white focus:bg-white/[0.07] focus:border-[#FE6B00]/40 focus:ring-4 focus:ring-[#FE6B00]/5 transition-all outline-none font-medium placeholder:text-white/10"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/5 rounded-lg opacity-40 group-focus-within:opacity-100 transition-opacity">
              <Command className="w-3 h-3 text-white" />
              <span className="text-[10px] font-black text-white">K</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Quick Menu Toggle */}
        <button className="hidden sm:flex p-3 text-white/20 hover:text-[#FE6B00] hover:bg-white/5 rounded-2xl transition-all">
          <LayoutGrid className="w-5 h-5" />
        </button>

        <div className="relative" ref={notifRef}>
            <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={cn(
                    "relative p-3 rounded-2xl transition-all group",
                    isNotifOpen ? "bg-[#FE6B00]/10 text-[#FE6B00]" : "text-white/20 hover:text-[#FE6B00] hover:bg-white/5"
                )}
            >
              <Bell className="w-5 h-5" />
              {urgentTasks.length > 0 && (
                  <span className="absolute top-3 right-3 w-2 h-2 bg-[#FE6B00] rounded-full border-2 border-[#05070a] shadow-[0_0_8px_#FE6B00]" />
              )}
            </button>

            <AnimatePresence>
                {isNotifOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-4 w-80 bg-[#0B2A4A]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50"
                    >
                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                            <h4 className="text-sm font-black text-white uppercase tracking-wider">Avisos</h4>
                            <span className="px-2 py-0.5 bg-[#FE6B00]/20 text-[#FE6B00] text-[10px] font-black rounded-lg">{urgentTasks.length} Hoje</span>
                        </div>
                        <div className="max-h-80 overflow-y-auto p-2 scrollbar-hide">
                            {urgentTasks.length === 0 ? (
                                <div className="p-6 text-center">
                                    <CheckCircle2 className="w-8 h-8 text-white/10 mx-auto mb-2" />
                                    <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Tudo em dia!</p>
                                </div>
                            ) : (
                                urgentTasks.map((task) => (
                                    <Link href="/calendar" key={task.id} onClick={() => setIsNotifOpen(false)}>
                                        <div className="p-3 hover:bg-white/5 rounded-2xl transition-all cursor-pointer flex gap-3 group">
                                            <div className="mt-0.5">
                                                {task.priority === 'ALTA' ? (
                                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                                ) : (
                                                    <Clock className="w-4 h-4 text-amber-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-white group-hover:text-[#FE6B00] transition-colors line-clamp-1">{task.title}</p>
                                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-1">{task.priority} Priority</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        <div className="h-8 w-[1px] bg-white/5 mx-2 hidden sm:block" />

        <div className="flex items-center gap-5">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-white leading-none font-outfit uppercase tracking-tight">{settings.userName}</p>
            <p className="text-[10px] text-[#FE6B00] mt-1.5 font-black uppercase tracking-[0.15em] opacity-80">{settings.agencyName.replace('SI - ', '')}</p>
          </div>
          <Link 
            href="/settings"
            className="group relative"
          >
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#0B2A4A] font-black hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-black/40 border border-white/10 overflow-hidden">
                <span className="relative z-10 text-lg">{settings.userName.charAt(0)}</span>
                <div className="absolute inset-0 bg-[#FE6B00] opacity-0 group-hover:opacity-10 transition-opacity" />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
