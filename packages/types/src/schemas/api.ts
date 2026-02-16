import { z } from "zod";
import { PipelineDefinitionSchema } from "./pipeline";

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
export type ExecutePipelineRequest = z.infer<
     typeof ExecutePipelineRequestSchema
>;
