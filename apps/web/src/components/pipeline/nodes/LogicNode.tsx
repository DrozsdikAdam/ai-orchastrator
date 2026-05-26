import { Handle, Position, type NodeProps } from "@xyflow/react";
import { GitBranch } from "lucide-react";
import "./nodes.css";
type LogicNodeData = { condition?: string };
export function LogicNode({ data, selected }: NodeProps) {
    const d = data as LogicNodeData;
    return (
        <div className={`node-logic min-w-[220px] rounded-xl bg-[#1e1e2e] border-2 shadow-lg
      text-[#cdd6f4] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl
      ${selected ? "!border-[#89b4fa] ring-2 ring-[#89b4fa]/30" : ""}`}
        >
            {/* BEMENET — bal */}
            <Handle type="target" position={Position.Left} id="logic-in"
                className="custom-handle" style={{ top: "50%" }} />
            {/* HEADER */}
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-t-[10px]
        bg-gradient-to-br from-[#3a2e1e] to-[#2e1e1e] text-[#fab387]
        text-[13px] font-semibold uppercase tracking-wide"
            >
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/10">
                    <GitBranch size={16} />
                </div>
                Logic (If/Else)
            </div>
            {/* BODY */}
            <div className="p-3.5">
                <div className="text-[11px] text-[#a6adc8] uppercase tracking-wider mb-1">Feltétel</div>
                <div className="text-[13px] bg-white/5 border border-white/[0.08] rounded-md px-2.5 py-1.5 font-mono break-words">
                    {d.condition || '{{input}} == "yes"'}
                </div>
            </div>
            {/* KIMENETEK — True (zöld) / False (piros) */}
            <Handle type="source" position={Position.Right} id="logic-true"
                className="custom-handle handle-true" style={{ top: "35%" }} />
            <span className="absolute right-4 top-[35%] -translate-y-1/2 text-[9px] text-[#a6e3a1] pointer-events-none">
                ✓ True
            </span>
            <Handle type="source" position={Position.Right} id="logic-false"
                className="custom-handle handle-false" style={{ top: "65%" }} />
            <span className="absolute right-4 top-[65%] -translate-y-1/2 text-[9px] text-[#f38ba8] pointer-events-none">
                ✗ False
            </span>
        </div>
    );
}