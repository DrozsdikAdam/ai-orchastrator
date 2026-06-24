"use client";

import { api } from "@/lib/apiClient";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function RegisterPage() {
    const [email, setEmail] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [password2, setPassword2] = useState<string>("");

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [emailError, setEmailError] = useState<string | null>(null);
    const [nameError, setNameError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [password2Error, setPassword2Error] = useState<string | null>(null);

    const emailCheck = (val: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!val) {
            setEmailError("Az email kötelező!");
            return true;
        } else if (!emailRegex.test(val)) {
            setEmailError("Érvénytelen email formátum!");
            return true;
        } else {
            setEmailError(null);
            return false;
        }
    };

    const nameCheck = (val: string): boolean => {
        if (!val.trim()) {
            setNameError("A név kötelező!");
            return true;
        } else {
            setNameError(null);
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

    const password2Check = (val: string, passVal: string): boolean => {
        if (!val) {
            setPassword2Error("A jelszó ismétlése kötelező!");
            return true;
        } else if (passVal !== val) {
            setPassword2Error("A jelszavak nem egyeznek!");
            return true;
        } else {
            setPassword2Error(null);
            return false;
        }
    };

    const securityCheck = (): boolean => {
        const emailInvalid = emailCheck(email);
        const nameInvalid = nameCheck(name);
        const passwordInvalid = passwordCheck(password);
        const password2Invalid = password2Check(password2, password);

        return emailInvalid || nameInvalid || passwordInvalid || password2Invalid;
    };

    const handleRegister = async () => {
        setError(null);
        if (securityCheck()) {
            return;
        }

        setLoading(true);
        try {
            const response = await api.post<{ token: string }>("/auth/register", false, {
                email,
                name,
                password
            });

            localStorage.setItem("token", response.token);
            window.location.href = "/";
        } catch (error: any) {
            setError(error?.message || "Hiba a regisztráció során! Lehet, hogy az email cím már foglalt.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-tr from-[#0b0b10] via-[#11111b] to-[#1a1b26] p-4 text-[#cdd6f4]">
            <div className="w-full max-w-md bg-[#1e1e2e]/60 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl transition-all duration-300 hover:border-white/20">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#89b4fa] to-[#b4befe] flex items-center justify-center shadow-lg shadow-[#89b4fa]/20 mb-3">
                        <span className="text-[#11111b] font-bold text-xl">A</span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#cdd6f4] tracking-tight">Regisztráció</h1>
                    <p className="text-sm text-[#a6adc8] mt-1 text-center">AI Workflow Orchestrator fiók létrehozása</p>
                </div>

                <div className="space-y-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[#a6adc8]" htmlFor="name">Név</label>
                        <input
                            id="name"
                            className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-[#cdd6f4] placeholder-[#585b70] focus:outline-none focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa]/30 transition-all duration-200"
                            type="text"
                            placeholder="Teljes név"
                            value={name}
                            onChange={(e) => {
                                const val = e.target.value;
                                setName(val);
                                if (nameError) nameCheck(val);
                            }}
                        />
                        {nameError && <p className="text-red-400 text-xs mt-1 font-medium">{nameError}</p>}
                    </div>

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
                                if (password2Error && password2 === val) setPassword2Error(null);
                            }}
                        />
                        {passwordError && <p className="text-red-400 text-xs mt-1 font-medium">{passwordError}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[#a6adc8]" htmlFor="password2">Jelszó megerősítése</label>
                        <input
                            id="password2"
                            className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-[#cdd6f4] placeholder-[#585b70] focus:outline-none focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa]/30 transition-all duration-200"
                            type="password"
                            placeholder="••••••••"
                            value={password2}
                            onChange={(e) => {
                                const val = e.target.value;
                                setPassword2(val);
                                if (password2Error) password2Check(val, password);
                            }}
                        />
                        {password2Error && <p className="text-red-400 text-xs mt-1 font-medium">{password2Error}</p>}
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-medium mt-2">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleRegister}
                        disabled={loading}
                        className="w-full py-3 px-4 mt-2 rounded-xl bg-[#89b4fa] hover:bg-[#74a3f0] text-[#11111b] font-semibold transition-all duration-200 shadow-md shadow-[#89b4fa]/10 hover:shadow-lg hover:shadow-[#89b4fa]/20 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {loading ? <Loader2 className="animate-spin text-[#11111b]" size={20} /> : "Regisztráció"}
                    </button>
                </div>

                <div className="mt-6 text-center text-sm text-[#a6adc8]">
                    <span>Már van fiókod? </span>
                    <a href="/login" className="text-[#89b4fa] hover:text-[#74a3f0] font-medium transition-colors duration-150">
                        Bejelentkezés
                    </a>
                </div>
            </div>
        </div>
    );
}