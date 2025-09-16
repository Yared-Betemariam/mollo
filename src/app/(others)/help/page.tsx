import Logo from "@/components/Logo";
import { mollo_telegram_username } from "@/data";
import { fontTheme } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { BsTelegram } from "react-icons/bs";

const page = () => {
  return (
    <>
      <div className="bg-gradient-to-t from-blue-900/[4%] via-transparent to-primary/[4%] -z-10 rounded-full absolute h-[100vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64" />
      <section className="mx-auto flex flex-col items-center justify-center my-auto max-w-md gap-12">
        <Logo />
        <h1 className={cn("h2", fontTheme.className)}>Help?</h1>
        <p className="text text-center text-muted-foreground">
          Contact us if you have any{" "}
          <span className="text-blue-900 underline">questions</span>,{" "}
          <span className="text-blue-900 underline">problems</span> with the app
          or have <span className="text-blue-900 underline">feedback</span> to
          give to us. We will be pleasured to help you with anything!
        </p>
        <div className="flex flex-col items-center justify-center gap-1 brightness-90">
          <div className="border px-1 rounded-full bg-gradient-to-b flex items-center from-zinc-400/25 gap-1 text-blue-500 text-lg opacity-75">
            <BsTelegram className="size-5 inline" /> Telegram
          </div>
          <Link
            href={`https://t.me/${mollo_telegram_username.slice(1)}`}
            target="_blank"
            className="h4 hover:opacity-100 opacity-75 active:scale-105 duration-200 transition-all from-blue-500/75 to-blue-700"
          >
            {mollo_telegram_username}
          </Link>
        </div>
      </section>
    </>
  );
};
export default page;
