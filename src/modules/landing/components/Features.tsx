"use client";

import { cn } from "@/lib/utils";

const Features = () => {
  const miniCards = [
    {
      title: "For everyone",
      desc: "Mollo is for Graphics editors, Video editors",
    },
    {
      title: "Build in minutes",
      desc: "You will build your portfolio websites in minutes.",
    },
    {
      title: "1 Click publish",
      desc: "Publish you updates within a click of a button.",
    },
    {
      title: "Update anytime",
      desc: "Publish you updates within a click of a button.",
    },
  ];

  return (
    <section id="features" className="wrapper flex flex-col gap-12 py-28 ">
      <div className="grid grid-cols-1 w-full md:grid-cols-2 divide-x divide-y border">
        {miniCards.map((item) => (
          <div
            key={item.title}
            className={cn(
              "p-8 px-10 overflow-hidden flex flex-col gap-1 flex-1 justify-center relative"
            )}
          >
            <p className="h3 mr-2">{item.title}</p>
            <p className="big-body">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Features;
