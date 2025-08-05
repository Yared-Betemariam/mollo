import { trpc } from "@/trpc/client";
import { useNodesStore } from "../store";

export const usePage = () => {
  const { data, isLoading } = trpc.pages.user.useQuery();
  const { nodes, editNode, deleteNode, moveNodeUp, moveNodeDown, addNode } =
    useNodesStore();

  // const nodes: PageNode[] = data?.data?.definition
  //   ? Page.loadJson(data.data.definition)
  //   : [];

  return {
    page: data?.data || null,
    nodes,
    isLoading,
    editNode,
    deleteNode,
    moveNodeDown,
    addNode,
    moveNodeUp,
  };
};
