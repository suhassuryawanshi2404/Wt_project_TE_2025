'use client';
import { useSearchParams } from "next/navigation";
import { DatePicker } from "@nextui-org/date-picker";
import { parseDate } from "@internationalized/date";
import React from "react";
import { getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const appointmentId = searchParams.get("id");
    const doctor = searchParams.get("doctorId");
    const udate = searchParams.get("date");
    const utime = searchParams.get("time");
    let formatter = useDateFormatter({ dateStyle: "full" });
    const [date, setDate] = React.useState(parseDate("2024-04-04"));
    const [slots, setSlots] = React.useState([]);
    const [slot, setSlot] = React.useState("");
    React.useEffect(() => {
        if (doctor !== "" && doctor !== "Choose Doctor" && date) {
            axios.get(`/api/doctor/get-schedule?doctorId=${doctor}&date=${formatter.format(date.toDate(getLocalTimeZone()))
                }`)
                .then((response) => {
                    setSlots(response.data.slots);
                }).catch((error) => {
                    console.log(error);
                });
        }
    }, [doctor, date]);
    return (
        <div className="bg-gray-100 flex h-screen p-10 justify-center items-center">
            <div className=" text-gray-800 text-center pt-32 sm:pt-0 flex flex-col items-center ">
                <div className="container mx-auto p-4">
                    <h1 className="text-4xl font-bold">Smart Solutions for Appointment Scheduling</h1>
                    <p className="text-lg">Manage your appointments with ease</p>
                </div>
                <div>
                    <div className="flex flex-col items-center bg-white p-8 rounded-lg">
                        <h2 className="text-2xl font-bold p-2">Reschedule an Appointment</h2>
                        <DatePicker
                            value={date}
                            onChange={(date) => setDate(date ?? parseDate("2024-04-04"))}
                            isRequired label="Choose date" />
                        <p className="text-default-500 text-sm">
                            Selected date: {date ? formatter.format(date.toDate(getLocalTimeZone())) : "--"}
                        </p>
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
                        <button className='flex items-center m-2 gap-1 h-12 bg-blue-400 hover:bg-blue-300 active:bg-blue-800 px-2 py-1 rounded-md ' onClick={() => {
                            //api request
                            if (doctor === "" || slot === "" || date === null || slot === "Choose Slot") {
                                return;
                            }
                            const d =  formatter.format(date.toDate(getLocalTimeZone()))
                            axios.patch(`/api/patient/reschedule-appointment?appointmentId=${appointmentId}&time=${slot}&date=${d}&utime=${utime}&udate=${udate}`, {
                            }).then((response) => {
                                console.log(response.data);
                            }).catch((error) => {
                                console.log(error);
                            });
                            router.refresh();
                        }}>
                            <span className='text-black'>Reschedule</span>
                            <img src='/arrow.png' alt='get_started_arrow' className='h-4 w-4' />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}