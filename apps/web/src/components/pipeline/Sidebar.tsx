import React from "react";
import { Zap, Brain, Globe, GitBranch, Monitor } from "lucide-react";

const nodeTypes = [
     {
          type: "trigger",
          label: "Trigger",
          description: "A pipeline indítója",
          icon: Zap,
          headerBg: "bg-gradient-to-br from-[#1e3a2f] to-[#1e2e1e]",
          headerText: "text-[#a6e3a1]",
     },
     {
          type: "llm",
          label: "LLM Node",
          description: "AI modell hívás",
          icon: Brain,
          headerBg: "bg-gradient-to-br from-[#2e1e3a] to-[#1e1e2e]",
          headerText: "text-[#cba6f7]",
     },
     {
          type: "http",
          label: "HTTP Request",
          description: "HTTP kérés küldése",
          icon: Globe,
          headerBg: "bg-gradient-to-br from-[#1e2a3a] to-[#1e1e2e]",
          headerText: "text-[#89b4fa]",
     },
     {
          type: "logic",
          label: "Logic (If/Else)",
          description: "Feltételes elágazás",
          icon: GitBranch,
          headerBg: "bg-gradient-to-br from-[#3a2e1e] to-[#2e1e1e]",
          headerText: "text-[#fab387]",
     },
     {
          type: "output",
          label: "Output",
          description: "Végeredmény",
          icon: Monitor,
          headerBg: "bg-gradient-to-br from-[#3a1e2e] to-[#2e1e1e]",
          headerText: "text-[#f38ba8]",
     },
]

export default function PipelineSidebar() {

     const onDragStart = (e: React.DragEvent<HTMLDivElement>, nodeType: string) => {
          if (e.dataTransfer) {
               e.dataTransfer.setData('application/reactflow', nodeType);
               e.dataTransfer.effectAllowed = "move";
          }
     }

     return (
          <div className="w-72 bg-[#11111b] border-r border-white/10 p-4 h-screen overflow-y-auto">
               <h2 className="text-sm font-semibold uppercase tracking-wider text-[#a6adc8] mb-4">
                    Elérhető elemek
               </h2>
               {nodeTypes.map((node) => {
                    const Icon = node.icon;
                    return (
                         <div
                              draggable
                              key={node.type}
                              onDragStart={(e) => onDragStart(e, node.type)}
                              className="rounded-xl bg-[#1e1e2e] border border-white/10 shadow-md
                                   cursor-grab active:cursor-grabbing mb-3
                                   transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-white/20"
                         >
                              <div className={`flex items-center gap-2 px-3 py-2.5 rounded-t-xl
                                   ${node.headerBg} ${node.headerText}
                                   text-[13px] font-semibold uppercase tracking-wide`}
                              >
                                   <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/10">
                                        <Icon size={16} />
                                   </div>
                                   {node.label}
                              </div>
                              <div className="px-3 py-2">
                                   <p className="text-[12px] text-[#a6adc8]">{node.description}</p>
                              </div>
                         </div>
                    );
               })}
          </div>
     )
}