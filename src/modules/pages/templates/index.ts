import { NodeType, PageNode } from "../editor";

// Define allowed templates
export type TemplateName = "editor" | "sample" | "video_editor";

// Example preset node-sets for each template
const templateStore: Record<TemplateName, PageNode[]> = {
  sample: [
    {
      id: "kalsd",
      type: NodeType.PageMetadata,
      title: "Yared's page",
      description: "Here is your metedatea",
    },
    {
      id: "kalsd",
      type: NodeType.SectionHeader,
      links: [
        {
          title: "Testimonials",
          url: "#testimonials",
        },
      ],
    },
    {
      id: "1",
      type: NodeType.SectionHero,
      template: "light",
      title: "Sample Hero",
      description: "This is a sample.",
      backgroundImageUrl: "/sample-bg.jpg",
    },
    {
      id: "2",
      type: NodeType.SectionFooter,
      template: "light",
      text: "© 2025 Sample Template",
    },
  ],
  editor: [
    {
      id: "1",
      type: NodeType.SectionHero,
      template: "dark",
      title: "Editor Hero",
      description: "Build your portfolio here.",
      backgroundImageUrl: "/editor-bg.jpg",
    },
    {
      id: "2",
      type: NodeType.SectionSkills,
      template: "dark",
      skills: [
        { name: "Photoshop", proficiency: 90 },
        { name: "Figma", proficiency: 80 },
      ],
    },
    {
      id: "3",
      type: NodeType.SectionFooter,
      template: "dark",
      text: "© 2025 Editor Template",
    },
  ],
  video_editor: [
    {
      id: "1",
      type: NodeType.SectionHero,
      template: "colorful",
      title: "Video Editor Hero",
      description: "Show off your reels.",
      backgroundImageUrl: "/video-bg.jpg",
    },
    {
      id: "2",
      type: NodeType.SectionVideoGallery,
      template: "colorful",
      videos: ["/videos/vid1.mp4", "/videos/vid2.mp4"],
    },
    {
      id: "3",
      type: NodeType.SectionFooter,
      template: "colorful",
      text: "© 2025 Video Editor Template",
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
