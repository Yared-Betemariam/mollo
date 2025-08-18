"use client";

import { PageNode } from "@/modules/pages/editor";
import { channel } from "@/modules/pages/store";
import { toReact } from "@/modules/pages/utils";
import { useEffect, useState } from "react";

const Page = () => {
  const [nodes, setNodes] = useState<PageNode[]>([]);

  useEffect(() => {
    channel.onmessage = (e) => {
      setNodes(e.data.nodes);
    };
  }, []);

  return (
    <>
      {nodes.length >= 1 ? (
        toReact(nodes)
      ) : (
        <span className="opacity-60 mx-auto my-auto text-sm">Loading...</span>
      )}
    </>
  );
};

export default Page;
