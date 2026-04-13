import mongoose, { Schema } from 'mongoose';

const DealSchema: Schema = new Schema({
  title:       { type: String, required: true, trim: true },
  value:       { type: Number, required: true },
  stage:       { 
    type: String, 
    enum: ['NOVO', 'CONTACTADO', 'VISITA_AGENDADA', 'PROPOSTA', 'FECHADO_GANHO', 'PERDIDO'], 
    default: 'NOVO'
  },
  leadId:      { type: String, required: true },
  propertyId:  { type: String, default: null },
  probability: { type: Number, default: 50 },
  notes:       { type: String, default: '' },
  createdAt:   { type: Date, default: Date.now },
}, { strict: false });

if (mongoose.models.Deal) {
  delete (mongoose.models as any).Deal;
}

export default mongoose.model('Deal', DealSchema);
