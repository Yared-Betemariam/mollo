"use client";

import { cn } from "@/lib/utils";

interface InfiniteImageScrollProps {
  images?: string[];
  speed?: "slow" | "normal" | "fast";
  direction?: "up" | "down";
  className?: string;
}

export function InfiniteImageScroll({
  images = [],
  speed = "normal",
  direction = "up",
  className,
}: InfiniteImageScrollProps) {
  const speedClasses = {
    slow: "animate-scroll-slow",
    normal: "animate-scroll-normal",
    fast: "animate-scroll-fast",
  };

  const directionClass = direction === "down" ? "animate-reverse" : "";

  return (
    <div
      className={cn(
        "relative h-[36rem] w-56 sm:64 md:w-80 overflow-hidden rounded-xl drop-shadow-md mask-",
        className
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-4",
          speedClasses[speed],
          directionClass
        )}
      >
        {images.map((src, index) => (
          <div
            key={`first-${index}`}
            className="flex-shrink-0 h-max w-full rounded-md overflow-hidden shadow-lg border"
          >
            <img
              src={src || "/placeholder.svg"}
              alt={`Scrolling image ${index + 1}`}
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
        {images.map((src, index) => (
          <div
            key={`second-${index}`}
            className="flex-shrink-0 w-full h-72 rounded-md overflow-hidden shadow-lg border"
          >
            <img
              src={src || "/placeholder.svg"}
              alt={`Scrolling image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
