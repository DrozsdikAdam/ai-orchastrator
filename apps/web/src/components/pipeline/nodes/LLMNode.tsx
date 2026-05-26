import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Brain } from "lucide-react";
import "./nodes.css";
type LLMNodeData = { prompt?: string; model?: string; temperature?: number };
export function LLMNode({ data, selected }: NodeProps) {
    const d = data as LLMNodeData;
    return (
        <div className={`node-llm min-w-[220px] rounded-xl bg-[#1e1e2e] border-2 shadow-lg
      text-[#cdd6f4] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl
      ${selected ? "!border-[#89b4fa] ring-2 ring-[#89b4fa]/30" : ""}`}
        >
            {/* BEMENETEK — bal */}
            <Handle type="target" position={Position.Left} id="llm-prompt-in"
                className="custom-handle" style={{ top: "30%" }} />
            <Handle type="target" position={Position.Left} id="llm-context-in"
                className="custom-handle" style={{ top: "70%" }} />
            {/* HEADER */}
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-t-[10px]
        bg-gradient-to-br from-[#2e1e3a] to-[#1e1e2e] text-[#cba6f7]
        text-[13px] font-semibold uppercase tracking-wide"
            >
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/10">
                    <Brain size={16} />
                </div>
                LLM Node
            </div>
            {/* BODY */}
            <div className="p-3.5 space-y-2">
                <div>
                    <div className="text-[11px] text-[#a6adc8] uppercase tracking-wider mb-1">Modell</div>
                    <div className="text-[13px] bg-white/5 border border-white/[0.08] rounded-md px-2.5 py-1.5">
                        {d.model || "gemini-1.5-flash"}
                    </div>
                </div>
                <div>
                    <div className="text-[11px] text-[#a6adc8] uppercase tracking-wider mb-1">Prompt</div>
                    <div className="text-[13px] bg-white/5 border border-white/[0.08] rounded-md px-2.5 py-1.5 break-words">
                        {d.prompt || "Írj ide promptot..."}
                    </div>
                </div>
                <div>
                    <div className="text-[11px] text-[#a6adc8] uppercase tracking-wider mb-1">Hőmérséklet</div>
                    <div className="text-[13px] bg-white/5 border border-white/[0.08] rounded-md px-2.5 py-1.5">
                        {d.temperature ?? 0.7}
                    </div>
                </div>
            </div>
            {/* KIMENET — jobb */}
            <Handle type="source" position={Position.Right} id="llm-output"
                className="custom-handle" style={{ top: "50%" }} />
        </div>
    );
}