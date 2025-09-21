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
import { dark_templates } from "@/data";
import { getPageFont } from "@/lib/fonts";

// color palette
function hexToRgb(hex: string) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
      .toUpperCase()
  );
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;

  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s, l };
}

function hslToRgb(h: number, s: number, l: number) {
  h /= 360;
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function triadicPalette(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);

  const h2 = (h + 120) % 360;
  const h3 = (h + 240) % 360;

  const rgb1 = hslToRgb(h, s, l);
  const rgb2 = hslToRgb(h2, s, l);
  const rgb3 = hslToRgb(h3, s, l);

  return {
    primary: rgbToHex(rgb1.r, rgb1.g, rgb1.b),
    secondary: rgbToHex(rgb2.r, rgb2.g, rgb2.b),
    tertiary: rgbToHex(rgb3.r, rgb3.g, rgb3.b),
  };
}

export function GatesColor(index: number, type: "b" | "n" = "n") {
  const colors =
    type == "n"
      ? ["bg-primary", "bg-secondary", "bg-[var(--tertiary)]"]
      : [
          "bg-[var(--primary-darker)]/[9%]",
          "bg-[var(--secondary-darker)]/[9%]",
          "bg-[var(--tertiary-darker)]/[9%]",
        ];

  if (colors.length === 0) {
    throw new Error("No colors defined");
  }

  let color = colors[index % colors.length];

  if (index > 0) {
    const prevColor = colors[(index - 1) % colors.length];
    if (color === prevColor) {
      color = colors[(index + 1) % colors.length];
    }
  }

  return color;
}

type TransformOptions = {
  darken?: number;
  brighten?: number;
  opacity?: number;
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

export function toReact(
  nodes: PageNode[],
  template?: string | undefined
): React.ReactNode {
  const metadataNode = nodes[0] as PageMetadataNode;
  const { primary, secondary, tertiary } = triadicPalette(
    metadataNode.themeColor || "#FFF"
  );
  const isDark = dark_templates.includes(template || "");

  return (
    <div
      style={
        {
          "--primary": primary,
          "--secondary": secondary,
          "--tertiary": tertiary,
          "--primary-darker": hexTransfigure(primary, {
            darken: 0.55,
          }),
          "--secondary-darker": hexTransfigure(secondary, {
            darken: 0.55,
          }),
          "--tertiary-darker": hexTransfigure(tertiary, {
            darken: 0.55,
          }),
          "--primary-dark": hexTransfigure(primary, {
            darken: 0.925,
          }),
          "--primary-light": hexTransfigure(primary, {
            brighten: 0.4,
          }),
          "--primary-dark-bg": hexTransfigure(primary, {
            darken: 0.625,
          }),
          "--theme-font": getPageFont(metadataNode.themeFont),
          ...(isDark
            ? {
                "--border": "#ffffff1b",
              }
            : {
                "--border": "#0000001b",
              }),
        } as CSSProperties
      }
      className={cn(
        isDark && "dark",
        "flex flex-col bg-background text-foreground flex-1"
      )}
    >
      <div className="border-b">
        <div className="border-x page-wrapper py-4" />
      </div>
      {nodes.map((raw_node) => {
        const node = {
          ...raw_node,
          template,
        };
        switch (node.type) {
          case NodeType.SectionHeader:
            return (
              <HeaderSection
                isDark={isDark}
                nodes={nodes}
                key={node.id}
                node={node}
              />
            );
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
            return (
              <ProjectsSection isDark={isDark} key={node.id} node={node} />
            );
          case NodeType.SectionVideoGallery:
            return (
              <VideoGallerySection isDark={isDark} key={node.id} node={node} />
            );
          case NodeType.SectionImageGallery:
            return (
              <ImageGallerySection isDark={isDark} key={node.id} node={node} />
            );
          case NodeType.SectionTestimonials:
            return <TestimonialsSection key={node.id} node={node} />;
          case NodeType.SectionContact:
            return <ContactSection key={node.id} node={node} />;
          case NodeType.SectionFooter:
            return <FooterSection nodes={nodes} key={node.id} node={node} />;
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
