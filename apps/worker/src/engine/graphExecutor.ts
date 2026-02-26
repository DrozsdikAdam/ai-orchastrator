import { prisma } from "@repo/database";
import { topologicalSort } from "./topologicalSort";
import { resolveObjectVariables } from "./variableResolver";
import { PipelineDefinition } from "@repo/types";
import { nodeHandler } from "../nodes";

export const executeGraph = async (executionId: string, pipelineId: string) => {
     const pipeline = await prisma.pipeline.findFirst({
          where: {
               id: pipelineId
          }
     })

     if (!pipeline) {
          throw new Error("Pipeline not found!");
     }

     try {
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

          for (const node of sortedNodes) {
               const resolvedData = resolveObjectVariables(node.data, context);
               const handler = nodeHandler(node.type);
               const result = await handler(resolvedData, context);
               context[node.id] = result;
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