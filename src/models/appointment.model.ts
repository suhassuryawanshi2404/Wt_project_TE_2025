import mongoose, { Schema } from 'mongoose';

export interface Appointment {
    patientId: mongoose.Schema.Types.ObjectId;
    doctorId: mongoose.Schema.Types.ObjectId;
    date: string;
    time: string;
    status: string;
    reason?: string;
}

const AppointmentSchema: Schema<Appointment> = new mongoose.Schema<Appointment>({
    patientId: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true 
    },
    doctorId: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'User', 
        required: true 
    },
    date: { 
        type: String, 
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: { 
        type: String, enum: ['scheduled', 'completed', 'canceled', 'no-show'], 
        required: true,
        default: 'scheduled' 
    },
    reason: { 
        type: String
     }, // Optional field for notes
  },
  { timestamps: true }
);

export const AppointmenModel = mongoose.models.Appointment as mongoose.Model<Appointment> 
|| mongoose.model<Appointment>('Appointment', AppointmentSchema);
  