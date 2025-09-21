import { Button } from "@/components/ui/button";
import { Plus, Star } from "lucide-react";

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
      group: "Favourites",
      type: NodeType.SectionHero,
      title: "Hero Section",
      node: {
        type: NodeType.SectionHero,
        subtitle: "I'm John",
        title: "Professional Web Developer",
        description:
          "I develop professional webdeveloper. I make full landing pages, websites and web apps.",
      },
    },
    {
      type: NodeType.SectionAbout,
      title: "About Section",
      node: {
        type: NodeType.SectionAbout,
        description:
          "I develop professional webdeveloper. I make full landing pages, websites and web apps. I develop professional webdeveloper. I make full landing pages, websites and web apps.",
      },
    },
    {
      type: NodeType.SectionImageGallery,
      title: "Image Gallery",
      node: {
        type: NodeType.SectionImageGallery,
        images: [],
        groups: [],
      },
    },
    {
      type: NodeType.SectionVideoGallery,
      title: "Video Gallery Section",
      node: {
        type: NodeType.SectionVideoGallery,
        videos: [],
        groups: [],
      },
    },
    {
      type: NodeType.SectionContact,
      title: "Contact Section",
      node: {
        type: NodeType.SectionContact,
        email: "yourname@email.com",
        phoneNumber: "090909090909",
        socialLinks: [
          {
            platform: "Facebook",
            url: "https://facebook.com",
          },
          {
            platform: "Telegram",
            url: "https://tg.me",
          },
          {
            platform: "Instagram",
            url: "https://instagram.com",
          },
        ],
      },
    },
    {
      group: "All",
      type: NodeType.SectionProjects,
      title: "Projects Section",
      node: {
        type: NodeType.SectionProjects,
        projects: [],
      },
    },
    {
      type: NodeType.SectionSkills,
      title: "Skills Section",
      node: {
        type: NodeType.SectionSkills,
        skills: [
          {
            id: "21891",
            name: "HTML/CSS/JS",
            proficiency: "78",
          },
        ],
      },
    },
    {
      type: NodeType.SectionCertificates,
      title: "Certificates Section",
      node: {
        type: NodeType.SectionCertificates,
        imageUrls: [],
      },
    },
    {
      type: NodeType.SectionEducation,
      title: "Education Section",
      node: {
        type: NodeType.SectionEducation,
        timeline: [
          {
            id: "21891",
            title: "Degree",
            description: "My Bachelor degree",
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
          },
        ],
      },
    },
    {
      type: NodeType.SectionTestimonials,
      title: "Testimonials Section",
      node: {
        type: NodeType.SectionTestimonials,
        testimonials: [
          {
            id: "218s",
            name: "John Doe",
            feedback: "This is a sample testimony",
            rating: "3",
          },
        ],
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
      <DropdownMenuContent align="end" className="w-56 p-0">
        <Command className="pb-2 pt-1">
          <CommandInput
            placeholder="Filter label..."
            autoFocus={true}
            className="h-9"
          />
          <CommandList className="p-0 pt-1">
            <CommandEmpty>No label found.</CommandEmpty>
            <CommandGroup className="p-0">
              {items.map((item) => {
                const cpt = (
                  <CommandItem
                    key={item.type}
                    value={item.title}
                    className="h-9 px-4 rounded-none"
                    onSelect={() => {
                      setOpen(false);

                      addNode(item.node);
                    }}
                  >
                    {item.title}
                  </CommandItem>
                );

                return item.group ? (
                  <div key={item.type} className="flex flex-col">
                    <span className="text-sm opacity-50 px-4 mt-2 mb-1">
                      {item.group}{" "}
                      {item.group == "Favourites" && (
                        <Star className="size-3 text-yellow-600 inline ml-1 fill-current" />
                      )}
                    </span>
                    {cpt}
                  </div>
                ) : (
                  cpt
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddNode;
