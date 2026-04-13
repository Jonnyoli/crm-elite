import { create } from 'zustand';
import { Lead, Property, Deal, Task, Interaction } from '@/types';

interface CRMStore {
  leads: Lead[];
  properties: Property[];
  deals: Deal[];
  tasks: Task[];
  interactions: Interaction[];
  settings: {
    userName: string;
    agencyName: string;
    emailStatus: 'CONNECTED' | 'DISCONNECTED';
    connectedEmail: string | null;
    pipedriveApiKey: string | null;
    pipedriveStatus: 'CONNECTED' | 'DISCONNECTED';
  };
  
  // Actions
  initialize: () => Promise<void>;
  updateSettings: (updates: Partial<CRMStore['settings']>) => void;
  
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => Promise<void>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt'>) => Promise<void>;
  updateDeal: (id: string, updates: Partial<Deal>) => Promise<void>;
  deleteDeal: (id: string) => Promise<void>;
  
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  
  addProperty: (property: Omit<Property, 'id' | 'createdAt'>) => Promise<void>;
  updateProperty: (id: string, updates: Partial<Property>) => Promise<void>;
  
  addInteraction: (interaction: Interaction) => void; // local mock for now
  getLeadScore: (id: string) => number;
  syncPipedrive: () => Promise<void>;
}

export const useCRMStore = create<CRMStore>((set, get) => ({
  leads: [],
  properties: [],
  deals: [],
  tasks: [],
  interactions: [],
  settings: {
    userName: 'João Oliveira',
    agencyName: 'SI - Soluções Ideais Coimbra - Mondego',
    emailStatus: 'DISCONNECTED',
    connectedEmail: null,
    pipedriveApiKey: null,
    pipedriveStatus: 'DISCONNECTED',
  },

  initialize: async () => {
    try {
      const res = await fetch('/api/init');
      if (!res.ok) throw new Error('API Sync Failed');
      const json = await res.json();
      if (json.success) {
        set({
          leads: json.data.leads || [],
          deals: json.data.deals || [],
          properties: json.data.properties || [],
          tasks: json.data.tasks || []
        });
      }
    } catch (e) {
      console.error('Failed to initialize MongoDB Store:', e);
    }
  },

  updateSettings: (updates) => set((state) => ({
    settings: { ...state.settings, ...updates }
  })),

  // LEADS
  addLead: async (lead) => {
    try {
        const res = await fetch('/api/leads', { method: 'POST', body: JSON.stringify(lead) });
        const json = await res.json();
        if (json.success) set((state) => ({ leads: [json.data, ...state.leads] }));
    } catch(e) { console.error('Add Lead Error:', e); }
  },
  updateLead: async (id, updates) => {
    try {
        const res = await fetch(`/api/leads/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
        const json = await res.json();
        if(json.success) set((state) => ({ leads: state.leads.map(l => l.id === id ? { ...l, ...json.data } : l) }));
    } catch(e) { console.error('Update Lead Error', e); }
  },
  deleteLead: async (id) => {
    try {
        const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
        const json = await res.json();
        if (json.success) {
            set((state) => ({
                leads: state.leads.filter(l => l.id !== id),
                deals: state.deals.filter(d => d.leadId !== id),
                tasks: state.tasks.filter(t => t.leadId !== id)
            }));
        }
    } catch(e) { console.error('Delete Lead Error', e); }
  },

  // DEALS
  addDeal: async (deal) => {
     try {
         const res = await fetch('/api/deals', { method: 'POST', body: JSON.stringify(deal) });
         const json = await res.json();
         if(json.success) set((state) => ({ deals: [json.data, ...state.deals] }));
     } catch(e) { console.error('Add Deal Error', e); }
  },
  updateDeal: async (id, updates) => {
     try {
         const res = await fetch(`/api/deals/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
         const json = await res.json();
         if(json.success) set((state) => ({ deals: state.deals.map(d => d.id === id ? { ...d, ...json.data } : d) }));
     } catch(e) { console.error('Update Deal Error', e); }
  },
  deleteDeal: async (id) => {
     try {
         const res = await fetch(`/api/deals/${id}`, { method: 'DELETE' });
         const json = await res.json();
         if(json.success) set((state) => ({ deals: state.deals.filter(d => d.id !== id) }));
     } catch(e) { console.error('Delete Deal Error', e); }
  },

  // TASKS
  addTask: async (task) => {
     try {
         const res = await fetch('/api/tasks', { method: 'POST', body: JSON.stringify(task) });
         const json = await res.json();
         if(json.success) set((state) => ({ tasks: [json.data, ...state.tasks] }));
     } catch(e) { console.error('Add Task Error', e); }
  },
  updateTask: async (id, updates) => {
     try {
         const res = await fetch(`/api/tasks/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
         const json = await res.json();
         if(json.success) set((state) => ({ tasks: state.tasks.map(t => t.id === id ? { ...t, ...json.data } : t) }));
     } catch(e) { console.error('Update Task Error', e); }
  },
  toggleTask: async (id) => {
     try {
         const task = get().tasks.find(t => t.id === id);
         if (!task) return;
         const res = await fetch(`/api/tasks/${id}`, { method: 'PUT', body: JSON.stringify({ isCompleted: !task.isCompleted }) });
         const json = await res.json();
         if(json.success) set((state) => ({ tasks: state.tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t) }));
     } catch(e) { console.error('Toggle Task Error', e); }
  },

  // PROPERTIES
  addProperty: async (prop) => {
     try {
         const res = await fetch('/api/properties', { method: 'POST', body: JSON.stringify(prop) });
         const json = await res.json();
         if(json.success) set((state) => ({ properties: [json.data, ...state.properties] }));
     } catch(e) { console.error('Add Prop Error', e); }
  },
  updateProperty: async (id, updates) => {
     try {
         const res = await fetch(`/api/properties/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
         const json = await res.json();
         if(json.success) set((state) => ({ properties: state.properties.map(p => p.id === id ? { ...p, ...json.data } : p) }));
     } catch(e) { console.error('Update Prop Error', e); }
  },

  addInteraction: (interaction) => set((state) => ({
    interactions: [interaction, ...state.interactions]
  })),

  getLeadScore: (id) => {
    const leadInteractions = get().interactions.filter(i => i.leadId === id);
    const score = Math.min(100, (leadInteractions.length * 20) + 10);
    return score;
  },

  syncPipedrive: async () => {
    const { settings } = get();
    if (settings.pipedriveApiKey) {
        try {
            const res = await fetch(`/api/pipedrive?api_token=${settings.pipedriveApiKey}`);
            const data = await res.json();
            if (data.success && data.deals.length > 0) {
               console.log('Pipedrive Sync real');
            }
        } catch (err) {
            console.error('Falha ao comunicar com Pipedrive API real.');
        }
    }
  }

}));
