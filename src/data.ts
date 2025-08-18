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

export const pricing_plans = [
  {
    id: "pro",
    title: "Pro",
    price: {
      year: 299,
      onetime: 699,
    },
    limits: {
      maxImages: 25,
      maxVideos: 10,
      maxImageSize: 10, // mb
      maxVideoSize: 100, // mb
    },
  },
  {
    id: "premium",
    title: "Premium",
    price: {
      year: 499,
      onetime: 999,
    },
    limits: {
      maxImages: 49,
      maxVideos: 19,
      maxImageSize: 25, // mb
      maxVideoSize: 300, // mb
    },
  },
];

export const IconUrls = {
  telebirr:
    "https://play-lh.googleusercontent.com/Mtnybz6w7FMdzdQUbc7PWN3_0iLw3t9lUkwjmAa_usFCZ60zS0Xs8o00BW31JDCkAiQk",
  cbe: "https://play-lh.googleusercontent.com/kKGUk63iUIMXF-SL4AklHhZnQesw3-jZT2MR6NuX-xS54ncaZJ-8tlJETZdQYyZ5-g?width=10&height=10",
  amole:
    "https://pbs.twimg.com/profile_images/1183761767517900800/X9jwUGJu_400x400.jpg",
};
