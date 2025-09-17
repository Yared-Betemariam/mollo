import { Button } from "@/components/ui/button";
import { defaultLoginRedirect } from "@/routes";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { FaGoogle } from "react-icons/fa";

const Social = () => {
  const [isPending, startTransition] = useTransition();
  const params = useSearchParams();

  const handleClick = () => {
    startTransition(async () => {
      await signIn("google", {
        redirectTo: params.get("redirectto") || defaultLoginRedirect,
      });
    });
  };
  return (
    <Button
      disabled={isPending}
      size={"lg"}
      onClick={handleClick}
      className="space-x-4 rounded-xl w-full bg-gradient-to-br from-zinc-800 to-zinc-500"
    >
      {isPending ? (
        <Loader2 className="animate-spin size-5" size={24} />
      ) : (
        <FaGoogle size={24} className="brightness-200 size-5" />
      )}
      <span>Continue with Google</span>
    </Button>
  );
};
export default Social;
