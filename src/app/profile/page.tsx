'use client';

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {

    const router = useRouter();

    const [user, setUser] = useState({
        email: "",
        name: "",
        phone: "",
        role: "",
    });

    const getUser = async () => {
        try {
            const response = await axios.post("/api/users/profile");
            const {email, name, phone, role} = response.data.user;
            setUser({email, name, phone, role});
        } catch (error) {
            console.error(error);
        }
    }

    const logOut = async () => {
        try {
            await axios.get("/api/users/sign-out");
            router.push("/sign-in");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="flex flex-col gap-3 justify-center items-center p-20 bg-gray-100 h-screen">
            <h1>Profile Page</h1>
            <p>Email: {user.email}</p>
            <p>Name: {user.name}</p>
            <p>Phone: {user.phone}</p>
            <p>Role: {user.role}</p>
            <button className="bg-gray-300 p-3 rounded-lg hover:bg-slate-400 active:bg-gray-200 disabled:bg-gray-500" onClick={getUser}>Get User</button>
            <button className="bg-gray-300 p-3 rounded-lg hover:bg-slate-400 active:bg-gray-200 disabled:bg-gray-500" onClick={logOut}>Log Out</button>
        </div>
    );
}