"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconUrls, pricing_plans } from "@/data";
import { fontTheme } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Plan } from "@/types";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

const Pricing = ({
  billing,
  activePlan,
}: {
  billing?: boolean;
  activePlan?: Plan;
}) => {
  const Cards = (
    <div
      id="cards"
      className="grid grid-cols-1 w-full md:w-auto sm:mx-auto sm:grid-cols-2 gap-8 md:grid-cols-3"
    >
      {pricing_plans.map((item) => (
        <div
          key={item.title}
          className={cn(
            "flex flex-col gap-1 md:max-w-[17rem] flex-1 justify-center border border-black/20  rounded-xl relative pt-10",
            activePlan == item.id && "opacity-50",
            item,
            {
              "border-2 scale-105 border-inset shadow-xl shadow-blue-900/25 border-blue-900/25":
                item.isPopular,
              "border-2 border-inset shadow-xl shadow-amber-900/25 border-amber-900/25":
                item.isRecommended,
            }
          )}
        >
          <div className="flex relative flex-col px-8 gap-4 text-center">
            <Badge
              className={cn(
                item.isPopular || item.isRecommended ? "" : "opacity-0",
                "mx-auto text-sm bg-gradient-to-b  rounded-full border-none drop-shadow-md h-6 px-3",
                {
                  "from-blue-500 to-blue-700": item.isPopular,
                  "from-amber-500 to-amber-700": item.isRecommended,
                }
              )}
            >
              {item.isPopular ? "Popular" : "Recommended"}
            </Badge>
            <p className={cn("h3 mb-3", fontTheme.className)}>{item.title}</p>
          </div>
          <ul className="px-8 py-4 space-y-1 bg-zinc-900/[2.5%] border-y">
            {[
              `${item.limits.maxImages} images`,
              `${item.limits.maxVideos} videos`,
              `Max ${item.limits.maxImageSize}mb image`,
              `Max ${item.limits.maxVideoSize}mb video`,
            ].map((value) => (
              <li
                key={value}
                className="flex opacity-80 items-center gap-2 text-lg"
              >
                <Check className="size-4 opacity-75 text-emerald-900" />
                {value}
              </li>
            ))}
          </ul>
          <div className=" px-8 py-6 my-2 flex flex-col gap-4 items-center">
            <div className="flex items-center sm:flex-col gap-2">
              <p className="flex flex-col gap-2 sm:gap-0 items-center">
                <span className="h4">{item.price.year} birr</span>
                <span className="opacity-50 font-light text-lg -mt-1">
                  per year
                </span>
              </p>
              <span className=" mx-auto opacity-50 text-xl my-2">or</span>
              <p className="flex flex-col items-center">
                <span className="h4">{item.price.onetime} birr</span>
                <span className="opacity-50 font-light text-lg -mt-1">
                  only once
                </span>
              </p>
            </div>
            <Link href={`/payment?plan=${item.id}`} className="mt-2">
              <Button
                size="xl"
                disabled={activePlan === item.id}
                className={cn(
                  "flex items-center rounded-full bg-gradient-to-tr from-primary to-zinc-500 hover:from-blue-800 hover:to-blue-500 duration-300! transition-all!"
                )}
              >
                {activePlan === item.id ? (
                  "Current plan"
                ) : (
                  <>
                    Choose plan <ArrowRight className="size-4 opacity-80" />
                  </>
                )}
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
  return billing ? (
    Cards
  ) : (
    <section
      id="pricing"
      className="wrapper flex flex-col items-center justify-center gap-10 py-20"
    >
      <h2 className={cn("h2", fontTheme.className)}>Pricing</h2>
      <div className="flex flex-col w-full gap-6">
        {Cards}
        <div className="flex items-center gap-4 mt-4 mx-auto">
          <img width={64} height={64} alt="telebirr" src={IconUrls.telebirr} />
          <img width={64} height={64} alt="cbe" src={IconUrls.cbe} />
        </div>
      </div>
    </section>
  );
};

export default Pricing;
