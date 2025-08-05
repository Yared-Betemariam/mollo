type ISODateString = string;

export const timeRangeList = ["today", "week", "month", "all"];
export type TimeRange = "today" | "week" | "month" | "all";

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
  base_template: string;
  name: string;
};

export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;
