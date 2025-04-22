import mongoose, { Schema } from 'mongoose';

export interface DaySchedule {
    day: String,
    slots: String[],
}

export interface Schedule {
    doctorId: mongoose.Schema.Types.ObjectId;
    schedule: DaySchedule[];
}

const AvailabilityScheduleSchema: Schema<Schedule> = new mongoose.Schema<Schedule>({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    schedule: {
        type: [
            {   
                day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                        required: true 
                },
                slots: { type: [String], required: true },
            }
        ],
        required: true
    }
},
    { timestamps: true }
);

export const AvailabilityScheduleModel = mongoose.models.AvailibitySchedule as mongoose.Model<Schedule> ||
    mongoose.model<Schedule>('AvailibitySchedule', AvailabilityScheduleSchema);
