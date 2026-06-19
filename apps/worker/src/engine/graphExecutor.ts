import { prisma } from "@repo/database";
import { topologicalSort } from "./topologicalSort";
import { resolveObjectVariables } from "./variableResolver";
import { PipelineDefinition } from "@repo/types";
import { nodeHandler } from "../nodes";

export const executeGraph = async (executionId: string, pipelineId: string) => {
     try {
          const pipeline = await prisma.pipeline.findFirst({
               where: {
                    id: pipelineId
               }
          })

          if (!pipeline) {
               throw new Error("Pipeline nem található.");
          }

          await prisma.execution.update({
               where: {
                    id: executionId
               },
               data: {
                    status: "RUNNING",
                    startedAt: new Date()
               }
          })

          const definition = pipeline.definition as PipelineDefinition;

          const sortedNodes = topologicalSort(definition.nodes, definition.edges)

          const context: Record<string, any> = {};

          const isActive: Record<string, boolean> = {};

          // 1. A csomópontok kiindulási állapotának rögzítése
          const targetNodeIds = new Set(definition.edges.map(edge => edge.target));
          definition.nodes.forEach(node => {
               isActive[node.id] = !targetNodeIds.has(node.id);
          });

          for (const node of sortedNodes) {
               // 2. A végrehajtó ciklus módosítása (átugrás ha inaktív)
               if (!isActive[node.id]) continue;
               if (node.type === "start" || node.type === "ends") continue;

               const resolvedData = resolveObjectVariables(node.data, context);
               const handler = nodeHandler(node.type);
               const result = await handler(resolvedData, context, pipeline.userId);

               context[node.id] = result;

               definition.edges.forEach(edge => {
                    if (edge.source !== node.id) return;
                    if (node.type !== "logic") {
                         isActive[edge.target] = true;
                         return;
                    }
                    const activeHandle = edge.sourceHandle === (result.result ? "logic-true" : "logic-false");
                    if (activeHandle) isActive[edge.target] = true;
               })
          }
          await prisma.execution.update({
               where: {
                    id: executionId
               },
               data: {
                    status: "COMPLETED",
                    finishedAt: new Date(),
                    logs: context
               }
          })

     } catch (error) {
          await prisma.execution.update({
               where: {
                    id: executionId
               },
               data: {
                    status: "FAILED",
                    error: error instanceof Error ? error.message : "Unknown error",
                    finishedAt: new Date()
               }
          })
     }
}
