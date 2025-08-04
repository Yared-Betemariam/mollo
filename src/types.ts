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
