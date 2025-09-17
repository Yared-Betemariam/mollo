import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useUserAffiliate = () => {
  const router = useRouter();

  const registerMutation = trpc.affiliate.register.useMutation({
    onSuccess: () => {
      toast.success("Registration completed!");

      router.refresh();
    },
    onError: (error) => {
      console.log(error);
      toast.error("Registration failed!");
    },
  });

  return {
    mutateRegistration: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
  };
};
