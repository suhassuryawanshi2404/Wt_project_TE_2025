import { AvailabilityScheduleModel } from '@/models/availability-schedule.model';
import { connectToDatabase } from "@/utils/mongodb-connect";
import { User, UserModel } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/utils/mailer";
import { ScheduleModel } from '@/models/schedule.model';
import bcrypt from 'bcrypt';

import generateSchedule from '@/utils/generateSchedule';

export async function POST(
    req: NextRequest,
){
    try{
        await connectToDatabase();
        const data: User = await req.json();
        const {name, email, password, role, phone, availability, slotDuration} = data;
        let {specialization} = data;
        if(specialization === "" && role === "doctor"){
            specialization = 'General'
        }
        if(role === "doctor" && (availability!.length <= 0 || slotDuration?.length === 0)){
                    return NextResponse.json("Doctor should have availability and slotDuration", {
                        status: 400,
                    });
                }
        if(role !== "doctor" && (availability!.length > 0 || slotDuration!.length > 0 || data.specialization!.length > 0)){
            return NextResponse.json("Only doctor can have availability, slotDuration or specialization", {
                status: 400,
            });
        }
        const user = await UserModel.findOne({
            email: email
        });
        if(user){
            return NextResponse.json({error: "User already exists"},{
                status: 400
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            role,
            phone,
            availability,
            slotDuration,
            specialization
        });

        if(newUser.role === "doctor"){
            newUser.isDoctor = true;
        }

        const savedUser = await newUser.save();
 
        if(savedUser.role === "doctor"){
            const availabilitySchedule = new AvailabilityScheduleModel({
                doctorId: savedUser._id,
                schedule: generateSchedule(savedUser.availability || [], savedUser.slotDuration || "0")
            });
            await availabilitySchedule.save();
            const schedule = new ScheduleModel({
                doctorId: savedUser._id,
                schedule: []
            });
            await schedule.save();
        }

        await sendMail({
            email: email,
            emailType: 'sign-up',
            userId: savedUser._id.toString()
        });

        return NextResponse.json(savedUser, {
            status: 201
        });

    }catch(err: any){
        return NextResponse.json({error: err.message}, {
            status: 500
        })
    }
}