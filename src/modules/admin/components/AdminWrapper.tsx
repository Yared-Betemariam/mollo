"use client";

import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsPeople } from "react-icons/bs";
import { MdOutlineContentPaste } from "react-icons/md";

type Props = {
  children: React.ReactNode;
};

const AdminWrapper = ({ children }: Props) => {
  const pathname = usePathname();

  const links = [
    { name: "Users", Icon: BsPeople, href: "/admin/users" },
    { name: "Pages", Icon: MdOutlineContentPaste, href: "/admin/pages" },
  ];

  return (
    <div className="flex flex-1 h-full flex-col">
      <div className="flex items-center justify-between h-16 px-5">
        <Logo logo />
      </div>
      <main className="flex-1 flex flex-col">{children}</main>
      <div className="grid grid-cols-2 h-16 border-t bg-gray-100">
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
