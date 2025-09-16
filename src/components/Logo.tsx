import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Props {
  light?: boolean;
  logo?: boolean;
  className?: string;
  size?: string;
  noLink?: boolean;
}

const Logo = ({ className, noLink, logo, size, light }: Props) => {
  const Logo = logo ? (
    <Image
      src="/logo.png"
      alt="Metabook Logo"
      width={100}
      height={100}
      className={cn("shrink-0 w-8 h-auto drop-shadow", {
        "w-10": size === "lg",
        "w-12": size === "xl",
        "w-6": size === "sm",
      })}
    />
  ) : (
    <>
      <Image
        src={light ? "/logo_wide_light.png" : "/logo_wide.png"}
        alt="Metabook Logo"
        width={140}
        height={140}
        className={cn("shrink-0 w-20 md:w-[4.5rem]", {
          "md:w-28": size === "lg",
          "md:w-36": size === "xl",
          "md:w-16": size === "sm",
          "w-12 md:w-14": size === "xs",
        })}
      />
    </>
  );
  return noLink ? (
    Logo
  ) : (
    <Link href="/" className={cn("w-fit shrink-0", className)}>
      {Logo}
    </Link>
  );
};
export default Logo;
