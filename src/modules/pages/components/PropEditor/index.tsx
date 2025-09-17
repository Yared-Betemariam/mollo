"use client";

import { useEffect, useState } from "react";
import { NodeType } from "../../editor";
import { usePage } from "../../hooks";
import Node from "./Node";
import { usePageInfoStore } from "../../store";

const PropEditor = () => {
  const { nodes, editNode, deleteNode, moveNodeDown, moveNodeUp } = usePage();
  const [activeNode, setActiveNode] = useState<string>();
  const { info } = usePageInfoStore();

  useEffect(() => {
    if (nodes && nodes.length > 0 && !activeNode) {
      setActiveNode(nodes[0].id);
    }
  }, [nodes]);

  return (
    <div className="h-[calc(100vh-7.5rem)]">
      {nodes.map((node, i) => {
        return (
          <Node
            isMain={node.type == NodeType.PageMetadata}
            deleteNode={() => deleteNode(node.id)}
            moveNodeDown={() => moveNodeDown(node.id)}
            moveNodeUp={() => moveNodeUp(node.id)}
            toggleNode={() =>
              setActiveNode(activeNode == node.id ? "none" : node.id)
            }
            isActive={activeNode == node.id}
            key={i}
            editNode={(updates) => {
              editNode<typeof node>(node.id, {
                ...node,
                ...updates,
              });
            }}
            node={node}
            info={info}
          />
        );
      })}
      {nodes.length <= 0 && (
        <div className="flex items-center w-full justify-between h-full flex-col gap-1">
          <div className="size-8 rounded-md border-2 rotate-[35deg] border-black mb-4 shadow-md flex">
            <div className="border size-5 mx-auto my-auto border-blue-700/80 rounded-sm shadow-inner" />
          </div>
          <span className="text">You have no nodes on your website</span>
          <span className="opacity-50 text-base">
            Start by adding some above
          </span>
        </div>
      )}
    </div>
  );
};

export default PropEditor;
