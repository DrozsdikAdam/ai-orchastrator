import { ConnectionOptions, Queue } from "bullmq";
import { env } from "./env"

export const redisConnection: ConnectionOptions = {
     url: env.REDIS_URL,
     maxRetriesPerRequest: null,
     enableReadyCheck: false,
}

export const pipelineQueue = new Queue("pipeline-queue", {
     connection: redisConnection,
})