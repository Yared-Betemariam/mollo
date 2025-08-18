import { create } from "zustand";
import { Page, PageNode } from "../editor";
import { UpdatableNode } from "../editor/class";

interface NodesStoreType {
  nodes: PageNode[];
  setNodes: (nodes: PageNode[]) => void;
  editNode: <T extends PageNode>(id: string, updates: UpdatableNode<T>) => void;
  deleteNode: (id: string) => void;
  moveNodeUp: (id: string) => void;
  moveNodeDown: (id: string) => void;
  addNode: <T extends PageNode>(node: Omit<T, "id">) => void;
}

export const useNodesStore = create<NodesStoreType>((set, get) => ({
  nodes: [],
  setNodes: (nodes) => set({ nodes }),
  editNode: (id, updates) => {
    set({ nodes: Page.editNode(get().nodes, id, updates) });
  },
  deleteNode: (id) => {
    set({ nodes: Page.deleteNode(get().nodes, id) });
  },
  moveNodeUp: (id) => {
    set({ nodes: Page.moveNodeUp(get().nodes, id) });
  },
  moveNodeDown: (id) => {
    set({ nodes: Page.moveNodeDown(get().nodes, id) });
  },
  addNode: (node) => {
    set({ nodes: Page.addNode(get().nodes, node) });
  },
}));

export const channel = new BroadcastChannel("zustand-sync");
