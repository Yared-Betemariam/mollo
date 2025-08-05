// src/PageRenderer.tsx
import React from "react";
import { PageNode, NodeType } from "../editor";
import {
  HeroSection,
  AboutSection,
  EducationSection,
  CertificatesSection,
  SkillsSection,
  ProjectsSection,
  VideoGallerySection,
  ImageGallerySection,
  TestimonialsSection,
  ContactSection,
  FooterSection,
  HeaderSection,
} from "../components/PageComponents";

export function toReact(nodes: PageNode[]): React.ReactNode {
  return (
    <>
      {nodes.map((node) => {
        switch (node.type) {
          case NodeType.SectionHeader:
            return <HeaderSection key={node.id} node={node} />;
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
    </>
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
