import { Button } from "@/components/ui/button";
import { defaultLoginRedirect } from "@/routes";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useTransition } from "react";
import { FaGoogle } from "react-icons/fa";

const Social = () => {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await signIn("google", { redirectTo: defaultLoginRedirect });
    });
  };
  return (
    <Button
      disabled={isPending}
      onClick={handleClick}
      size={"xl"}
      className="space-x-4 rounded-xl w-full"
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
