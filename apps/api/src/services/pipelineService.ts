import { prisma } from "@repo/database";
import { CreatePipelineRequest, UpdatePipelineRequest } from "@repo/types";
import { ApiError } from "../lib/apiError";

export class PipelineService {
     static async create(userId: string, data: CreatePipelineRequest) {
          return prisma.pipeline.create({
               data: {
                    name: data.name,
                    description: data.description,
                    definition: data.definition as any,
                    userId: userId,
               },
          });
     }

     static async getById(id: string, userId: string) {
          const pipeline = await prisma.pipeline.findFirst({
               where: {
                    id,
                    userId,
               },
          });

          if (!pipeline) {
               throw ApiError.notFound("Pipeline nem található.");
          }

          return pipeline;
     }

     static async listByUser(userId: string) {
          return prisma.pipeline.findMany({
               where: {
                    userId,
               },
               orderBy: {
                    updatedAt: "desc",
               },
          });
     }

     static async update(id: string, userId: string, data: UpdatePipelineRequest) {
          // Verify ownership
          await this.getById(id, userId);

          return prisma.pipeline.update({
               where: { id },
               data: {
                    name: data.name,
                    description: data.description,
                    definition: data.definition ? (data.definition as any) : undefined,
               },
          });
     }

     static async delete(id: string, userId: string) {
          // Verify ownership
          await this.getById(id, userId);

          return prisma.pipeline.delete({
               where: { id },
          });
     }
}
