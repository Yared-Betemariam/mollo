import { cn, fontTheme } from "@/lib/utils";

import Features from "./Features";

const AboutApp = () => {
  return (
    <section
      id="features"
      className="py-20 bg-blue-800/[3%] flex flex-col gap-12"
    >
      <div className="wrapper flex items-center flex-col gap-6">
        <p className="big-body text-center">What is mollo?</p>
        <p className={cn("about text-center", fontTheme.className)}>
          Mollo lets Video Editors, Graphics Designers, Photographers . . . make
          portfolio simple websites and publish them in minutes
        </p>
      </div>
      <Features />
    </section>
  );
};
export default AboutApp;
