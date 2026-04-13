import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  dueDate: string; // ISO string
  priority: 'ALTA' | 'MEDIA' | 'BAIXA';
  leadId?: string;
  dealId?: string;
  isCompleted: boolean;
  createdAt: Date;
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: String, required: true },
  priority: { type: String, enum: ['ALTA', 'MEDIA', 'BAIXA'], default: 'MEDIA' },
  leadId: { type: String },
  dealId: { type: String },
  isCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
