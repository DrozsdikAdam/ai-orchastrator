"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/apiClient";

export default function LoginPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const emailCheck = (val: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!val) {
            setEmailError("Az email kötelező!");
            return true;
        } else if (!emailRegex.test(val)) {
            setEmailError("Az email formátuma helytelen!");
            return true;
        } else {
            setEmailError(null);
            return false;
        }
    };

    const passwordCheck = (val: string): boolean => {
        if (!val) {
            setPasswordError("A jelszó kötelező!");
            return true;
        } else if (val.length < 8) {
            setPasswordError("A jelszónak legalább 8 karakter hosszúnak kell lennie!");
            return true;
        } else if (!/[A-Z]/.test(val)) {
            setPasswordError("Tartalmaznia kell legalább egy nagybetűt!");
            return true;
        } else if (!/[0-9]/.test(val)) {
            setPasswordError("Tartalmaznia kell legalább egy számot!");
            return true;
        } else if (!/[^a-zA-Z0-9]/.test(val)) {
            setPasswordError("Tartalmaznia kell legalább egy speciális karaktert!");
            return true;
        } else {
            setPasswordError(null);
            return false;
        }
    };

    const securityCheck = (): boolean => {
        const emailInvalid = emailCheck(email);
        const passwordInvalid = passwordCheck(password);
        return emailInvalid || passwordInvalid;
    };

    const handleLogin = async () => {
        setError(null);
        if (securityCheck()) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post<{ token: string }>("/auth/login", false, {
                email,
                password
            });
            localStorage.setItem("token", response.token);
            window.location.href = "/";
        } catch (error: any) {
            setError(error?.message || "Sikertelen bejelentkezés! Ellenőrizd a megadott adatokat.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-tr from-[#0b0b10] via-[#11111b] to-[#1a1b26] p-4 text-[#cdd6f4]">
            <div className="w-full max-w-md bg-[#1e1e2e]/60 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl transition-all duration-300 hover:border-white/20">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#89b4fa] to-[#b4befe] flex items-center justify-center shadow-lg shadow-[#89b4fa]/20 mb-3">
                        <span className="text-[#11111b] font-bold text-xl">A</span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#cdd6f4] tracking-tight">Bejelentkezés</h1>
                    <p className="text-sm text-[#a6adc8] mt-1 text-center">AI Workflow Orchestrator platform</p>
                </div>

                <div className="space-y-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[#a6adc8]" htmlFor="email">Email</label>
                        <input
                            id="email"
                            className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-[#cdd6f4] placeholder-[#585b70] focus:outline-none focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa]/30 transition-all duration-200"
                            type="email"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => {
                                const val = e.target.value;
                                setEmail(val);
                                if (emailError) emailCheck(val);
                            }}
                        />
                        {emailError && <p className="text-red-400 text-xs mt-1 font-medium">{emailError}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[#a6adc8]" htmlFor="password">Jelszó</label>
                        <input
                            id="password"
                            className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-[#cdd6f4] placeholder-[#585b70] focus:outline-none focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa]/30 transition-all duration-200"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => {
                                const val = e.target.value;
                                setPassword(val);
                                if (passwordError) passwordCheck(val);
                            }}
                        />
                        {passwordError && <p className="text-red-400 text-xs mt-1 font-medium">{passwordError}</p>}
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-medium mt-2">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="w-full py-3 px-4 mt-2 rounded-xl bg-[#89b4fa] hover:bg-[#74a3f0] text-[#11111b] font-semibold transition-all duration-200 shadow-md shadow-[#89b4fa]/10 hover:shadow-lg hover:shadow-[#89b4fa]/20 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {isLoading ? <Loader2 className="animate-spin text-[#11111b]" size={20} /> : "Bejelentkezés"}
                    </button>
                </div>

                <div className="mt-6 text-center text-sm text-[#a6adc8]">
                    <span>Nincs még fiókod? </span>
                    <a href="/register" className="text-[#89b4fa] hover:text-[#74a3f0] font-medium transition-colors duration-150">
                        Regisztráció
                    </a>
                </div>
            </div>
        </div>
    );
}