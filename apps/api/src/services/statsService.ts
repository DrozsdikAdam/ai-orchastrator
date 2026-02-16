import { prisma } from "@repo/database";
import { QueueService } from "./queueService";
import { ExecutionStatus } from "@repo/database";

export class StatsService {
     static async getUserStats(userId: string) {
          const [pipelineCount, executionStats, recentExecutions] = await Promise.all([
               // Összes pipeline száma
               prisma.pipeline.count({
                    where: { userId },
               }),

               // Végrehajtások állapota szerinti bontásban
               prisma.execution.groupBy({
                    by: ["status"],
                    where: {
                         pipeline: { userId },
                    },
                    _count: {
                         status: true,
                    },
               }),

               // Legutóbbi 5 végrehajtás
               prisma.execution.findMany({
                    where: {
                         pipeline: { userId },
                    },
                    orderBy: {
                         startedAt: "desc",
                    },
                    take: 5,
                    include: {
                         pipeline: {
                              select: {
                                   name: true,
                              },
                         },
                    },
               }),
          ]);

          // Formázzuk a csoportosított statisztikát
          const statsBreakdown = executionStats.reduce((acc, curr) => {
               acc[curr.status] = curr._count.status;
               return acc;
          }, {} as Record<ExecutionStatus, number>);

          // Alapértelmezett értékek (ha még nincs adat)
          const finalStats = {
               PENDING: statsBreakdown.PENDING || 0,
               RUNNING: statsBreakdown.RUNNING || 0,
               COMPLETED: statsBreakdown.COMPLETED || 0,
               FAILED: statsBreakdown.FAILED || 0,
          };

          const totalExecutions = Object.values(finalStats).reduce((a, b) => a + b, 0);

          const queueStats = await QueueService.getQueueStats();

          return {
               overview: {
                    totalPipelines: pipelineCount,
                    totalExecutions: totalExecutions,
               },
               statusBreakdown: finalStats,
               recentExecutions,
               queue: queueStats,
          };
     }
}
