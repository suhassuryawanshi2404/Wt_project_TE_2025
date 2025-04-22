import { AppointmenModel } from "@/models/appointment.model";
import { UserModel } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest){
    const params = req.nextUrl.searchParams;
    const appointmentId = params.get('appointmentId');
    if(!appointmentId){
        return NextResponse.json({status: 400, body: "Appointment ID is required"});
    }
    const appointment = await AppointmenModel.findOne({ _id: appointmentId });
    if(!appointment){
        return NextResponse.json({status: 404, body: "Appointment not found"});
    }
    const doctor = await UserModel.findOne({ _id: appointment.doctorId });
    const patient = await UserModel.findOne({ _id: appointment.patientId });
    return NextResponse.json({ doctorName: doctor?.name, patientName: patient?.name });
}