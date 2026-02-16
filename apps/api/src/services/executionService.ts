import { prisma } from "@repo/database";
import { QueueService } from "./queueService";
import { ApiError } from "../lib/apiError";

export class ExecutionService {
     static async create(pipelineId: string, userId: string) {
          // Ellenőrizzük a hozzáférést a pipeline-hoz
          const pipeline = await prisma.pipeline.findFirst({
               where: { id: pipelineId, userId },
          });

          if (!pipeline) {
               throw ApiError.notFound("Pipeline nem található.");
          }

          // Létrehozzuk az Execution rekordot
          const execution = await prisma.execution.create({
               data: {
                    pipelineId: pipeline.id,
                    status: "PENDING",
               },
          });

          // Hozzáadjuk a feladatot a Redis Queue-hoz a Worker számára a QueueService-en keresztül
          await QueueService.enqueueExecution(execution.id, pipeline.id);

          return execution;
     }

     static async getById(id: string, userId: string) {
          const execution = await prisma.execution.findFirst({
               where: {
                    id,
                    pipeline: {
                         userId,
                    },
               },
          });

          if (!execution) {
               throw ApiError.notFound("Execution nem található.");
          }

          return execution;
     }

     static async listByPipeline(pipelineId: string, userId: string) {
          return prisma.execution.findMany({
               where: {
                    pipelineId,
                    pipeline: {
                         userId,
                    },
               },
               orderBy: {
                    startedAt: "desc",
               },
          });
     }
}
