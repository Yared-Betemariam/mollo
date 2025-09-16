import { TemplateName } from "@/types";
import { NodeType, PageNode } from "../editor";

const templateStore: Record<TemplateName, PageNode[]> = {
  primary: [
    {
      id: "xxx1",
      type: NodeType.PageMetadata,
      title: "Yared's page",
      description: "Here is your metedatea",
    },
    {
      id: "xxx11",
      type: NodeType.SectionHeader,
    },
    {
      id: "111",
      type: NodeType.SectionHero,
      subtitle: "Drag",
      title: "Sample Hero",
      description: "This is a sample.",
    },
    {
      id: "2222",
      type: NodeType.SectionFooter,
      text: "© 2025 Portfolio webiste",
    },
  ],
  primary_dark: [],
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
