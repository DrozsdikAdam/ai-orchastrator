import { usePipelineStore } from "@/store/pipelineStore";
import { X } from "lucide-react"
import { useState, useEffect } from "react"

export default function NodeEditor() {
     const { nodes, selectedNodeId, selectNode, updateNodeData } = usePipelineStore();
     const node = nodes.find(n => n.id === selectedNodeId);
     const [originalData, setOriginalData] = useState<Record<string, any> | null>(null);

     useEffect(() => {
          if (node) {
               setOriginalData({ ...node.data });
          }
     }, [selectedNodeId]);

     if (!node) return null;

     const handleDiscard = () => {
          if (originalData) {
               updateNodeData(node.id, originalData);
          }
          selectNode(null);
     };

     return (
          <div className="w-80 bg-[#11111b] border-1 border-white/10 p-4 h-screen overflow-y-auto text-[#cdd6f4]">
               <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Node Editor</h2>
                    <button onClick={() => selectNode(null)}>
                         <X className="w-5 h-5 transition-colors duration-200 hover:text-red-400" />
                    </button>
               </div>
               {node.type === 'trigger' && (
                    <div>
                         <div className="my-4 flex items-center">
                              <h3>Trigger</h3>
                         </div>
                         <div>
                              <label htmlFor="triggerName">Name</label>
                              <input className="bg-white/5 border border-white/[0.08] rounded-md px-2.5 py-1.5 text-[#cdd6f4] w-full text-[13px] outline-none focus:border-[#89b4fa]" type="text" name="triggerName" id="triggerName" value={(node.data.name as string) ?? ''} onChange={(e) => updateNodeData(node.id, { name: e.target.value })} />
                         </div>
                         <div>
                              <label htmlFor="triggerType">Trigger típus</label>
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
                              <label htmlFor="llmName">Name</label>
                              <input className="bg-white/5 border border-white/[0.08] rounded-md px-2.5 py-1.5 text-[#cdd6f4] w-full text-[13px] outline-none focus:border-[#89b4fa]" type="text" name="llmName" id="llmName" value={(node.data.name as string) ?? ''} onChange={(e) => updateNodeData(node.id, { name: e.target.value })} />
                         </div>
                         <div>
                              <label htmlFor="llmModel">Model</label>
                              <select className="bg-white/5 border border-white/[0.08] rounded-md px-2.5 py-1.5 text-[#cdd6f4] w-full text-[13px] outline-none focus:border-[#89b4fa]" name="llmModel" id="llmModel" value={(node.data.model as string) ?? ''} onChange={(e) => updateNodeData(node.id, { model: e.target.value })}>
                                   <option value="gpt-4o">GPT-4o</option>
                                   <option value="gpt-4o-mini">GPT-4o-mini</option>
                                   <option value="gpt-3.5-turbo">GPT-3.5-turbo</option>
                              </select>
                         </div>
                         <div>
                              <label htmlFor="llmTemperature">Temperature</label>
                              <input className="bg-white/5 border border-white/[0.08] rounded-md px-2.5 py-1.5 text-[#cdd6f4] w-full text-[13px] outline-none focus:border-[#89b4fa]" type="number" step="0.1" min="0" max="2" name="llmTemperature" id="llmTemperature" value={(node.data.temperature as number) ?? 0.7} onChange={(e) => updateNodeData(node.id, { temperature: parseFloat(e.target.value) })} />
                         </div>
                         <div>
                              <label htmlFor="llmMaxTokens">Max Tokens</label>
                              <input className="bg-white/5 border border-white/[0.08] rounded-md px-2.5 py-1.5 text-[#cdd6f4] w-full text-[13px] outline-none focus:border-[#89b4fa]" type="number" min="1" name="llmMaxTokens" id="llmMaxTokens" value={(node.data.maxTokens as number) ?? 1024} onChange={(e) => updateNodeData(node.id, { maxTokens: parseInt(e.target.value) })} />
                         </div>
                         <div>
                              <label htmlFor="llmPrompt">Prompt</label>
                              <textarea className="bg-white/5 border border-white/[0.08] rounded-md px-2.5 py-1.5 text-[#cdd6f4] w-full text-[13px] outline-none focus:border-[#89b4fa]" name="llmPrompt" id="llmPrompt" value={(node.data.prompt as string) ?? ''} onChange={(e) => updateNodeData(node.id, { prompt: e.target.value })} />
                         </div>
                    </div>
               )}
               {node.type === 'http' && (
                    <div>
                         <div className="my-4 flex items-center">
                              <h3>HTTP Node</h3>
                         </div>
                         <div>
                              <label htmlFor="httpName">Name</label>
                              <input className="bg-white/5 border border-white/[0.08] rounded-md px-2.5 py-1.5 text-[#cdd6f4] w-full text-[13px] outline-none focus:border-[#89b4fa]" type="text" name="httpName" id="httpName" value={(node.data.name as string) ?? ''} onChange={(e) => updateNodeData(node.id, { name: e.target.value })} />
                         </div>
                         <div>
                              <label htmlFor="httpUrl">URL</label>
                              <input className="bg-white/5 border border-white/[0.08] rounded-md px-2.5 py-1.5 text-[#cdd6f4] w-full text-[13px] outline-none focus:border-[#89b4fa]" type="text" name="httpUrl" id="httpUrl" value={(node.data.url as string) ?? ''} onChange={(e) => updateNodeData(node.id, { url: e.target.value })} />
                         </div>
                         <div>
                              <label htmlFor="httpMethod">Method</label>
                              <select className="bg-white/5 border border-white/[0.08] rounded-md px-2.5 py-1.5 text-[#cdd6f4] w-full text-[13px] outline-none focus:border-[#89b4fa]" name="httpMethod" id="httpMethod" value={(node.data.method as string) ?? ''} onChange={(e) => updateNodeData(node.id, { method: e.target.value })}>
                                   <option value="GET">GET</option>
                                   <option value="POST">POST</option>
                                   <option value="PUT">PUT</option>
                                   <option value="DELETE">DELETE</option>
                              </select>
                         </div>
                         <div>
                              <label htmlFor="httpHeaders">Headers</label>
                              <input className="bg-white/5 border border-white/[0.08] rounded-md px-2.5 py-1.5 text-[#cdd6f4] w-full text-[13px] outline-none focus:border-[#89b4fa]" type="text" name="httpHeaders" id="httpHeaders" value={(node.data.headers as string) ?? ''} onChange={(e) => updateNodeData(node.id, { headers: e.target.value })} />
                         </div>
                         <div>
                              <label htmlFor="httpBody">Body</label>
                              <textarea className="bg-white/5 border border-white/[0.08] rounded-md px-2.5 py-1.5 text-[#cdd6f4] w-full text-[13px] outline-none focus:border-[#89b4fa]" name="httpBody" id="httpBody" value={(node.data.body as string) ?? ''} onChange={(e) => updateNodeData(node.id, { body: e.target.value })} />
                         </div>
                    </div>
               )}
               {node.type === 'logic' && (
                    <div>
                         <div className="my-4 flex items-center">
                              <h3>Logic Node</h3>
                         </div>
                         <div>
                              <label htmlFor="logicName">Name</label>
                              <input className="bg-white/5 border border-white/[0.08] rounded-md px-2.5 py-1.5 text-[#cdd6f4] w-full text-[13px] outline-none focus:border-[#89b4fa]" type="text" name="logicName" id="logicName" value={(node.data.name as string) ?? ''} onChange={(e) => updateNodeData(node.id, { name: e.target.value })} />
                         </div>
                         <div>
                              <label htmlFor="logicCondition">Condition</label>
                              <input className="bg-white/5 border border-white/[0.08] rounded-md px-2.5 py-1.5 text-[#cdd6f4] w-full text-[13px] outline-none focus:border-[#89b4fa]" type="text" name="logicCondition" id="logicCondition" value={(node.data.condition as string) ?? ''} onChange={(e) => updateNodeData(node.id, { condition: e.target.value })} />
                         </div>
                    </div>
               )}
               {node.type === 'output' && (
                    <div>
                         <div className="my-4 flex items-center">
                              <h3>Output Node</h3>
                         </div>
                         <div>
                              <label htmlFor="outputName">Name</label>
                              <input className="bg-white/5 border border-white/[0.08] rounded-md px-2.5 py-1.5 text-[#cdd6f4] w-full text-[13px] outline-none focus:border-[#89b4fa]" type="text" name="outputName" id="outputName" value={(node.data.name as string) ?? ''} onChange={(e) => updateNodeData(node.id, { name: e.target.value })} />
                         </div>
                         <div>
                              <label htmlFor="outputVariable">Output változó</label>
                              <input className="bg-white/5 border border-white/[0.08] rounded-md px-2.5 py-1.5 text-[#cdd6f4] w-full text-[13px] outline-none focus:border-[#89b4fa]" type="text" name="outputVariable" id="outputVariable" placeholder="pl. {{llm_1.response}}" value={(node.data.outputVariable as string) ?? ''} onChange={(e) => updateNodeData(node.id, { outputVariable: e.target.value })} />
                         </div>
                         <div>
                              <label htmlFor="outputFormat">Output formátum</label>
                              <select className="bg-white/5 border border-white/[0.08] rounded-md px-2.5 py-1.5 text-[#cdd6f4] w-full text-[13px] outline-none focus:border-[#89b4fa]" name="outputFormat" id="outputFormat" value={(node.data.outputFormat as string) ?? 'json'} onChange={(e) => updateNodeData(node.id, { outputFormat: e.target.value })}>
                                   <option value="json">JSON</option>
                                   <option value="text">Szöveg</option>
                                   <option value="html">HTML</option>
                              </select>
                         </div>
                    </div>
               )}

               <div className="mt-6 pt-4 flex gap-3 border-t border-white/10">
                    <button
                         onClick={handleDiscard}
                         className="flex-1 border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-[#a6adc8] hover:text-red-400 font-medium py-2 px-4 rounded-lg transition-all duration-200 text-[13px]"
                    >
                         Elvetés
                    </button>
                    <button
                         onClick={() => selectNode(null)}
                         className="flex-1 bg-[#89b4fa] hover:bg-[#74a3f0] text-[#1e1e2e] font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-[13px] shadow-md shadow-[#89b4fa]/20 hover:shadow-lg hover:shadow-[#89b4fa]/30"
                    >
                         Mentés
                    </button>
               </div>
          </div>
     )
}