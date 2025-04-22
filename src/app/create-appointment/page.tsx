"use client";

import React from "react"
import axios from "axios";

import { DatePicker } from "@nextui-org/date-picker";

import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";

import { useRouter } from "next/navigation";

interface Doctor {
    id: string;
    name: string;
}

export default function Page() {

    const router = useRouter();
    
    const [doctors, setDoctors] = React.useState([] as Doctor[]);
    const [slots, setSlots] = React.useState([]);

    const [doctor, setDoctor] = React.useState("");
    const [slot, setSlot] = React.useState("");

    const [date, setDate] = React.useState(parseDate("2024-04-04"));

    React.useEffect(() => {
        axios.get("/api/users/get-user?role=doctor")
            .then((response) => {
                setDoctors(response.data.map((doctor: any) => ({ id: doctor._id, name: doctor.name })));
            }).catch((error) => {
                console.log(error);
            });
    }, []);
    
    React.useEffect(() => {
        if(doctor !== "" && doctor !== "Choose Doctor" && date){
        axios.get(`/api/doctor/get-schedule?doctorId=${doctor}&date=${
            formatter.format(date.toDate(getLocalTimeZone()))
        }`)
            .then((response) => {
                setSlots(response.data.slots);
            }).catch((error) => {
                console.log(error);
            });
        }
    }, [doctor, date]);

    let formatter = useDateFormatter({ dateStyle: "full" });

    return (
        <div className="bg-gray-100 flex h-screen p-10 justify-center items-center">
            <div className=" text-gray-800 text-center pt-32 sm:pt-0 flex flex-col items-center ">
                <div className="container mx-auto p-4">
                    <h1 className="text-4xl font-bold">Smart Solutions for Appointment Scheduling</h1>
                    <p className="text-lg">Manage your appointments with ease</p>
                </div>
                <div>
                    <div className="flex flex-col items-center bg-white p-8 rounded-lg">
                        <h2 className="text-2xl font-bold p-2">Create an Appointment</h2>
                        <div className="flex flex-wrap justify-center gap-2">
                            <div className="flex flex-wrap items-center justify-center gap-2">
                                <div className="w-48">
                                    <DatePicker
                                        value={date}
                                        onChange={(date) => setDate(date ?? parseDate("2024-04-04"))}
                                        isRequired label="Choose date" />
                                    <p className="text-default-500 text-sm">
                                        Selected date: {date ? formatter.format(date.toDate(getLocalTimeZone())) : "--"}
                                    </p>
                                </div>
                                <select onChange={
                                    (event) => {
                                        setDoctor(event.target.value);
                                    }
                                } className="p-2 border h-10 border-gray-300 rounded-lg">
                                    <option>Choose Doctor</option>
                                        {
                                            doctors.map((doctor: any) => (
                                                <option value={doctor.id} key={doctor.id}>{doctor.name}</option>
                                            ))
                                        }
                                </select>
                                <select onChange={
                                    (event) => {
                                        setSlot(event.target.value);
                                    }
                                } className="p-2 border h-10 border-gray-300 rounded-lg">
                                    <option>Choose Slot</option>
                                    {
                                        slots?.map((slot: any) => (
                                            <option value={slot} key={slot}>{slot}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="justify-center items-center flex">
                                <button className='flex items-center gap-1 h-12 bg-blue-400 hover:bg-blue-300 active:bg-blue-800 px-2 py-1 rounded-md ' onClick={() => {
                                    //api request
                                    if(doctor === "" || slot === "" || date === null || doctor === "Choose Doctor" || slot === "Choose Slot"){
                                        return;
                                    }
                                    
                                    axios.post('/api/patient/create-appointment', {
                                        doctorId: doctor,
                                        time: slot,
                                        date: formatter.format(date.toDate(getLocalTimeZone()))
                                    }).then((response) => {
                                        console.log(response.data);
                                    }).catch((error) => {
                                        console.log(error);
                                    });
                                    window.alert("Appointment created successfully");
                                    router.refresh();
                                }}>
                                    <span className='text-black'>Create</span>
                                    <img src='/arrow.png' alt='get_started_arrow' className='h-4 w-4' />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}