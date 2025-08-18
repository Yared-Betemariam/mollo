type ISODateString = string;

export const statusList = ["active", "disabled"] as const;
export type Status = (typeof statusList)[number];

export const plansList = ["pro", "premium", "free"] as const;
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

export type TemplateName = "empty" | "sample";

export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;
