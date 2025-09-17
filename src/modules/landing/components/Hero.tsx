import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import template1 from "@/assets/images/app.png";
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
        <section className="wrapper relative flex pt-28 flex-col gap-12">
          <div className="flex text-center items-center flex-col gap-8 w-full">
            <h1
              className={cn(
                "text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1] tracking-tighter !max-w-[18ch] bg-clip-text bg-gradient-to-tl from-zinc-950 to-gray-600 text-transparent",
                fontTheme.className
              )}
            >
              Build portfolio websites in minutes
            </h1>
            <p className="body max-w-[32ch]">
              Mollo lets you Build and Deploy Personalized Portfolio websites in
              short minutes
            </p>
            <Link href={"/signin"} className="w-fit relative h-fit">
              <div className="h-10 w-64 radiant-mask -z-10 blur-xl rounded-full bg-gradient-to-t from-sky-600 to-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
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

        <div className="flex gap-6 flex-row mx-auto">
          <InfiniteImageScroll
            speed="slow"
            images={[
              template1.src,
              template1.src,
              template1.src,
              template1.src,
              template1.src,
              template1.src,
            ]}
          />
          <InfiniteImageScroll
            direction="down"
            speed="slow"
            images={[
              template1.src,
              template1.src,
              template1.src,
              template1.src,
              template1.src,
              template1.src,
            ]}
          />
        </div>
      </section>
    </>
  );
};
export default Hero;
