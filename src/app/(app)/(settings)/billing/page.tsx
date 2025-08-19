"use client";

import { Button } from "@/components/ui/button";
import { pricing_plans } from "@/data";
import { cn } from "@/lib/utils";
import { useBilling } from "@/modules/auth/hooks";
import { format } from "date-fns";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { BsExclamationTriangle } from "react-icons/bs";

const Page = () => {
  const { plan, isUserActive, user, isSubscriptionExpired } = useBilling();

  return (
    <>
      <div className="border-b">
        <div className="wrapper flex flex-col py-6 gap-2">
          <h1 className="h3">Billing</h1>
          <p className="">Here is you billing and payment information</p>
        </div>
      </div>
      <div className="py-6">
        <div className="wrapper flex gap-8 flex-col">
          <div className="flex items-center gap-12">
            <div className="flex flex-col gap-1">
              <p className="opacity-75">Your plan</p>
              <h2 className="h4">
                {plan == "free"
                  ? "No Plan"
                  : plan == "premium"
                  ? "Premium Plan"
                  : "Pro Plan"}
              </h2>
            </div>
            <div className="flex flex-col gap-1">
              <p className="opacity-75">User status</p>
              <div
                className={cn(
                  "px-2 border py-0.5 font-medium w-fit rounded-md flex items-center gap-1.5",
                  isUserActive
                    ? "bg-emerald-700/20 text-emerald-900"
                    : "bg-red-700/20 text-red-900"
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
            <div className="flex flex-col gap-1">
              <p className="opacity-75">Subscription status</p>
              <div
                className={cn(
                  "px-2 border py-0.5 font-medium w-fit rounded-md flex items-center gap-1.5",
                  isSubscriptionExpired
                    ? " bg-yellow-700/20 text-yellow-900"
                    : plan == "free"
                    ? "bg-red-700/20 text-red-900"
                    : "bg-emerald-700/20 text-emerald-900"
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
          {plan !== "free" && (
            <>
              <p>Here is detailed information about your payment</p>
              <div className="flex items-center gap-12">
                <div className="flex flex-col gap-1">
                  <p className="opacity-75">Payment renewal</p>
                  <p className="h5">
                    {user?.subscription_end_date ? "Yearly" : "Onetime"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="opacity-75">Price</p>
                  <p>
                    <span className="opacity-75 text-lg font-semibold tracking-tight">
                      Br
                    </span>
                    <span className="h5">
                      {plan == "pro"
                        ? user?.subscription_end_date
                          ? pricing_plans[0].price.year
                          : pricing_plans[0].price.onetime
                        : user?.subscription_end_date
                        ? pricing_plans[1].price.year
                        : pricing_plans[1].price.onetime}
                    </span>
                  </p>
                </div>
                {user?.subscription_end_date && (
                  <div className="flex flex-col gap-1">
                    <p className="opacity-75">Subscription End Date</p>
                    <p className="h5">
                      {format(
                        user?.subscription_end_date || new Date(),
                        "dd MMM yyyy"
                      )}
                    </p>
                  </div>
                )}
              </div>{" "}
            </>
          )}

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
          <div className="flex items-center gap-12">
            <Link href={"/payment"} className="w-fit">
              <Button size={"sm"}>
                Upgrade <ArrowRight className="size-4 inline" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
