import { useParams } from "next/navigation";
import { usePipelineStore } from "@/store/pipelineStore";
import { useState } from "react"
import { Loader2 } from "lucide-react";
import { ApiClient } from "@/lib/apiClient";
import { Execution } from "@repo/types";

type ExecutionStatus = "idle" | "running" | "completed" | "saving" | "failed";

export default function PipelineToolbar() {

    const {
        name,
        setName,
        savePipeline,
        executePipeline,
        isLoading
    } = usePipelineStore();

    const { id } = useParams() as { id: string };

    const [executionStatus, setExecutionStatus] = useState<ExecutionStatus>("idle");
    const [executionError, setExecutionError] = useState<string | null>(null);

    const handleSave = async (id: string) => {
        setExecutionStatus("saving");
        await savePipeline(id);
        setExecutionStatus("idle")
    }

    const handleExecute = async (id: string) => {
        await handleSave(id);
        setExecutionError(null);
        try {
            const executionId = await executePipeline(id);
            setExecutionStatus("running");
            const interval = setInterval(async () => {
                const execution: Execution = await new ApiClient(`/executions/${executionId}`).get();
                if (execution.status === "COMPLETED") {
                    setExecutionStatus("completed");
                    clearInterval(interval);
                    setTimeout(() => setExecutionStatus("idle"), 3000);
                } else if (execution.status === "FAILED") {
                    setExecutionStatus("failed");
                    clearInterval(interval);
                    setTimeout(() => setExecutionStatus("idle"), 3000);
                }
            }, 2000);
        } catch (error) {
            setExecutionError("Hiba a futtatás során!")
            setExecutionStatus("failed");
        }
    }

    const handleDelete = async (id: string) => {

    }

    return (
        <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center gap-4">
                <input className="text-lg border-0 rounded p-2 outline-none hover:outline hover:outline-gray-300" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="w-full">
                <p className={executionError ?
                    "text-red-500" : executionStatus === "running" ?
                        "text-blue-500" : executionStatus === "completed" ?
                            "text-green-500" : "text-gray-500"}>

                    {executionError ? executionError :
                        executionStatus === "saving" ? "Mentés..." :
                            executionStatus === "running" ? "Futtatás folyamatban..." :
                                executionStatus === "completed" ? "Sikeres futtatás!" :
                                    executionStatus === "failed" ? "Hiba történt" :
                                        ""}
                </p>
            </div>
            <div className="flex items-center gap-4">
                <button className="text-md bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 transition-colors" disabled={isLoading} onClick={() => handleSave(id)}>{isLoading ? <Loader2 size={20} className="animate-spin text-white" /> : "Mentés"}</button>
                <button className="text-md bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition-colors" disabled={isLoading} onClick={() => handleExecute(id)}>{isLoading ? <Loader2 size={20} className="animate-spin text-white" /> : "Futtatás"}</button>
                <button className="text-md bg-red-600 text-white rounded px-4 py-2 hover:bg-red-700 transition-colors" disabled={isLoading} onClick={() => handleDelete(id)}>{isLoading ? <Loader2 size={20} className="animate-spin text-white" /> : "Törlés"}</button>
            </div>
        </div>
    )
}