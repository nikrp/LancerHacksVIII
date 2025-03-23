import { useState } from "react";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

export default function RegisterComponent({ supabase }) {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [formData, setFormData] = useState({
        fName: "",
        lName: "",
        username: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    function onChange(e) {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    async function register() {
        const { data, error } = supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    display_name: formData.username,
                    name: formData.fName + " " + formData.lName,
                },
            },
        });

        if (error) {
            alert("Error registering user:", error);
        } else {
            navigate('/dashboard', { replace: true });
        }
    }

    return (
        <div className={`w-full rounded-xl border border-base-300 p-7 bg-white`}>
                <div className={`w-full flex items-center justify-between gap-5`}>
                    <fieldset className="fieldset w-1/2">
                        <legend className="fieldset-legend">First Name</legend>
                        <input name="fName" onChange={onChange} type="text" className="input w-full" placeholder="John" />
                        <p className="fieldset-label">Enter your first name here.</p>
                    </fieldset>
                    <fieldset className="fieldset w-1/2">
                        <legend className="fieldset-legend">Last Name</legend>
                        <input name="lName" onChange={onChange} type="text" className="input w-full" placeholder="Doe" />
                        <p className="fieldset-label">Enter your last name here.</p>
                    </fieldset>
                </div>
                <fieldset className="fieldset w-full">
                    <legend className="fieldset-legend">Username</legend>
                    <input name="username" onChange={onChange} type="text" className="input w-full" placeholder="john_doe123" />
                    <p className="fieldset-label">Enter your username here.</p>
                </fieldset>
                <fieldset className="fieldset w-full">
                    <legend className="fieldset-legend">Email</legend>
                    <input name="email" onChange={onChange} type="email" className="input w-full" placeholder="johndoe@example.com" />
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
                <button onClick={register} className={`w-full btn btn-base-300 my-3`}>Register</button>
            </div>
    )
}