import mongoose, { Schema, Document } from 'mongoose';

const LeadSchema: Schema = new Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, trim: true },
  phone:    { type: String, required: true, trim: true },
  status:   { 
    type: String, 
    enum: ['NOVO', 'CONTACTADO', 'VISITA_AGENDADA', 'PROPOSTA', 'FECHADO_GANHO', 'PERDIDO'], 
    default: 'NOVO' 
  },
  source:   { type: String, default: 'Outro' },
  notes:    { type: String, default: '' },
  tags:     { type: [String], default: [] },
  budget:   { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
}, { 
  strict: false // allow extra fields to be stored
});

// Clear cached model to ensure schema updates are applied
if (mongoose.models.Lead) {
  delete (mongoose.models as any).Lead;
}

export default mongoose.model('Lead', LeadSchema);
