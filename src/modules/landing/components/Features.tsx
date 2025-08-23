"use client";

import { cn } from "@/lib/utils";
import { Clock, Globe, Pencil, Pointer } from "lucide-react";

const Features = () => {
  const miniCards = [
    {
      Icon: Globe,
      title: "For everyone",
      desc: "Mollo is for Graphics editors, Video editors",
    },
    {
      Icon: Clock,
      title: "Build in minutes",
      desc: "You will build your portfolio websites in minutes.",
    },
    {
      Icon: Pointer,
      title: "1 Click publish",
      desc: "Publish you updates within a click of a button.",
    },
    {
      Icon: Pencil,
      title: "Update anytime",
      desc: "Publish you updates within a click of a button.",
    },
  ];

  return (
    <section className="wrapper flex flex-col gap-12">
      <div className="grid grid-cols-1 gap-4 w-fit mx-auto md:grid-cols-2">
        {miniCards.map((item) => (
          <div
            key={item.title}
            className={cn(
              "p-4 overflow-hidden gap-3 flex-1 flex flex-col bg-white rounded-2xl shadow-lg relative"
            )}
          >
            <div className="flex gap-3 items-center ">
              <span className=" rounded-full text-white bg-gradient-to-br from-blue-300 to-blue-800 p-2">
                <item.Icon className="size-6" />
              </span>
              <p className="h4 mr-2">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Features;
