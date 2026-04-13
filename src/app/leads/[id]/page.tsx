'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MessageCircle, 
  Calendar, 
  History, 
  Plus, 
  Building2, 
  ArrowUpRight,
  TrendingUp,
  FileText,
  Clock,
  MoreVertical
} from 'lucide-react';
import { useCRMStore } from '@/lib/store';
import { cn, formatDate, formatCurrency } from '@/lib/utils';
import { Interaction } from '@/types';

export default function LeadDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { leads, deals, properties, interactions, addInteraction, getLeadScore } = useCRMStore();
  
  const lead = leads.find(l => l.id === id);
  const score = getLeadScore(id as string);
  if (!lead) return <div className="p-20 text-center">Lead não encontrado.</div>;

  const leadDeals = deals.filter(d => d.leadId === lead.id);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header / Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all group"
        >
          <div className="p-2 rounded-xl bg-muted group-hover:bg-accent transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="font-semibold text-sm">Voltar para Leads</span>
        </button>

        <div className="flex gap-2">
          <button className="px-4 py-2 border border-border rounded-xl text-sm font-bold hover:bg-accent transition-all">
            Editar Perfil
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
            Criar Negócio
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-3xl p-8 relative overflow-hidden shadow-sm">
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-extrabold border-4 border-background shadow-xl mb-4 relative">
                {lead.name.charAt(0)}
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-background flex items-center justify-center",
                  score > 70 ? "bg-orange-500" : score > 40 ? "bg-amber-500" : "bg-blue-500"
                )}>
                  <Clock className="w-3 h-3 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">{lead.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={lead.status} />
                <span className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                  score > 70 ? "bg-orange-500/10 text-orange-500 border-orange-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                )}>
                  SCORE: {score}%
                </span>
              </div>
              
              <div className="w-full grid grid-cols-2 gap-2 mt-8">
                <a 
                  href={`tel:${lead.phone}`}
                  className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all group"
                >
                  <Phone className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-widest">Ligar</span>
                </a>
                <a 
                  href={`https://wa.me/${lead.phone.replace(/\s/g, '')}`}
                  target="_blank"
                  className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all group"
                >
                  <MessageCircle className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-widest">WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="mt-8 space-y-4 pt-6 border-t border-border">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{lead.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Adicionado em:</span>
                <span className="font-medium">{formatDate(lead.createdAt)}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Origem:</span>
                <span className="px-2 py-0.5 bg-accent rounded font-bold text-[10px] uppercase">{lead.source}</span>
              </div>
            </div>

            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          </div>

          {/* Budget / Preferences */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Critérios de Busca</h3>
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-2xl">
                <p className="text-xs text-muted-foreground mb-1">Budget Máximo</p>
                <p className="text-xl font-bold">{formatCurrency(200000)}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-accent border border-border rounded-full text-xs font-bold">T2</span>
                <span className="px-3 py-1 bg-accent border border-border rounded-full text-xs font-bold">Coimbra</span>
                <span className="px-3 py-1 bg-accent border border-border rounded-full text-xs font-bold">Garagem</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Suggestions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Deals Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Negócios Ativos</h3>
              <span className="text-xs font-bold text-muted-foreground">{leadDeals.length} Negócio(s)</span>
            </div>
            {leadDeals.length > 0 ? (
              <div className="space-y-4">
                {leadDeals.map(deal => (
                  <div key={deal.id} className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between hover:border-primary transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold">{deal.title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs font-bold text-emerald-500">{formatCurrency(deal.value)}</span>
                          <span className="text-xs text-muted-foreground">Probabilidade: {deal.probability}%</span>
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={deal.stage} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 border-2 border-dashed border-border rounded-2xl text-center">
                <p className="text-muted-foreground text-sm">Este lead ainda não tem negócios ativos.</p>
              </div>
            )}
          </div>

          {/* Matching Suggestions (THE "PUXAR IMÓVEIS" FEATURE) */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">Oportunidades de Match</h3>
                <p className="text-sm text-muted-foreground">Imóveis que encaixam nos critérios do João.</p>
              </div>
              <div className="p-2 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20">
                <Building2 className="w-5 h-5" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Suggestion 1 */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden group hover:shadow-xl transition-all">
                <div className="h-32 bg-muted relative">
                  <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">95% Match</div>
                </div>
                <div className="p-3">
                  <h5 className="font-bold text-xs truncate">T2 Renovado - Santo António</h5>
                  <p className="text-xs font-bold text-primary mt-1">{formatCurrency(185000)}</p>
                  <button className="w-full mt-3 py-1.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-lg flex items-center justify-center gap-1 group-hover:bg-primary/90 transition-all">
                    Apresentar ao Cliente
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
              {/* Suggestion 2 */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden group hover:shadow-xl transition-all">
                <div className="h-32 bg-muted relative">
                  <img src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-amber-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">82% Match</div>
                </div>
                <div className="p-3">
                  <h5 className="font-bold text-xs truncate">T2 Centro da Cidade</h5>
                  <p className="text-xs font-bold text-primary mt-1">{formatCurrency(198000)}</p>
                  <button className="w-full mt-3 py-1.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-lg flex items-center justify-center gap-1 group-hover:bg-primary/90 transition-all">
                    Apresentar ao Cliente
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <History className="w-5 h-5 text-muted-foreground" />
                Histórico de Atividade
              </h3>
              <button 
                onClick={() => {
                  const content = prompt('Descreva a nova interação:');
                  if (content) {
                    addInteraction({
                      id: Date.now().toString(),
                      leadId: lead.id,
                      type: 'CHAMADA',
                      content,
                      date: 'Agora'
                    });
                  }
                }}
                className="p-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-colors shadow-lg shadow-primary/20"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:via-border/50 before:to-transparent">
              {interactions.filter(i => i.leadId === lead.id).map((interaction, idx, arr) => (
                <TimelineItem 
                  key={interaction.id}
                  type={interaction.type} 
                  title={interaction.type} 
                  detail={interaction.content} 
                  date={interaction.date} 
                  isLast={idx === arr.length - 1}
                />
              ))}
              
              {interactions.filter(i => i.leadId === lead.id).length === 0 && (
                <>
                  <TimelineItem 
                    type="CHAMADA" 
                    title="Chamada de Qualificação" 
                    detail="O cliente confirmou interesse em visitar o imóvel na próxima semana." 
                    date="Hoje às 10:30" 
                  />
                  <TimelineItem 
                    type="EMAIL" 
                    title="Envio de Dossier" 
                    detail="Enviado PDF com planta e ficha técnica do T2 em Santo António." 
                    date="Ontem" 
                  />
                  <TimelineItem 
                    type="REUNIAO" 
                    title="Novo Lead Adicionado" 
                    detail="Lead capturado via formulário do website (Zillow)." 
                    date="Há 2 dias" 
                    isLast
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    'NOVO': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'CONTACTADO': 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    'VISITA_AGENDADA': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'PROPOSTA': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    'FECHADO_GANHO': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'PERDIDO': 'bg-destructive/10 text-destructive border-destructive/20',
  };

  return (
    <span className={cn(
      "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mt-2",
      styles[status] || styles['NOVO']
    )}>
      {status.replace('_', ' ')}
    </span>
  );
}

function TimelineItem({ type, title, detail, date, isLast }: any) {
  const icons: any = {
    'CHAMADA': <Phone className="w-3.5 h-3.5" />,
    'EMAIL': <Mail className="w-3.5 h-3.5" />,
    'REUNIAO': <Clock className="w-3.5 h-3.5" />,
  };

  return (
    <div className="relative flex items-start gap-6 group">
      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card border border-border shadow-sm group-hover:border-primary transition-colors relative z-10">
        <div className="text-muted-foreground group-hover:text-primary transition-colors">
          {icons[type]}
        </div>
      </div>
      <div className={cn(
        "flex-1 pb-4",
        !isLast && "border-b border-border/50"
      )}>
        <div className="flex items-center justify-between gap-4">
          <h4 className="font-bold text-sm tracking-tight">{title}</h4>
          <span className="text-xs text-muted-foreground font-medium">{date}</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          {detail}
        </p>
        <div className="mt-2 text-[10px] font-bold text-primary uppercase tracking-widest cursor-pointer hover:underline">
          Ver notas completas
        </div>
      </div>
    </div>
  );
}
