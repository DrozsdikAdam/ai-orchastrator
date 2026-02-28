import React from "react";

const nodeTypes = [
     { type: "trigger", label: "Trigger", description: "A pipeline indítója" },
     { type: "llm", label: "LLM", description: "Ai modell hívás" },
     { type: "http", label: "HTTP", description: "HTTP kérés küldése" },
     { type: "logic", label: "Logic", description: "Feltételes elágazás" },
     { type: "output", label: "Output", description: "A pipeline vége" }
]

export default function PipelineSidebar() {

     const onDragStart = (e: React.DragEvent<HTMLDivElement>, nodeType: string) => {
          if (e.dataTransfer) {
               e.dataTransfer.setData('application/reactflow', nodeType);
               e.dataTransfer.effectAllowed = "move";
          }
     }

     return (
          <div className="w-64 bg-white border-r p-4 h-screen overflow-y-auto">
               <h2>Elérhető elemek</h2>
               {nodeTypes.map((node) => (
                    <div draggable className="p-4 cursor-grab border-2 hover:border-indigo-600 hover:bg-gray-100 border-indigo-900 rounded-lg my-2" key={node.type} onDragStart={(e) => onDragStart(e, node.type)}>
                         <h3>{node.label}</h3>
                         <p>{node.description}</p>
                    </div>
               ))}
          </div>
     )
}