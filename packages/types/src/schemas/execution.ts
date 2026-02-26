import { z } from "zod";

export const ExecutionStatusSchema = z.enum([
     "PENDING",
     "RUNNING",
     "COMPLETED",
     "FAILED",
]);
export type ExecutionStatus = z.infer<typeof ExecutionStatusSchema>;

export const ExecutionContextSchema = z.record(
     z.object({
          status: z.enum(["success", "error"]),
          output: z.any(),
          error: z.string().optional(),
          duration: z.number().optional(), // ms
     })
);
export type ExecutionContext = z.infer<typeof ExecutionContextSchema>;

export const ExecutionSchema = z.object({
     id: z.string().uuid(),
     status: ExecutionStatusSchema,
     logs: ExecutionContextSchema.optional(),
     error: z.string().nullish(),
     startedAt: z.date(),
     finishedAt: z.date().nullish(),
     pipelineId: z.string().uuid(),
});
export type Execution = z.infer<typeof ExecutionSchema>;
