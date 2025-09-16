"use client";

import { PageNode } from "@/modules/pages/editor";
import { channel } from "@/modules/pages/store";
import { toReact } from "@/modules/pages/utils";
import { useEffect, useState } from "react";

const Page = () => {
  const [data, setData] = useState<{
    template?: string | undefined;
    nodes: PageNode[];
  }>({
    nodes: [],
  });

  useEffect(() => {
    channel.onmessage = (e) => {
      setData(e.data);
    };
  }, []);

  return (
    <>
      {data.nodes.length >= 1 ? (
        toReact(data.nodes, data.template)
      ) : (
        <span className="opacity-60 mx-auto my-auto text-sm">Loading...</span>
      )}
    </>
  );
};

export default Page;
