import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/mongodb-connect';
import { AppointmenModel, Appointment } from '@/models/appointment.model';
import { ScheduleModel } from '@/models/schedule.model';
import { AvailabilityScheduleModel } from '@/models/availability-schedule.model';
import { UserModel } from '@/models/user.model';
import { sendMail } from '@/utils/mailer';
import getTokenPayload from '@/utils/getTokenPayload';

export async function POST(
    req: NextRequest,
) {
    try {
        await connectToDatabase();
        const payload: any = getTokenPayload(req);
        const patientId = payload.id;
        const data: Appointment = await req.json();
        data.patientId = patientId;
        const appointment = new AppointmenModel(data);
        await appointment.save();
        const s = await ScheduleModel.findOne({
            doctorId: data.doctorId
        });
        const e = s!.schedule.filter((s) => s.date === data.date);
        if(e.length > 0){
            //push and pop elements
            await ScheduleModel.findOneAndUpdate({
                doctorId: data.doctorId,
                "schedule.date": data.date
            },{
                $push: { "schedule.$.bookedSlots": data.time  },
                $pull: { "schedule.$.availableSlots": data.time }
            });
        }else{
            //create an element of that date
            const doctorAvailibilitySchedule = await AvailabilityScheduleModel.findOne({
                doctorId: data.doctorId
            });
            let index = -1;
            switch(data.date.split(",")[0]){
                case "Monday":
                    index = 0;
                    break;
                case "Tuesday":
                    index = 1;
                    break;
                case "Wednesday":
                    index = 2;
                    break;
                case "Thursday":
                    index = 3;
                    break;
                case "Friday":
                    index = 4;
                    break;
                case "Saturday":
                    index = 5;
                    break;
                case "Sunday":
                    index = 6;
                    break;
            }

            if(index === -1){
                return NextResponse.json("Invalid Date", {
                    status: 400
                });
            }

            const doctorSchedule = await ScheduleModel.findOne({
                doctorId: data.doctorId,
            });
            doctorSchedule!.schedule.push({
                date: data.date,
                availableSlots: doctorAvailibilitySchedule!.schedule[index].slots.map(slot => slot.toString()),
                bookedSlots: []
            });
            await doctorSchedule!.save();
            // push and pop elements
            await ScheduleModel.findOneAndUpdate({
                doctorId: data.doctorId,
                "schedule.date": data.date
            },{
                $push: { "schedule.$.bookedSlots": data.time },
                $pull: { "schedule.$.availableSlots": data.time }
            });
        }
        const doctor = await UserModel.findOne({
            _id: data.doctorId
        }).select('email');
        const patient = await UserModel.findOne({
            _id: data.patientId
        });
        const doctorEmail = doctor!.email;
        const patientEmail = patient!.email;
        sendMail({ email: doctorEmail, emailType: "doctor-appointment-scheduled", userId: doctor!._id.toString() });
        sendMail({ email: patientEmail, emailType: "appointment-scheduled", userId: patient!._id.toString() });
        return NextResponse.json(appointment, {
            status: 201,
        });
    } catch (e) {
        return NextResponse.json("Error in creating Appointment", {
            status: 500,
        });
    }
}