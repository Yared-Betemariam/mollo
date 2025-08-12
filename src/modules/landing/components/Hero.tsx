import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/* eslint-disable react/no-unescaped-entities */
const Hero = () => {
  return (
    <>
      <section className="py-12 flex items-center">
        <section className="wrapper flex pt-28 flex-col gap-12">
          <div className="flex relative text-center items-center flex-col gap-8 w-full">
            <Image
              src="/pattern.png"
              width={500}
              height={500}
              alt="pattern"
              className="absolute size-125 -top-1/4 -z-10 object-contain opacity-15 radial-mask"
            />
            <h1
              className={
                "text-4xl md:text-[3rem] font-extrabold leading-[1] tracking-[-0.075em] !max-w-[18ch] bg-clip-text bg-gradient-to-bl from-zinc-700 to-blue-950 text-transparent"
              }
            >
              Build Portfolio website in minutes
            </h1>
            <p className="big-body max-w-[32ch]">
              Mollo lets you Build and Deploy Personalized Portfolio websites in
              short minutes
            </p>
            <Link href={"#contact"} className="w-fit">
              <Button size={"lg"} className="rounded-full text-base h-14 px-6!">
                <span>Start Building</span>
                <ArrowRight className="size-5 ml-2" />
              </Button>
            </Link>
          </div>
          {/* <Image
            src={"/screen.png"}
            alt="telegram"
            width={800}
            height={800}
            className="shadow-xl hidden md:block w-full max-w-4xl mx-auto border"
          />
          <Image
            src={"/mobile-screen.png"}
            alt="telegram"
            width={800}
            height={800}
            className="shadow-xl md:hidden w-full max-w-80 mx-auto border"
          /> */}
        </section>
      </section>
    </>
  );
};
export default Hero;
