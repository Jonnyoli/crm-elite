'use client';

import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Jan', preco: 1850 },
  { name: 'Fev', preco: 1920 },
  { name: 'Mar', preco: 1880 },
  { name: 'Abr', preco: 1950 },
  { name: 'Mai', preco: 2100 },
  { name: 'Jun', preco: 2050 },
  { name: 'Jul', preco: 2200 },
];

export default function MarketTrendsChart() {
  return (
    <div className="h-[300px] w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPreco" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FE6B00" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#FE6B00" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700 }} 
          />
          <YAxis 
            hide 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0B2A4A', 
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: 'white'
            }} 
            itemStyle={{ color: '#FE6B00' }}
          />
          <Area 
            type="monotone" 
            dataKey="preco" 
            stroke="#FE6B00" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorPreco)" 
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
