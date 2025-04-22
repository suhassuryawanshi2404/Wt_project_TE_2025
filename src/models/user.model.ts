import mongoose, { Schema } from 'mongoose';

export interface User {
    name: string;
    email: string;
    phone: string;
    role: string;
    password: string;
    isVerified?: boolean;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    verifyEmailToken?: string;
    verifyEmailTokenExpires?: Date;
    isDoctor?: boolean;
    specialization?: string;
    availability?: string[];
    slotDuration?: string;
}

const UserSchema: Schema<User> = new mongoose.Schema<User>({
    name: { 
        type: String, 
        required: [true, 'Please provide your name']
    },
    email: { 
        type: String, required: [true, 'Please provide your email'], 
        unique: [true, 'Email already exists']
    },
    phone: { 
        type: String, required: [true, 'Please provide your phone number'],
    },
    role: { 
        type: String, 
        enum: ['doctor', 'patient'], 
        required: [true, 'Please provide your role']
    },
    specialization: { 
        type: String ,
    }, // Only for doctors
    availability: { 
        type: [String]
    }, // Only for doctors (e.g., ["Monday 9-11", "Tuesday 2-5"], "Wednesday 1-3", "Thursday 10-12", "Friday 3-5", "Saturday 4-6", "Sunday 11-1")
    slotDuration: { 
        type: String, 
    }, // Only for doctors (in minutes)
    isVerified: {
        type: Boolean,
        default: false
    },
    password: { 
        type: String, 
        required: [true, 'Please provide your password']
    },
    passwordResetToken: { 
        type: String 
    },
    passwordResetExpires: { 
        type: Date 
    },
    verifyEmailToken: {
        type: String
    },
    verifyEmailTokenExpires: {
        type: Date
    },
    isDoctor: {
        type: Boolean,
        default: false
    },
},
{ timestamps: true }
);

export const UserModel = mongoose.models.User as mongoose.Model<User> || 
mongoose.model<User>('User', UserSchema);
