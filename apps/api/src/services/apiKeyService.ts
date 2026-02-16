import { prisma } from "@repo/database";
import { CreateApiKeyRequest } from "@repo/types";
import { StatusCodes } from "http-status-codes";

export class ApiKeyService {
     static async create(userId: string, data: CreateApiKeyRequest) {
          // Ellenőrizzük, hogy van-e már ilyen szolgáltatóhoz kulcs
          const existing = await prisma.apiKey.findFirst({
               where: { userId, provider: data.provider },
          });

          if (existing) {
               return prisma.apiKey.update({
                    where: { id: existing.id },
                    data: { key: data.key },
               });
          }

          return prisma.apiKey.create({
               data: {
                    userId,
                    provider: data.provider,
                    key: data.key,
               },
          });
     }

     static async list(userId: string) {
          const keys = await prisma.apiKey.findMany({
               where: { userId },
               select: {
                    id: true,
                    provider: true,
                    createdAt: true,
               },
          });
          return keys;
     }

     static async delete(id: string, userId: string) {
          const key = await prisma.apiKey.findFirst({
               where: { id, userId },
          });

          if (!key) {
               const error: any = new Error("API kulcs nem található.");
               error.statusCode = StatusCodes.NOT_FOUND;
               throw error;
          }

          return prisma.apiKey.delete({
               where: { id },
          });
     }
}
