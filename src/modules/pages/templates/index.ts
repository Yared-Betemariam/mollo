import { TemplateName } from "@/types";
import { NodeType, PageNode } from "../editor";

const templateStore: Record<TemplateName, PageNode[]> = {
  sample: [
    {
      id: "xxx1",
      type: NodeType.PageMetadata,
      title: "Yared's page",
      description: "Here is your metedatea",
    },
    {
      id: "xxx11",
      type: NodeType.SectionHeader,
      links: [
        {
          title: "Testimonials",
          url: "#testimonials",
        },
      ],
    },
    {
      id: "111",
      type: NodeType.SectionHero,
      template: "light",
      title: "Sample Hero",
      description: "This is a sample.",
    },
    {
      id: "2222",
      type: NodeType.SectionFooter,
      template: "light",
      text: "© 2025 Sample Template",
    },
  ],
  empty: [
    {
      id: "xx21",
      type: NodeType.PageMetadata,
      title: "Empty Page",
      description: "Empty mollo page",
    },
  ],
};

// Getter function
export function getTemplate(templateName: TemplateName): PageNode[] {
  const nodes = templateStore[templateName];
  if (!nodes) {
    throw new Error(`Unknown template: ${templateName}`);
  }
  // Deep-clone so caller can mutate freely
  return JSON.parse(JSON.stringify(nodes));
}
