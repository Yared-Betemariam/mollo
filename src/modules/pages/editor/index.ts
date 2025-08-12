import z from "zod";

export { Page } from "./class";

export enum NodeType {
  PageMetadata = "page:metadata", //
  SectionHeader = "section:header", //
  SectionHero = "section:hero", //
  SectionAbout = "section:about", //
  SectionEducation = "section:education", //
  SectionCertificates = "section:certificates", //
  SectionSkills = "section:skills", //
  SectionProjects = "section:projects", //
  SectionVideoGallery = "section:video-gallery",
  SectionImageGallery = "section:image-gallery", //
  SectionTestimonials = "section:testimonials", //
  SectionContact = "section:contact", //
  SectionFooter = "section:footer", //
}

export const BaseNodeSchema = z.object({
  id: z.string(),
  template: z.string().optional(),
});

export type BaseNode = z.infer<typeof BaseNodeSchema>;

export const LinkItemSchema = z.object({ title: z.string(), url: z.string() });
export type LinkItem = z.infer<typeof LinkItemSchema>;

export const PageMetadataNodeSchema = BaseNodeSchema.extend({
  type: z.literal(NodeType.PageMetadata),
  title: z.string(),
  description: z.string(),
  iconUrl: z.string().optional(),
  themeColor: z.string().optional(),
  themeFont: z.string().optional(),
});
export type PageMetadataNode = z.infer<typeof PageMetadataNodeSchema>;

export const HeaderNodeSchema = BaseNodeSchema.extend({
  type: z.literal(NodeType.SectionHeader),
  iconText: z.string().optional(),
  showIcon: z.boolean().optional(),
  showLinks: z.boolean().optional(),
});
export type HeaderNode = z.infer<typeof HeaderNodeSchema>;

export const HeroNodeSchema = BaseNodeSchema.extend({
  type: z.literal(NodeType.SectionHero),
  title: z.string(),
  description: z.string(),
  imageUrl: z.string().optional(),
  isImageBackgroud: z.boolean().optional(),
});
export type HeroNode = z.infer<typeof HeroNodeSchema>;

export const AboutNodeSchema = BaseNodeSchema.extend({
  type: z.literal(NodeType.SectionAbout),
  description: z.string(),
});
export type AboutNode = z.infer<typeof AboutNodeSchema>;

export const EducationItemSchema = z.object({
  id: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  title: z.string(),
  description: z.string(),
});
export type EducationItem = z.infer<typeof EducationItemSchema>;

export const EducationNodeSchema = BaseNodeSchema.extend({
  type: z.literal(NodeType.SectionEducation),
  timeline: z.array(EducationItemSchema),
  description: z.string().optional(),
});
export type EducationNode = z.infer<typeof EducationNodeSchema>;

export const CertificatesNodeSchema = BaseNodeSchema.extend({
  type: z.literal(NodeType.SectionCertificates),
  imageUrls: z.array(z.string()),
});
export type CertificatesNode = z.infer<typeof CertificatesNodeSchema>;

export const SkillItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  proficiency: z.string(), // percentage number
});
export type SkillItem = z.infer<typeof SkillItemSchema>;

export const SkillsNodeSchema = BaseNodeSchema.extend({
  type: z.literal(NodeType.SectionSkills),
  skills: z.array(SkillItemSchema),
  description: z.string().optional(),
});
export type SkillsNode = z.infer<typeof SkillsNodeSchema>;

export const ProjectItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrls: z.array(z.string()),
});
export type ProjectItem = z.infer<typeof ProjectItemSchema>;

export const ProjectsNodeSchema = BaseNodeSchema.extend({
  type: z.literal(NodeType.SectionProjects),
  projects: z.array(ProjectItemSchema),
});
export type ProjectsNode = z.infer<typeof ProjectsNodeSchema>;

export const VideoGroupSchema = z.object({
  id: z.string(),
  title: z.string(),
  videoUrls: z.array(z.string()),
});
export type VideoGroup = z.infer<typeof VideoGroupSchema>;

export const VideoGalleryNodeSchema = BaseNodeSchema.extend({
  type: z.literal(NodeType.SectionVideoGallery),
  videos: z.array(z.string()).optional(),
  groups: z.array(VideoGroupSchema).optional(),
});
export type VideoGalleryNode = z.infer<typeof VideoGalleryNodeSchema>;

export const ImageGroupSchema = z.object({
  id: z.string(),
  title: z.string(),
  imageUrls: z.array(z.string()),
});
export type ImageGroup = z.infer<typeof ImageGroupSchema>;

export const ImageGalleryNodeSchema = BaseNodeSchema.extend({
  type: z.literal(NodeType.SectionImageGallery),
  images: z.array(z.string()).optional(),
  groups: z.array(ImageGroupSchema).optional(),
});
export type ImageGalleryNode = z.infer<typeof ImageGalleryNodeSchema>;

export const TestimonialSchema = z.object({
  id: z.string(),
  picture: z.string().optional(),
  name: z.string(),
  jobDescription: z.string().optional(),
  feedback: z.string(),
  rating: z.string().optional(),
});
export type Testimonial = z.infer<typeof TestimonialSchema>;

export const TestimonialsNodeSchema = BaseNodeSchema.extend({
  type: z.literal(NodeType.SectionTestimonials),
  testimonials: z.array(TestimonialSchema),
});
export type TestimonialsNode = z.infer<typeof TestimonialsNodeSchema>;

export const SocialLinkSchema = z.object({
  platform: z.string(),
  url: z.string(),
});
export type SocialLink = z.infer<typeof SocialLinkSchema>;

export const ContactNodeSchema = BaseNodeSchema.extend({
  type: z.literal(NodeType.SectionContact),
  socialLinks: z.array(SocialLinkSchema),
  phoneNumber: z.string().optional(),
  email: z.string().optional(),
});
export type ContactNode = z.infer<typeof ContactNodeSchema>;

export const FooterNodeSchema = BaseNodeSchema.extend({
  type: z.literal(NodeType.SectionFooter),
  text: z.string(),
});
export type FooterNode = z.infer<typeof FooterNodeSchema>;

export const PageNodeSchema = z.discriminatedUnion("type", [
  PageMetadataNodeSchema,
  HeaderNodeSchema,
  HeroNodeSchema,
  AboutNodeSchema,
  EducationNodeSchema,
  CertificatesNodeSchema,
  SkillsNodeSchema,
  ProjectsNodeSchema,
  VideoGalleryNodeSchema,
  ImageGalleryNodeSchema,
  TestimonialsNodeSchema,
  ContactNodeSchema,
  FooterNodeSchema,
]);
export type PageNode = z.infer<typeof PageNodeSchema>;

export const PageSchema = z.object({ nodes: z.array(PageNodeSchema) });
