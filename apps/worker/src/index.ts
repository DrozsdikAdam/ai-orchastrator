import { Job, Worker } from "bullmq";
import { redisConnection } from "./config/redis";
import { executeGraph } from "./engine/graphExecutor";

export const worker = new Worker("pipeline-queue", async (job: Job) => {
     const { executionId, pipelineId } = job.data;
     await executeGraph(executionId, pipelineId);
}, { connection: redisConnection })

worker.on("completed", (job: Job | undefined) => {
     console.log(`Job ${job?.id} completed!`);
})

worker.on("failed", (job: Job | undefined, error: Error) => {
     console.error(`Job ${job?.id} failed: ${error.message}`);
})

process.on("SIGTERM", async () => {
     console.log("Worker leállítása folyamatban... ");
     await worker.close();
})

console.log("A worker elindult!");