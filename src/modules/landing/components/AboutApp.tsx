import { cn } from "@/lib/utils";

import Features from "./Features";
import { fontTheme } from "@/lib/fonts";

const AboutApp = () => {
  return (
    <section
      id="features"
      className="py-20 bg-blue-950/[4%] flex flex-col gap-12"
    >
      <div className="wrapper flex items-center flex-col gap-6">
        <p className="body text-center">What is mollo?</p>
        <p
          className={cn("about text-white/35 text-center", fontTheme.className)}
        >
          Mollo lets{" "}
          <span className="text-white/5">
            Video Editors, Graphics Designers, Photographers . . .
          </span>{" "}
          <span className="text-blue-500/85 font-semibold">Build</span> and{" "}
          <span className="text-blue-500/85 font-semibold">Publish</span>{" "}
          portfolio websites in{" "}
          <span className="italic font-semibold text-white/5">minutes</span>
        </p>
      </div>
      <Features />
    </section>
  );
};
export default AboutApp;
