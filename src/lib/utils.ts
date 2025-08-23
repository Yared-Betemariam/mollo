import { NodeType, PageNode } from "@/modules/pages/editor";
import { Info } from "@/types";
import { clsx, type ClassValue } from "clsx";
import crypto from "crypto";
import { format, parseISO } from "date-fns";
import { Geist, Hanken_Grotesk, Schibsted_Grotesk } from "next/font/google";
import { toast } from "sonner";
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

export const fontTheme = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-theme",
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

export function getInfoSummary(
  info: Info,
  fileType: "image" | "video"
): string {
  const { limits } = info;
  return `Maximum ${fileType} upload size is ${
    fileType === "image" ? limits.maxImageSize : limits.maxVideoSize
  } MB.`;
}

export function isUploadValid(
  info: Info | null,
  files: File[],
  fileType: "image" | "video"
): boolean {
  if (!info) {
    toast.error("No info is provided for upload validation.");
    return false;
  }

  if (info.status == "disabled") {
    toast.error(
      "Uploads are disabled for this account. Contact support for more information."
    );
    return false;
  }

  if (info.isExpired) {
    toast.error(
      "Your subscription has expired. Please renew to continue uploading."
    );
    return false;
  }

  const fileCount = files.length;
  if (fileCount === 0) {
    toast.error("No files selected for upload.");
    return false;
  }

  if (
    fileType === "image" &&
    info.imageCount + fileCount > info.limits.maxImages
  ) {
    toast.error(
      `You have reached the maximum image limit of ${info.limits.maxImages}.`
    );
    return false;
  }

  if (
    fileType === "image" &&
    files.some((file) => file.size > info.limits.maxImageSize * 1024 * 1024)
  ) {
    toast.error(
      `Image${fileCount > 1 ? "s" : ""} exceed the maximum size of ${
        info.limits.maxImageSize
      } MB.`
    );
    return false;
  }

  if (
    fileType === "video" &&
    info.videoCount + fileCount > info.limits.maxVideos
  ) {
    toast.error(
      `You have reached the maximum video limit of ${info.limits.maxVideos}.`
    );
    return false;
  }

  if (
    fileType === "video" &&
    files.some((file) => file.size > info.limits.maxVideoSize * 1024 * 1024)
  ) {
    toast.error(
      `Video${fileCount > 1 ? "s" : ""} exceed the maximum size of ${
        info.limits.maxVideoSize
      } MB.`
    );
    return false;
  }

  return true;
}
