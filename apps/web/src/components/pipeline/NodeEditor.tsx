import { usePipelineStore } from "@/store/pipelineStore";
import { X } from "lucide-react"

export default function NodeEditor() {
     const { nodes, selectedNodeId, selectNode, updateNodeData } = usePipelineStore();
     const node = nodes.find(n => n.id === selectedNodeId);
     if (!node) return null;

     return (
          <div className="w-80 bg-[#11111b] border-1 border-white/10 p-4 h-screen overflow-y-auto">
               <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Node Editor</h2>
                    <button onClick={() => selectNode(null)}>
                         <X className="w-6 h-6" size={16} />
                    </button>
               </div>
               {node.type === 'trigger' && (
                    <div>
                         <div className="my-4 flex items-center">
                              <h3>Trigger</h3>
                         </div>
                         <div>
                              <label htmlFor="name">Name</label>
                              <input className="bg-white/5 border border-white/[0.08] rounded-md px-2.5 py-1.5 text-[#cdd6f4] w-full text-[13px] outline-none focus:border-[#89b4fa]" type="text" name="name" id="name" value={(node.data.name as string) ?? ''} onChange={(e) => updateNodeData(node.id, { name: e.target.value })} />
                         </div>
                         <div>
                              <select className="bg-white/5 border border-white/[0.08] rounded-md px-2.5 py-1.5 text-[#cdd6f4] w-full text-[13px] outline-none focus:border-[#89b4fa]" name="triggerType" value={node.data.triggerType as string} onChange={(e) => updateNodeData(node.id, { triggerType: e.target.value })} id="triggerType">
                                   <option value="webhook">Webhook</option>
                                   <option value="manual">Manual</option>
                                   <option value="schedule">Schedule</option>
                              </select>
                         </div>

                         {node.data.triggerType === 'webhook' && (<div>
                              <label htmlFor="webhookUrl">Webhook URL</label>
                              <input className="bg-white/5 border border-white/[0.08] rounded-md px-2.5 py-1.5 text-[#cdd6f4] w-full text-[13px] outline-none focus:border-[#89b4fa]" type="text" name="webhookUrl" id="webhookUrl" value={(node.data.webhookUrl as string) ?? ''} onChange={(e) => updateNodeData(node.id, { webhookUrl: e.target.value })} />
                         </div>)}
                    </div>
               )}
               {node.type === 'llm' && (
                    <div>
                         <div className="my-4 flex items-center">
                              <h3>LLM Node</h3>
                         </div>
                         <div>
                              <label htmlFor="name">Name</label>
                              <input className="bg-white/5 border border-white/[0.08] rounded-md px-2.5 py-1.5 text-[#cdd6f4] w-full text-[13px] outline-none focus:border-[#89b4fa]" type="text" name="name" id="name" value={(node.data.name as string) ?? ''} onChange={(e) => updateNodeData(node.id, { name: e.target.value })} />
                         </div>
                         <div>
                         </div>
                    </div>
               )}

               <div className="mt-6 pt-4 flex justify-between items-center border-t border-white/10">
                    <button
                         onClick={() => selectNode(null)}
                         className="w-full bg-red-700 hover:bg-red-600 text-white 
               font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                         Elvetés
                    </button>
                    <button
                         onClick={() => selectNode(null)}
                         className="w-full bg-[#89b4fa] hover:bg-[#74a3f0] text-[#1e1e2e] 
               font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                         Mentés
                    </button>
               </div>
          </div>
     )
}