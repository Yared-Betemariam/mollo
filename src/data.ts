import { Template } from "./types";

export const timeRangeOptions = [
  {
    value: "today",
    label: "Today",
  },
  {
    value: "week",
    label: "This Week",
  },
  {
    value: "month",
    label: "This Month",
  },
  {
    value: "all",
    label: "All",
  },
];

export const templates: Template[] = [
  {
    image_url: "/logo.png?height=200&width=200",
    base_template: "sample",
    name: "Sample",
  },
  {
    image_url: "/logo.png?height=200&width=200",
    base_template: "empty",
    name: "Empty",
  },
];
