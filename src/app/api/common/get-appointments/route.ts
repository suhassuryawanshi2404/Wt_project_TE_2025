import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AppointmenModel } from "@/models/appointment.model";
import { connectToDatabase } from "@/utils/mongodb-connect";
import getTokenPayload from "@/utils/getTokenPayload";
import axios from "axios";

export async function GET(
    req: NextRequest,
){

    const payload: any = getTokenPayload(req);

    try {
        await connectToDatabase();
        const appointments = await AppointmenModel.find({
            $or: [
                { patientId: payload.id },
                { doctorId: payload.id },
            ],
        });
        appointments.map(async (appointment) => {
            await axios.patch(`http://localhost:3000/api/common/no-show-check?id=${appointment._id}`);
        });
        return NextResponse.json({appointments: appointments, role: payload.role}, {
            status: 200,
        });
    } catch (e) {
        return NextResponse.json("Error in fetching Appointments", {
            status: 500,
        });
    }
}