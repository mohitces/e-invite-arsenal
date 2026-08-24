import mongoose, { Schema, Document } from 'mongoose';

export interface IRegistration extends Document {
  name: string;
  phone: string;
  email: string;
  department: string;
  description?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: Date;
}

const RegistrationSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  description: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Registration || mongoose.model<IRegistration>('Registration', RegistrationSchema);
