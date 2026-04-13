'use client';

import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  AlertCircle,
  MoreVertical,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { useCRMStore } from '@/lib/store';
import { cn, formatDate } from '@/lib/utils';
import { Priority } from '@/types';
import AddTaskModal from '@/components/forms/AddTaskModal';


export default function TasksPage() {
  const { tasks, toggleTask, leads } = useCRMStore();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'PENDING') return !task.isCompleted;
    if (filter === 'COMPLETED') return task.isCompleted;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AddTaskModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
          <p className="text-muted-foreground mt-1">Organize as suas pendências e garanta que nada fica para trás.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
        >
          <Plus className="w-5 h-5" />
          Nova Tarefa
        </button>
      </div>

      {/* Stats/Filters Row */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex bg-card border border-border rounded-xl p-1 shrink-0">
          <button 
            onClick={() => setFilter('ALL')}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-lg transition-all",
              filter === 'ALL' ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Todas
          </button>
          <button 
            onClick={() => setFilter('PENDING')}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-lg transition-all",
              filter === 'PENDING' ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Pendentes
          </button>
          <button 
            onClick={() => setFilter('COMPLETED')}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-lg transition-all",
              filter === 'COMPLETED' ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Concluídas
          </button>
        </div>

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Pesquisar tarefas..." 
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
          />
        </div>
      </div>

      {/* Task List */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="divide-y divide-border">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => {
              const lead = leads.find(l => l.id === task.leadId);
              
              return (
                <div key={task.id} className={cn(
                  "p-4 flex items-start gap-4 hover:bg-muted/30 transition-colors group",
                  task.isCompleted && "bg-muted/10 opacity-75"
                )}>
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className={cn(
                      "mt-1 w-6 h-6 flex items-center justify-center rounded-lg border-2 transition-all",
                      task.isCompleted 
                        ? "bg-primary border-primary text-primary-foreground transform scale-110" 
                        : "border-muted-foreground/30 hover:border-primary text-transparent"
                    )}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className={cn(
                          "font-bold text-lg leading-snug group-hover:text-primary transition-colors",
                          task.isCompleted && "line-through text-muted-foreground"
                        )}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                        )}
                      </div>
                      
                      <button className="p-2 text-muted-foreground hover:bg-accent rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground py-1 px-2 bg-accent rounded-md">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(task.dueDate)}
                      </div>
                      
                      <div className={cn(
                        "flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide",
                        task.priority === 'ALTA' ? "bg-destructive/10 text-destructive" :
                        task.priority === 'MEDIA' ? "bg-amber-500/10 text-amber-500" :
                        "bg-blue-500/10 text-blue-500"
                      )}>
                        <AlertCircle className="w-3.5 h-3.5" />
                        Prioridade {task.priority}
                      </div>

                      {lead && (
                        <div className="flex items-center gap-2 py-1 px-2 border border-border rounded-md">
                          <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">
                            {lead.name.charAt(0)}
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">{lead.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-20 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4 opacity-50">
                <CheckSquare className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold">Sem tarefas nesta categoria</h3>
              <p className="text-muted-foreground mt-2">Bom trabalho! Parece que estás em dia.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
