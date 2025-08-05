import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { NodeType, PageNode } from "../editor";

type Props = {
  addNode: (node: Omit<PageNode, "id">) => void;
};

const AddNode = ({ addNode }: Props) => {
  const [open, setOpen] = useState(false);

  const items = [
    {
      type: NodeType.SectionHero,
      title: "Hero Section",
      node: {
        type: NodeType.SectionHero,
        title: "HI There",
        description: "DESC",
      },
    },
  ];

  return (
    <DropdownMenu open={open} onOpenChange={(open) => setOpen(open)}>
      <DropdownMenuTrigger asChild>
        <Button size={"sm"} className="aspect-square size-8">
          <Plus />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <Command>
          <CommandInput
            placeholder="Filter label..."
            autoFocus={true}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No label found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.type}
                  value={item.title}
                  onSelect={() => {
                    setOpen(false);

                    addNode(item.node);
                  }}
                >
                  {item.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddNode;
