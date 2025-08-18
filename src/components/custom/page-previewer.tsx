"use client";

import { cn } from "@/lib/utils";

interface PagePreviewerProps {
  className?: string;
  onFrameLoad?: () => void;
  zoom: number;
  deviceView: "desktop" | "mobile";
}

export function PagePreviewer({
  className,
  onFrameLoad,
  zoom,
  deviceView,
}: PagePreviewerProps) {
  return (
    <div
      style={{
        width: deviceView === "mobile" ? "375px" : "100%",
      }}
      className={cn("relative", className)}
    >
      <iframe
        src={"/preview"}
        className="flex-1 border-0 transition-all duration-300"
        style={{
          zoom: `${zoom}%`,
        }}
        onLoad={onFrameLoad}
        title="Page Preview"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
}
