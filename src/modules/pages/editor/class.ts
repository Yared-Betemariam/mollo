import { generateId } from "@/lib/utils";
import { PageNode } from ".";

export type UpdatableNode<T> = Partial<Omit<T, "id" | "type">>;

type UUID = string;

export class Page {
  private static generateId(): UUID {
    return generateId();
  }

  public static loadJson(input: string | { nodes: PageNode[] }): PageNode[] {
    const data = typeof input === "string" ? JSON.parse(input) : input;
    if (!Array.isArray(data.nodes)) {
      throw new Error("Invalid page JSON: missing nodes array");
    }
    return data.nodes;
  }

  public static toJsonString(nodes: PageNode[], indent: number = 2): string {
    return JSON.stringify({ nodes }, null, indent);
  }

  public static addNode<T extends PageNode>(
    nodes: PageNode[],
    node: Omit<T, "id">
  ): PageNode[] {
    const newNode = { ...node, id: this.generateId() } as T;
    return [...nodes, newNode];
  }

  public static deleteNode(nodes: PageNode[], id: UUID): PageNode[] {
    return nodes.filter((n) => n.id !== id);
  }

  public static editNode<T extends PageNode>(
    nodes: PageNode[],
    id: UUID,
    updates: UpdatableNode<T>
  ): PageNode[] {
    return nodes.map((node) => {
      if (node.id === id) {
        return { ...node, ...updates };
      }
      return node;
    });
  }

  public static getNodes(nodes: PageNode[]): PageNode[] {
    return JSON.parse(JSON.stringify(nodes));
  }

  public static moveNodeUp(nodes: PageNode[], id: UUID): PageNode[] {
    const index = nodes.findIndex((n) => n.id === id);
    if (index > 1) {
      const newNodes = [...nodes];
      [newNodes[index - 1], newNodes[index]] = [
        newNodes[index],
        newNodes[index - 1],
      ];
      return newNodes;
    }
    return nodes;
  }

  public static moveNodeDown(nodes: PageNode[], id: UUID): PageNode[] {
    const index = nodes.findIndex((n) => n.id === id);
    if (index !== -1 && index < nodes.length - 1) {
      const newNodes = [...nodes];
      [newNodes[index], newNodes[index + 1]] = [
        newNodes[index + 1],
        newNodes[index],
      ];
      return newNodes;
    }
    return nodes;
  }
}
