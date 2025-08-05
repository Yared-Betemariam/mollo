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
    base_template: "minimal",
    name: "Minimal",
  },
  {
    image_url: "/logo.png?height=200&width=200",
    base_template: "creative",
    name: "Creative",
  },
  {
    image_url: "/logo.png?height=200&width=200",
    base_template: "business",
    name: "Business",
  },
  {
    image_url: "/logo.png?height=200&width=200",
    base_template: "blog",
    name: "Blog",
  },
];
