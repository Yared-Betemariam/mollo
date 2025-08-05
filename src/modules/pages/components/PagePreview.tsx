import { useMemo } from "react";
import { PageNode } from "../editor";
import { toReact } from "../utils";

type Props = {
  nodes: PageNode[];
};

export default function PagePreview({ nodes }: Props) {
  const components = useMemo(() => {
    return toReact(nodes);
  }, [nodes]);

  return (
    <div className="bg-white flex min-h-full flex-col rounded-xl overflow-hidden">
      {components}
    </div>
  );
}
