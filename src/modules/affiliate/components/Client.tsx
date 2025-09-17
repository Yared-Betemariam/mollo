"use client";

import { Button } from "@/components/ui/button";
import { AFFILIATE_FEE } from "@/data";
import { fontTheme } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { useUserAffiliate } from "@/modules/affiliate/hooks";
import { AffiliateData } from "@/types";
import {
  Check,
  Coins,
  Globe,
  Loader2,
  LucideIcon,
  User,
  UserCheck,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { toast } from "sonner";

type Props = {
  affiliate?: AffiliateData;
};

const ClientPage = ({ affiliate }: Props) => {
  const { isRegistering, mutateRegistration } = useUserAffiliate();
  const link_url = useMemo(() => {
    return `${process.env.NEXT_PUBLIC_BASE_URL}?ref=${affiliate?.id}`;
  }, [affiliate]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link_url);
      toast.success("URL copied to clipboard");
    } catch {
      toast.error("Could not copy URL to clipboard");
    }
  };

  const data = [
    {
      id: 1,
      text: "The user must purchase one of the Pricing plans.",
    },
    {
      id: 2,
      text: `You will get ${AFFILIATE_FEE * 100}% of every purchase`,
    },
    {
      id: 3,
      text: `You can only payouts every Saturday, minimum of 100 birr`,
    },
  ];

  if (!affiliate) {
    return (
      <div className="mx-auto px-10 my-auto flex items-center justify-center flex-col gap-6">
        <p className="text">Earn by referring mollo to others!</p>
        <Globe className="size-14 text-primary/75 rounded-full p-2 bg-gradient-to-b from-zinc-200" />
        <h1 className={cn("h3 font-semibold", fontTheme.className)}>
          Mollo Affiliate <span className="text-zinc-400">Rules</span>
        </h1>
        <ul className="flex flex-col gap-2">
          {data.map((item) => (
            <li key={item.id} className="flex gap-2 items-center">
              <Check className="size-6 p-1 border border-border/90 rounded-full bg-zinc-100" />{" "}
              <p className="text-lg">{item.text}</p>
            </li>
          ))}
        </ul>
        <Button
          size={"xl"}
          disabled={isRegistering || !!affiliate}
          onClick={() => mutateRegistration()}
          className="rounded-full hover:opacity-90 duration-300 transition-all text-white bg-gradient-to-br from-blue-400 border border-black/25 to-blue-700 shadow-md shadow-blue-800/15"
        >
          {isRegistering && <Loader2 className="size-4 animate-spin" />}
          Register for Affiliate
        </Button>
      </div>
    );
  }

  const Card = ({
    value,
    label,
    icon: Icon,
  }: {
    value: string;
    label: string;
    icon?: LucideIcon;
  }) => {
    return (
      <div className="p-4 flex flex-col gap-1">
        <div className="flex gap-2 items-center justify-between">
          <p className="text-base opacity-75">{label}</p>
          {Icon && <Icon className="size-5 text-sky-800 " />}
        </div>
        <h2 className="h4 font-semibold">{value}</h2>{" "}
      </div>
    );
  };

  return (
    <div className="mx-auto px-10 my-auto flex items-center justify-center flex-col gap-6">
      <h1 className={cn("h3 font-semibold", fontTheme.className)}>
        Your Affiliates <span className="text-zinc-400">Stats</span>
      </h1>
      <div className="border gap-5 rounded-full flex items-center p-2 bg-gradient-to-tr from-zinc-900/5 to-blue-950/10">
        <div className="text-lg opacity-65 pl-4">{link_url}</div>
        <Button
          size={"lg"}
          variant={"secondary"}
          onClick={() => handleCopy()}
          className="rounded-full text-base! bg-white text-primary"
        >
          Copy
        </Button>
      </div>
      <div className="divide-x grid grid-cols-2 border w-full">
        <div className="divide-y flex flex-col">
          <Card
            value={affiliate.signups.toLocaleString()}
            icon={User}
            label="Signups"
          />
          <Card
            value={affiliate.conversions.toLocaleString()}
            icon={UserCheck}
            label="Converstions"
          />
        </div>
        <div className="divide-y flex flex-col">
          <Card
            value={`${affiliate.remainingPayouts.toLocaleString()} birr`}
            label="Remaining payout"
            icon={Wallet}
          />
          <Card
            value={`${affiliate.withdrawnPayouts.toLocaleString()} birr`}
            label="Withdrawn"
            icon={Coins}
          />
        </div>
      </div>
      <Link href="/help" className="-mt-2">
        <Button
          size={"lg"}
          className={cn(
            "bg-gradient-to-tr from-blue-700 h-9 to-blue-500 rounded-xl drop-shadow-[4px_4px] drop-shadow-sky-700/25"
          )}
        >
          Request Payout
        </Button>
      </Link>
      <span className="border-b w-full" />
      <ul className="flex flex-col gap-2">
        {data.map((item) => (
          <li key={item.id} className="flex gap-2 items-center">
            <Check className="size-6 p-1 border border-border/90 rounded-full bg-zinc-100" />{" "}
            <p className="text-lg">{item.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientPage;
