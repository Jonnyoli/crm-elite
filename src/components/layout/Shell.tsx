'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { useCRMStore } from '@/lib/store';

export function Shell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { initialize } = useCRMStore();

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-[#FE6B00]/30 selection:text-white">
      <CommandPalette />
      {/* Background radial effects for premium depth */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#FE6B00] opacity-[0.03] blur-[150px] rounded-full" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-indigo-500 opacity-[0.02] blur-[120px] rounded-full" />
      </div>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      
      <div className="lg:pl-80 flex flex-col min-h-screen relative z-10">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        
        {/* pb-24 on mobile so content isn't hidden behind the bottom nav bar */}
        <main className="flex-1 p-4 lg:p-10 max-w-[1700px] mx-auto w-full pb-24 lg:pb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="hidden lg:block p-8 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-40">
          Soluções Ideais Coimbra - Mondego • Elite Management System
        </footer>
      </div>
    </div>
  );
}
