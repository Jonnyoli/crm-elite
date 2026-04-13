'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { TrendingUp, Users, Target, Zap } from 'lucide-react';

const funnelData = [
  { name: 'Leads', value: 400, color: '#0B2A4A' },
  { name: 'Contactos', value: 300, color: '#1a3a5a' },
  { name: 'Visitas', value: 200, color: '#FE6B00' },
  { name: 'Propostas', value: 100, color: '#FF8C33' },
  { name: 'Fechado', value: 50, color: '#10b981' },
];

const scoringData = [
  { name: 'Quente', value: 45, color: '#FE6B00' },
  { name: 'Morno', value: 30, color: '#FF8C33' },
  { name: 'Frio', value: 25, color: '#0B2A4A' },
];

export default function ExecutivePerformance() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Funnel Chart */}
      <div className="bg-card border border-border rounded-[40px] p-6 lg:p-10 shadow-sm relative overflow-hidden group">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-black tracking-tight mb-1">Funil de Conversão</h3>
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="w-4 h-4 text-[#FE6B00]" />
              Eficiência: 12.5% de fecho total
            </p>
          </div>
          <div className="p-3 bg-[#FE6B00]/10 text-[#FE6B00] rounded-2xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={funnelData} margin={{ left: 20, right: 40 }}>
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700 }}
              />
              <Tooltip 
                 cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                 contentStyle={{ backgroundColor: '#0B2A4A', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={32}>
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lead Scoring Distribution */}
      <div className="bg-card border border-border rounded-[40px] p-6 lg:p-10 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-black tracking-tight mb-1">Qualidade da Pipeline</h3>
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-[#FE6B00]" />
              Distribuição de Scoring
            </p>
          </div>
          <div className="relative group">
              <Zap className="w-6 h-6 text-amber-500 fill-amber-500 animate-pulse" />
          </div>
        </div>

        <div className="h-auto min-h-[300px] w-full flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="w-full h-[250px] sm:h-[300px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={scoringData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={8}
                            dataKey="value"
                        >
                            {scoringData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip 
                             contentStyle={{ backgroundColor: '#0B2A4A', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                
                {/* Center Text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <p className="text-3xl font-black">75%</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ativo</p>
                </div>
            </div>
            
            <div className="space-y-4 min-w-[120px] flex flex-row sm:flex-col justify-center w-full sm:w-auto gap-4 sm:gap-0">
                {scoringData.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 sm:gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <div>
                            <p className="text-[10px] sm:text-xs font-black">{item.name}</p>
                            <p className="text-[9px] sm:text-[10px] text-muted-foreground font-bold">{item.value}%</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
