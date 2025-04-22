'use client';

import { useEffect, useState } from "react";
import CreateAppointment from "./create_appointment";
import axios from "axios";

import { useRouter } from "next/navigation";

export default function Hero() {

    const router = useRouter();

    const [user, setUser] = useState({
        id: "",
        role: "",
    });

    const getUser = async () => {
        try {
            const res = await axios.get("/api/users/get-token-payload");
            setUser(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <div className="bg-gray-100 flex h-screen p-10 items-center gap-10">
            <div className="text-center flex flex-col items-center ">
                <div className="container mx-auto p-4">
                    <h1 className="text-4xl font-bold">Smart Solutions for Appointment Scheduling</h1>
                    <p className="text-lg">Manage your appointments with ease</p>
                </div>
                {(user.role === "doctor") ?
                    <button onClick={() => {
                        router.push("/list-appointments");
                    }} className="flex items-center gap-1 bg-blue-400 hover:bg-blue-300 active:bg-blue-800 px-2 py-1 h-12 rounded-md ">
                        Get Appointment List
                    </button> : (user.role === "patient") ? <CreateAppointment /> :
                        <button className='flex items-center gap-1 h-12 bg-blue-400 hover:bg-blue-300 active:bg-blue-800 px-2 py-1 rounded-md ' onClick={() => {
                            router.push('/sign-in')
                        }}>
                            <span className='text-black'>Get Started</span>
                            <img src='/arrow.png' alt='get_started_arrow' className='h-4 w-4' />
                        </button>
                }
            </div>
            <img src="/hero.jpg" alt="Hero" className="hidden lg:block w-2/3 h-96 rounded-lg" />
        </div>
    );
}