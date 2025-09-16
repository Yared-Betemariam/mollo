import { trpc } from "@/trpc/client";
import { toast } from "sonner";

export const useUsers = () => {
  const { data, isLoading } = trpc.admin.users.useQuery();
  const utils = trpc.useUtils();

  const updateUserMutation = trpc.admin.updateUser.useMutation({
    onSuccess: () => {
      toast.success("User updated successfully!");
      utils.admin.users.invalidate();
    },
    onError: (error) => {
      console.error("Error updating user:", error);
      toast.error("Failed to update user. Please try again.");
    },
  });

  return {
    users: data?.data || [],
    isUsersLoading: isLoading,
    updateUser: updateUserMutation.mutate,
  };
};

export const usePages = () => {
  const { data, isLoading } = trpc.admin.pages.useQuery();
  const { users } = useUsers();
  const utils = trpc.useUtils();

  const updatePageMutation = trpc.pages.update.useMutation({
    onSuccess: () => {
      toast.success("User updated successfully!");
      utils.admin.pages.invalidate();
    },
    onError: (error) => {
      console.error("Error updating user:", error);
      toast.error("Failed to update user. Please try again.");
    },
  });

  return {
    pages: data?.data || [],
    users,
    isPagesLoading: isLoading,
    updatePage: updatePageMutation.mutate,
    invalidatePages: () => utils.admin.pages.invalidate(),
  };
};
