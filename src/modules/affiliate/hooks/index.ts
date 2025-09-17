import { trpc } from "@/trpc/client";
import { AffiliateData } from "@/types";
import { toast } from "sonner";

export const useUserAffiliate = () => {
  const data = trpc.affiliate.user.useSuspenseQuery(undefined);
  const utils = trpc.useUtils();

  const registerMutation = trpc.affiliate.register.useMutation({
    onSuccess: (raw_data) => {
      toast.success("Registration completed!");

      utils.affiliate.user.setData(undefined, (old) => {
        if (!old) return old;

        return {
          success: true,
          data: {
            id: raw_data.data.id,
            signups: 0,
            conversions: 0,
            withdrawnPayouts: 0,
            remainingPayouts: 0,
          } as AffiliateData,
        };
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error("Registration failed!");
    },
  });

  return {
    affiliate: data[0].data,
    mutateRegistration: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
  };
};
