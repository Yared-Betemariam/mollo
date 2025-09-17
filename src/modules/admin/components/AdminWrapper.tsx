"use client";

import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";
import UserButton from "@/modules/auth/components/UserButton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsPeople } from "react-icons/bs";
import { FaCoins } from "react-icons/fa";
import { MdOutlineContentPaste } from "react-icons/md";

type Props = {
  children: React.ReactNode;
};

const AdminWrapper = ({ children }: Props) => {
  const pathname = usePathname();

  const links = [
    { name: "Users", Icon: BsPeople, href: "/admin/users" },
    { name: "Pages", Icon: MdOutlineContentPaste, href: "/admin/pages" },
    { name: "Affiliates", Icon: FaCoins, href: "/admin/affiliates" },
  ];

  return (
    <div className="flex max-w-4xl mx-auto w-full border-x flex-1 h-full flex-col">
      <div className="flex items-center justify-between h-20 px-6 border-b">
        <div className="flex items-center gap-4">
          <Logo logo />
          <span className="text-sm rounded-xl font-medium text-emerald-800 px-2 py-0.5 bg-gradient-to-br from-emerald-900/5 to-emerald-900/10">
            Admin
          </span>
        </div>
        <UserButton simple />
      </div>
      <main className="flex-1 flex flex-col">{children}</main>
      <div className="grid grid-cols-3 h-[4.5rem] border-t bg-gray-100">
        {links.map((link) => (
          <Link
            href={link.href}
            className={cn(
              "flex flex-col h-full w-full items-center justify-center gap-0.5",
              pathname == link.href
                ? "text-blue-600 bg-white shadow-sm"
                : "text-gray-700 hover:text-blue-600"
            )}
            key={link.name}
          >
            <link.Icon className="size-6 fill-current" />
            <span className="text-sm">{link.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminWrapper;
