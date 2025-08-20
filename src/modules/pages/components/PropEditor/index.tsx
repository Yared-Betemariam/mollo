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
    </div>
  );
};

export default PropEditor;
