"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { s } from "framer-motion/client";

export default function Page() {

    const router = useRouter();

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        role: '',
        availability: [] as string[],
        slotDuration: '',
        specialization: ''
    });

    const [availability, setAvailability] = useState('');

    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSignUp = async () => {
        try {
            setLoading(true);
            const res = await axios.post('/api/users/sign-up', user);
            console.log("Signup success", res.data);
            router.push('/sign-in');
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);  
        }
    }

    useEffect(() => {
        if (user.email === '' || user.password === '' || user.confirmPassword === '' || user.phone === '' || user.role === '' || (user.password !== user.confirmPassword)) {
            setButtonDisabled(true);
        } else {
            setButtonDisabled(false);
        }
    }, [user]);

    const addAvailibility = () => {
        //if availibility must be in format for ex - "Monday 10:00-12:00"
        if (availability === '') {
            return;
        }
        //regex
        // const regex = new RegExp('/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s([1-9]|1[0-2]):[0-5][0-9](AM|PM)-([1-9]|1[0-2]):[0-5][0-9](AM|PM)$/g');
        const regex = new RegExp('^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\\s([1-9]|1[0-2]):[0-5][0-9](AM|PM)-([1-9]|1[0-2]):[0-5][0-9](AM|PM)$');
        if (!regex.test(availability)) {
            return;
        }
        setUser({ ...user, availability: [...user.availability, availability] });
        setAvailability('');
    }

    return (
        <>
        <a href="/" className="absolute top-0 left-0 p-5 text-blue-500">Go Back</a>
        <div className="flex gap-3 justify-center items-center p-20 bg-gray-300 h-screen">
            <div className="flex flex-col gap-3 justify-center items-center p-20 bg-gray-300 h-screen">
                <input className="hover:bg-gray-200 rounded-lg p-2" type="text" placeholder="Name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                <input className="hover:bg-gray-200 rounded-lg p-2" type="text" placeholder="Email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
                <input className="hover:bg-gray-200 rounded-lg p-2" type="password" placeholder="Password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} />
                <input className="hover:bg-gray-200 rounded-lg p-2" type="password" placeholder="Confirm Password" value={user.confirmPassword} onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })} />
                <input className="hover:bg-gray-200 rounded-lg p-2" type="text" placeholder="Phone" value={user.phone} onChange={(e) => setUser({ ...user, phone: e.target.value })} />
                <select className="hover:bg-gray-200 rounded-lg p-2" value={user.role} onChange={(e) => {
                    if (e.target.value !== "doctor") {
                        setUser({ ...user, role: e.target.value, availability: [], slotDuration: '', specialization: '' });
                    } else {
                        setUser({ ...user, role: e.target.value });
                    }
                }}>
                    <option value="">Select Role</option>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                </select>
                {(user.role === "doctor") && (
                    <>
                        <input className="hover:bg-gray-200 rounded-lg p-2" type="text" placeholder="Specialization" value={user.specialization} onChange={(e) => setUser({ ...user, specialization: e.target.value })} />
                        <input className="hover:bg-gray-200 rounded-lg p-2" type="text" placeholder="Slot Duration ( in minutes )" value={user.slotDuration} onChange={(e) => setUser({ ...user, slotDuration: e.target.value })} />
                        <input className="hover:bg-gray-200 rounded-lg p-2" type="text" placeholder="Availability" value={availability} onChange={(e) => setAvailability(e.target.value)} />
                        <div className="text-gray-500">Availibility must be in format for ex - "Monday 10:00AM-12:00PM"</div>
                        <button className="bg-gray-300 p-3 rounded-lg hover:bg-slate-400 active:bg-gray-200 disabled:bg-gray-500" onClick={addAvailibility}>Add Availability</button>
                    </>
                )}
                <button className="bg-gray-300 p-3 rounded-lg hover:bg-slate-400 active:bg-gray-200 disabled:bg-gray-500" onClick={onSignUp} disabled={buttonDisabled || loading}>Sign Up</button>
            </div>
            <div>
                {user.availability.map((item, index) => (
                    <div key={index} className="bg-gray-200 p-4 rounded-lg">{item}</div>
                ))}
            </div>
        </div>
        </>
    );
}