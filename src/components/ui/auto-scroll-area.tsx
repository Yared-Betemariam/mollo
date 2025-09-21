"use client";

import * as React from "react";
import { ScrollArea } from "./scroll-area";
import { cn } from "@/lib/utils";

interface AutoScrollAreaProps extends React.ComponentProps<typeof ScrollArea> {
  scrollSpeed?: number;
  pauseOnHover?: boolean;
  direction?: "vertical" | "horizontal";
}

function AutoScrollArea({
  className,
  children,
  scrollSpeed = 1,
  pauseOnHover = true,
  direction = "vertical",
  ...props
}: AutoScrollAreaProps) {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const animationRef = React.useRef<number>(0);
  const [sV, setSV] = React.useState<number>(0);

  const scroll = React.useCallback(() => {
    if (!scrollAreaRef.current || (pauseOnHover && isHovered)) return;

    const viewport = scrollAreaRef.current.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLElement;
    if (!viewport) return;

    const isVertical = direction === "vertical";
    console.log(sV, viewport.scrollLeft);

    if (
      (!isVertical && sV != 0 && viewport.scrollLeft == sV + scrollSpeed) ||
      (isVertical && sV != 0 && viewport.scrollTop == sV + scrollSpeed)
    ) {
      if (isVertical) {
        viewport.scrollTop = 0;
        setSV(0);
      } else {
        viewport.scrollLeft = 0;
        setSV(0);
      }
    } else {
      if (isVertical) {
        viewport.scrollTop += scrollSpeed;
        setSV(viewport.scrollTop + scrollSpeed);
      } else {
        viewport.scrollLeft += scrollSpeed;
        setSV(viewport.scrollLeft + scrollSpeed);
      }
    }

    animationRef.current = requestAnimationFrame(scroll);
  }, [scrollSpeed, isHovered, pauseOnHover, direction]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      animationRef.current = requestAnimationFrame(scroll);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [scroll]);

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsHovered(false);
    }
  };

  return (
    <ScrollArea
      ref={scrollAreaRef}
      className={cn("relative", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </ScrollArea>
  );
}

export { AutoScrollArea };
