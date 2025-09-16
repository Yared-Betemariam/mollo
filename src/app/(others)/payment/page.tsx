"use client";

import Logo from "@/components/Logo";
import { IconUrls, mollo_telegram_username, pricing_plans } from "@/data";
import { fontTheme } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useMemo } from "react";

const Page = () => {
  const searchParams = useSearchParams();
  const info = useMemo(() => {
    const plan =
      pricing_plans.find((item) => item.id == searchParams.get("plan")) ||
      pricing_plans[0];
    return {
      title: plan.title,
      payments: [
        {
          price: plan.price.year,
          span: "For a year",
        },
        {
          price: plan.price.onetime,
          span: "Forever",
        },
      ],
    };
  }, [searchParams]);

  const step = (id: string, title: string) => (
    <div className="flex items-center gap-3">
      <span className="size-7 grid place-content-center text-base font-semibold rounded-full bg-gradient-to-br from-zinc-50/75 to-zinc-300 text-blue-800/80 group-hover/step:text-white group-hover/step:drop-shadow-md group-hover/step:from-blue-500/75 group-hover/step:to-blue-800 duration-300">
        {id}
      </span>
      <p className="text-xl tracking-tight font-medium">{title}</p>
    </div>
  );

  const paymentMethods = [
    {
      url: IconUrls.telebirr,
      title: "Telebirr",
      value: "09092109210",
    },
    {
      url: IconUrls.cbe,
      title: "CBE",
      value: "1000912819289",
    },
  ];

  return (
    <section className="flex items-center justify-center flex-col gap-8 mx-auto my-auto w-full max-w-md">
      <Logo />
      <div className="flex items-center justify-center flex-col gap-8">
        <h1 className={cn("h3", fontTheme.className)}>Payment</h1>
        <Step>
          {step("1", "Make payment")}
          <div className="grid grid-cols-2 gap-12">
            {info.payments.map((item) => {
              return (
                <div key={item.price}>
                  <p className="text-2xl font-medium tracking-tight">
                    {item.price}{" "}
                    <span className="opacity-80 tracking-normal font-normal text-lg">
                      birr
                    </span>
                  </p>
                  <span>{item.span}</span>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-6">
            {paymentMethods.map((item) => (
              <div
                key={item.title}
                className="border rounded-xl shadow-lg shadow-zinc-200/50 p-3 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-1">
                  <img width={24} height={24} alt={item.title} src={item.url} />
                  <p>{item.title}</p>
                </div>
                <p className="h5">{item.value}</p>
              </div>
            ))}
          </div>
        </Step>
        <Step>
          {step("2", "Send screenshot")}
          <span className="text-muted-foreground -mb-4">Telegram account</span>
          <Link
            href={`https://t.me/${mollo_telegram_username.slice(1)}`}
            target="_blank"
            className="text-xl font-medium tracking-tight text-blue-800"
          >
            {mollo_telegram_username}
          </Link>
        </Step>
      </div>
      <p className="text-muted-foreground max-w-[28ch] text-center">
        Your payment will be verified within 24hrs, until then try out the{" "}
        <Link
          href={"/editor"}
          className="underline text-lg text-blue-800/75 underline-offset-2"
        >
          Editor
        </Link>
      </p>
    </section>
  );
};

const Step = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-center group/step flex-col gap-5 border- pb-4">
      {children}
    </div>
  );
};

export default Page;
