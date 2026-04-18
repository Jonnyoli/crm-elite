'use client';

import React, { useState } from 'react';
import { 
    Calendar,
    Video,
    Mic,
    Scissors,
    UploadCloud,
    Plus,
    Play,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentIdea {
    id: string;
    title: string;
    platform: 'TIKTOK' | 'INSTAGRAM' | 'YOUTUBE';
    stage: 'IDEIA' | 'GRAVAR' | 'EDITAR' | 'PUBLICADO';
}

const INITIAL_IDEAS: ContentIdea[] = [
    { id: '1', title: 'Tour Imóvel de Luxo T4 - Solum', platform: 'TIKTOK', stage: 'GRAVAR' },
    { id: '2', title: '3 Erros ao Comprar Casa em 2026', platform: 'INSTAGRAM', stage: 'EDITAR' },
    { id: '3', title: 'Como funciona o Crédito Jovem?', platform: 'YOUTUBE', stage: 'IDEIA' }
];

export default function ContentPlanner() {
    const [ideas, setIdeas] = useState<ContentIdea[]>(INITIAL_IDEAS);

    const stages = [
        { id: 'IDEIA', label: 'Ideação', icon: Plus, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { id: 'GRAVAR', label: 'A Gravar', icon: Mic, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { id: 'EDITAR', label: 'Edição', icon: Scissors, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { id: 'PUBLICADO', label: 'Publicado', icon: CheckCircle2, color: 'text-[#25D366]', bg: 'bg-[#25D366]/10' }
    ];

    return (
        <div className="bg-card border border-border rounded-[40px] p-8 shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 text-purple-500">
                        <Video className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white font-outfit uppercase tracking-tighter">Planeador de Conteúdo</h2>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">TikTok • Reels • Shorts</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    <Plus className="w-4 h-4" /> Nova Ideia
                </button>
            </div>

            {/* Kanban Planner */}
            <div className="flex gap-6 overflow-x-auto custom-scrollbar flex-1 pb-4">
                {stages.map(stage => {
                    const stageIdeas = ideas.filter(i => i.stage === stage.id);
                    return (
                        <div key={stage.id} className="min-w-[280px] w-[280px] flex flex-col bg-muted/20 border border-border rounded-3xl p-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className={cn("pe-2 py-1 rounded-lg flex items-center justify-center", stage.bg)}>
                                        <stage.icon className={cn("w-4 h-4 ml-2", stage.color)} />
                                    </div>
                                    <h3 className="font-black text-[11px] uppercase tracking-widest text-white">{stage.label}</h3>
                                </div>
                                <span className="text-[10px] bg-card px-2 py-1 rounded-md text-muted-foreground font-black border border-border">
                                    {stageIdeas.length}
                                </span>
                            </div>

                            <div className="space-y-3 flex-1 overflow-y-auto">
                                {stageIdeas.map(idea => (
                                    <div key={idea.id} className="bg-card border border-border rounded-2xl p-4 hover:border-white/20 transition-all cursor-pointer group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={cn(
                                                "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm",
                                                idea.platform === 'TIKTOK' ? "bg-cyan-500/20 text-cyan-400" :
                                                idea.platform === 'INSTAGRAM' ? "bg-pink-500/20 text-pink-400" :
                                                "bg-red-500/20 text-red-400"
                                            )}>
                                                {idea.platform}
                                            </span>
                                            <Play className="w-3 h-3 text-white/20 group-hover:text-white transition-colors" />
                                        </div>
                                        <p className="text-xs font-bold text-white leading-tight">{idea.title}</p>
                                    </div>
                                ))}
                                {stageIdeas.length === 0 && (
                                    <div className="h-24 border-2 border-dashed border-border rounded-2xl flex items-center justify-center text-[9px] uppercase tracking-widest font-black text-muted-foreground opacity-50">
                                        Soltar Aqui
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
