import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { usePipelineStore } from "@/store/pipelineStore";
import { ReactFlowProvider } from "@xyflow/react";
import { useCallback, useRef } from "react";
import PipelineSidebar from "./Sidebar";

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
     const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } = usePipelineStore();
     const reactFlowWrapper = useRef<HTMLDivElement>(null);

     const onDragOver = useCallback((e: React.DragEvent) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move"
     }, [])

     const onDrop = useCallback((e: React.DragEvent) => {
          e.preventDefault();
          const type = e.dataTransfer.getData('application/reactflow')
          if (!type) return;

          const position = { x: e.clientX, y: e.clientY }

          const newNode = {
               id: `${type}_${Date.now()}`,
               type,
               position,
               data: { label: type },
          }

          addNode(newNode)
     }, [addNode])

     return (
          <ReactFlowProvider>
               <div className="flex w-full h-screen">
                    <PipelineSidebar />
                    <div className="flex-1" ref={reactFlowWrapper}>
                         <ReactFlow
                              nodes={nodes}
                              edges={edges}
                              onNodesChange={onNodesChange}
                              onEdgesChange={onEdgesChange}
                              onConnect={onConnect}
                              onDrop={onDrop}
                              onDragOver={onDragOver}
                              fitView
                         >
                              <Background />
                              <Controls />
                              <MiniMap />
                         </ReactFlow>
                    </div>
               </div>
          </ReactFlowProvider>
     )
}