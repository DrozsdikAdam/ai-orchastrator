import { create } from "zustand";
import { Node, Edge, OnNodesChange, OnEdgesChange, OnConnect, applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";
import { Pipeline, Execution } from "@repo/types";
import { api } from "@/lib/apiClient";

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

     selectedNodeId: string | null;
     selectNode: (nodeId: string | null) => void;
     updateNodeData: (nodeId: string, data: Record<string, any>) => void;

     // pipeline variables
     name: string;
     description: string;
     isLoading: boolean;
     error: string | null;

     //pipeline methods
     setName: (name: string) => void;
     setDescription: (description: string) => void;
     loadPipeline: (id: string) => Promise<void>;
     savePipeline: (id: string) => Promise<void>;
     executePipeline: (id: string) => Promise<string>;
}

export const usePipelineStore = create<PipelineState>((set, get) => ({
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
     setNodes: (nodes) => set({ nodes }),

     selectedNodeId: null,
     selectNode: (nodeId) => set({ selectedNodeId: nodeId }),
     updateNodeData: (nodeId, data) => set(state => ({
          nodes: state.nodes.map(node => node.id === nodeId ? {
               ...node, data: {
                    ...node.data, ...data
               }
          } : node)
     })),
     // pipeline informations
     name: "Névtelen pipeline",
     description: "",
     isLoading: false,
     error: null,

     // pipeline methods
     setName: (name) => set({ name }),

     setDescription: (description) => set({ description }),

     loadPipeline: async (id) => {
          set({ isLoading: true, error: null });

          try {
               const pipeline = await api.get<Pipeline>(`/pipelines/${id}`, true);

               const { nodes = [], edges = [] } =
                    (pipeline.definition || {}) as
                    { nodes: Node[], edges: Edge[] };

               set({
                    name: pipeline.name,
                    description: pipeline.description || "",
                    nodes,
                    edges,
                    isLoading: false
               })
          } catch (error) {
               set({ isLoading: false, error: "Hiba a betöltés során!" })
          }
     },

     savePipeline: async (id) => {
          set({ isLoading: true, error: null });

          const { name, description, nodes, edges } = get();

          try {
               const definition = { nodes, edges };
               await api.put<Pipeline>(`/pipelines/${id}`, true, {
                    name,
                    description,
                    definition
               });

               set({ name, description, nodes, edges, isLoading: false });
          } catch (e) {
               set({ isLoading: false, error: "Hiba a mentés során" });
          }
     },

     executePipeline: async (id) => {
          const execution = await api.post<Execution>(`/pipelines/${id}/execute`, true);
          return execution.id;
     }
}))