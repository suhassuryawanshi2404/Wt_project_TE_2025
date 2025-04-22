import { AppointmenModel } from "@/models/appointment.model";
import { UserModel } from "@/models/user.model";
import { sendMail } from "@/utils/mailer";
import { connectToDatabase } from "@/utils/mongodb-connect";
import { NextRequest, NextResponse } from "next/server";
import { ScheduleModel } from "@/models/schedule.model";
import { AvailabilityScheduleModel } from "@/models/availability-schedule.model";


export async function PATCH(
    req: NextRequest,
) {
    try {
        await connectToDatabase();
        const params = req.nextUrl.searchParams;
        const date: string | null = params.get('date');
        const time: string | null = params.get('time');
        const udate: string | null = params.get('udate');
        const utime: string | null = params.get('utime');
        const updatedAppointment = await AppointmenModel.findOneAndUpdate(
            { _id: params.get('appointmentId') },
            {
                date: date,
                time: time,
                status: "rescheduled",
            },
        );
        if (!updatedAppointment) { return NextResponse.json("Appointment rescheduled failed", { status: 404 }); }
        await ScheduleModel.findOneAndUpdate({
            doctorId: updatedAppointment.doctorId,
            "schedule.date": udate
        }, {
            $push: { "schedule.$.availableSlots": utime },
            $pull: { "schedule.$.bookedSlots": utime }
        });
        const s = await ScheduleModel.findOne({
            doctorId: updatedAppointment.doctorId
        });
        const e = s!.schedule.filter((s) => s.date === date);
        if(e.length > 0){
            //push and pop elements
            await ScheduleModel.findOneAndUpdate({
                doctorId: updatedAppointment.doctorId,
                "schedule.date": date
            },{
                $push: { "schedule.$.bookedSlots": time  },
                $pull: { "schedule.$.availableSlots": time }
            });
        }
        else{
            //create an element of that date
            const a = await AvailabilityScheduleModel.findOne({
                doctorId: updatedAppointment.doctorId
            });
            let index = -1;
            switch(date!.split(",")[0]){
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

            await ScheduleModel.updateOne({
                doctorId: updatedAppointment.doctorId,
            },{
                $addToSet: {
                    schedule: {
                        date: date,
                        availableSlots: a!.schedule[index - 1].slots,
                        bookedSlots: []
                    }
                }
            });

            await ScheduleModel.findOneAndUpdate({
                doctorId: updatedAppointment.doctorId,
                "schedule.date": updatedAppointment.date
            },{
                $push: { "schedule.$.bookedSlots": updatedAppointment.time  },
                $pull: { "schedule.$.availableSlots": updatedAppointment.time }
            });

        }
        
        const { patientId, doctorId } = updatedAppointment;
        const patient = await UserModel.findById(patientId);
        const doctor = await UserModel.findById(doctorId);
        const doctorEmail = doctor!.email;
        const patientEmail = patient!.email;
        sendMail({ email: doctorEmail, emailType: "doctor-appointment-rescheduled", userId: doctor!._id.toString() });
        sendMail({ email: patientEmail, emailType: "appointment-rescheduled", userId: patient!._id.toString() });
        return NextResponse.json(updatedAppointment, { status: 200 });
    } catch (error) {
        return NextResponse.json("Error in updating Appointment", { status: 500 });
    }
}