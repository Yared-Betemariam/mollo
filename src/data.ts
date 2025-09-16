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
    base_template: "primary",
    name: "Primary",
  },
  {
    image_url: "/logo.png?height=200&width=200",
    base_template: "primary_dark",
    name: "Primary Dark",
    dark: true,
  },
];

export const fonts = [
  {
    value: "lato",
    label: "Lato",
  },
  {
    value: "roboto",
    label: "Roboto",
  },
  {
    value: "open-sans",
    label: "Open Sans",
  },
  {
    value: "rubik",
    label: "Rubik",
  },
  {
    value: "dm-sans",
    label: "DM Sans",
  },
  {
    value: "poppins",
    label: "Poppins",
  },
  {
    value: "manrope",
    label: "Manrope",
  },
  {
    value: "raleway",
    label: "Raleway",
  },
  {
    value: "montserrat",
    label: "Montserrat",
  },
  {
    value: "playfair",
    label: "Playfair",
  },
  {
    value: "lora",
    label: "Lora",
  },
  {
    value: "eb-garamond",
    label: "EB Garamond",
  },
  {
    value: "libre-baskerville",
    label: "Libre Baskerville",
  },
  {
    value: "forum",
    label: "Forum",
  },
];

export const dark_templates = ["primary_dark"];

export const pricing_plans = [
  {
    id: "starter",
    title: "Starter",
    price: {
      year: 299,
      onetime: 699,
    },
    limits: {
      maxImages: 10,
      maxVideos: 5,
      maxImageSize: 5,
      maxVideoSize: 50,
    },
  },
  {
    id: "pro",
    title: "Pro",
    isPopular: true,
    price: {
      year: 399,
      onetime: 799,
    },
    limits: {
      maxImages: 25,
      maxVideos: 10,
      maxImageSize: 10,
      maxVideoSize: 100,
    },
  },
  {
    id: "premium",
    title: "Premium",
    price: {
      year: 499,
      onetime: 899,
    },
    limits: {
      maxImages: 49,
      maxVideos: 19,
      maxImageSize: 25,
      maxVideoSize: 300,
    },
  },
];

export const IconUrls = {
  telebirr:
    "https://play-lh.googleusercontent.com/Mtnybz6w7FMdzdQUbc7PWN3_0iLw3t9lUkwjmAa_usFCZ60zS0Xs8o00BW31JDCkAiQk",
  cbe: "https://play-lh.googleusercontent.com/kKGUk63iUIMXF-SL4AklHhZnQesw3-jZT2MR6NuX-xS54ncaZJ-8tlJETZdQYyZ5-g?width=10&height=10",
};

export const mollo_telegram_username = "@mollosupport";
