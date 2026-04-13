'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
}

export default function BaseModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className,
  maxWidth = 'max-w-xl'
}: BaseModalProps) {
  
  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className={cn(
              "relative bg-card border border-white/10 w-full rounded-[32px] overflow-hidden shadow-3xl luxury-shadow",
              maxWidth,
              className
            )}
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black tracking-tighter text-white font-outfit uppercase">{title}</h3>
                <div className="h-0.5 w-12 bg-primary mt-1 rounded-full" />
              </div>
              <button 
                onClick={onClose}
                className="p-2.5 rounded-2xl bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all border border-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto max-h-[75vh] custom-scrollbar">
              {children}
            </div>

            {/* Subtle bottom design element */}
            <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
