import { useState } from "react";
import RegisterComponent from "./RegisterComponent";
import LoginComponent from "./LoginComponent";

export default function AuthenticationPage({ supabase }) {
    const [registerMode, setRegisterMode] = useState(true);

    return (
        <div data-theme={`green`} className={`min-h-screen h-screen bg-base-200 flex items-center justify-center flex-col`}>
            <div className={`h-4/6 w-2/6`}>
                <div className={`p-1 w-fit mx-auto rounded-md bg-base-300 mb-3 flex items-center justify-center`}>
                    <p onClick={() => setRegisterMode(true)} className={`px-4 py-2 rounded-md cursor-pointer text-base-content opacity-70 ${registerMode && `opacity-100 bg-base-100`}`}>Register</p>
                    <p onClick={() => setRegisterMode(false)} className={`px-4 py-2 rounded-md cursor-pointer text-base-content opacity-70 ${!registerMode && `opacity-100 bg-base-100`}`}>Login</p>
                </div>
                {registerMode ? <RegisterComponent supabase={supabase} /> : <LoginComponent supabase={supabase} />}
            </div>
        </div>
    );
}