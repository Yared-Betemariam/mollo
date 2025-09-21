import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import t0a from "@/assets/images/0a.png";
import t0b from "@/assets/images/0b.png";

import { InfiniteImageScroll } from "@/components/custom/infinite-image-scroll";
import { fontTheme } from "@/lib/fonts";

/* eslint-disable react/no-unescaped-entities */
const Hero = () => {
  return (
    <>
      <section className="py-28 relative overflow-hidden flex flex-col gap-20">
        <Image
          src="/hero-pattern.png"
          width={1100}
          height={400}
          alt="pattern"
          className="mx-auto -z-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[110vw] opacity-25 h-auto outbound-radiant-mask"
        />
        <section className="wrapper relative flex pt-16 flex-col gap-12">
          <div className="flex text-center items-center flex-col gap-8 w-full">
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              <div className="border px-2 py-1 shadow-sm flex items-center gap-2 rounded-full">
                <div className="size-5 rounded-full border overflow-hidden flex flex-col">
                  <span className="bg-green-600  flex-1" />
                  <span className="bg-yellow-500  flex-1" />
                  <span className="bg-red-600 flex-1 " />
                </div>
                <span className="text-black/50">
                  Payments with{" "}
                  <span className="text-black font-semibold">Birr</span>
                </span>
              </div>
              <div className="border px-2 py-1 shadow-sm flex items-center gap-2 rounded-full">
                <ShieldCheck className="size-5 text-emerald-600 fill-emerald-100" />
                <span className="text-black/50">
                  Trusted by{" "}
                  <span className="text-black font-semibold">
                    6+ freelancers
                  </span>
                </span>
              </div>
            </div>
            <h1
              className={cn(
                "text-6xl md:text-7xl font-semibold leading-[1] tracking-tighter !max-w-[18ch] bg-clip-text bg-gradient-to-tl from-zinc-950 to-gray-600 text-transparent",
                fontTheme.className
              )}
            >
              Make portoflio websites
            </h1>
            <p className="body max-w-[32ch]">
              Mollo lets you{" "}
              <span className="font-semibold  text-primary">Build</span> and{" "}
              <span className="font-semibold  text-primary">Deploy</span>{" "}
              Personalized Portfolio websites in{" "}
              <span className="font-medium after:w-full after:underline after:decoration-blue-600 after:decoration-wavy brightness-90 after:underline-offset-8 bg-clip-text bg-gradient-to-r from-sky-500 to-blue-700 text-transparent">
                minutes
              </span>
            </p>
            <Link
              href={"/signin"}
              className="w-fit relative rounded-full outline-none h-fit"
            >
              <div className="h-10 w-64 radiant-mask -z-10 blur-xl rounded-full bg-gradient-to-t from-sky-600 to-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute inset-0 z-10 translate-x-1/4">
                <div className="glare-animation h-full w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
              </div>
              <Button
                size={"2xl"}
                className="rounded-full border-white/85 border duration-300 transition-all opacity-95 hover:opacity-85 bg-gradient-to-br from-blue-500 to-blue-800"
              >
                <span>Start Building for Free</span>
                <ArrowRight className="size-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        <div className="flex gap-6 mt-6 flex-row mx-auto">
          <InfiniteImageScroll speed="fast" images={[t0b.src, t0b.src]} />
          <InfiniteImageScroll speed="fast" images={[t0a.src, t0a.src]} />
        </div>
      </section>
    </>
  );
};
export default Hero;
