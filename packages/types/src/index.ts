import { z } from "zod"

export const ExecutionStatusSchema = z.enum([
     "PENDING",
     "RUNNING",
     "COMPLETED",
     "FAILED"
])

export type ExecutionStatus = z.infer<typeof ExecutionStatusSchema>

export const UserSchema = z.object({
     id: z.string().uuid(),
     email: z.string().email(),
     name: z.string(),
     password: z.string().min(8, "A jelszónak legalább 8 karakter hosszúnak kell lennie.")
          .regex(/[A-Z]/, "Tartalmaznia kell legalább egy nagybetűt.")
          .regex(/[0-9]/, "Tartalmaznia kell legalább egy számot.")
          .regex(/[^a-zA-Z0-9]/, "Tartalmaznia kell legalább egy speciális karaktert."),
     createdAt: z.date(),
     updatedAt: z.date()
})

export type User = z.infer<typeof UserSchema>

// --- Node Specifikus Adat Sémák (Data) ---
export const NodeDataSchema = z.record(z.any()); // Alap
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
// --- API DTO-k (Data Transfer Objects) ---
export const CreatePipelineRequestSchema = z.object({
     name: z.string().min(1),
     description: z.string().optional(),
     definition: PipelineDefinitionSchema,
});
export type CreatePipelineRequest = z.infer<typeof CreatePipelineRequestSchema>;
export const UpdatePipelineRequestSchema = CreatePipelineRequestSchema.partial();
export type UpdatePipelineRequest = z.infer<typeof UpdatePipelineRequestSchema>;
export const ExecutePipelineRequestSchema = z.object({
     inputData: z.record(z.any()).optional(), // Kezdő adatok a triggerhez
});
export type ExecutePipelineRequest = z.infer<typeof ExecutePipelineRequestSchema>;
// --- Futtatási Kontextus (A "Log" szerkezete) ---
export const ExecutionContextSchema = z.record(z.object({
     status: z.enum(["success", "error"]),
     output: z.any(),
     error: z.string().optional(),
     duration: z.number().optional(), // ms
}));
export type ExecutionContext = z.infer<typeof ExecutionContextSchema>;
// --- Pipeline és Execution (Adatbázis rekordokhoz) ---
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

export const ExecutionSchema = z.object({
     id: z.string().uuid(),
     status: ExecutionStatusSchema,
     logs: ExecutionContextSchema.optional(), // Strukturált logok
     error: z.string().nullish(),
     startedAt: z.date(),
     finishedAt: z.date().nullish(),
     pipelineId: z.string().uuid(),
});
export type Execution = z.infer<typeof ExecutionSchema>;