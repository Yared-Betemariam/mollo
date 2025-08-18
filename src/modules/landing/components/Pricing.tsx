"use client";

import { Button } from "@/components/ui/button";
import { IconUrls, pricing_plans } from "@/data";
import { cn } from "@/lib/utils";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

const Pricing = () => {
  return (
    <section
      id="pricing"
      className="wrapper flex flex-col items-center justify-center gap-20 py-28"
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="big-body">Pricing</p>
        <h2 className={"h2"}>Choose a Package that best fits your needs</h2>
      </div>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 w-full md:grid-cols-2 divide-x divide-y border max-w-[24rem] md:max-w-[32rem]">
          {pricing_plans.map((item, i) => (
            <div
              key={item.title}
              className={cn(
                "flex flex-col gap-1 flex-1 justify-center relative py-10",
                item.id == "premium"
                  ? "border-2 border-inset border-zinc-900"
                  : "",
                pricing_plans.length > i + 1 &&
                  pricing_plans[i + 1].id == "premium" &&
                  "pb-20 md:pb-10"
              )}
            >
              <span
                className={cn(
                  item.id == "premium" ? "" : "opacity-0",
                  "text-base tracking-tighter mb-2 absolute -top-8 left-4 h-8 flex items-center justify-center px-4 bg-primary rounded-t-xl text-white drop-shadow-lg drop-shadow-white"
                )}
              >
                Popular
              </span>
              <div className="flex relative flex-col px-8">
                <p className="h3 mb-3">{item.title}</p>
              </div>
              <div className="border-y bg-zinc-950/[0.025] px-8 py-4 my-2">
                <p className="text-3xl font-medium tracking-tighter">
                  <span className="text-2xl opacity-60">Br </span>
                  <span className="tracking-[-0.075em]">
                    {item.price.year}
                  </span>{" "}
                  <span className="opacity-50 text-lg font-medium">/year</span>
                </p>
                <span className="opacity-30 tracking-tighter text-base">
                  or
                </span>
                <p className="text-2xl font-medium tracking-tighter">
                  <span className="text-xl opacity-60">Br </span>
                  <span className="tracking-[-0.075em]">
                    {item.price.onetime}
                  </span>{" "}
                  <span className="opacity-50 text-base font-medium">
                    /year
                  </span>
                </p>
              </div>
              <div className="flex flex-col px-8">
                <ul className="py-2 space-y-1">
                  {(item.id == "pro"
                    ? [
                        "Upto 50 images",
                        "Upto 20 videos",
                        "Max 10mb image size",
                        "Max 100mb video size",
                      ]
                    : item.id == "premium"
                    ? [
                        "Unlimited images",
                        "Unlimited videos",
                        "Max 25mb image size",
                        "Max 300mb video size",
                      ]
                    : []
                  ).map((value) => (
                    <li
                      key={value}
                      className="flex opacity-70 items-center gap-2"
                    >
                      <Check className="size-3 opacity-80" />
                      {value}
                    </li>
                  ))}
                </ul>

                <Link href={"/payment"} className="w-full flex flex-col mt-2">
                  <Button
                    size="lg"
                    className="mt-2 flex items-center justify-between rounded-full"
                  >
                    Choose plan <ArrowRight className="size-4 opacity-80" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="flex mx-auto items-center justify-center flex-col gap-1">
          <p className="opacity-50">Secure payments with</p>
          <div className="flex items-center gap-2">
            <img
              width={40}
              height={40}
              alt="telebirr"
              src={IconUrls.telebirr}
            />
            <img width={40} height={40} alt="telebirr" src={IconUrls.cbe} />
            <img width={40} height={40} alt="amole" src={IconUrls.amole} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
