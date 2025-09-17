import { ScrollAreaWrapper } from "@/components/custom/scrollarea-wrapper";
import { Button } from "@/components/ui/button";
import {
  useConfirmationModalStore,
  useModalStore,
} from "@/modules/modals/store";
import { ChevronUp, Pencil, Plus, Trash } from "lucide-react";
import { NodeType, PageNode } from "../../editor";
import { cn } from "@/lib/utils";

type NodeItem = {
  id: string;
  name: string;
  item: unknown;
  cpt?: React.ReactNode;
};

type Props = {
  item_id: string;
  node: PageNode;
  name: string;
  movable?: boolean;
  items: NodeItem[];
  onItemsChange?: (items: unknown) => void;
  onDelete: (id: string) => void;
};

const NodeItems = ({
  item_id,
  items,
  name,
  node,
  onItemsChange,
  movable,
  onDelete,
}: Props) => {
  const handleMoveUp = (item: NodeItem, i: number) => {
    if (
      items.indexOf(item) > 0 &&
      onItemsChange &&
      node.type == NodeType.SectionEducation
    ) {
      const new_items = node.timeline;
      const prev = new_items[i - 1];
      new_items[i - 1] = node.timeline[i];
      new_items[i] = prev;
      onItemsChange(new_items);
    }
  };
  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex items-center justify-between">
        <p className="font-medium">
          {name}
          {items.length > 0 && ` (${items.length})`}
        </p>
        <Button
          size={"xs"}
          onClick={() =>
            useModalStore
              .getState()
              .openModal({ open: item_id, data: { node: node } })
          }
          className="ml-auto rounded-md"
        >
          <Plus className="size-4" /> Add
        </Button>
      </div>
      <ScrollAreaWrapper className="bg-zinc-700/5 p-2 rounded-md flex-1 min-h-36 max-h-36 border">
        <div className="w-full gap-2 grid grid-cols-2 sm:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="border bg-white drop-shadow-sm drop-shadow-black/5  flex rounded-md mb-2"
            >
              {movable && (
                <div className="border-r flex flex-col items-center justify-center px-2 h-full">
                  <ChevronUp
                    onClick={() => handleMoveUp(item, i)}
                    className={cn(
                      "size-6 hover:bg-zinc-200 p-0.5 rounded-md duration-300 transition-all cursor-pointer",
                      i == 0 && "opacity-50"
                    )}
                  />
                </div>
              )}
              <div className="flex flex-1 px-3 py-2">
                <div className="flex flex-1 flex-col gap-0.5">
                  <p className="font-medium">{item.name}</p>
                  {item.cpt}
                </div>
                <div className={cn("flex", item.cpt ? "flex-col" : "gap-1")}>
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    onClick={() =>
                      useModalStore.getState().openModal({
                        open: item_id,
                        data: {
                          node: node,
                          ...(item_id == "skill" ? { skill: item.item } : {}),
                          ...(item_id == "project"
                            ? { project: item.item }
                            : {}),
                          ...(item_id == "testimonial"
                            ? { testimonial: item.item }
                            : {}),
                          ...(item_id == "education"
                            ? { education: item.item }
                            : {}),
                          ...(item_id == "imageGalleryGroup" ||
                          item_id == "videoGalleryGroup"
                            ? { group: item.item }
                            : {}),
                        },
                      })
                    }
                    className="gap-2 size-6"
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() => {
                      useConfirmationModalStore.getState().openModal({
                        title: `delete this`,
                        description: "delete this item",
                        onClick: () => onDelete(item.id),
                        variant: "destructive",
                      });
                    }}
                    className="gap-2 size-6"
                  >
                    <Trash className="text-destructive! size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length <= 0 && (
          <span className="opacity-35 text-base px-2">Nothing here...</span>
        )}
      </ScrollAreaWrapper>
    </div>
  );
};

export default NodeItems;
