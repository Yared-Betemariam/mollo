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
      className="grid grid-cols-1 mx-auto sm:grid-cols-2 gap-6 md:grid-cols-3"
    >
      {pricing_plans.map((item) => (
        <div
          key={item.title}
          className={cn(
            "flex flex-col gap-1 flex-1 justify-center border rounded-xl relative pt-10 pb-6",
            item.isPopular
              ? "border border-inset shadow-xl shadow-blue-950/25 border-blue-900"
              : "",
            activePlan == item.id && "opacity-50"
          )}
        >
          <div className="flex relative flex-col px-8 gap-4 text-center">
            <Badge
              className={cn(
                item.isPopular ? "" : "opacity-0",
                "mx-auto text-sm bg-gradient-to-b from-blue-500 to-blue-700 rounded-full border-none drop-shadow-md h-6 px-3"
              )}
            >
              Popular
            </Badge>
            <p className={cn("h3 mb-3", fontTheme.className)}>{item.title}</p>
          </div>
          <div className="bg-blue-900/5 px-8 py-6 my-2 flex items-center flex-col gap-2">
            <p className="flex flex-col items-center">
              <span className="h4">{item.price.year} birr</span>
              <span className="opacity-50">per year</span>
            </p>
            <span className=" mx-auto opacity-75 text-lg">or</span>
            <p className="flex flex-col items-center">
              <span className="h4">{item.price.onetime} birr</span>
              <span className="opacity-50">only once</span>
            </p>
            <Link href={`/payment?plan=${item.id}`}>
              <Button
                size="xl"
                disabled={activePlan === item.id}
                className={cn(
                  "flex items-center rounded-full bg-gradient-to-br from-primary to-zinc-600 hover:from-blue-800 hover:to-blue-500 duration-300! transition-all!"
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
          <ul className="px-8 py-2 space-y-1">
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
                <Check className="size-4 opacity-50 text-emerald-800" />
                {value}
              </li>
            ))}
          </ul>
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
      <div className="flex flex-col gap-6">
        {Cards}
        <div className="flex items-center gap-2 mx-auto">
          <img width={64} height={64} alt="telebirr" src={IconUrls.telebirr} />
          <img width={64} height={64} alt="telebirr" src={IconUrls.cbe} />
        </div>
      </div>
    </section>
  );
};

export default Pricing;
