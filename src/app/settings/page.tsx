'use client';

import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Globe, 
  Camera, 
  Plus,
  Check,
  Power,
  Zap
} from 'lucide-react';
import { useCRMStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { settings, updateSettings, syncPipedrive } = useCRMStore();
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'EMAIL' | 'PIPEDRIVE' | 'NOTIFICATIONS'>('PROFILE');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    await syncPipedrive();
    setIsSyncing(false);
  };
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Gere a tua conta, sincroniza o email e personaliza a tua experiência.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Tabs */}
        <div className="lg:col-span-1 flex flex-col gap-2">
          <TabButton 
            active={activeTab === 'PROFILE'} 
            onClick={() => setActiveTab('PROFILE')} 
            icon={<User className="w-4 h-4" />} 
            label="Perfil Geral" 
          />
          <TabButton 
            active={activeTab === 'EMAIL'} 
            onClick={() => setActiveTab('EMAIL')} 
            icon={<Mail className="w-4 h-4" />} 
            label="Sincronização Email" 
          />
          <TabButton 
            active={activeTab === 'PIPEDRIVE'} 
            onClick={() => setActiveTab('PIPEDRIVE')} 
            icon={<Shield className="w-4 h-4 text-[#FE6B00]" />} 
            label="Pipedrive Hub" 
          />
          <TabButton 
            active={activeTab === 'NOTIFICATIONS'} 
            onClick={() => setActiveTab('NOTIFICATIONS')} 
            icon={<Bell className="w-4 h-4" />} 
            label="Notificações" 
          />
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden min-h-[500px]">
            {activeTab === 'PROFILE' && (
              <div className="p-8 space-y-8">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border-4 border-background shadow-xl">
                      {settings.userName.charAt(0)}
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-xl shadow-lg hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{settings.userName}</h3>
                    <p className="text-sm text-muted-foreground">{settings.agencyName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nome Completo</label>
                    <input 
                      type="text" 
                      value={settings.userName}
                      onChange={(e) => updateSettings({ userName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:bg-background transition-all outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Agência / Empresa</label>
                    <input 
                      type="text" 
                      value={settings.agencyName}
                      onChange={(e) => updateSettings({ agencyName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:bg-background transition-all outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-border flex justify-end">
                  <button className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                    Guardar Alterações
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'EMAIL' && (
              <div className="p-8 space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-2">Puxar Emails (Sincronização Direta)</h3>
                  <p className="text-sm text-muted-foreground">Liga o teu email profissional para que todas as conversas com os clientes apareçam automaticamente na timeline.</p>
                </div>

                <div className="space-y-4">
                  <EmailConnector 
                    provider="Gmail" 
                    isConnected={settings.emailStatus === 'CONNECTED' && settings.connectedEmail?.includes('gmail')} 
                    onConnect={() => updateSettings({ emailStatus: 'CONNECTED', connectedEmail: 'joao.oliveira@gmail.com' })}
                    onDisconnect={() => updateSettings({ emailStatus: 'DISCONNECTED', connectedEmail: null })}
                  />
                  <EmailConnector 
                    provider="Outlook" 
                    isConnected={settings.emailStatus === 'CONNECTED' && settings.connectedEmail?.includes('outlook')}
                    onConnect={() => updateSettings({ emailStatus: 'CONNECTED', connectedEmail: 'joao.oliveira@outlook.com' })}
                    onDisconnect={() => updateSettings({ emailStatus: 'DISCONNECTED', connectedEmail: null })}
                  />
                </div>

                <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-blue-500">
                    <Globe className="w-5 h-5" />
                    <span className="font-bold">Porquê sincronizar?</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Ao ligar a sua conta, o ImobiCRM irá ler os emails enviados para os emails dos seus Leads e indexá-los automaticamente. Poupa tempo e mantém todo o histórico de interação num só lugar.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'PIPEDRIVE' && (
              <div className="p-8 space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black tracking-tighter uppercase font-outfit">Pipedrive Sync Hub</h3>
                    <p className="text-sm text-muted-foreground">Sincroniza os teus negócios e leads do Pipedrive com a rede SI Elite.</p>
                  </div>
                  <div className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                    settings.pipedriveStatus === 'CONNECTED' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-white/5 text-white/30 border-white/10"
                  )}>
                    {settings.pipedriveStatus === 'CONNECTED' ? '● Ativo' : 'Desconectado'}
                  </div>
                </div>

                <div className="p-10 border border-white/5 bg-white/[0.02] rounded-[32px] space-y-6 relative overflow-hidden">
                  <div className="space-y-4 relative z-10">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#FE6B00]">Pipedrive API Token</label>
                    <div className="flex gap-3">
                      <input 
                        type="password" 
                        value={settings.pipedriveApiKey || ''}
                        onChange={(e) => updateSettings({ pipedriveApiKey: e.target.value })}
                        placeholder="Insere o teu token da Pipedrive..."
                        className="flex-1 px-5 py-4 bg-background border border-border rounded-2xl outline-none focus:border-[#FE6B00]/40 transition-all font-mono text-sm"
                      />
                      <button 
                        onClick={() => updateSettings({ pipedriveStatus: settings.pipedriveStatus === 'CONNECTED' ? 'DISCONNECTED' : 'CONNECTED' })}
                        className={cn(
                          "px-8 py-4 font-black rounded-2xl transition-all shadow-xl text-xs uppercase tracking-widest",
                          settings.pipedriveStatus === 'CONNECTED' 
                            ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white" 
                            : "bg-[#FE6B00] text-white shadow-[#FE6B00]/20 hover:scale-105"
                        )}
                      >
                        {settings.pipedriveStatus === 'CONNECTED' ? 'Desligar' : 'Conectar'}
                      </button>
                    </div>
                  </div>
                  
                  {settings.pipedriveStatus === 'CONNECTED' && (
                    <div className="pt-6 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-500">
                      <div className="flex items-center justify-between mb-6">
                        <div className="space-y-1">
                          <p className="font-bold text-white">Sincronização de Dados</p>
                          <p className="text-xs text-muted-foreground">Última sincronização: Há 5 minutos</p>
                        </div>
                        <button 
                          onClick={handleSync}
                          disabled={isSyncing}
                          className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-black rounded-xl text-[10px] uppercase tracking-widest border border-white/10 flex items-center gap-2 transition-all"
                        >
                          <Power className={cn("w-3 h-3", isSyncing && "animate-spin")} />
                          {isSyncing ? "A Sincronizar..." : "Sincronizar Agora"}
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Leads Importados</p>
                          <p className="text-2xl font-black text-white">42</p>
                        </div>
                        <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Negócios Ativos</p>
                          <p className="text-2xl font-black text-white">12</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Icon watermarks */}
                  <Shield className="absolute -bottom-10 -right-10 w-40 h-40 text-white opacity-[0.02]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-500/5 p-8 rounded-3xl border border-blue-500/10">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-blue-500 mb-2">
                      <Zap className="w-5 h-5 fill-current" />
                      <p className="font-black uppercase tracking-tighter">Automação SI</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Ao ativar a sincronização, todos os novos leads capturados no Pipedrive serão automaticamente qualificados pela nossa IA e adicionados à sua agenda local.
                    </p>
                  </div>
                  <div className="flex flex-col justify-center items-end">
                    <button className="text-[10px] font-black uppercase text-blue-500 tracking-widest hover:underline">
                      Ver logs de auditoria →
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all",
        active 
          ? "bg-primary text-white shadow-lg shadow-primary/20" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function EmailConnector({ provider, isConnected, onConnect, onDisconnect }: any) {
  return (
    <div className={cn(
      "p-6 border rounded-3xl transition-all flex items-center justify-between",
      isConnected ? "bg-card border-primary" : "bg-muted/30 border-border"
    )}>
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black",
          provider === 'Gmail' ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"
        )}>
          {provider.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold text-lg">{provider} Business</h4>
          <p className="text-xs text-muted-foreground">
            {isConnected ? "Sincronizado com joao.oliveira@agency.com" : "Sincronização inativa"}
          </p>
        </div>
      </div>
      
      {isConnected ? (
        <button 
          onClick={onDisconnect}
          className="flex items-center gap-2 px-4 py-2 border border-destructive text-destructive hover:bg-destructive hover:text-white font-bold rounded-xl text-xs transition-all"
        >
          <Power className="w-3 h-3" />
          Desligar
        </button>
      ) : (
        <button 
          onClick={onConnect}
          className="flex items-center gap-2 px-6 py-3 bg-foreground text-background font-bold rounded-xl text-xs hover:bg-foreground/90 transition-all"
        >
          <Plus className="w-3 h-3" />
          Ligar {provider}
        </button>
      )}
    </div>
  );
}
