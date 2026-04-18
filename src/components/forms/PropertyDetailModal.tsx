'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MapPin, 
  UploadCloud, 
  Camera, 
  Euro, 
  Info,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Save,
  Building2,
  Share2,
  Loader2,
  Star,
  Sparkles
} from 'lucide-react';
import { useCRMStore } from '@/lib/store';
import { cn, formatCurrency } from '@/lib/utils';
import { Property, PropertyStatus, PropertyType } from '@/types';

interface PropertyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string | null;
}

export default function PropertyDetailModal({ isOpen, onClose, propertyId }: PropertyDetailModalProps) {
  const { properties, updateProperty } = useCRMStore();
  const [formData, setFormData] = useState<Partial<Property> | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const property = properties.find(p => p.id === propertyId);

  useEffect(() => {
    if (property && isOpen) {
      setFormData(property);
      setPreviewImage(property.imageUrl || null);
    }
  }, [property, isOpen]);

  // Client-side Image Compression Engine
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1280; // Optimized for high quality display
          const MAX_HEIGHT = 1280;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Compress as JPEG with 80% quality
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve(dataUrl);
        };
        img.onerror = error => reject(error);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size natively to avoid immediate crashes (limit 15MB before compression)
    if (file.size > 15 * 1024 * 1024) {
      alert("A imagem é demasiado grande. Por favor, escolha uma até 15MB antes da compressão.");
      return;
    }

    try {
      setIsUploading(true);
      const base64Image = await compressImage(file);
      
      setPreviewImage(base64Image);
      setFormData(prev => prev ? { ...prev, imageUrl: base64Image } : null);
      
    } catch (error) {
      console.error("Erro ao comprimir imagem:", error);
      alert("Houve um problema a processar a fotografia.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyId || !formData) return;

    try {
      setIsSubmitting(true);
      await updateProperty(propertyId, formData);
      onClose();
    } catch (error) {
      console.error('Failed to update property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFeature = (feature: string) => {
      if(!formData || !formData.features) return;
      
      const features = [...formData.features];
      const index = features.indexOf(feature);
      
      if(index > -1) {
          features.splice(index, 1);
      } else {
          features.push(feature);
      }
      
      setFormData({...formData, features});
  };

  const generateAIDescription = async () => {
    if (!formData) return;
    setIsGenerating(true);
    
    // Simulate API delay for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const type = formData.type || 'Imóvel';
    const feats = (formData.features && formData.features.length) 
        ? formData.features.join(', ')
        : 'excelentes acabamentos e muita luz natural';
    const loc = formData.address || 'uma zona privilegiada';
    
    const description = `✨ EXCLUSIVO SOLUÇÕES IDEAIS ✨\n\nExcelente ${type} localizado em ${loc}, desenhado para proporcionar o máximo conforto e qualidade de vida à sua família.\n\nEste imóvel de excelência destaca-se pelos seguintes atributos memoráveis:\n✅ ${feats.replace(/,/g, '\n✅')}\n\nIdeal para quem procura exclusividade, conveniência e bem-estar. Não perca esta oportunidade de negócio segura e rentável!\n\n📞 Fale com a nossa equipa hoje mesmo para agendar a sua visita e sentir o potencial desta casa.`;
    
    setFormData(prev => prev ? { ...prev, description } : null);
    setIsGenerating(false);
  };

  if (!isOpen || !formData || !propertyId) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 pb-safe pt-safe">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col max-h-full sm:rounded-[40px]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card z-10 shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">Ficha de Imóvel</h2>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">REF: SI-{propertyId.slice(-6).toUpperCase()}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                 {/* Visual Area (Upload Center) */}
                 <div className="bg-muted/10 p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-border flex flex-col justify-center items-center relative overflow-hidden">
                     {/* Background blur of the same image */}
                     {previewImage && (
                        <div className="absolute inset-0 z-0">
                            <img src={previewImage} className="w-full h-full object-cover opacity-20 blur-2xl" alt="blur" />
                        </div>
                     )}
                     
                     <div className="relative z-10 w-full max-w-sm">
                         <div 
                            onClick={() => fileInputRef.current?.click()}
                            className={cn(
                                "aspect-[4/3] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden group shadow-2xl",
                                previewImage ? "border-primary/50" : "border-border hover:border-primary/50 hover:bg-white/5",
                                isUploading && "opacity-50 pointer-events-none"
                            )}
                         >
                             {previewImage ? (
                                 <>
                                    <img src={previewImage} alt="Property" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                        <Camera className="w-8 h-8 mb-2" />
                                        <span className="font-bold text-sm">Atualizar Fotografia</span>
                                    </div>
                                 </>
                             ) : (
                                 <div className="text-center p-6 flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4 text-muted-foreground group-hover:text-primary transition-colors group-hover:scale-110 duration-500">
                                        <UploadCloud className="w-8 h-8" />
                                    </div>
                                    <h4 className="font-bold text-sm mb-1">Upload Capa do Imóvel</h4>
                                    <p className="text-xs text-muted-foreground">Arraste ou clique para carregar.<br/>Otimizado por Compressão Inteligente.</p>
                                 </div>
                             )}
                             
                             {isUploading && (
                                 <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white">
                                     <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
                                     <p className="font-bold text-xs uppercase tracking-widest text-primary animate-pulse">Comprimindo Imagem...</p>
                                 </div>
                             )}
                         </div>
                         <input 
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/jpeg, image/png, image/webp"
                            className="hidden"
                         />

                         <div className="mt-8 bg-card border border-border p-6 rounded-3xl shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                <Share2 className="w-16 h-16" />
                            </div>
                            <h4 className="font-black text-sm uppercase text-primary tracking-widest mb-2 flex items-center gap-2">
                               <Star className="w-4 h-4 fill-primary" />
                               Ação Rápida
                            </h4>
                            <p className="text-xs text-muted-foreground mb-4">Pode publicar automaticamente este imóvel depois de preencher os dados visuais.</p>
                            <button className="px-4 py-2 bg-primary/10 text-primary w-full rounded-xl text-xs font-bold hover:bg-primary/20 transition-colors pointer-events-none">
                                Abrir no Marketing Hub
                            </button>
                         </div>
                     </div>
                 </div>

                 {/* Edit Form Area */}
                 <div className="p-6 sm:p-10 space-y-8 bg-card flex flex-col min-h-[500px]">
                     <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                         <div className="space-y-1">
                            <label className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground">Endereço Principal</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input 
                                   type="text"
                                   value={formData.address}
                                   onChange={e => setFormData({...formData, address: e.target.value})}
                                   autoFocus
                                   className="w-full pl-11 pr-4 py-3.5 bg-background border border-border rounded-xl font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1">
                                <label className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground">Valor (Preço)</label>
                                <div className="relative">
                                    <Euro className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FE6B00]" />
                                    <input 
                                    type="number"
                                    value={formData.price}
                                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                                    className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl font-bold focus:border-[#FE6B00] outline-none"
                                    />
                                </div>
                             </div>
                             <div className="space-y-1">
                                <label className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground">Estado</label>
                                <select 
                                    value={formData.status}
                                    onChange={e => setFormData({...formData, status: e.target.value as PropertyStatus})}
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl font-bold font-outfit appearance-none focus:border-primary outline-none"
                                >
                                    <option value="DISPONIVEL">Disponível</option>
                                    <option value="RESERVADO">Reservado</option>
                                    <option value="VENDIDO">Vendido</option>
                                </select>
                             </div>
                         </div>

                         <div className="space-y-2">
                             <label className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground">Tipologia</label>
                             <div className="flex flex-wrap gap-2">
                                {['T0', 'T1', 'T2', 'T3', 'T4', 'MORADIA', 'TERRENO'].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({...formData, type: type as PropertyType})}
                                        className={cn(
                                            "px-4 py-2 font-bold text-xs rounded-xl border transition-all",
                                            formData.type === type ? "bg-primary text-primary-foreground border-primary" : "bg-transparent border-border hover:bg-muted"
                                        )}
                                    >
                                        {type}
                                    </button>
                                ))}
                             </div>
                         </div>

                         <div className="space-y-2">
                             <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground">Descrição Base</label>
                                <button 
                                   type="button"
                                   onClick={generateAIDescription}
                                   disabled={isGenerating}
                                   className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                    Gerar com IA
                                </button>
                             </div>
                             <textarea 
                                 rows={4}
                                 value={formData.description}
                                 onChange={e => setFormData({...formData, description: e.target.value})}
                                 className="w-full p-4 bg-background border border-border rounded-xl text-sm focus:border-primary outline-none resize-none leading-relaxed"
                                 placeholder="Descreva o imóvel..."
                             />
                         </div>

                         {/* Destaques (Features) */}
                         <div className="space-y-2">
                             <label className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground">Destaques Premium</label>
                             <div className="flex flex-wrap gap-2">
                                 {['Piscina', 'Garagem', 'Vista Rio', 'Terraço', 'Domótica', 'Condomínio Fechado', 'Recuperador'].map(feat => (
                                     <button
                                         key={feat}
                                         type="button"
                                         onClick={() => toggleFeature(feat)}
                                         className={cn(
                                             "px-3 py-1.5 rounded-full text-xs font-bold border transition-colors flex items-center gap-1",
                                             formData.features?.includes(feat) 
                                               ? "bg-amber-500/10 text-amber-500 border-amber-500/30" 
                                               : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
                                         )}
                                     >
                                         {formData.features?.includes(feat) && <CheckCircle2 className="w-3 h-3" />}
                                         {feat}
                                     </button>
                                 ))}
                             </div>
                         </div>

                         {/* Hidden Submit to trigger on form enter */}
                         <button type="submit" disabled={isSubmitting} className="hidden" />
                     </form>

                     <div className="mt-auto pt-6 border-t border-border flex items-center justify-end gap-4 shrink-0">
                         <button 
                             onClick={handleSubmit}
                             disabled={isSubmitting}
                             className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/30"
                         >
                             {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-5 h-5" />}
                             Guardar Alterações
                         </button>
                     </div>
                 </div>
              </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
