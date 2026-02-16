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
     password: z.string(),
     createdAt: z.date(),
     updatedAt: z.date()
})

export type User = z.infer<typeof UserSchema>

export const ApiKeySchema = z.object({
     id: z.string().uuid(),
     key: z.string(),
     provider: z.string(),
     userId: z.string().uuid(),
     createdAt: z.date(),
})

export type ApiKey = z.infer<typeof ApiKeySchema>

export const NodeSchema = z.object({
     id: z.string().uuid(),
     type: z.string(),
     position: z.object({
          x: z.number(),
          y: z.number()
     }),
     data: z.record(z.any()),
})

export type Node = z.infer<typeof NodeSchema>

export const EdgeSchema = z.object({
     id: z.string().uuid(),
     source: z.string().uuid(),
     target: z.string().uuid(),
     sourceHandle: z.string(),
     targetHandle: z.string()
})

export type Edge = z.infer<typeof EdgeSchema>

export const PipelineDefinitionSchema = z.object({
     nodes: z.array(NodeSchema),
     edges: z.array(EdgeSchema),
     viewPort: z.object({
          x: z.string(),
          y: z.string(),
          zoom: z.number()
     }).optional()
})

export type PipelineDefinition = z.infer<typeof PipelineDefinitionSchema>

export const PipelineSchema = z.object({
     id: z.string().uuid(),
     status: ExecutionStatusSchema,
     logs: z.any().optional(),
     error: z.string().nullish(),
     startedAt: z.date(),
     finishedAt: z.date().nullish(),
     pipelineId: z.string().uuid(),
})

export type Pipeline = z.infer<typeof PipelineSchema>

export const ExecutionSchema = z.object({
     id: z.string().uuid(),
     status: ExecutionStatusSchema,
     logs: z.any().optional(),
     error: z.string().nullish(),
     startedAt: z.date(),
     finishedAt: z.date().nullish(),
     pipelineId: z.string().uuid(),
});
export type Execution = z.infer<typeof ExecutionSchema>;