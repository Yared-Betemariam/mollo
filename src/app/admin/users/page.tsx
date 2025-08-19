"use client";

import DataTable from "@/components/custom/data-table";
import { useUsers } from "../hooks";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Plan } from "@/types";
import { useModalStore } from "@/modules/modals/store";
import { PencilIcon } from "lucide-react";

const Page = () => {
  const { users, isUsersLoading, updateUser } = useUsers();

  return (
    <>
      <div className="flex flex-col border-b pt-2 pb-6 gap-1 px-5">
        <h1 className="h3">Users</h1>
        <p>All mollo users and their subscription information.</p>
      </div>
      <DataTable
        columns={[
          { name: "Email", key: "email", isBold: true },
          {
            name: "Status",
            key: "status",
            render: (value) => (
              <Badge
                className={`badge ${
                  value === "active" ? "bg-green-800" : "bg-red-800"
                }`}
              >
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </Badge>
            ),
          },
          {
            name: "Plan",
            key: "plan",
            render: (value) => (
              <Badge
                className={cn({
                  "bg-blue-800": value === "pro",
                  "bg-yellow-800": value === "premium",
                  "bg-gray-800": value === "free",
                })}
              >
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </Badge>
            ),
          },
          {
            name: "Created At",
            key: "created_at",
            isDate: true,
          },
          {
            name: "Subscription end date",
            key: "subscription_end_date",
            isDate: true,
          },
        ]}
        isLoading={isUsersLoading}
        data={users}
        actions={[
          {
            label: "Toggle Status",
            onClick: (row) => {
              updateUser({
                id: row.id as number,
                status: row.status === "active" ? "disabled" : "active",
                plan: row["plan"] as Plan,
                subscription_end_date:
                  (row.subscription_end_date as Date | null) || null,
              });
            },
          },
          {
            label: "Update",
            Icon: PencilIcon,
            onClick: (row) => {
              useModalStore.getState().openModal({
                open: "user",
                data: row,
              });
            },
          },
        ]}
      />
    </>
  );
};

export default Page;
