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
