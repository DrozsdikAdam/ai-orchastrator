export const resolveVariables = (text: string, context: Record<string, any>): string => {
     return text.replace(/\{\{(\w+)\.(\w+)\}\}/g, (match, nodeId, field) => {
          const node = context[nodeId];
          if (!node) {
               return match;
          }
          const value = node[field];
          if (value === undefined) {
               return match;
          }
          return value;
     });
}

export const resolveObjectVariables = (obj: Record<string, any>, context: Record<string, any>): Record<string, any> => {
     const resolved: Record<string, any> = {};
     Object.entries(obj).forEach(([key, value]) => {
          if (typeof value === "string") {
               resolved[key] = resolveVariables(value, context);
          } else if (typeof value === "object" && value !== null) {
               resolved[key] = resolveObjectVariables(value, context);
          } else {
               resolved[key] = value;
          }
     });

     return resolved;
}
