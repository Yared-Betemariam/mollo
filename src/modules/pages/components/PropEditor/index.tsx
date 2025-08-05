"use client";

import { useState } from "react";
import { NodeType } from "../../editor";
import { usePage } from "../../hooks";
import Node from "./Node";

const PropEditor = () => {
  const { nodes, editNode, deleteNode, moveNodeDown, moveNodeUp } = usePage();
  const [activeNode, setActiveNode] = useState<string>();

  return (
    <div className="flex flex-col">
      {nodes.map((node, i) => {
        return (
          <Node
            isMain={node.type == NodeType.PageMetadata}
            deleteNode={() => deleteNode(node.id)}
            moveNodeDown={() => moveNodeDown(node.id)}
            moveNodeUp={() => moveNodeUp(node.id)}
            toggleNode={() =>
              setActiveNode(activeNode == node.id ? undefined : node.id)
            }
            isActive={
              activeNode == node.id || node.type == NodeType.PageMetadata
            }
            key={i}
            editNode={(updates) => {
              editNode<typeof node>(node.id, {
                ...node,
                ...updates,
              });
            }}
            node={node}
          />
        );
      })}
    </div>
  );
};

export default PropEditor;
