import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/mongodb-connect';
import { AppointmenModel } from '@/models/appointment.model';
import { ScheduleModel } from '@/models/schedule.model';

export async function PATCH(
    req: NextRequest,
){
    try {
        await connectToDatabase();
        const params = req.nextUrl.searchParams;
        const updatedAppointment = await AppointmenModel.findOne({ _id: params.get('id') });
        if(updatedAppointment?.status === 'completed' || updatedAppointment?.status === 'canceled'){ 
            return NextResponse.json("Invalid status", { status: 400 }); }
        const status = params.get('status');
        if (!updatedAppointment) {
            return NextResponse.json("Appointment not found", { status: 404 });
        }
        if (status === null) {
            return NextResponse.json("Status is required", { status: 400 });
        }
        updatedAppointment.status = status;
        await updatedAppointment.save();
        if(!updatedAppointment){ return NextResponse.json("Appointment not found", { status: 404 }); }
        
        await ScheduleModel.findOneAndUpdate({
            doctorId: updatedAppointment.doctorId,
            "schedule.date": updatedAppointment.date
        },{
            $push: { "schedule.$.availableSlots": updatedAppointment.time },
            $pull: { "schedule.$.bookedSlots": updatedAppointment.time }
        });

        return NextResponse.json(updatedAppointment, { status: 200 });
    }catch(e){
        return NextResponse.json("Error in updating Appointment", { status: 500 });
    }
}