"use client";

import { redirect } from 'next/navigation';

export default function CreateAppointment() {
    return (
        <button className='flex items-center gap-1 bg-blue-400 hover:bg-blue-300 active:bg-blue-800 px-2 py-1 h-12 rounded-md ' onClick={() => {
            redirect('/create-appointment');
        }}>
            <div className='text-black'>Create Appointment</div>
            <img src='/arrow.png' alt='get_started_arrow' className='h-4 w-4' />
        </button>
    );
}