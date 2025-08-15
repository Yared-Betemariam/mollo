"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Search } from "lucide-react";
import { toast } from "sonner";

interface PagePreviewerProps {
  url?: string;
  className?: string;
}

export function PagePreviewer({ url = "/", className }: PagePreviewerProps) {
  const [currentUrl, setCurrentUrl] = useState(url);

  const handleCopy = async () => {
    try {
      const fullUrl = window.location.origin + currentUrl;
      await navigator.clipboard.writeText(fullUrl);
      toast.success("URL copied to clipboard");
    } catch {
      toast.error("Could not copy URL to clipboard");
    }
  };

  return (
    <div className={`w-full h-full max-w-4xl mx-auto ${className}`}>
      <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-t-lg border border-b-0">
        <div className="flex items-center gap-2 flex-1">
          <Search className="h-4 w-4 text-muted-foreground opacity-50" />
          <Input
            value={currentUrl}
            onChange={(e) => setCurrentUrl(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-8"
            placeholder="Enter URL path..."
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 w-7 p-0 hover:bg-background"
        >
          <Copy className="h-3.5 w-3.5" />
          <span className="sr-only">Copy URL</span>
        </Button>
      </div>

      <div className="border rounded-b-lg bg-background overflow-hidden">
        <iframe
          src={currentUrl}
          className="w-full h-96 border-0"
          title="Page Preview"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    </div>
  );
}
