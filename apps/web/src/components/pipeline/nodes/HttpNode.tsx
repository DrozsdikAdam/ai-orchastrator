import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Globe } from "lucide-react";
import "./nodes.css";
type HttpNodeData = { url?: string; method?: string };
export function HttpNode({ data, selected }: NodeProps) {
    const d = data as HttpNodeData;
    const methodColor = d.method === "POST" ? "text-[#a6e3a1]"
        : d.method === "DELETE" ? "text-[#f38ba8]" : "text-[#89b4fa]";
    return (
        <div className={`node-http min-w-[220px] rounded-xl bg-[#1e1e2e] border-2 shadow-lg
      text-[#cdd6f4] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl
      ${selected ? "!border-[#89b4fa] ring-2 ring-[#89b4fa]/30" : ""}`}
        >
            {/* BEMENET — bal */}
            <Handle type="target" position={Position.Left} id="http-in"
                className="custom-handle" style={{ top: "50%" }} />
            {/* HEADER */}
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-t-[10px]
        bg-gradient-to-br from-[#1e2a3a] to-[#1e1e2e] text-[#89b4fa]
        text-[13px] font-semibold uppercase tracking-wide"
            >
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/10">
                    <Globe size={16} />
                </div>
                HTTP Request
            </div>
            {/* BODY */}
            <div className="p-3.5 space-y-2">
                <div>
                    <div className="text-[11px] text-[#a6adc8] uppercase tracking-wider mb-1">Metódus</div>
                    <div className={`text-[13px] bg-white/5 border border-white/[0.08] rounded-md px-2.5 py-1.5 font-bold ${methodColor}`}>
                        {d.method || "GET"}
                    </div>
                </div>
                <div>
                    <div className="text-[11px] text-[#a6adc8] uppercase tracking-wider mb-1">URL</div>
                    <div className="text-[13px] bg-white/5 border border-white/[0.08] rounded-md px-2.5 py-1.5 break-all">
                        {d.url || "https://api.example.com"}
                    </div>
                </div>
            </div>
            {/* KIMENETEK — jobb: response + error */}
            <Handle type="source" position={Position.Right} id="http-response"
                className="custom-handle" style={{ top: "35%" }} />
            <Handle type="source" position={Position.Right} id="http-error"
                className="custom-handle handle-error" style={{ top: "65%" }} />
        </div>
    );
}