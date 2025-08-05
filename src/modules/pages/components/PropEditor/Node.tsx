import { AnimatedAccordionContent } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Trash } from "lucide-react";
import { useMemo } from "react";
import { FooterNode, NodeType, PageNode } from "../../editor";
import { getNodeTypeInfo } from "../../utils";
import ValueChanger from "./ValueChanger";

interface Props {
  node: PageNode;
  isActive: boolean;
  toggleNode: () => void;
  moveNodeUp: () => void;
  moveNodeDown: () => void;
  deleteNode: () => void;
  isMain?: boolean;
  editNode: <T extends PageNode>(updates: Partial<T>) => void;
}

const Node = ({
  node,
  isActive,
  toggleNode,
  editNode,
  moveNodeDown,
  moveNodeUp,
  deleteNode,
  isMain,
}: Props) => {
  const nodeInfo = useMemo(() => getNodeTypeInfo(node.type), [node]);

  const contents = () => {
    switch (node.type) {
      case NodeType.PageMetadata:
        return <>Page meta</>;
      case NodeType.SectionHero:
        return <></>;
      case NodeType.SectionAbout:
        return <></>;
      case NodeType.SectionEducation:
        return <></>;
      case NodeType.SectionCertificates:
        return <></>;
      case NodeType.SectionSkills:
        return <></>;
      case NodeType.SectionProjects:
        return <></>;
      case NodeType.SectionVideoGallery:
        return <></>;
      case NodeType.SectionImageGallery:
        return <></>;
      case NodeType.SectionTestimonials:
        return <></>;
      case NodeType.SectionContact:
        return <></>;
      case NodeType.SectionFooter:
        return (
          <>
            <ValueChanger
              onChange={(value) => {
                editNode<FooterNode>({
                  ...node,
                  text: value,
                });
              }}
              value={node.text}
            />
          </>
        );
      default:
        return <></>;
    }
  };

  const nodeActions = [
    {
      title: "Move Up",
      desc: "Move node up",
      Icon: ArrowUp,
      onClick: moveNodeUp,
    },
    {
      title: "Move Down",
      desc: "Move node down",
      Icon: ArrowDown,
      onClick: moveNodeDown,
    },
    {
      title: "Delete",
      desc: "Delte node",
      Icon: Trash,
      onClick: deleteNode,
    },
  ];

  return (
    <div className="flex flex-col border-b border-border/75">
      {/* Trigger */}
      <div className="group/item py-3.5 px-4 flex items-center justify-between">
        <p
          onClick={() => toggleNode()}
          className={cn(
            "hover:text-primary flex-1 h-full text-lg cursor-pointer",
            isActive && "text-primary font-medium"
          )}
        >
          {nodeInfo.title}
        </p>
        {!isMain && (
          <div className="hidden group-hover/item:flex gap-2 items-center">
            {nodeActions.map((action) => (
              <span
                key={action.desc}
                onClick={action.onClick}
                className={cn(
                  "p-1 aspect-square rounded-md hover:bg-zinc-900/15 hover:cursor-pointer",
                  action.title == "Delete" && "text-destructive"
                )}
              >
                <action.Icon className="size-4 opacity-70" />
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <AnimatedAccordionContent
        isActive={isActive}
        className="px-4 flex flex-col gap-3"
      >
        <p className="text-muted-foreground">{nodeInfo.description}</p>
        {contents()}
        <div className="mb-4" />
      </AnimatedAccordionContent>
    </div>
  );
};
export default Node;
