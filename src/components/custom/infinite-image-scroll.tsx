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
        "relative h-[36rem] w-72 overflow-hidden rounded-lg mask-scroller",
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
            className="flex-shrink-0 w-full h-72 rounded-lg overflow-hidden shadow-lg"
          >
            <img
              src={src || "/placeholder.svg"}
              alt={`Scrolling image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {images.map((src, index) => (
          <div
            key={`second-${index}`}
            className="flex-shrink-0 w-full h-72 rounded-lg overflow-hidden shadow-lg"
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
