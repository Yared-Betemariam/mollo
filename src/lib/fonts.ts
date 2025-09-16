import {
  Geist,
  Hanken_Grotesk,
  Rubik,
  Lato,
  Roboto,
  Open_Sans,
  DM_Sans,
  Poppins,
  Manrope,
  Raleway,
  Montserrat,
  Playfair_Display,
  Lora,
  EB_Garamond,
  Libre_Baskerville,
  Forum,
} from "next/font/google";

export const fontTheme = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-theme",
});

export const fontGeist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const fontRubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
});

export const fontLato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-lato",
});

export const fontRoboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const fontEBGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
});

export const fontLibreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-libre-baskerville",
});

export const fontForum = Forum({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-forum",
});

export const fontOpenSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export const fontDMSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const fontPoppins = Poppins({
  weight: ["100", "300", "400", "700", "900", "200", "500", "600", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const fontManrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const fontRaleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

export const fontMontserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const fontPlayfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

export const fontLora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

export const getPageFont = (font?: string): string => {
  switch (font) {
    case "geist":
      return fontGeist.style.fontFamily;
    case "rubik":
      return fontRubik.style.fontFamily;
    case "lato":
      return fontLato.style.fontFamily;
    case "roboto":
      return fontRoboto.style.fontFamily;
    case "open-sans":
      return fontOpenSans.style.fontFamily;
    case "dm-sans":
      return fontDMSans.style.fontFamily;
    case "poppins":
      return fontPoppins.style.fontFamily;
    case "manrope":
      return fontManrope.style.fontFamily;
    case "raleway":
      return fontRaleway.style.fontFamily;
    case "montserrat":
      return fontMontserrat.style.fontFamily;
    case "playfair":
      return fontPlayfairDisplay.style.fontFamily;
    case "eb-garamond":
      return fontEBGaramond.style.fontFamily;
    case "libre-baskerville":
      return fontLibreBaskerville.style.fontFamily;
    case "forum":
      return fontForum.style.fontFamily;
    case "lora":
      return fontLora.style.fontFamily;
    default:
      return fontTheme.style.fontFamily;
  }
};
