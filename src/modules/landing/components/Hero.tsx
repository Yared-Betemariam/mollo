import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/* eslint-disable react/no-unescaped-entities */
const Hero = () => {
  return (
    <>
      <section className="py-28 relative overflow-hidden flex items-center">
        <Image
          src="/hero-pattern.png"
          width={1100}
          height={400}
          alt="pattern"
          className="mx-auto -z-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[110vw] opacity-25 h-auto brightness-200 outbound-radiant-mask"
        />
        <div className="size-24 -z-10 blur-xl rounded-full bg-gradient-to-b from-red-800 to-blue-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <Image
          src="/cube-pattern.png"
          width={1100}
          height={400}
          alt="pattern"
          className="size-14"
        />
        <section className="wrapper relative flex pt-28 flex-col gap-12">
          <div className="flex text-center items-center flex-col gap-8 w-full">
            <h1
              className={
                "text-[2.5rem] sm:text-[3rem] md:text-[3.25rem] font-extrabold leading-[1] tracking-[-0.075em] !max-w-[18ch] bg-clip-text bg-gradient-to-tl from-zinc-950 to-gray-600 text-transparent"
              }
            >
              Build portfolio websites in minutes
            </h1>
            <p className="big-body max-w-[32ch]">
              Mollo lets you Build and Deploy Personalized Portfolio websites in
              short minutes
            </p>
            <Link href={"/signin"} className="w-fit">
              <Button size={"lg"} className="rounded-full text-base h-14 px-6!">
                <span>Start Building</span>
                <ArrowRight className="size-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </section>
    </>
  );
};
export default Hero;
