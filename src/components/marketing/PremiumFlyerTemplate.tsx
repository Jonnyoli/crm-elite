'use client';

import React from 'react';
import { 
  MapPin, 
  BedDouble, 
  Square, 
  Euro, 
  Phone, 
  Globe, 
  Mail,
  QrCode
} from 'lucide-react';
import { Property } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface FlyerTemplateProps {
  property: Property;
  aiCopy: {
    teaser: string;
    description: string;
  };
}

export default function PremiumFlyerTemplate({ property, aiCopy }: FlyerTemplateProps) {
  return (
    <div className="w-full bg-white text-[#0B2A4A] shadow-2xl rounded-sm overflow-hidden border border-gray-200" id="flyer-content">
      {/* Header with Luxury Brand */}
      <div className="bg-[#0B2A4A] p-10 flex justify-between items-center text-white relative overflow-hidden">
        <div className="z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
               <span className="text-2xl font-black tracking-tighter flex">
                <span className="text-[#FE6B00]">S</span>
                <span className="text-[#0B2A4A]">I</span>
              </span>
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tighter leading-none">SOLUÇÕES IDEAIS</h2>
              <p className="text-[#FE6B00] text-[10px] font-bold uppercase tracking-widest mt-1">Coimbra | Mondego</p>
            </div>
          </div>
        </div>
        <div className="z-10 text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 mb-1 font-serif italic italic font-light italic">Exclusive Listing</p>
          <p className="text-lg font-black tracking-tighter">REF: SI-{property.id.toUpperCase()}</p>
        </div>
        
        {/* Decorative elements for print */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FE6B00] opacity-10 rounded-full -mr-32 -mt-32 blur-3xl" />
      </div>

      {/* Hero Image */}
      <div className="relative h-[450px]">
        <img 
          src={property.imageUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200'} 
          alt={property.address} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-10">
          <div className="bg-[#FE6B00] text-white px-6 py-2 w-fit mb-4 text-2xl font-black rounded-lg shadow-xl">
            {formatCurrency(property.price)}
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight leading-tight">
            {property.address}
          </h1>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-12 gap-10 p-12">
        {/* Main Details */}
        <div className="col-span-8 space-y-10">
          <div className="space-y-4">
            <h3 className="text-[#FE6B00] font-black text-sm uppercase tracking-widest flex items-center gap-2">
              <span className="w-8 h-[2px] bg-[#FE6B00]" />
              Descrição do Imóvel
            </h3>
            <h4 className="text-2xl font-black leading-tight italic font-serif">
              "{aiCopy.teaser}"
            </h4>
            <p className="text-lg text-slate-700 leading-relaxed text-justify">
              {aiCopy.description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 bg-slate-50 p-8 rounded-3xl border border-slate-100">
             <div className="flex flex-col items-center gap-2">
                <BedDouble className="w-8 h-8 text-[#0B2A4A]" />
                <p className="text-sm font-bold text-slate-500 uppercase">Tipologia</p>
                <p className="text-xl font-black">{property.type}</p>
             </div>
             <div className="flex flex-col items-center gap-2 border-x border-slate-200">
                <Square className="w-8 h-8 text-[#0B2A4A]" />
                <p className="text-sm font-bold text-slate-500 uppercase">Área Total</p>
                <p className="text-xl font-black">124 m²</p>
             </div>
             <div className="flex flex-col items-center gap-2">
                <QrCode className="w-8 h-8 text-[#FE6B00]" />
                <p className="text-sm font-bold text-slate-500 uppercase">Visita Virtual</p>
                <p className="text-xs font-black">Digital Key</p>
             </div>
          </div>
          
          <div className="space-y-4">
             <h3 className="text-[#FE6B00] font-black text-sm uppercase tracking-widest flex items-center gap-2">
              <span className="w-8 h-[2px] bg-[#FE6B00]" />
              Características de Destaque
            </h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-10">
                {property.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-700 font-bold border-b border-slate-100 pb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FE6B00]" />
                        {feature}
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="col-span-4 space-y-10">
          {/* Agent Info Box */}
          <div className="bg-[#0B2A4A] p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
                 <Globe className="w-32 h-32" />
             </div>
             
             <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-32 h-32 border-4 border-[#FE6B00] rounded-full overflow-hidden mb-6 shadow-2xl">
                    <img 
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                      alt="Agente"
                      className="w-full h-full bg-slate-100"
                    />
                </div>
                <h4 className="text-2xl font-black mb-1">João Oliveira</h4>
                <p className="text-[#FE6B00] font-bold text-xs uppercase tracking-widest mb-6 border-b border-[#FE6B00]/20 pb-4 w-full">Director Comercial SI</p>
                
                <div className="space-y-4 w-full">
                    <div className="flex items-center gap-4 text-sm font-bold hover:text-[#FE6B00] transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[#FE6B00]/20 transition-all">
                            <Phone className="w-4 h-4 text-[#FE6B00]" />
                        </div>
                        <p>+351 912 345 678</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-bold hover:text-[#FE6B00] transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[#FE6B00]/20 transition-all">
                            <Mail className="w-4 h-4 text-[#FE6B00]" />
                        </div>
                        <p className="truncate text-[11px]">joao.oliveira@solucoesideais.pt</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-bold hover:text-[#FE6B00] transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[#FE6B00]/20 transition-all">
                            <Globe className="w-4 h-4 text-[#FE6B00]" />
                        </div>
                        <p>www.solucoesideais.pt</p>
                    </div>
                </div>
             </div>
          </div>
          
          {/* Location / Quality Badge */}
          <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-200">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-[#FE6B00]" />
                </div>
                <div>
                    <h5 className="font-black text-sm uppercase tracking-tight">SI Coimbra</h5>
                    <p className="text-xs text-slate-500 font-bold">Rua Ferreira Borges, 12, Coimbra</p>
                </div>
             </div>
             
             <div className="pt-6 border-t border-slate-200">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Garantia de Qualidade</p>
                <div className="flex gap-2">
                    {[1,2,3,4,5].map(i => (
                        <div key={i} className="w-2 h-2 rounded-full bg-[#FE6B00]/30" />
                    ))}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Footer / Legal */}
      <div className="bg-[#f8fafc] px-12 py-8 flex justify-between items-center border-t border-slate-100">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#0B2A4A] rounded-lg flex items-center justify-center text-white text-sm font-black">
                SI
            </div>
            <p className="text-[10px] text-slate-400 font-bold max-w-sm">
                Soluções Ideais Coimbra - Mondego. Licença AMI 123456. Todos os direitos reservados. 
                Os dados apresentados são meramente informativos.
            </p>
         </div>
         <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
             <QrCode className="w-16 h-16 text-[#0B2A4A] opacity-20" />
         </div>
      </div>
    </div>
  );
}
