import Logo from "@/components/Logo";
import { defaultLoginRedirect } from "@/routes";
import Link from "next/link";

const Page = () => {
  return (
    <main className="flex-1 flex flex-col items-center justify-center">
      <div className="flex flex-col gap-8 max-w-md">
        <Logo className="mb-4" />
        <h1 className="h2">404: Page not found!</h1>
        <p>
          The page you are looking for doesn&apos;t exist. Please make sure you
          are on the right page.
        </p>

        <Link href={defaultLoginRedirect} className="underline text-blue-800">
          Back to home
        </Link>
      </div>
    </main>
  );
};
export default Page;
