import { pricing_plans } from "./data";

type ISODateString = string;

export const statusList = ["active", "disabled"] as const;
export type Status = (typeof statusList)[number];

export const plansList = ["pro", "premium", "starter", "free"] as const;
export type Plan = (typeof plansList)[number];

export interface CleanSession {
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
  };
  expires: ISODateString;
}

export type Template = {
  image_url: string;
  base_template: TemplateName;
  name: string;
};

export type Limits = (typeof pricing_plans)[number]["limits"];

export type Info = {
  status: Status;
  isExpired: boolean;
  imageCount: number;
  videoCount: number;
  limits: Limits;
};

export interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  url?: string;
  error?: string;
  previewUrl?: string;
}

export type TemplateName = "empty" | "sample";

export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;
