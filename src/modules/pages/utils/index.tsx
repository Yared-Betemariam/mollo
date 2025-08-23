// src/PageRenderer.tsx
import { cn } from "@/lib/utils";
import React, { CSSProperties } from "react";
import {
  AboutSection,
  CertificatesSection,
  ContactSection,
  EducationSection,
  FooterSection,
  HeaderSection,
  HeroSection,
  ImageGallerySection,
  ProjectsSection,
  SkillsSection,
  TestimonialsSection,
  VideoGallerySection,
} from "../components/PageComponents";
import { LinkItem, NodeType, PageMetadataNode, PageNode } from "../editor";
type TransformOptions = {
  darken?: number; // 0 to 1
  brighten?: number; // 0 to 1
  opacity?: number; // 0 to 1
};

export function hexTransfigure(hex: string, options: TransformOptions): string {
  const { darken = 0, brighten = 0, opacity } = options;

  // Ensure hex starts without #
  hex = hex.replace(/^#/, "");

  // Handle shorthand #FFF → #FFFFFF
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  if (hex.length !== 6) {
    throw new Error("Invalid hex color format");
  }

  // Convert to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Apply darkening
  if (darken > 0) {
    r = Math.max(0, Math.min(255, Math.floor(r * (1 - darken))));
    g = Math.max(0, Math.min(255, Math.floor(g * (1 - darken))));
    b = Math.max(0, Math.min(255, Math.floor(b * (1 - darken))));
  }

  // Apply brightening
  if (brighten > 0) {
    r = Math.max(0, Math.min(255, Math.floor(r + (255 - r) * brighten)));
    g = Math.max(0, Math.min(255, Math.floor(g + (255 - g) * brighten)));
    b = Math.max(0, Math.min(255, Math.floor(b + (255 - b) * brighten)));
  }

  // Return rgba if opacity is specified
  if (typeof opacity === "number") {
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  // Return hex otherwise
  return (
    "#" +
    [r, g, b]
      .map((val) => val.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

export async function getImageDimensions(
  url: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      resolve({ width: img.naturalWidth / 2, height: img.naturalHeight / 2 });
    };
    img.onerror = reject;
  });
}

export function toReact(nodes: PageNode[]): React.ReactNode {
  const metadataNode = nodes[0] as PageMetadataNode;

  return (
    <div
      style={
        {
          "--primary": metadataNode?.themeColor || "#020202",
          "--primary-dark": hexTransfigure(metadataNode?.themeColor || "#FFF", {
            darken: 0.9,
          }),
          "--primary-darker": hexTransfigure(
            metadataNode?.themeColor || "#FFF",
            {
              darken: 0.2,
            }
          ),
          "--primary-light": hexTransfigure(
            metadataNode?.themeColor || "#FFF",
            {
              brighten: 0.6,
            }
          ),
          "--primary-dark-bg": hexTransfigure(
            metadataNode?.themeColor || "#FFF",
            {
              darken: 0.625,
              opacity: 0.1,
            }
          ),
        } as CSSProperties
      }
      className={cn("flex flex-col")}
    >
      {nodes.map((node) => {
        switch (node.type) {
          case NodeType.SectionHeader:
            return <HeaderSection nodes={nodes} key={node.id} node={node} />;
          case NodeType.SectionHero:
            return <HeroSection key={node.id} node={node} />;
          case NodeType.SectionAbout:
            return <AboutSection key={node.id} node={node} />;
          case NodeType.SectionEducation:
            return <EducationSection key={node.id} node={node} />;
          case NodeType.SectionCertificates:
            return <CertificatesSection key={node.id} node={node} />;
          case NodeType.SectionSkills:
            return <SkillsSection key={node.id} node={node} />;
          case NodeType.SectionProjects:
            return <ProjectsSection key={node.id} node={node} />;
          case NodeType.SectionVideoGallery:
            return <VideoGallerySection key={node.id} node={node} />;
          case NodeType.SectionImageGallery:
            return <ImageGallerySection key={node.id} node={node} />;
          case NodeType.SectionTestimonials:
            return <TestimonialsSection key={node.id} node={node} />;
          case NodeType.SectionContact:
            return <ContactSection key={node.id} node={node} />;
          case NodeType.SectionFooter:
            return <FooterSection key={node.id} node={node} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

interface NodeTypeInfo {
  title: string;
  description: string;
}

export function getNodeTypeInfo(type: NodeType): NodeTypeInfo {
  switch (type) {
    case NodeType.PageMetadata:
      return {
        title: "Page Settings",
        description: "Set page title, description, and SEO settings.",
      };
    case NodeType.SectionHeader:
      return {
        title: "Header",
        description: "Include links to your entire website",
      };
    case NodeType.SectionHero:
      return {
        title: "Hero Section",
        description:
          "Create a powerful first impression with a main heading, call-to-action, and background.",
      };
    case NodeType.SectionAbout:
      return {
        title: "About Section",
        description: "Share your story, mission, or company information.",
      };
    case NodeType.SectionEducation:
      return {
        title: "Education Section",
        description:
          "Display your academic background, degrees, and accomplishments.",
      };
    case NodeType.SectionCertificates:
      return {
        title: "Certificates Section",
        description:
          "Showcase your professional certifications and achievements.",
      };
    case NodeType.SectionSkills:
      return {
        title: "Skills Section",
        description:
          "List your key skills and proficiencies to showcase expertise.",
      };
    case NodeType.SectionProjects:
      return {
        title: "Projects Section",
        description:
          "Showcase your portfolio with images, descriptions, and links to your best projects.",
      };
    case NodeType.SectionVideoGallery:
      return {
        title: "Video Gallery",
        description:
          "Display a collection of your videos in a clean, organized gallery.",
      };
    case NodeType.SectionImageGallery:
      return {
        title: "Image Gallery",
        description:
          "Create a gallery to display your photos, artwork, or product images.",
      };
    case NodeType.SectionTestimonials:
      return {
        title: "Testimonials Section",
        description: "Display positive feedback from clients to build trust.",
      };
    case NodeType.SectionContact:
      return {
        title: "Contact Section",
        description:
          "Provide a contact form, social media links, and contact details.",
      };
    case NodeType.SectionFooter:
      return {
        title: "Footer Section",
        description:
          "The final section for legal links, contact information, and social media.",
      };
    default:
      // Return a generic, safe object for any new or unexpected types.
      return {
        title: "Unknown Section",
        description:
          "No predefined description for this section. Please update.",
      };
  }
}

export function getHeaderlinks(nodes: PageNode[]): LinkItem[] {
  return nodes
    .filter(
      (node) =>
        ![
          NodeType.SectionFooter,
          NodeType.PageMetadata,
          NodeType.SectionHeader,
          NodeType.SectionImageGallery,
          NodeType.SectionVideoGallery,
          NodeType.SectionSkills,
          NodeType.SectionHero,
          NodeType.SectionCertificates,
        ].includes(node.type)
    )
    .map((item) => {
      let title: string;

      switch (item.type) {
        case NodeType.SectionAbout:
          title = "About";
          break;
        case NodeType.SectionEducation:
          title = "Education";
          break;
        case NodeType.SectionProjects:
          title = "Projects";
          break;
        case NodeType.SectionTestimonials:
          title = "Testimonials";
          break;
        case NodeType.SectionContact:
          title = "Contact";
          break;
        default:
          title = "Unknown";
          break;
      }
      return { title: title, url: `#${item.type}` };
    });
}
