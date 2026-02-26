import { prisma } from "@repo/database";
import { topologicalSort } from "./topologicalSort";
import { resolveObjectVariables } from "./variableResolver";
import { Node as FlowNode, Edge as FlowEdge, PipelineDefinition } from "@repo/types";

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

          sortedNodes.forEach(node => {
               const resolvedNode = resolveObjectVariables(node.data, context);
               const result = { output: "mock" }
               context[node.id] = result;
          })

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