import { AppointmenModel } from '@/models/appointment.model';
import { UserModel } from '@/models/user.model';
import { sendMail } from '@/utils/mailer';
import { connectToDatabase } from '@/utils/mongodb-connect';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
    req: NextRequest,
) {
    try {
        await connectToDatabase();
        const params = req.nextUrl.searchParams;
        const appointment = await AppointmenModel.findById({
            _id: params.get('id')
        });
        if (!appointment) return NextResponse.json("Appointment not found", { status: 404 });
        const appointmentDate = new Date(appointment.date);
        const now = new Date();
        const gracePeriodEnd = new Date(appointmentDate.getTime() + 15 * 60000); // 15 minutes
        if (now > gracePeriodEnd && (appointment.status === 'scheduled' || appointment.status === 'rescheduled')) {
            appointment.status = 'no-show';
            await appointment.save();
            const patient = await UserModel.findById(appointment.patientId);
            sendMail({email: patient!.email, emailType: 'appointment-no-show', userId: patient!._id.toString()});
        }
        return NextResponse.json(appointment, { status: 200 });
    } catch (err) {
        return NextResponse.json("Error in updating Appointment", { status: 500 });
    }
}