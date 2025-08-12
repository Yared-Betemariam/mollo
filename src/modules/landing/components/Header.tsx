"use client";

import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import MenuSheet from "./MenuSheet";

export const navLinks = [
  {
    name: "Features",
    href: "#features",
  },
  {
    name: "Pricing",
    href: "#pricing",
  },
  {
    name: "Contact",
    href: "#",
  },
];

const Header = () => {
  return (
    <header className="absolute z-50 top-0 w-full h-[5rem]">
      <nav className="wrapper flex items-center h-full gap-12">
        <Logo />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-8">
            {navLinks.map((item) => (
              <Link
                href={item.href}
                key={item.name}
                className={cn(
                  "opacity-80 font-normal transition-all hidden md:block duration-300 cursor-pointer"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center ml-auto gap-6">
          <div className="relative ml-auto md:hidden h-10 w-10 rounded-xl">
            <MenuSheet />
          </div>

          <Link href="/signin">
            <Button size={"lg"} className="text-base!">
              Signin
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
};
export default Header;
