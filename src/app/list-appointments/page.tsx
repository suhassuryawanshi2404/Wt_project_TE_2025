'use client';
import axios from "axios";
import React from "react";
import { redirect } from "next/navigation";

function GetDoctorAndPatientName({appointmentId} : {appointmentId: string}) {
    
    const [doctorName, setDoctorName] = React.useState('');
    const [patientName, setPatientName] = React.useState('');

    axios.get(`http://localhost:3000/api/common/get-doctor-and-patient-name?appointmentId=${appointmentId}`).then((response) => {
        setDoctorName(response.data.doctorName);
        setPatientName(response.data.patientName);
    }).catch((error) => {
        console.log(error);
    });
    return <div>
        <h1>Doctor: {doctorName}</h1>
        <h1>Patient: {patientName}</h1>
    </div>
}

export default function () {

    const [appointments, setAppointments] = React.useState([]);
    const [role, setRole] = React.useState('');

    React.useEffect(() => {
        axios.get("http://localhost:3000/api/common/get-appointments")
            .then((response) => {
                setAppointments(response.data.appointments);
                setRole(response.data.role);
            }).catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div className="h-screen pt-20 flex justify-center">

            <div className="">
                <ul className="justify-center flex-wrap sm:flex">
                    {
                        appointments.map((appointment: any) => (
                            <li key={appointment._id} className="p-4 m-4 bg-gray-100 rounded-lg text-center">
                                <GetDoctorAndPatientName appointmentId={appointment._id} />
                                <h2>Date: {appointment.date}</h2>
                                <p>Time: {appointment.time}</p>
                                <p>Status: {appointment.status}</p>
                                <div className="flex gap-3 flex-wrap justify-center">
                                    <button onClick={() => {
                                        axios.patch(`/api/common/modify-appointment?id=${appointment._id}&status=canceled`);
                                    }} className="flex items-center gap-1 h-12 bg-blue-400 hover:bg-blue-300 active:bg-blue-800 px-2 py-1 rounded-md">Cancel Appointment
                                    </button>
                                    {role === 'doctor' && <button onClick={() => {
                                        axios.patch(`/api/common/modify-appointment?id=${appointment._id}&status=completed`);
                                    }} className="flex items-center gap-1 h-12 bg-blue-400 hover:bg-blue-300 active:bg-blue-800 px-2 py-1 rounded-md">Mark as complete
                                    </button>}
                                    {role === 'patient' && <button onClick={() => {
                                        redirect(`/reschedule-appointment?date=${appointment.date}&time=${appointment.time}&id=${appointment._id}&doctorId=${appointment.doctorId}`);
                                    }} className="flex items-center gap-1 h-12 bg-blue-400 hover:bg-blue-300 active:bg-blue-800 px-2 py-1 rounded-md">Reschedule Appointment
                                    </button>}
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    );
}