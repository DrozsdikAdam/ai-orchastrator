import { ConnectionOptions, Worker } from "bullmq"
import { env } from "./env"

export const redisConnection: ConnectionOptions = {
     url: env.REDIS_URL,
     maxRetriesPerRequest: null,
     enableReadyCheck: false,
}
