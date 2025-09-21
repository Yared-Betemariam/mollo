import { Limits, Template } from "./types";

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
    image_url: "/templates/primary.png",
    base_template: "primary",
    name: "Primary",
  },
  {
    image_url: "/templates/primary_dark.png",
    base_template: "primary_dark",
    name: "Primary Dark",
    dark: true,
  },
];

export const fonts = [
  {
    value: "geist",
    label: "Geist",
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
      year: 399,
      onetime: 799,
    },
    limits: {
      maxImages: 15,
      maxVideos: 4,
      maxImageSize: 5,
      maxVideoSize: 75,
    },
  },
  {
    id: "pro",
    title: "Pro",
    isPopular: true,
    price: {
      year: 499,
      onetime: 899,
    },
    limits: {
      maxImages: 30,
      maxVideos: 8,
      maxImageSize: 10,
      maxVideoSize: 150,
    },
  },
  {
    id: "premium",
    title: "Premium",
    isRecommended: true,
    price: {
      year: 599,
      onetime: 999,
    },
    limits: {
      maxImages: 50,
      maxVideos: 10,
      maxImageSize: 20,
      maxVideoSize: 200,
    },
  },
];

export const free_limits: Limits = {
  maxImages: 4,
  maxVideos: 0,
  maxImageSize: 2,
  maxVideoSize: 10,
};

export const IconUrls = {
  telebirr:
    "https://play-lh.googleusercontent.com/Mtnybz6w7FMdzdQUbc7PWN3_0iLw3t9lUkwjmAa_usFCZ60zS0Xs8o00BW31JDCkAiQk",
  cbe: "https://play-lh.googleusercontent.com/kKGUk63iUIMXF-SL4AklHhZnQesw3-jZT2MR6NuX-xS54ncaZJ-8tlJETZdQYyZ5-g?width=10&height=10",
};

export const mollo_telegram_username = "@mollosupport";

export const AFFILIATE_FEE = 0.3;
