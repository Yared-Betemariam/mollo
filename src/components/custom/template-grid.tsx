"use client";

import { Button } from "@/components/ui/button";
import { templates } from "@/data";
import { Template } from "@/types";
import { Check, Maximize2 } from "lucide-react";
import { useState } from "react";
import { FullscreenMedia } from "./fullscreen-media";

interface TemplateGridProps {
  selectedTemplate: string;
  onTemplateSelect: (template: string) => void;
}

export function TemplateGrid({
  selectedTemplate,
  onTemplateSelect,
}: TemplateGridProps) {
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  return (
    <div className="grid grid-cols-2 gap-4">
      {templates.map((template) => (
        <div
          key={template.base_template}
          className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 ${
            selectedTemplate === template.base_template
              ? "bg-blue-50 border-blue-400"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => onTemplateSelect(template.base_template)}
        >
          <div className="flex flex-col">
            <div className="relative overflow-hidden rounded-md group">
              <img
                src={template.image_url || "/placeholder.svg"}
                alt={`${template.name} template`}
                className="w-full h-48 object-cover transition-transform duration-200 hover:scale-105"
              />

              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 bg-white/25 hover:bg-white/50 shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewTemplate(template);
                }}
              >
                <Maximize2 size={16} />
              </Button>
            </div>
            <div className="h-10 flex items-center justify-center text-center">
              <p className="font-medium text-gray-800">{template.name}</p>
            </div>
          </div>

          {selectedTemplate === template.base_template && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1.5 shadow-lg">
              <Check size={16} />
            </div>
          )}
        </div>
      ))}

      {previewTemplate && (
        <FullscreenMedia
          src={previewTemplate.image_url}
          open={!!previewTemplate}
          onOpen={() => setPreviewTemplate(null)}
        />
      )}
    </div>
  );
}
