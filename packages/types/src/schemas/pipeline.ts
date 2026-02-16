import { z } from "zod";

// --- Node Specifikus Adat Sémák ---

export const NodeDataSchema = z.record(z.any());

export const LLMNodeDataSchema = z.object({
     prompt: z.string(),
     model: z.string(),
     temperature: z.number().min(0).max(2).default(0.7),
     systemPrompt: z.string().optional(),
     maxTokens: z.number().optional(),
});
export type LLMNodeData = z.infer<typeof LLMNodeDataSchema>;

export const HttpNodeDataSchema = z.object({
     url: z.string().url(),
     method: z.enum(["GET", "POST", "PUT", "DELETE"]),
     headers: z.record(z.string()).optional(),
     body: z.string().optional(),
});
export type HttpNodeData = z.infer<typeof HttpNodeDataSchema>;

export const LogicNodeDataSchema = z.object({
     condition: z.string(), // pl. "{{node_1.output}} == 'yes'"
});
export type LogicNodeData = z.infer<typeof LogicNodeDataSchema>;

// --- React Flow / Editor sémák ---

export const NodeSchema = z.object({
     id: z.string(),
     type: z.string(), // "llm", "http", "trigger", "logic", "output"
     position: z.object({
          x: z.number(),
          y: z.number(),
     }),
     data: NodeDataSchema,
});
export type Node = z.infer<typeof NodeSchema>;

export const EdgeSchema = z.object({
     id: z.string(),
     source: z.string(),
     target: z.string(),
     sourceHandle: z.string().nullish(),
     targetHandle: z.string().nullish(),
});
export type Edge = z.infer<typeof EdgeSchema>;

export const PipelineDefinitionSchema = z.object({
     nodes: z.array(NodeSchema),
     edges: z.array(EdgeSchema),
     viewport: z.object({
          x: z.number(),
          y: z.number(),
          zoom: z.number(),
     }).optional(),
});
export type PipelineDefinition = z.infer<typeof PipelineDefinitionSchema>;

// --- Pipeline Modell ---

export const PipelineSchema = z.object({
     id: z.string().uuid(),
     name: z.string(),
     description: z.string().nullish(),
     definition: PipelineDefinitionSchema,
     isPublic: z.boolean(),
     userId: z.string().uuid(),
     createdAt: z.date(),
     updatedAt: z.date(),
});
export type Pipeline = z.infer<typeof PipelineSchema>;
