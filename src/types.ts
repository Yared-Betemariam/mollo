import { pricing_plans } from "./data";
import { PageNode } from "./modules/pages/editor";

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
  dark?: boolean;
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
}

export type RedisDefinitionData = {
  definition: {
    template: string;
    nodes: PageNode[];
  };
};

export type TemplateName = "primary" | "primary_dark";

export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;
