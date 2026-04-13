'use client';

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Users, 
  FileText,
  AlertCircle,
  LayoutGrid,
  List
} from 'lucide-react';
import { useCRMStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { format, isToday, isTomorrow, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function CalendarPage() {
  const { tasks, leads, toggleTask } = useCRMStore();
  const [view, setView] = useState<'HOJE' | 'PROG' | 'MES'>('HOJE');
  
  // Sort tasks by due date
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Group tasks
  const todayTasks = sortedTasks.filter(t => isToday(new Date(t.dueDate)) && !t.isCompleted);
  const upcomingTasks = sortedTasks.filter(t => !isToday(new Date(t.dueDate)) && !t.isCompleted);
  const completedTasks = sortedTasks.filter(t => t.isCompleted);

  // Month Calendar logic
  const today = new Date();
  const firstDay = startOfMonth(today);
  const lastDay = endOfMonth(today);
  const startDate = startOfWeek(firstDay, { weekStartsOn: 1 }); // Monday
  const endDate = endOfWeek(lastDay, { weekStartsOn: 1 }); // Sunday
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getPriorityColor = (priority: string) => {
      switch(priority) {
          case 'ALTA': return 'text-red-500 bg-red-500/10 border-red-500/20';
          case 'MEDIA': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
          default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      }
  };

  const renderTask = (task: typeof tasks[0]) => {
      const lead = leads.find(l => l.id === task.leadId);
      
      return (
          <div 
            key={task.id} 
            className={cn(
                "group relative p-6 rounded-3xl border transition-all flex items-start gap-4",
                task.isCompleted ? "bg-white/[0.02] border-white/5 opacity-50" : "bg-white/[0.05] border-white/10 hover:border-white/20 hover:bg-white/[0.08]"
            )}
          >
              <button 
                  onClick={() => toggleTask(task.id)}
                  className={cn(
                      "mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                      task.isCompleted ? "bg-emerald-500 border-emerald-500 text-white" : "border-white/20 hover:border-emerald-500 hover:text-emerald-500 text-transparent"
                  )}
              >
                  <CheckCircle2 className="w-4 h-4" />
              </button>

              <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                     <span className={cn("px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded border", getPriorityColor(task.priority))}>
                         {task.priority}
                     </span>
                     <span className="text-xs font-bold text-white/40 flex items-center gap-1">
                         <Clock className="w-3 h-3" />
                         {format(new Date(task.dueDate), "HH:mm")}
                         {!isToday(new Date(task.dueDate)) && ` • ${format(new Date(task.dueDate), "dd MMM")}`}
                     </span>
                  </div>
                  <h4 className={cn("text-lg font-black text-white mb-2", task.isCompleted && "line-through text-white/50")}>
                      {task.title}
                  </h4>
                  {task.description && (
                      <p className="text-sm text-white/60 leading-relaxed mb-4">{task.description}</p>
                  )}

                  {lead && (
                      <div className="flex items-center gap-2 p-3 bg-black/20 rounded-xl border border-white/5 w-fit">
                          <div className="w-6 h-6 rounded-lg bg-[#0B2A4A] flex items-center justify-center text-[10px] font-black text-white">
                              {lead.name.charAt(0)}
                          </div>
                          <span className="text-xs font-bold text-white/80 pr-2">{lead.name}</span>
                          <button className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md transition-all text-white/40 hover:text-white">
                              <Phone className="w-3 h-3" />
                          </button>
                      </div>
                  )}
              </div>
          </div>
      );
  };

  return (
    <div className="flex flex-col gap-8 h-full max-w-7xl mx-auto w-full pb-20">
      
      {/* Header section */}
      <div className="flex flex-col lg:flex-row justify-between gap-8 bg-[#0B2A4A]/20 p-8 rounded-[40px] border border-white/5 relative overflow-hidden backdrop-blur-sm shadow-2xl shrink-0">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                <CalendarIcon className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Command Center</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white font-outfit uppercase">
            A tua <span className="text-white/20">Agenda</span>
          </h1>
          <div className="flex items-center gap-8 pt-4">
             <div className="flex flex-col">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Para Hoje</span>
                <span className="text-xl font-black text-white">{todayTasks.length}</span>
             </div>
             <div className="flex flex-col">
                <span className="text-[9px] font-black text-emerald-500/50 uppercase tracking-widest mb-1">Completas</span>
                <span className="text-xl font-black text-emerald-500">{completedTasks.length}</span>
             </div>
          </div>
        </div>

        {/* Date Display & View Toggles */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-4">
            <div className="text-center p-6 bg-white/[0.02] border border-white/5 rounded-[32px] backdrop-blur-md">
                <p className="text-sm font-black text-[#FE6B00] uppercase tracking-widest mb-2">
                    {format(new Date(), "EEEE", { locale: ptBR })}
                </p>
                <h2 className="text-6xl font-black text-white font-outfit leading-none mb-2">
                    {format(new Date(), "dd")}
                </h2>
                <p className="text-sm font-bold text-white/40 uppercase tracking-widest">
                    {format(new Date(), "MMMM yyyy", { locale: ptBR })}
                </p>
            </div>
            
            <div className="flex p-1 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-md">
                 <button 
                    onClick={() => setView('HOJE')}
                    className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", view === 'HOJE' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white')}
                 >Hoje</button>
                 <button 
                    onClick={() => setView('PROG')}
                    className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", view === 'PROG' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white')}
                 >Programadas</button>
                 <button 
                    onClick={() => setView('MES')}
                    className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2", view === 'MES' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white')}
                 ><LayoutGrid className="w-3 h-3" /> Mês</button>
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full">
         {view === 'HOJE' && (
             <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-6">
                    <AlertCircle className="w-5 h-5 text-[#FE6B00]" />
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Obrigatório Hoje</h3>
                    <div className="h-px flex-1 bg-white/5 ml-4" />
                </div>
                {todayTasks.length === 0 ? (
                    <div className="p-10 border-2 border-dashed border-white/5 rounded-[32px] text-center">
                        <CheckCircle2 className="w-12 h-12 text-white/10 mx-auto mb-4" />
                        <p className="text-sm font-bold text-white/40 uppercase tracking-widest">Nada pendente para hoje.</p>
                    </div>
                ) : (
                    <div className="space-y-4">{todayTasks.map(renderTask)}</div>
                )}
             </div>
         )}

         {view === 'PROG' && (
             <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-6">
                    <Clock className="w-5 h-5 text-white/40" />
                    <h3 className="text-xl font-black text-white/40 uppercase tracking-tight">Próximos Dias</h3>
                    <div className="h-px flex-1 bg-white/5 ml-4" />
                </div>
                {upcomingTasks.length === 0 ? (
                    <p className="text-sm text-white/20 font-bold uppercase tracking-widest text-center py-10">Sem eventos programados.</p>
                ) : (
                    <div className="space-y-4">{upcomingTasks.map(renderTask)}</div>
                )}
             </div>
         )}

         {view === 'MES' && (
             <div className="animate-in slide-in-from-bottom-4 duration-500 bg-white/[0.02] border border-white/5 rounded-[40px] p-8">
                 <div className="grid grid-cols-7 gap-4 mb-4">
                     {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(day => (
                         <div key={day} className="text-center text-[10px] font-black text-white/30 uppercase tracking-widest">
                             {day}
                         </div>
                     ))}
                 </div>
                 <div className="grid grid-cols-7 gap-4">
                     {calendarDays.map((day, idx) => {
                         const isCurrentMonth = isSameMonth(day, today);
                         const isCurrentDay = isSameDay(day, today);
                         const dayTasks = tasks.filter(t => isSameDay(new Date(t.dueDate), day));
                         const hasHighPriority = dayTasks.some(t => t.priority === 'ALTA' && !t.isCompleted);

                         return (
                             <div 
                                key={idx} 
                                className={cn(
                                    "min-h-[100px] p-3 rounded-2xl border transition-all group hover:bg-white/[0.05]",
                                    isCurrentMonth ? "bg-white/[0.02] border-white/5" : "bg-transparent border-transparent opacity-30",
                                    isCurrentDay && "border-[#FE6B00]/40 bg-[#FE6B00]/5"
                                )}
                             >
                                 <div className="flex items-start justify-between">
                                     <span className={cn(
                                         "text-sm font-black font-outfit",
                                         isCurrentDay ? "text-[#FE6B00] bg-[#FE6B00]/10 px-2 py-0.5 rounded-md" : "text-white/60"
                                     )}>
                                         {format(day, 'd')}
                                     </span>
                                     {dayTasks.length > 0 && (
                                         <div className={cn(
                                             "w-2 h-2 rounded-full",
                                             hasHighPriority ? "bg-red-500" : "bg-blue-500"
                                         )} />
                                     )}
                                 </div>
                                 <div className="mt-2 space-y-1">
                                     {dayTasks.slice(0, 3).map(dt => (
                                         <div key={dt.id} className={cn(
                                             "text-[9px] font-black truncate px-2 py-1 rounded",
                                             dt.isCompleted ? "opacity-30 line-through bg-white/5 text-white" : getPriorityColor(dt.priority)
                                         )}>
                                             {dt.title}
                                         </div>
                                     ))}
                                     {dayTasks.length > 3 && (
                                         <div className="text-[8px] font-black text-white/30 pl-2">+{dayTasks.length - 3} mais</div>
                                     )}
                                 </div>
                             </div>
                         );
                     })}
                 </div>
             </div>
         )}
      </div>

    </div>
  );
}
