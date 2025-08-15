import { cn } from "@/lib/utils";
import Image from "next/image";

import templateImage1 from "@/assets/images/templates/1.png";

const AboutApp = () => {
  const templates = [
    templateImage1,
    templateImage1,
    templateImage1,
    templateImage1,
  ];

  return (
    <section className="py-28 bg-blue-700/5">
      <div className="wrapper flex flex-col gap-2">
        <h2 className="big-body">The Power of Mollo</h2>
        <p className="h2">
          Mollo lets Video Editors, Graphics Designers, Photographers . . . make
          portfolio simple websites and publish them in minutes
        </p>

        <div className="flex mx-auto -space-x-20 mt-10">
          {templates.map((item, i) => (
            <div key={i} className={cn("w-fit h-fit", i % 2 === 0 && "mt-12")}>
              <Image
                src={item}
                width={700}
                height={700}
                alt="template 1"
                className={cn(
                  "border max-w-[16rem] w-full h-auto inline-block border-zinc-900/20 rounded-xl shadow-xl"
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default AboutApp;
