import { Employee } from "../types";

export const findNodeById = (nodes: Employee[], id: string): Employee | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};