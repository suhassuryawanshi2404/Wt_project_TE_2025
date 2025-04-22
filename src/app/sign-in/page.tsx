"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Page() {

    const router = useRouter();

    const [user, setUser] = useState({
        email: '',
        password: '',
    });

    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSignIn = async () => {
        try{
            setLoading(true);
            const res = await axios.post('/api/users/sign-in', user);
            console.log("Signin success", res.data);
            router.push('/profile');
            setLoading(false);
        }catch(err){
            console.log(err);
            setLoading(false);
        }
    }

    useEffect(() => {
        if(user.email === '' || user.password === ''){
            setButtonDisabled(true);
        }else{
            setButtonDisabled(false);
        }
    }, [user]);

    return (
        <>
        <a href="/" className="absolute top-0 left-0 p-5 text-blue-500">Go Back</a>
        <div className="flex flex-col gap-3 justify-center items-center p-20 bg-gray-300 h-screen">
            <input className="hover:bg-gray-200 rounded-lg p-2" type="text" placeholder="Email" value={user.email} onChange={(e) => setUser({...user, email: e.target.value})}/>
            <input className="hover:bg-gray-200 rounded-lg p-2" type="password" placeholder="Password" value={user.password} onChange={(e) => setUser({...user, password: e.target.value})}/>
            <button className="bg-gray-300 p-3 rounded-lg hover:bg-slate-400 active:bg-gray-200 disabled:bg-gray-500" onClick={onSignIn} disabled={buttonDisabled || loading}>Sign In</button>
            <div className="text-gray-500">Don't have an account? <a href="/sign-up" className="text-blue-500">Sign Up</a></div>
        </div>
        </>
    );
}