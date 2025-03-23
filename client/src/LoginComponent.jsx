import { useState } from "react";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

export default function LoginComponent({ supabase }) {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    function onChange(e) {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    async function login() {
        const { data, error } = supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        });

        if (error) {
            alert("Error registering user:", error);
        } else {
            navigate('/dashboard', { replace: true });
            console.log(data);
        }
    }

    return (
        <div className={`w-full h-fit rounded-xl border border-base-300 p-7 bg-base-100`}>
            <fieldset className="fieldset w-full">
                <legend className="fieldset-legend">Email</legend>
                <input name="email" onChange={onChange} type="text" className="input w-full" placeholder="john_doe@example.com" />
                <p className="fieldset-label">Enter your email here.</p>
            </fieldset>
            <fieldset className="fieldset w-full">
                <legend className="fieldset-legend">Password</legend>
                <label className="input w-full">
                    <input name="password" onChange={onChange} type={passwordVisible ? `text` : `password`} className="grow" placeholder={passwordVisible ? `thisIsAPass` : `•••••••••••`} />
                    {!passwordVisible ? <PiEyeClosed size={20} onClick={() => setPasswordVisible(true)} className={`cursor-pointer`} /> : <PiEye size={20} onClick={() => setPasswordVisible(false)} className={`cursor-pointer`} />}
                </label>
                <p className="fieldset-label">Enter your password here.</p>
            </fieldset>
            <button className={`w-full btn btn-base-300 my-3`} onClick={login}>Login</button>
        </div>
    )
}