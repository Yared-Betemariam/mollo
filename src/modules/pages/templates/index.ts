import { TemplateName } from "@/types";
import { NodeType, PageNode } from "../editor";

const basePageNode: PageNode[] = [
  {
    id: "0A0A0A0A",
    type: NodeType.PageMetadata,
    title: "Page title",
  },
  {
    id: "0A0A0A0B",
    type: NodeType.SectionHeader,
  },
  {
    id: "0A0A0A0C",
    type: NodeType.SectionHero,
    subtitle: "Subtitle here",
    title: "Heading 1 of Website",
    description: "This is a description part.",
  },
  {
    id: "0A0A0A0D",
    type: NodeType.SectionFooter,
    text: "© 2025 Website",
  },
];

const templateStore: Record<TemplateName, PageNode[]> = {
  primary: basePageNode,
  primary_dark: basePageNode,
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
