import { NodeType, PageNode } from "@/modules/pages/editor";
import { Info } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(small?: boolean): string {
  const length = small ? 8 : 24;
  const bytes = new Uint8Array(length);

  crypto.getRandomValues(bytes);

  const base62 =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < length; i++) {
    id += base62[bytes[i] % base62.length];
  }

  return id;
}

export function getDateStringByIso(iso: string) {
  const date = parseISO(iso);
  return format(date, "MMM yyyy");
}

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

export const MAX_REF_COOKIE_AGE = 60 * 60 * 24 * 30;

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
