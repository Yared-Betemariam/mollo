import { NodeType, PageNode } from "@/modules/pages/editor";
import { clsx, type ClassValue } from "clsx";
import crypto from "crypto";
import { format, parseISO } from "date-fns";
import { Geist, Inter } from "next/font/google";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(small?: boolean): string {
  return crypto
    .randomBytes(12)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, small ? 8 : 24);
}

export function getDateStringByIso(iso: string) {
  const date = parseISO(iso);
  return format(date, "MMM yyyy");
}

export const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const fontGeist = Geist({
  subsets: ["latin"],
  variable: "--font-inter",
});

const IMAGE_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".bmp",
  ".svg",
  ".avif",
];
const VIDEO_EXTENSIONS = [".mp4", ".mov", ".avi", ".mkv", ".webm", ".flv"];

function hasValidExtension(url: string, fileType: "image" | "video"): boolean {
  const exts = fileType === "image" ? IMAGE_EXTENSIONS : VIDEO_EXTENSIONS;
  return exts.some((ext) => url.toLowerCase().split("?")[0].endsWith(ext));
}

export function countMediaUrls(
  nodes: PageNode[],
  fileType: "image" | "video"
): number {
  let count = 0;

  for (const node of nodes) {
    switch (node.type) {
      case NodeType.PageMetadata:
        if (
          fileType === "image" &&
          node.iconUrl &&
          hasValidExtension(node.iconUrl, "image")
        ) {
          count++;
        }
        break;

      case NodeType.SectionCertificates:
        if (fileType === "image") {
          count += node.imageUrls.filter((url) =>
            hasValidExtension(url, "image")
          ).length;
        }
        break;

      case NodeType.SectionProjects:
        if (fileType === "image") {
          for (const project of node.projects) {
            count += project.imageUrls.filter((url) =>
              hasValidExtension(url, "image")
            ).length;
          }
        }
        break;

      case NodeType.SectionImageGallery:
        if (fileType === "image") {
          if (node.images) {
            count += node.images.filter((url) =>
              hasValidExtension(url, "image")
            ).length;
          }
          if (node.groups) {
            for (const group of node.groups) {
              count += group.imageUrls.filter((url) =>
                hasValidExtension(url, "image")
              ).length;
            }
          }
        }
        break;

      case NodeType.SectionVideoGallery:
        if (fileType === "video") {
          if (node.videos) {
            count += node.videos.filter((url) =>
              hasValidExtension(url, "video")
            ).length;
          }
          if (node.groups) {
            for (const group of node.groups) {
              count += group.videoUrls.filter((url) =>
                hasValidExtension(url, "video")
              ).length;
            }
          }
        }
        break;

      case NodeType.SectionTestimonials:
        if (fileType === "image") {
          for (const t of node.testimonials) {
            if (t.picture && hasValidExtension(t.picture, "image")) {
              count++;
            }
          }
        }
        break;

      case NodeType.SectionHero:
        if (
          fileType === "image" &&
          node.imageUrl &&
          hasValidExtension(node.imageUrl, "image")
        ) {
          count++;
        }
        break;
    }
  }

  return count;
}
