import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Zap } from "lucide-react"
import "./nodes.css"

export function TriggerNode({ selected }: NodeProps) {
    return (
        <div className={`node-trigger min-w-[220px] rounded-xl bg-[#1e1e2e] border-2 shadow-lgtext-[#cdd6f4] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl
      ${selected ? "!border-[#89b4fa] ring-2 ring-[#89b4fa]/30" : ""}`}
        >
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-t-[10px]
        bg-gradient-to-br from-[#1e3a2f] to-[#1e2e1e] text-[#a6e3a1]
        text-[13px] font-semibold uppercase tracking-wide"
            >
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/10">
                    <Zap size={16} />
                </div>
                Trigger
            </div>
            <div className="p-3.5">
                <div className="text-[11px] text-[#a6adc8] uppercase tracking-wider mb-1">Típus</div>
                <div className="text-[13px] bg-white/5 border border-white/[0.08] rounded-md px-2.5 py-1.5">
                    Manuális indítás
                </div>
            </div>
            <Handle type="source" position={Position.Right} id="trigger-out" className="custom-handle" />
        </div>
    )
}