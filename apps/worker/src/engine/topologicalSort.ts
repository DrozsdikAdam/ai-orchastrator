import { Node as FlowNode, Edge as FlowEdge } from "@repo/types";

export const topologicalSort = (nodes: FlowNode[], edges: FlowEdge[]): FlowNode[] => {
     const inDegree = new Map<string, number>();
     const adjacency = new Map<string, string[]>();

     nodes.forEach(node => {
          inDegree.set(node.id, 0);
          adjacency.set(node.id, []);
     })

     edges.forEach(edge => {
          const sourceNode = nodes.find(node => node.id === edge.source)
          const targetNode = nodes.find(node => node.id === edge.target)

          if (!sourceNode || !targetNode) {
               throw new Error("Invalid edge");
          }

          inDegree.set(targetNode.id, (inDegree.get(targetNode.id) || 0) + 1);
          adjacency.get(sourceNode.id)?.push(targetNode.id);
     })

     const nodeMap = new Map(nodes.map(node => [node.id, node]));

     const sorted: FlowNode[] = [];

     const queue = [...inDegree.entries()].filter(([_, value]) => value === 0);

     while (queue.length > 0) {
          const current = queue.shift()!;

          sorted.push(nodeMap.get(current[0])!);

          for (const neighbor of adjacency.get(current[0]) ?? []) {
               inDegree.set(neighbor, (inDegree.get(neighbor) || 1) - 1)

               if (inDegree.get(neighbor) === 0) {
                    queue.push([neighbor, 0]);
               }
          }

     }

     if (sorted.length !== nodes.length) {
          throw new Error("Cycle detected");
     }

     return sorted;

}