import mongoose, { Schema } from "mongoose";

export interface DaySchedule {
    date: string;
    availableSlots: string[];
    bookedSlots: string[];
}

export interface Schedule {
    doctorId: mongoose.Schema.Types.ObjectId;
    schedule: DaySchedule[];
}

const ScheduleSchema: Schema<Schedule> = new mongoose.Schema<Schedule>({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    schedule: {
        type: [{
        date: {
            type: String,
            required: true
        },
        availableSlots: {
            type: [String],
            required: true
        },
        bookedSlots: {
            type: [String],
            required: true
        }
    }],
    required: true,
}
},
    { timestamps: true }
);

export const ScheduleModel = mongoose.models.Schedule as mongoose.Model<Schedule> ||
    mongoose.model<Schedule>('Schedule', ScheduleSchema);