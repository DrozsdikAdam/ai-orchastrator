"use client"

import { useState, useEffect } from "react";
import { api } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/loader";
import { ArrowLeft, Key, Plus, Trash2, Loader2, Eye, EyeOff, CheckCircle2, AlertCircle, Calendar } from "lucide-react";

interface ApiKey {
    id: string;
    provider: providers;
    createdAt: string;
}

type providers = "groq" | "gemini" | "openai";

export default function KeysPage() {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    const [newKeyString, setNewKeyString] = useState<string>("");
    const [newKeyProvider, setNewKeyProvider] = useState<providers>("openai");
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const router = useRouter();

    const clearMessages = () => {
        setSuccessMessage("");
        setErrorMessage("");
    };

    const checkInputs = (): boolean => {
        if (!newKeyProvider) {
            setErrorMessage("Kérlek válassz egy szolgáltatót!");
            return false;
        }
        if (!newKeyString.trim()) {
            setErrorMessage("Kérlek add meg a kulcsot!");
            return false;
        }
        return true;
    };

    const fetchKeys = async () => {
        setIsLoadingData(true);
        clearMessages();
        try {
            const res = await api.get<ApiKey[]>("/api-keys", true);
            setKeys(res);
        } catch (error: any) {
            setErrorMessage(error?.message || "Hiba a kulcsok betöltésekor!");
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleAddKey = async () => {
        clearMessages();
        if (!checkInputs()) return;

        setIsLoading(true);
        try {
            await api.post<ApiKey>("/api-keys", true, {
                provider: newKeyProvider,
                key: newKeyString.trim(),
            });
            setNewKeyString("");
            setSuccessMessage("API kulcs sikeresen mentve!");
            await fetchKeys();
        } catch (error: any) {
            setErrorMessage(error?.message || "Hiba a kulcs mentésekor!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, providerName: string) => {
        if (!confirm(`Biztosan törölni szeretnéd a(z) ${getProviderLabel(providerName)} kulcsát?`)) {
            return;
        }

        clearMessages();
        setIsLoading(true);
        try {
            await api.delete(`/api-keys/${id}`, true);
            setKeys((prev) => prev.filter((key) => key.id !== id));
            setSuccessMessage("Kulcs sikeresen törölve!");
        } catch (error: any) {
            setErrorMessage(error?.message || "Hiba a kulcs törlésekor!");
        } finally {
            setIsLoading(false);
        }
    };

    const getProviderLabel = (prov: string) => {
        switch (prov) {
            case "openai":
                return "OpenAI";
            case "gemini":
                return "Google Gemini";
            case "groq":
                return "Groq";
            default:
                return prov.toUpperCase();
        }
    };

    useEffect(() => {
        let token = localStorage.getItem("token");
        if (!token) {
            router.replace("/login");
        } else {
            fetchKeys();
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-[#11111b] text-[#cdd6f4] font-sans pb-12">
            {/* Header */}
            <div className="flex items-center p-4 w-full bg-[#1e1e2e]/50 border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
                <button
                    className="hover:bg-white/5 rounded-lg p-2 mr-2 transition-colors duration-150 cursor-pointer text-[#a6adc8] hover:text-white"
                    onClick={() => router.push("/")}
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-2 px-2">
                    <Key size={20} className="text-[#89b4fa]" />
                    <h1 className="text-xl font-bold tracking-tight text-white">API Kulcsok Kezelése</h1>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-6 mt-8">
                {/* Global Status Messages */}
                {errorMessage && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-3">
                        <AlertCircle size={18} className="shrink-0" />
                        <span>{errorMessage}</span>
                    </div>
                )}
                {successMessage && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-5 py-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-3">
                        <CheckCircle2 size={18} className="shrink-0" />
                        <span>{successMessage}</span>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Add Key Form */}
                    <div className="bg-[#1e1e2e]/60 w-full lg:w-2/5 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col p-6 shadow-xl">
                        <h2 className="text-lg font-bold text-white mb-1">Új kulcs hozzáadása</h2>
                        <p className="text-xs text-[#a6adc8] mb-6">Meglévő kulcs hozzáadásakor a rendszer felülírja a korábbi értéket.</p>

                        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-[#a6adc8]" htmlFor="provider-select">Szolgáltató</label>
                                <select
                                    id="provider-select"
                                    value={newKeyProvider}
                                    onChange={(e) => setNewKeyProvider(e.target.value as providers)}
                                    className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-[#cdd6f4] focus:outline-none focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa]/30 transition-all duration-200"
                                >
                                    <option value="openai">OpenAI</option>
                                    <option value="gemini">Google Gemini</option>
                                    <option value="groq">Groq</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-[#a6adc8]" htmlFor="key-input">Kulcs</label>
                                <div className="relative">
                                    <input
                                        id="key-input"
                                        type={isVisible ? "text" : "password"}
                                        placeholder="sk-..."
                                        value={newKeyString}
                                        onChange={(e) => setNewKeyString(e.target.value)}
                                        className="w-full bg-white/5 border border-white/[0.08] rounded-xl pl-4 pr-11 py-3 text-[#cdd6f4] placeholder-[#585b70] focus:outline-none focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa]/30 transition-all duration-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsVisible(!isVisible)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#585b70] hover:text-[#cdd6f4] transition-colors cursor-pointer"
                                    >
                                        {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                className="w-full py-3 px-4 mt-2 rounded-xl bg-[#89b4fa] hover:bg-[#74a3f0] text-[#11111b] font-semibold transition-all duration-200 shadow-md shadow-[#89b4fa]/10 hover:shadow-lg hover:shadow-[#89b4fa]/20 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
                                disabled={isLoading}
                                onClick={handleAddKey}
                            >
                                {isLoading ? (
                                    <Loader2 size={18} className="animate-spin text-[#11111b]" />
                                ) : (
                                    <Plus size={18} />
                                )}
                                <span>{isLoading ? "Betöltés..." : "Hozzáadás"}</span>
                            </button>
                        </form>
                    </div>

                    {/* Keys List */}
                    <div className="bg-[#1e1e2e]/40 border border-white/5 rounded-2xl flex flex-col p-6 w-full lg:w-3/5 shadow-xl">
                        <h2 className="text-lg font-bold text-white mb-6">Aktív API kulcsaid</h2>

                        {isLoadingData ? (
                            <div className="py-12 flex justify-center">
                                <Loader />
                            </div>
                        ) : keys.length === 0 ? (
                            <div className="py-12 text-center text-[#585b70]">
                                <Key size={40} className="mx-auto mb-3 opacity-50" />
                                <p className="text-sm">Nincsenek mentett API kulcsaid.</p>
                                <p className="text-xs mt-1">Az LLM csomópontok használatához előbb meg kell adnod egy kulcsot.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {keys.map((key) => (
                                    <div
                                        key={key.id}
                                        className="bg-[#1e1e2e]/50 border border-white/5 rounded-xl p-4 flex items-center justify-between gap-4 hover:border-white/10 transition-colors"
                                    >
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-white">
                                                {getProviderLabel(key.provider)}
                                            </h3>
                                            <div className="flex items-center gap-1.5 text-xs text-[#a6adc8] mt-1">
                                                <Calendar size={12} className="text-[#585b70]" />
                                                <span>
                                                    Mentve: {new Date(key.createdAt).toLocaleString("hu-HU")}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-[#a6adc8] font-mono select-none">
                                                ••••••••••••
                                            </span>
                                            <button
                                                className="p-2 rounded-lg hover:bg-red-500/10 text-[#a6adc8] hover:text-red-400 transition-colors duration-150 cursor-pointer"
                                                onClick={() => handleDelete(key.id, key.provider)}
                                                title="Kulcs törlése"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
