import { pipelineQueue } from "../config/redis";

export class QueueService {
     static async enqueueExecution(executionId: string, pipelineId: string) {
          return pipelineQueue.add("execute", {
               executionId,
               pipelineId,
          });
     }

     static async getQueueStats() {
          const [waiting, active, completed, failed] = await Promise.all([
               pipelineQueue.getWaitingCount(),
               pipelineQueue.getActiveCount(),
               pipelineQueue.getCompletedCount(),
               pipelineQueue.getFailedCount(),
          ]);

          return {
               waiting,
               active,
               completed,
               failed,
          };
     }
}
