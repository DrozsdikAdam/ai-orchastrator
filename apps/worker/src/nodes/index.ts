import { httpHandler } from "./httpHandler";

type NodeHandler = (data: Record<string, any>, context: Record<string, any>, userId: string) => Promise<any>;

export const nodeHandler = (type: string): NodeHandler => {
     switch (type) {
          case "trigger":
               return async (data, context, options) => {
                    return data;
               }
          case "llm":
               return async (data, context, options) => {
                    return { output: "mock még nincs implementálva!" }
               }

          case "http":
               return httpHandler;

          case "logic":
               return async (data, context, options) => {
                    return { output: "mock még nincs implementálva!" }
               }

          default: throw new Error(`Unknown node type: ${type}`)
     }
}

