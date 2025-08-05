import { trpc } from "@/trpc/client";
import { useNodesStore } from "../store";
import { useEffect } from "react";

export const usePage = () => {
  const { data, isLoading } = trpc.pages.user.useQuery();
  const {
    nodes,
    editNode,
    deleteNode,
    moveNodeUp,
    moveNodeDown,
    addNode,
    setNodes,
  } = useNodesStore();

  useEffect(() => {
    if (data && data.data?.definition) {
      setNodes(data.data.definition.nodes);
    }
  }, [data]);

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
