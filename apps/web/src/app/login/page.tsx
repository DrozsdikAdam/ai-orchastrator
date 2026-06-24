"use client";

import { useRef, useState } from "react"
import { Loader2 } from "lucide-react";
import { ApiClient } from "@/lib/apiClient";

export default function loginPage() {

    const [email, setEmail] = useState<Record<string, string>>();
    const [password, setPassword] = useState<Record<string, string>>();
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const securityCheck = (): boolean => {
        let isInvalid = false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,64}$/;
        if (!email?.email) {
            setEmailError("Az email kötelező!");
            isInvalid = true;
        } else if (!emailRegex.test(email.email)) {
            setEmailError("Az email formátuma helytelen!");
            isInvalid = true;
        } else {
            setEmailError(null);
        }

        if (!password?.password) {
            setPasswordError("A jelszó kötelező!");
            isInvalid = true;
        } else if (!passwordRegex.test(password.password)) {
            setPasswordError("A jelszónak tartalmaznia kell legalább egy betűt, egy számot és egy speciális karaktert, valamint legalább 8, legfeljebb 64 karakterből kell állnia!");
            isInvalid = true;
        } else {
            setPasswordError(null);
        }

        return isInvalid;
    }

    const handleLogin = async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (securityCheck()) return;
            const client = new ApiClient("/auth/login");
            const response: any = await client.post<{ token: string }>({
                email: email!.email,
                password: password!.password
            });
            localStorage.setItem("token", response.token);
            window.location.href = "/";
        } catch (error) {
            setError("Sikertelen bejelentkezés!");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="w-full py-2 rounded-md border border-gray-400">
                <h1 className="text-center font-semibold mb-8">Login</h1>
                <div className="w-full px-4">
                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
                        <input className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            type="text"
                            placeholder="Email"
                            value={email?.email || ""}
                            onChange={(e) => setEmail({ email: e.target.value.trim() })} />
                        {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="password">Jelszó</label>
                        <input className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            type="password"
                            placeholder="Jelszó"
                            value={password?.password || ""}
                            onChange={(e) => setPassword({ password: e.target.value.trim() })}
                        />
                        {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                    </div>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition-colors w-full mt-4"
                    onClick={handleLogin}
                    disabled={isLoading || emailError !== null || passwordError !== null}>
                    {isLoading ?
                        <Loader2 className="animate-spin text-white" size={20} /> :
                        "Login"
                    }
                </button>
            </div>
        </div>
    )
}