import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Props {
  light?: boolean;
  logo?: boolean;
  className?: string;
  size?: string;
}

const Logo = ({ className, logo, size, light }: Props) => {
  return (
    <Link href="/" className={cn("w-fit shrink-0", className)}>
      {logo ? (
        <Image
          src="/logo.png"
          alt="Metabook Logo"
          width={100}
          height={100}
          className={cn("shrink-0 w-8 h-auto drop-shadow", {
            "w-10": size === "lg",
            "w-12": size === "xl",
          })}
        />
      ) : (
        <>
          <Image
            src={light ? "/logo_wide_light.png" : "/logo_wide.png"}
            alt="Metabook Logo"
            width={140}
            height={140}
            className={cn("shrink-0 w-12 md:w-16", {
              "md:w-36": size === "lg",
              "md:w-40": size === "xl",
            })}
          />
        </>
      )}
    </Link>
  );
};
export default Logo;
