import { Button } from "@/components/ui/button";
import { fontTheme } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

/* eslint-disable react/no-unescaped-entities */
const CTA = () => {
  return (
    <section className="relative py-12 overflow-hidden bg-neutral-900 text-white">
      <img
        width={500}
        height={500}
        alt="pattern"
        src="/cta-pattern.png"
        className="absolute outbound-radiant-mask inset-y-0 -left-6 -right-6 min-w-[110vw] h-full object-cover opacity-25"
      />
      <section
        id="cta"
        className="wrapper pt-28 pb-44 md:pb-36 flex flex-col items-cente justify-cente gap-10 relative overflow-y-hidden"
      >
        <div className="flex flex-col items-center justify-center gap-5 text-center">
          <h2 className={cn("h2 from-white to-gray-400", fontTheme.className)}>
            Ready to have a website?
          </h2>
          <Link href={"/signin"} className="w-fit">
            <Button
              size={"2xl"}
              className="rounded-full text-white bg-gradient-to-br from-blue-400/90 border border-white/25 to-blue-700/90"
            >
              <span>Start now</span>
              <ArrowRight className="size-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </section>
  );
};
export default CTA;
