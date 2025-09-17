"use client";

import DataTable from "@/components/custom/data-table";
import { fontTheme } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { useAffiliates } from "../../../modules/admin/hooks";
import { useMemo } from "react";

const Page = () => {
  const {
    affiliates: raw_affiliates,
    users,
    isAffiliatesLoading,
    payout,
  } = useAffiliates();

  const affiliates = useMemo(
    () =>
      raw_affiliates.map((item) => ({
        ...item,
        converstions: Number(item.converstions),
        payouts: Number(item.payouts),
        remaining_payout: Number(item.total_payouts) - Number(item.payouts),
        signups: users.filter((u) => u.rId == item.id).length,
      })),
    [raw_affiliates]
  );

  return (
    <>
      <div className="flex flex-col border-b pt-2 pb-6 gap-1 px-5">
        <h1 className={cn("h3 py-2 font-semibold", fontTheme.className)}>
          Affiliates
        </h1>
        <p>Here is the list of all the mollo affiliates program users</p>
      </div>
      <DataTable
        columns={[
          {
            name: "ID",
            key: "id",
            isBold: true,
          },
          {
            name: "User",
            key: "user_id",
            render: (value) => {
              const user = users.find((user) => user.id === value);
              return user ? user.email : "Unknown User";
            },
          },
          {
            name: "Signups",
            key: "signups",
          },
          {
            name: "Conv.",
            key: "converstions",
          },
          {
            name: "Remaining P.",
            key: "remaining_payout",
            isBirr: true,
          },
          {
            name: "Withdrawn P.",
            key: "payouts",
            isBirr: true,
          },
        ]}
        isLoading={isAffiliatesLoading}
        data={affiliates}
        actions={[
          {
            label: "Payout",
            onClick: (row) => {
              payout(Number(row.total_payouts), Number(row.payouts));
            },
          },
        ]}
      />
    </>
  );
};

export default Page;
