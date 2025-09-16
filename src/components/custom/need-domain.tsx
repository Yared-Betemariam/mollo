import Link from "next/link";
import Logo from "../Logo";
import { fontTheme } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

const NeedCustomDomain = () => {
  return (
    <Link
      href={"/help"}
      className="rounded-xl bg-gradient-to-br overflow-hidden flex flex-col gap-5 w-fit mx-auto from-blue-700/65 to-blue-950/90 relative hover:opacity-90 cursor-pointer"
    >
      <Globe className="size-32 text-white opacity-15 absolute -bottom-8 -right-8" />
      <div className="rotate-45 top-1/2 w-28 h-[100vh] bg-white/5 left-0 -translate-y-1/2 absolute" />
      <div className="border-b px-6 pt-5 pb-4 border-white/25 flex items-center justify-between">
        <Logo noLink size="xs" light className="" />
        <span className="text-white/50 text-xl leading-[1] flex items-center gap-4">
          <span>.com</span> <span>.et</span> <span>.cc</span>
        </span>
      </div>
      <p className="text-2xl px-6 pt-0 pb-8 leading-[1.2] text-white font-medium tracking-tight">
        <span className={cn(fontTheme.className)}>
          Do you need a custom domain?{" "}
        </span>
        <span className="text-xl opacity-65 block font-normal">
          Just contact us here and we will help you set it up!
        </span>
      </p>
    </Link>
  );
};
export default NeedCustomDomain;
