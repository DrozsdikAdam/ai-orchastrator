const resolveVariables = (text: string, context: Record<string, any>): string => {
     return text.replace(/\{\{(\w+)\.(\w+)~}\}/g, (match, nodeId, field) => {
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