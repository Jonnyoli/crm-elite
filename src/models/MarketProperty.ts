import mongoose, { Schema } from 'mongoose';

const MarketPropertySchema: Schema = new Schema({
  title:       { type: String, default: '' },
  type:        { type: String, default: 'MORADIA' },
  price:       { type: Number, required: true },
  location:    { type: String, default: '' },
  address:     { type: String, default: '' },
  rooms:       { type: String, default: '' },
  area:        { type: String, default: '' },
  status:      { type: String, default: 'ATIVO' },
  source:      { type: String, default: 'Casafari' },
  sourceUrl:   { type: String, default: '' },
  imageUrl:    { type: String, default: '' },
  sellerName:  { type: String, default: '' },
  sellerPhone: { type: String, default: '' },
  isParticular:{ type: Boolean, default: false },
  features:    { type: [String], default: [] },
  notes:       { type: String, default: '' },
  createdAt:   { type: Date, default: Date.now },
}, { strict: false });

if (mongoose.models.MarketProperty) {
  delete (mongoose.models as any).MarketProperty;
}

export default mongoose.model('MarketProperty', MarketPropertySchema);
