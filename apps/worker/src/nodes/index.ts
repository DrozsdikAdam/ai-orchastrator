import { httpHandler } from "./httpHandler";
import { llmHandler } from "./llmHandler";
import { logicHandler } from "./logicHandler";

type NodeHandler = (data: Record<string, any>, context: Record<string, any>, userId: string) => Promise<any>;

export const nodeHandler = (type: string): NodeHandler => {
     switch (type) {
          case "trigger":
               return async (data, context, options) => {
                    return data;
               }
          case "llm":
               return llmHandler;

          case "http":
               return httpHandler;

          case "logic":
               return async (data, context, options) => {
                    return logicHandler(data, context, options)
               }

          default: throw new Error(`Unknown node type: ${type}`)
     }
}

