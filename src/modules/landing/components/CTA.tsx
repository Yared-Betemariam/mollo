import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

/* eslint-disable react/no-unescaped-entities */
const CTA = () => {
  return (
    <section className="relative overflow-hidden bg-neutral-900 text-white">
      <img
        width={500}
        height={500}
        alt="pattern"
        src="/cta-pattern.png"
        className="absolute outbound-radiant-mask inset-y-0 -left-6 -right-6 min-w-[110vw] h-full object-cover opacity-40"
      />
      <section
        id="cta"
        className="wrapper pt-28 pb-44 md:pb-36 flex flex-col items-cente justify-cente gap-10 relative overflow-y-hidden"
      >
        <div className="flex flex-col items-center justify-center gap-5 text-center">
          <h2 className={"h2 from-zinc-100 to-gray-500"}>
            Ready to have a portfolio?
          </h2>
          <p className="big-body">
            Start with the Pro plan to have your Portfolio website.
          </p>
          <Link href={"/signin"} className="w-fit">
            <Button
              size={"xl"}
              variant={"secondary"}
              className="cursor-pointer shadow-lg  px-6! text-lg flex items-center justify-between h-14 rounded-full"
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
