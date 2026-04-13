import mongoose, { Schema } from 'mongoose';

const PropertySchema: Schema = new Schema({
  title:       { type: String, default: '' },
  type:        { type: String, required: true },
  price:       { type: Number, required: true },
  location:    { type: String, default: 'Coimbra' },
  address:     { type: String, required: true },
  status:      { type: String, enum: ['DISPONIVEL', 'RESERVADO', 'VENDIDO'], default: 'DISPONIVEL' },
  features:    { type: [String], default: [] },
  description: { type: String, default: '' },
  imageUrl:    { type: String, default: '' },
  createdAt:   { type: Date, default: Date.now },
}, { strict: false });

if (mongoose.models.Property) {
  delete (mongoose.models as any).Property;
}

export default mongoose.model('Property', PropertySchema);
