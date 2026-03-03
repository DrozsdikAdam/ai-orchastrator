import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { usePipelineStore } from "@/store/pipelineStore";
import { ReactFlowProvider } from "@xyflow/react";
import { useCallback, useRef } from "react";
import PipelineSidebar from "./sidebar";
import NodeEditor from "./NodeEditor";
import { useReactFlow } from "@xyflow/react";
import { TriggerNode } from "./nodes/TriggerNode";
import { LLMNode } from "./nodes/LLMNode";
import { HttpNode } from "./nodes/HttpNode";
import { LogicNode } from "./nodes/LogicNode";
import { OutputNode } from "./nodes/OutputNode";


const nodeTypes = {
     trigger: TriggerNode,
     llm: LLMNode,
     http: HttpNode,
     logic: LogicNode,
     output: OutputNode
}

function PipelineEditorInner() {
     const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, selectNode } = usePipelineStore();
     const reactFlowWrapper = useRef<HTMLDivElement>(null);
     const { screenToFlowPosition } = useReactFlow();

     const onDragOver = useCallback((e: React.DragEvent) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move"
     }, [])

     const onDrop = useCallback((e: React.DragEvent) => {
          e.preventDefault();
          const type = e.dataTransfer.getData("application/reactflow");
          if (!type) return;
          const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
          const defaultData: Record<string, any> = { label: type };
          if (type === 'trigger') {
               defaultData.triggerType = 'webhook';
          } else if (type === 'llm') {
               defaultData.model = 'gpt-4o';
               defaultData.temperature = 0.7;
               defaultData.maxTokens = 1024;
          } else if (type === 'http') {
               defaultData.method = 'GET';
          }
          addNode({ id: `${type}_${Date.now()}`, type, position, data: defaultData });
     }, [addNode, screenToFlowPosition]);

     return (
          <div className="flex w-full h-screen">
               <PipelineSidebar />
               <div className="flex-1" ref={reactFlowWrapper}>
                    <ReactFlow
                         nodes={nodes}
                         edges={edges}
                         nodeTypes={nodeTypes}
                         onNodesChange={onNodesChange}
                         onEdgesChange={onEdgesChange}
                         onConnect={onConnect}
                         onDrop={onDrop}
                         onDragOver={onDragOver}
                         onNodeClick={(_, node) => selectNode(node.id)}
                         fitView
                    >
                         <Background />
                         <Controls />
                         <MiniMap />
                    </ReactFlow>
               </div>
               <NodeEditor />
          </div>
     )
}

export default function PipelineEditor() {
     return (
          <ReactFlowProvider>
               <PipelineEditorInner />
          </ReactFlowProvider>
     )
}