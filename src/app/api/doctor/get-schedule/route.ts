import { NextRequest } from "next/server";
import { AvailabilityScheduleModel } from "@/models/availability-schedule.model";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/mongodb-connect";
import { UserModel } from "@/models/user.model";
import { ScheduleModel } from "@/models/schedule.model";

export async function GET(
    req: NextRequest
){
    try{
        await connectToDatabase();
        const searchParams = req.nextUrl.searchParams;
        const user = UserModel.findOne({id: searchParams.get('doctorId'), role: 'doctor'});
        if(!user){
            return NextResponse.json("Doctor not found", { status: 404 });
        }
        const date = searchParams.get('date');
        const doctorSchedule = await ScheduleModel.find({doctorId: searchParams.get('doctorId')});
        const s = doctorSchedule[0].schedule.filter((schedule) => schedule.date === date);
        if(s.length > 0){
            return NextResponse.json({slots: s[0].availableSlots}, {
                status: 201
            }); 
        }
        let day = date!.split(",")[0];
        const doctorAvailibilitySchedule = await AvailabilityScheduleModel.find({doctorId: searchParams.get('doctorId') });
        const d = doctorAvailibilitySchedule[0].schedule.filter((schedule) => schedule.day === day);
        return NextResponse.json({slots: d[0].slots} , { status: 200 });
    }catch(error){
        return NextResponse.json("Error in fetching schedule", { status: 500 });
    }
}