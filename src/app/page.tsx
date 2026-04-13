'use client';

import React, { useMemo } from 'react';
import { 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  ArrowUpRight, 
  Clock,
  Briefcase,
  Target,
  Zap,
  Star,
  Building2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useCRMStore } from '@/lib/store';
import { formatCurrency, cn } from '@/lib/utils';
import MarketTrendsChart from '@/components/dashboard/MarketTrendsChart';
import ExecutivePerformance from '@/components/dashboard/ExecutivePerformance';
import { motion } from 'framer-motion';
import AddDealModal from '@/components/forms/AddDealModal';
import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';


export default function Dashboard() {
  const { leads, deals, tasks, settings } = useCRMStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }, []);

  const stats = [
    { 
      label: 'Leads Ativos', 
      value: leads.length, 
      trend: '+12%', 
      icon: Users, 
      color: 'bg-indigo-500',
      description: 'Contactos em progresso'
    },
    { 
      label: 'Volume Negócios', 
      value: '€2.4M', 
      trend: '+8%', 
      icon: TrendingUp, 
      color: 'bg-[#FE6B00]',
      description: 'Pipeline total SI Mondego'
    },
    { 
      label: 'Taxa de Conversão', 
      value: '24%', 
      trend: '+3%', 
      icon: Target, 
      color: 'bg-emerald-500',
      description: 'Fechados vs Propostas'
    },
    { 
      label: 'Tarefas Hoje', 
      value: tasks.filter(t => !t.isCompleted).length, 
      trend: 'Pendente', 
      icon: CheckCircle2, 
      color: 'bg-amber-500',
      description: 'Follow-ups pendentes'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-12 pb-20">
      <AddDealModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      {/* Welcome Header Luxury 2.0 */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-10 bg-[#0B2A4A] p-8 lg:p-16 rounded-[48px] relative overflow-hidden shadow-3xl luxury-shadow"
      >
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-4 py-1.5 bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-white/10 backdrop-blur-md">
              SI Elite CRM
            </span>
            <div className="flex h-2.5 w-2.5 rounded-full bg-[#FE6B00] animate-ping" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter font-outfit leading-tight">
            {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FE6B00] to-[#FF9E52]">{settings.userName.split(' ')[0]}</span>.
          </h1>
          <p className="text-white/60 font-medium text-xl leading-relaxed max-w-xl">
            Tens <span className="text-white font-black underline decoration-[#FE6B00] decoration-4 underline-offset-4">{leads.length} leads qualificados</span> para gerir na zona de Coimbra hoje.
          </p>
        </div>

        <div className="relative z-10 flex gap-4">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-10 py-5 si-gradient text-white font-black rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all text-sm tracking-tight flex items-center gap-3 group"
          >
            <Sparkles className="w-5 h-5 fill-white group-hover:rotate-12 transition-transform" />
            Novo Negócio Elite
          </button>
        </div>

        {/* High-end abstract effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FE6B00] opacity-[0.08] rounded-full blur-[150px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500 opacity-[0.05] rounded-full blur-[100px] -ml-32 -mb-32" />
        <div className="absolute top-1/2 left-1/4 w-px h-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            whileHover={{ y: -10 }}
            className="group bg-card border border-white/5 p-8 rounded-[40px] transition-all duration-700 relative overflow-hidden hover:border-[#FE6B00]/30 luxury-shadow glass-card"
          >
            <div className={cn("p-4 rounded-[20px] w-fit mb-6 shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-6", stat.color)}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{stat.label}</p>
              <div className="flex items-baseline gap-3">
                <h3 className="text-4xl font-black tracking-tighter font-outfit text-white">{stat.value}</h3>
                <span className="text-xs font-black text-emerald-500 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                </span>
              </div>
              <p className="text-xs text-white/40 font-bold pt-3">{stat.description}</p>
            </div>
            {/* Background Icon Accent */}
            <stat.icon className="absolute -bottom-8 -right-8 w-32 h-32 opacity-[0.02] group-hover:opacity-[0.05] group-hover:scale-110 transition-all duration-700 text-white" />
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Market Trends (Professional Chart) */}
        <div className="lg:col-span-2 bg-card border border-white/5 rounded-[48px] p-12 shadow-2xl relative overflow-hidden glass-card">
          <div className="flex items-start justify-between mb-10">
            <div className="space-y-1">
              <h3 className="text-3xl font-black tracking-tighter text-white font-outfit">Tendência Inteligente (m²)</h3>
              <p className="text-sm font-bold text-white/40 flex items-center gap-2 uppercase tracking-widest">
                <Building2 className="w-4 h-4 text-[#FE6B00]" />
                Foco: Coimbra Centro e Celas
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-2xl border border-white/5">
              <button className="px-5 py-2 bg-white/10 rounded-xl text-xs font-black text-white shadow-xl">REAL TIME</button>
              <button className="px-5 py-2 text-xs font-black text-white/40 hover:text-white transition-colors">HISTÓRICO</button>
            </div>
          </div>
          
          <MarketTrendsChart />
          
          <div className="mt-10 pt-10 border-t border-white/5 flex flex-wrap items-center justify-between gap-6">
            <div className="flex gap-12">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Preço Médio Atual</p>
                <p className="text-2xl font-black text-[#FE6B00] font-outfit">€2,185/m²</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Variação Trimestral</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-2xl font-black text-emerald-500 font-outfit">+4.8%</p>
                </div>
              </div>
            </div>
            <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-xs font-black text-white flex items-center gap-3 transition-all group">
              Baixar Relatório Executivo
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
          
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FE6B00] opacity-[0.03] blur-3xl" />
        </div>

        {/* Task List / Daily Agenda - Upgraded */}
        <div className="bg-[#0B2A4A]/20 border border-white/5 rounded-[48px] p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl group">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-3xl font-black tracking-tighter text-white font-outfit">Agenda SI</h3>
            <Link href="/calendar">
              <div className="p-4 bg-white/5 text-[#FE6B00] rounded-[24px] border border-white/5 shadow-xl group-hover:rotate-12 transition-transform duration-700 cursor-pointer hover:bg-white/10">
                <Calendar className="w-6 h-6" />
              </div>
            </Link>
          </div>
          
          <div className="space-y-6">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className={cn(
                  "group/item flex items-start gap-5 p-5 rounded-[32px] hover:bg-white/[0.04] transition-all border border-transparent hover:border-white/5 relative overflow-hidden",
                  task.isCompleted && "opacity-50"
              )}>
                <div className={cn(
                  "p-3.5 rounded-2xl flex items-center justify-center transition-all shadow-xl",
                  task.priority === 'ALTA' ? 'bg-[#FE6B00]/10 text-[#FE6B00]' : 'bg-blue-500/10 text-blue-500'
                )}>
                  {task.priority === 'ALTA' ? <Zap className="w-5 h-5 fill-current" /> : <Clock className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h4 className={cn("font-black text-[14px] text-white/90 truncate group-hover/item:text-white transition-colors tracking-tight", task.isCompleted && "line-through")}>{task.title}</h4>
                  <div className="flex items-center gap-4 mt-1.5">
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{format(new Date(task.dueDate), "dd MMM")}</span>
                  </div>
                </div>
              </div>
            ))}
            
            <Link href="/calendar" className="block w-full">
              <button className="w-full mt-6 py-5 border-2 border-dashed border-white/5 rounded-[32px] text-xs font-black text-white/20 hover:border-[#FE6B00]/40 hover:text-white hover:bg-white/5 transition-all duration-500 uppercase tracking-[0.2em]">
                Abrir Command Center
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Advanced Performance Section */}
      <div className="space-y-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[20px] bg-[#FE6B00]/10 flex items-center justify-center text-[#FE6B00] shadow-xl border border-[#FE6B00]/10">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div className="space-y-1">
                <h2 className="text-4xl font-black tracking-tighter text-white font-outfit">Visão Estratégica</h2>
                <p className="text-[10px] font-black uppercase text-white/30 tracking-[0.3em]">Métricas de Conversão Direta</p>
            </div>
          </div>
          <ExecutivePerformance />
      </div>
    </div>
  );
}
