import { prisma } from "@repo/database";
import { pipelineQueue } from "../config/redis";
import { StatusCodes } from "http-status-codes";

export class ExecutionService {
     static async create(pipelineId: string, userId: string) {
          // Ellenőrizzük a hozzáférést a pipeline-hoz
          const pipeline = await prisma.pipeline.findFirst({
               where: { id: pipelineId, userId },
          });

          if (!pipeline) {
               const error: any = new Error("Pipeline nem található.");
               error.statusCode = StatusCodes.NOT_FOUND;
               throw error;
          }

          // Létrehozzuk az Execution rekordot
          const execution = await prisma.execution.create({
               data: {
                    pipelineId: pipeline.id,
                    status: "PENDING",
               },
          });

          // Hozzáadjuk a feladatot a Redis Queue-hoz a Worker számára
          await pipelineQueue.add("execute", {
               executionId: execution.id,
               pipelineId: pipeline.id,
          });

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
               const error: any = new Error("Végrehajtás nem található.");
               error.statusCode = StatusCodes.NOT_FOUND;
               throw error;
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
