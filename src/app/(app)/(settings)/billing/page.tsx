"use client";

import { pricing_plans } from "@/data";
import { fontTheme } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { useBilling } from "@/modules/auth/hooks";
import Pricing from "@/modules/landing/components/Pricing";
import { format } from "date-fns";
import { Check } from "lucide-react";
import Link from "next/link";
import { BsExclamationTriangle } from "react-icons/bs";

const Page = () => {
  const { plan, isUserActive, user, isSubscriptionExpired } = useBilling();

  return (
    <>
      <div className="wrapper flex items-center justify-between py-10 gap-2">
        <h1 className={cn("h3", fontTheme.className)}>Plans & Billing</h1>

        <Link
          href={"#cards"}
          className="brightness-90 text-xl bg-gradient-to-br text-transparent bg-clip-text tracking-tight hover:opacity-100 opacity-90 active:scale-105 duration-200 transition-all from-blue-500/75 to-blue-700"
        >
          Upgrade plan
        </Link>
      </div>
      <div className="wrapper flex flex-col pb-12 gap-12">
        <div className="flex flex-col border-y divide-y">
          <div className="flex flex-col gap-6 py-8 px-6">
            <p className="h5 opacity-65">Plan details</p>
            <div className="flex items-center gap-12">
              <div className="flex flex-col gap-1">
                <p className="text-lg opacity-60">Your plan</p>
                <h2 className="h4">
                  {plan == "free"
                    ? "No Plan"
                    : plan == "premium"
                    ? "Premium Plan"
                    : "Pro Plan"}
                </h2>
              </div>
              {plan !== "free" && (
                <>
                  <div className="flex flex-col gap-1">
                    <p className="text-lg opacity-60">Price</p>
                    <p>
                      <span className="h5">
                        {plan == "pro"
                          ? user?.subscription_end_date
                            ? pricing_plans[0].price.year
                            : pricing_plans[0].price.onetime
                          : user?.subscription_end_date
                          ? pricing_plans[1].price.year
                          : pricing_plans[1].price.onetime}
                      </span>
                      <span className="opacity-75 ml-1 text-xl tracking-tight">
                        birr
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-lg opacity-60">Payment renewal</p>
                    <p className="h5">
                      {user?.subscription_end_date ? "Yearly" : "Onetime"}
                    </p>
                  </div>

                  {user?.subscription_end_date && (
                    <div className="flex flex-col gap-1">
                      <p className="text-lg opacity-60">
                        Subscription End Date
                      </p>
                      <p className="h5">
                        {format(
                          user?.subscription_end_date || new Date(),
                          "dd MMM yyyy"
                        )}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center py-8 px-6 gap-12">
            <div className="flex flex-col gap-2">
              <p className="text-lg opacity-60">User status</p>
              <div
                className={cn(
                  "px-2 py-0.5 bg-gradient-to-br font-medium w-fit rounded-lg flex items-center gap-1.5",
                  isUserActive
                    ? "from-emerald-600/10 to-emerald-900/25 text-emerald-900/80"
                    : "from-red-600/10 to-red-900/25 text-red-900/80"
                )}
              >
                {isUserActive ? (
                  <>
                    <Check className="size-4" /> Active
                  </>
                ) : (
                  <>
                    <BsExclamationTriangle className="size-4" /> Not Active
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-lg opacity-60">Subscription status</p>
              <div
                className={cn(
                  "px-2 py-0.5 bg-gradient-to-br font-medium w-fit rounded-lg flex items-center gap-1.5",
                  isSubscriptionExpired
                    ? " from-yellow-600/10 to-yellow-900/25 text-yellow-900/80"
                    : plan == "free"
                    ? "from-red-600/10 to-red-900/25 text-red-900/80"
                    : "from-emerald-600/10 to-emerald-900/25 text-emerald-900/80"
                )}
              >
                {isSubscriptionExpired ? (
                  <>
                    <BsExclamationTriangle className="size-4" /> Subscription
                    has expired
                  </>
                ) : plan == "free" ? (
                  <>
                    <BsExclamationTriangle className="size-4" /> No subscription
                  </>
                ) : (
                  <>
                    <Check className="size-4" /> Subscription active
                  </>
                )}
              </div>
            </div>
          </div>

          {plan == "free" && (
            <>
              <p>
                Start by{" "}
                <span className="font-medium underline underline-offset-2">
                  purchasing
                </span>{" "}
                a plan to continue publishing you website.
              </p>
            </>
          )}
        </div>
        <Pricing billing activePlan={plan} />
      </div>
    </>
  );
};

export default Page;
