import { TemplateName } from "@/types";
import { NodeType, PageNode } from "../editor";

const templateStore: Record<TemplateName, PageNode[]> = {
  primary: [
    {
      id: "0A0A0A0A",
      type: NodeType.PageMetadata,
      title: "Page title",
      themeColor: "#000",
    },
    {
      id: "0A0A0A0B",
      type: NodeType.SectionHeader,
      showIcon: true,
      showLinks: true,
    },
    {
      id: "0A0A0A0C",
      type: NodeType.SectionHero,
      subtitle: "Subtitle here",
      title: "Heading of Website",
      description: "This is a description part.",
    },
    {
      id: "0A0A0A0E",
      type: NodeType.SectionAbout,
      description:
        "I’m Lorem Ipsum, a passionate graphic designer who loves turning ideas into bold and creative visuals. From branding to digital art, I focus on designs that inspire and connect with people.",
    },
    {
      id: "0A0A0A0D",
      type: NodeType.SectionFooter,
      text: "© 2025 Website",
    },
  ],
  primary_dark: [
    {
      id: "0A0A0A0A",
      type: NodeType.PageMetadata,
      title: "Page title",
      themeColor: "#FFF",
    },
    {
      id: "0A0A0A0B",
      type: NodeType.SectionHeader,
      showIcon: true,
      showLinks: true,
    },
    {
      id: "0A0A0A0C",
      type: NodeType.SectionHero,
      subtitle: "Subtitle here",
      title: "Heading of Website",
      description: "This is a description part.",
    },
    {
      id: "0A0A0A0E",
      type: NodeType.SectionAbout,
      description:
        "I’m Lorem Ipsum, a passionate graphic designer who loves turning ideas into bold and creative visuals. From branding to digital art, I focus on designs that inspire and connect with people.",
    },
    {
      id: "0A0A0A0D",
      type: NodeType.SectionFooter,
      text: "© 2025 Website",
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
