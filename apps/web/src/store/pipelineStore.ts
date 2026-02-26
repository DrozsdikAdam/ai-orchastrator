import { create } from "zustand";
import { Node, Edge, OnNodesChange, OnEdgesChange, OnConnect, applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";

interface PipelineState {
     // variables
     nodes: Node[];
     edges: Edge[];
     // callbacks
     onNodesChange: OnNodesChange;
     onEdgesChange: OnEdgesChange;
     onConnect: OnConnect;
     // methods
     addNode: (node: Node) => void;
     setEdges: (edges: Edge[]) => void;
     setNodes: (nodes: Node[]) => void;
}

export const usePipelineStore = create<PipelineState>((set) => ({
     nodes: [],
     edges: [],
     onNodesChange: (changes) => set(state => ({
          nodes: applyNodeChanges(changes, state.nodes),
     })),
     onEdgesChange: (changes) => set(state => ({
          edges: applyEdgeChanges(changes, state.edges),
     })),
     onConnect: (connection) => set(state => ({
          edges: addEdge(connection, state.edges),
     })),
     addNode: (node) => set(state => ({
          nodes: [...state.nodes, node],
     })),
     setEdges: (edges) => set({ edges }),
     setNodes: (nodes) => set({ nodes })
}))