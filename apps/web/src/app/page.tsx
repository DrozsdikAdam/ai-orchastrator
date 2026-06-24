"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/apiClient";
import { Pipeline } from "@repo/types";
import { Loader } from "@/components/loader";
import {
    Plus,
    Trash2,
    Settings,
    Key,
    HelpCircle,
    Activity,
    CheckCircle2,
    XCircle,
    Loader2,
    LogOut,
    Play,
    Calendar,
    ChevronRight
} from "lucide-react";

export default function HomePage() {
    const router = useRouter();
    const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
    const [stats, setStats] = useState<any>(null);
    const [pipelines, setPipelines] = useState<Pipeline[]>([]);
    const [loadingData, setLoadingData] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [creating, setCreating] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/login");
        } else {
            setIsAuthChecking(false);
            fetchDashboardData();
        }
    }, [router]);

    const fetchDashboardData = async () => {
        setLoadingData(true);
        setErrorMsg(null);
        try {
            const [statsData, pipelinesData] = await Promise.all([
                api.get<any>("/stats/dashboard", true),
                api.get<Pipeline[]>("/pipelines", true)
            ]);
            setStats(statsData);
            setPipelines(pipelinesData);
        } catch (err: any) {
            console.error(err);
            setErrorMsg("Nem sikerült betölteni a dashboard adatokat. Kérjük, próbáld újra később.");
        } finally {
            setLoadingData(false);
        }
    };

    const handleCreatePipeline = async () => {
        setCreating(true);
        try {
            const newPipeline = await api.post<Pipeline>("/pipelines", true, {
                name: "Névtelen folyamat",
                description: "AI munkafolyamat leírása",
                definition: {
                    nodes: [
                        {
                            id: "trigger_1",
                            type: "trigger",
                            position: { x: 250, y: 100 },
                            data: { name: "Indító", triggerType: "manual" }
                        }
                    ],
                    edges: []
                }
            });
            router.push(`/pipeline/${newPipeline.id}`);
        } catch (err) {
            console.error(err);
            alert("Nem sikerült létrehozni a folyamatot.");
        } finally {
            setCreating(false);
        }
    };

    const handleDeletePipeline = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click event
        if (!confirm("Biztosan törölni szeretnéd ezt a folyamatot?")) return;
        try {
            await api.delete(`/pipelines/${id}`, true);
            setPipelines(prev => prev.filter(p => p.id !== id));
            // Refresh stats
            const statsData = await api.get<any>("/stats/dashboard", true);
            setStats(statsData);
        } catch (err) {
            console.error(err);
            alert("Nem sikerült törölni a folyamatot.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.replace("/login");
    };

    if (isAuthChecking) {
        return (
            <div className="min-h-screen w-screen flex items-center justify-center bg-[#11111b]">
                <Loader />
            </div>
        );
    }

    const totalPipelines = stats?.overview?.totalPipelines ?? pipelines.length;
    const totalExecutions = stats?.overview?.totalExecutions ?? 0;
    const completedExecutions = stats?.statusBreakdown?.COMPLETED ?? 0;
    const failedExecutions = stats?.statusBreakdown?.FAILED ?? 0;
    const activeExecutions = stats?.statusBreakdown?.RUNNING ?? 0;

    const successRate = totalExecutions > 0 
        ? Math.round((completedExecutions / totalExecutions) * 100) 
        : 0;

    return (
        <div className="min-h-screen bg-[#11111b] text-[#cdd6f4] font-sans">
            {/* Top Navigation */}
            <header className="border-b border-white/10 bg-[#1e1e2e]/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#89b4fa] to-[#b4befe] flex items-center justify-center shadow-lg shadow-[#89b4fa]/15">
                        <span className="text-[#11111b] font-bold text-lg">A</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">AI Orchestrator</span>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.push("/settings/keys")}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:border-[#89b4fa]/50 hover:bg-[#89b4fa]/10 transition-all duration-200 text-sm font-medium cursor-pointer"
                    >
                        <Key size={16} className="text-[#89b4fa]" />
                        <span>API Kulcsok</span>
                    </button>
                    <button 
                        onClick={() => router.push("/help")}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:border-[#b4befe]/50 hover:bg-[#b4befe]/10 transition-all duration-200 text-sm font-medium cursor-pointer"
                    >
                        <HelpCircle size={16} className="text-[#b4befe]" />
                        <span>Súgó</span>
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all duration-200 text-sm font-medium cursor-pointer"
                    >
                        <LogOut size={16} />
                        <span>Kijelentkezés</span>
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Cards Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-[#1e1e2e]/60 border border-white/5 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:border-white/10 hover:shadow-lg">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#89b4fa]/5 rounded-bl-full pointer-events-none" />
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-[#a6adc8]">Összes folyamat</span>
                            <div className="w-8 h-8 rounded-lg bg-[#89b4fa]/10 flex items-center justify-center text-[#89b4fa]">
                                <Activity size={18} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-1">{totalPipelines}</h2>
                        <p className="text-xs text-[#a6adc8]">Létrehozott diagramok</p>
                    </div>

                    <div className="bg-[#1e1e2e]/60 border border-white/5 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:border-white/10 hover:shadow-lg">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#cba6f7]/5 rounded-bl-full pointer-events-none" />
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-[#a6adc8]">Futtatások száma</span>
                            <div className="w-8 h-8 rounded-lg bg-[#cba6f7]/10 flex items-center justify-center text-[#cba6f7]">
                                <Play size={18} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-1">{totalExecutions}</h2>
                        <p className="text-xs text-[#a6adc8]">Futtatott végrehajtások</p>
                    </div>

                    <div className="bg-[#1e1e2e]/60 border border-white/5 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:border-white/10 hover:shadow-lg">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#a6e3a1]/5 rounded-bl-full pointer-events-none" />
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-[#a6adc8]">Sikeres futások aránya</span>
                            <div className="w-8 h-8 rounded-lg bg-[#a6e3a1]/10 flex items-center justify-center text-[#a6e3a1]">
                                <CheckCircle2 size={18} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-1">{successRate}%</h2>
                        <p className="text-xs text-[#a6adc8]">{completedExecutions} sikeres / {failedExecutions} sikertelen</p>
                    </div>

                    <div className="bg-[#1e1e2e]/60 border border-white/5 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:border-white/10 hover:shadow-lg">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#fab387]/5 rounded-bl-full pointer-events-none" />
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-[#a6adc8]">Aktív végrehajtások</span>
                            <div className="w-8 h-8 rounded-lg bg-[#fab387]/10 flex items-center justify-center text-[#fab387]">
                                <Loader2 size={18} className={activeExecutions > 0 ? "animate-spin" : ""} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-1">{activeExecutions}</h2>
                        <p className="text-xs text-[#a6adc8]">Jelenleg futó folyamatok</p>
                    </div>
                </div>

                {/* Dashboard Action Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Folyamataim</h2>
                        <p className="text-sm text-[#a6adc8] mt-1">Munkafolyamataid kezelése és szerkesztése</p>
                    </div>
                    <button
                        onClick={handleCreatePipeline}
                        disabled={creating}
                        className="flex items-center gap-2 bg-[#89b4fa] hover:bg-[#74a3f0] text-[#11111b] font-semibold px-5 py-3 rounded-xl transition-all duration-200 shadow-md shadow-[#89b4fa]/15 hover:shadow-lg hover:shadow-[#89b4fa]/25 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {creating ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <Plus size={20} />
                        )}
                        <span>Új folyamat létrehozása</span>
                    </button>
                </div>

                {errorMsg && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-4 rounded-xl mb-6 text-sm font-medium">
                        {errorMsg}
                    </div>
                )}

                {loadingData ? (
                    <div className="py-20 flex justify-center">
                        <Loader />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Pipelines List */}
                        <div className="lg:col-span-2 space-y-4">
                            {pipelines.length === 0 ? (
                                <div className="bg-[#1e1e2e]/30 border border-white/5 rounded-2xl py-16 px-6 text-center">
                                    <Activity size={48} className="text-[#585b70] mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-white">Nincs még folyamatod</h3>
                                    <p className="text-sm text-[#a6adc8] mt-1 mb-6">Hozz létre egy új pipeline-t a no-code tervező elindításához.</p>
                                    <button
                                        onClick={handleCreatePipeline}
                                        className="bg-[#89b4fa]/10 border border-[#89b4fa]/20 hover:bg-[#89b4fa]/20 text-[#89b4fa] font-medium px-4 py-2 rounded-xl transition-colors duration-150 cursor-pointer"
                                    >
                                        Létrehozás
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {pipelines.map(pipeline => (
                                        <div
                                            key={pipeline.id}
                                            onClick={() => router.push(`/pipeline/${pipeline.id}`)}
                                            className="bg-[#1e1e2e]/50 border border-white/5 hover:border-white/10 hover:bg-[#1e1e2e]/70 p-5 rounded-2xl cursor-pointer transition-all duration-200 group relative flex flex-col justify-between"
                                        >
                                            <div>
                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                    <h3 className="font-semibold text-white group-hover:text-[#89b4fa] transition-colors duration-150 truncate">
                                                        {pipeline.name}
                                                    </h3>
                                                    <button
                                                        onClick={(e) => handleDeletePipeline(pipeline.id, e)}
                                                        className="text-[#a6adc8] hover:text-red-400 p-1 rounded-lg hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-150 cursor-pointer"
                                                        title="Törlés"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <p className="text-sm text-[#a6adc8] line-clamp-2 mb-4 leading-relaxed">
                                                    {pipeline.description || "Nincs megadva leírás."}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-[#585b70] pt-3 border-t border-white/5">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={12} />
                                                    <span>
                                                        {new Date(pipeline.updatedAt).toLocaleDateString("hu-HU")}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-0.5 text-[#89b4fa] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                                    <span>Megnyitás</span>
                                                    <ChevronRight size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Recent Executions (Sidebar) */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white tracking-tight">Legutóbbi futtatások</h3>
                            <div className="bg-[#1e1e2e]/40 border border-white/5 rounded-2xl p-5 space-y-4">
                                {!stats?.recentExecutions || stats.recentExecutions.length === 0 ? (
                                    <p className="text-sm text-[#a6adc8] text-center py-6">Még nem történt futtatás.</p>
                                ) : (
                                    <div className="divide-y divide-white/5">
                                        {stats.recentExecutions.map((exec: any) => {
                                            const isCompleted = exec.status === "COMPLETED";
                                            const isFailed = exec.status === "FAILED";
                                            const isRunning = exec.status === "RUNNING";

                                            return (
                                                <div key={exec.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-white truncate">
                                                            {exec.pipeline?.name || "Ismeretlen folyamat"}
                                                        </p>
                                                        <p className="text-xs text-[#585b70] mt-0.5">
                                                            {new Date(exec.startedAt).toLocaleString("hu-HU")}
                                                        </p>
                                                    </div>
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shrink-0 ${
                                                        isCompleted ? "bg-[#a6e3a1]/10 text-[#a6e3a1]" :
                                                        isFailed ? "bg-[#f38ba8]/10 text-[#f38ba8]" :
                                                        isRunning ? "bg-[#89b4fa]/10 text-[#89b4fa]" :
                                                        "bg-[#fab387]/10 text-[#fab387]"
                                                    }`}>
                                                        {isRunning && <Loader2 size={12} className="animate-spin" />}
                                                        {isCompleted && <CheckCircle2 size={12} />}
                                                        {isFailed && <XCircle size={12} />}
                                                        {exec.status}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

