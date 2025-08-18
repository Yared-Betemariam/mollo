import { trpc } from "@/trpc/client";
import { Plan } from "@/types";
import { isPast } from "date-fns";
import { useSession } from "next-auth/react";

export const useUser = () => {
  const { data, status } = useSession();

  return {
    user: data?.user || null,
    isLoading: status == "loading",
  };
};

export const useUserData = () => {
  const { data, isLoading } = trpc.users.current.useQuery();

  return {
    isLoading,
    user: data?.data,
  };
};

export const useBilling = () => {
  const { user, isLoading } = useUserData();
  const isUserActive = (user?.status || "disabled") === "active";
  const isSubscriptionExpired = user?.subscription_end_date
    ? isPast(new Date(user?.subscription_end_date))
    : false;

  return {
    isLoading,
    user,
    plan: (user?.plan || "free") as Plan,
    isUserActive,
    isSubscriptionExpired,
  };
};
