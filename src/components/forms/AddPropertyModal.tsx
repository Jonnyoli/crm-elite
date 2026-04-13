'use client';

import React, { useState } from 'react';
import BaseModal from '@/components/ui/BaseModal';
import { useCRMStore } from '@/lib/store';
import { PropertyType, PropertyStatus } from '@/types';
import { Building2, Euro, Home, Maximize, MapPin, AlignLeft, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddPropertyModal({ isOpen, onClose }: AddPropertyModalProps) {
  const { addProperty } = useCRMStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    price: '',
    type: 'T2' as PropertyType,
    status: 'DISPONIVEL' as PropertyStatus,
    description: '',
    features: [] as string[],
  });

  const [featureInput, setFeatureInput] = useState('');

  const addFeature = () => {
    if (featureInput && !formData.features.includes(featureInput)) {
      setFormData({ ...formData, features: [...formData.features, featureInput] });
      setFeatureInput('');
    }
  };

  const removeFeature = (f: string) => {
    setFormData({ ...formData, features: formData.features.filter(x => x !== f) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await addProperty({
      address: formData.address,
      price: Number(formData.price),
      type: formData.type,
      status: formData.status,
      description: formData.description,
      features: formData.features,
      location: 'Coimbra',
    });
    setIsSubmitting(false);
    onClose();
    setFormData({ address: '', price: '', type: 'T2', status: 'DISPONIVEL', description: '', features: [] });
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Nova Angariação SI" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Morada */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Morada Completa</label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
              <input 
                required
                type="text" 
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-white shadow-inner"
                placeholder="Rua, Número, Código Postal, Cidade"
              />
            </div>
          </div>

          {/* Preço e Tipo */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Preço Consensual (€)</label>
            <div className="relative group">
              <Euro className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
              <input 
                required
                type="number" 
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-white shadow-inner"
                placeholder="500000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Tipologia</label>
            <div className="relative group">
              <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
              <select 
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as PropertyType })}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-white appearance-none cursor-pointer shadow-inner"
              >
                {['T0', 'T1', 'T2', 'T3', 'T4', 'MORADIA', 'TERRENO'].map(t => (
                  <option key={t} value={t} className="bg-[#0B2A4A]">{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Estado */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Estado do Imóvel</label>
            <div className="flex gap-2">
                {['DISPONIVEL', 'RESERVADO', 'VENDIDO'].map((s) => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => setFormData({...formData, status: s as PropertyStatus})}
                        className={cn(
                            "flex-1 py-3 px-2 rounded-xl text-[10px] font-black uppercase transition-all border",
                            formData.status === s 
                                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                                : "bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10"
                        )}
                    >
                        {s}
                    </button>
                ))}
            </div>
          </div>

          {/* Descrição */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Descrição Comercial</label>
            <div className="relative group">
              <AlignLeft className="absolute left-4 top-4 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
              <textarea 
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-white shadow-inner resize-none text-sm"
                placeholder="Descreva os pontos fortes do imóvel..."
              />
            </div>
          </div>

          {/* Características / Tags */}
          <div className="md:col-span-2 space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Características (Garagem, Piscina, etc.)</label>
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={featureInput}
                    onChange={e => setFeatureInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-primary/50 transition-all font-medium text-white text-sm"
                    placeholder="Adicionar característica..."
                />
                <button 
                    type="button"
                    onClick={addFeature}
                    className="px-6 bg-primary text-white font-black rounded-xl hover:bg-primary/90 transition-all text-xs"
                >
                    ADD
                </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
                {formData.features.map(f => (
                    <span key={f} className="group flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-white/70">
                        {f}
                        <button type="button" onClick={() => removeFeature(f)} className="text-white/20 hover:text-red-500 transition-colors">
                            <Check className="w-3 h-3 rotate-45" />
                        </button>
                    </span>
                ))}
            </div>
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <button 
            type="button" 
            onClick={onClose}
            className="flex-1 py-4 px-6 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all border border-white/5"
          >
            CANCELAR
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-4 px-6 si-gradient text-white font-black rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:scale-100"
          >
            {isSubmitting ? 'A GUARDAR...' : 'REGISTAR IMÓVEL'}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
