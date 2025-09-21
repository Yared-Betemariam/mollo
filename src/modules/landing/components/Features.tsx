"use client";

import { cn } from "@/lib/utils";
import { Coins, ImageIcon, RectangleCircle, VideoIcon } from "lucide-react";

const Features = () => {
  const miniCards = [
    {
      Icon: Coins,
      title: "Affordable pricing",
    },
    {
      Icon: ImageIcon,
      title: "Image galleries",
    },
    {
      Icon: VideoIcon,
      title: "Video uploads",
    },
    {
      Icon: RectangleCircle,
      title: "Website sections",
    },
  ];

  return (
    <section className="wrapper flex flex-col gap-12">
      <div className="grid grid-cols-1 gap-4 w-fit mx-auto md:grid-cols-2">
        {miniCards.map((item) => (
          <div
            key={item.title}
            className={cn(
              "p-2 md:p-4 overflow-hidden gap-3 flex-1 flex flex-col bg-white rounded-2xl shadow-lg shadow-black/10 relative"
            )}
          >
            <div className="flex gap-3 items-center ">
              <span className=" rounded-full text-white bg-gradient-to-br from-blue-300 to-blue-800 p-1 md:p-3">
                <item.Icon className="size-5 md:size-6" />
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
