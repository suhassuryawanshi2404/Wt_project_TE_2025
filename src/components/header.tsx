
import axios from "axios";
import Register from "./register";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { Redirect } from "next";

export default function Header() {

  const router = useRouter();

    const [user, setUser] = useState({
        id: "",
        role: "",
    });

    const getUser = async () => {
      try{
        const res = await axios.get("/api/users/get-token-payload");
        setUser(res.data);
      }catch(err){
        console.log(err);
      }
    }

    useEffect(() => {
      getUser();
    }, []);

    const logOut = async () => {
      try {
          await axios.get("/api/users/sign-out");
          router.push("/sign-in");
      } catch (error) {
          console.error(error);
      }
  }


    return (
        <header className=" p-4 bg-gray-300 text-gray-800 fixed w-full h-20 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold hidden sm:block">Pharmacists</h1>
            <img  onClick={() => {
              redirect("/");
            }} src="/logo.png" alt="pharmacy" className="h-10 w-10 sm:hidden" />
            </div>
          <nav>
            {user.id && <ul className="flex space-x-4">
              <li>
                <a href="/" className="hover:underline">
                  Home
                </a>
              </li>
              {user.role === 'patient' && <li>
                <a href="/create-appointment" className="hover:underline">
                  Create Appointments
                </a>
              </li>}
              <li>
                <a href="/list-appointments" className="hover:underline">
                  List Appointments
                </a>
              </li>
            </ul>}
          </nav>
          {(user.id) ? <button onClick={logOut} className="flex items-center gap-1 h-12 bg-blue-400 hover:bg-blue-300 active:bg-blue-800 px-2 py-1 rounded-md ">
            Log Out
          </button> : <Register />}
        </header>
    );
    }