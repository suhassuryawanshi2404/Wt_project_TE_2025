'use client';

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function verifyEmail(){

    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);

    const verify = async () => {
        try{
            const res = await axios.post(`/api/users/verify-email?token=${token}`);
            console.log("Email verified", res.data);
            setVerified(true);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if(token){
            setToken(token);
        }
    }, []);

    useEffect(() => {
        if(token){
            verify();
        }
    }, [token]);


    return (
        <div>
            {verified ? <p>Email verified</p> : <p>Verifying...</p>} 
            <Link href="/sign-in">Sign In</Link>
        </div>
    );
}