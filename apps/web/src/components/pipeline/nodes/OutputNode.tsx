import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Monitor } from "lucide-react";
import "./nodes.css";
type OutputNodeData = { result?: string };
export function OutputNode({ data, selected }: NodeProps) {
    const d = data as OutputNodeData;
    return (
        <div className={`node-output min-w-[220px] rounded-xl bg-[#1e1e2e] border-2 shadow-lg
      text-[#cdd6f4] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl
      ${selected ? "!border-[#89b4fa] ring-2 ring-[#89b4fa]/30" : ""}`}
        >
            {/* BEMENETEK — bal: 2 forrás */}
            <Handle type="target" position={Position.Left} id="output-in-1"
                className="custom-handle" style={{ top: "35%" }} />
            <Handle type="target" position={Position.Left} id="output-in-2"
                className="custom-handle" style={{ top: "65%" }} />
            {/* HEADER */}
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-t-[10px]
        bg-gradient-to-br from-[#3a1e2e] to-[#2e1e1e] text-[#f38ba8]
        text-[13px] font-semibold uppercase tracking-wide"
            >
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/10">
                    <Monitor size={16} />
                </div>
                Output
            </div>
            {/* BODY */}
            <div className="p-3.5">
                <div className="text-[11px] text-[#a6adc8] uppercase tracking-wider mb-1">Eredmény</div>
                <div className="text-[13px] bg-white/5 border border-white/[0.08] rounded-md px-2.5 py-1.5 min-h-[40px]">
                    {d.result || "Várakozás futtatásra..."}
                </div>
            </div>
        </div>
    );
}