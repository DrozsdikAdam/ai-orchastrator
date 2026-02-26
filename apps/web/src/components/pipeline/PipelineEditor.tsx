import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { usePipelineStore } from "@/store/pipelineStore";
/*import { TriggerNode } from "./nodes/TriggerNode";
import { LLMNode } from "./nodes/LLMNode";
import { HttpNode } from "./nodes/HttpNode";
import { LogicNode } from "./nodes/LogicNode";
import { OutputNode } from "./nodes/OutputNode";*/
/*const nodeTypes = {
     trigger: TriggerNode,
     llm: LLMNode,
     http: HttpNode,
     logic: LogicNode,
     output: OutputNode
}*/

export default function PipelineEditor() {
     const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = usePipelineStore();
     return (
          <div className="w-full h-screen">
               <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} fitView>
                    <Background />
                    <Controls />
                    <MiniMap />
               </ReactFlow>
          </div>
     )
}