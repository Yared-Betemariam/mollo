"use client";

import { Button } from "@/components/ui/button";
import { templates } from "@/data";
import { Template } from "@/types";
import { Check, Maximize2 } from "lucide-react";
import { useState } from "react";
import DialogWrapper from "./dialog-wrapper";

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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {templates.map((template) => (
        <div
          key={template.base_template}
          className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
            selectedTemplate === template.base_template
              ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => onTemplateSelect(template.base_template)}
        >
          <div className="p-3">
            <div className="relative overflow-hidden rounded-md group">
              <img
                src={template.image_url || "/placeholder.svg"}
                alt={`${template.name} template`}
                className="w-full h-48 object-cover transition-transform duration-200 hover:scale-105"
              />

              {/* Fullscreen button */}
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 bg-white/90 hover:bg-white shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewTemplate(template);
                }}
              >
                <Maximize2 size={16} />
              </Button>
            </div>
            <div className="mt-3 text-center">
              <p className="font-semibold text-gray-900">{template.name}</p>
            </div>
          </div>

          {/* Selection indicator */}
          {selectedTemplate === template.base_template && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1.5 shadow-lg">
              <Check size={16} />
            </div>
          )}
        </div>
      ))}

      {/* Fullscreen Preview Dialog */}
      <DialogWrapper
        title={`${previewTemplate?.name} Template Preview`}
        open={!!previewTemplate}
        onOpen={() => setPreviewTemplate(null)}
      >
        <div className="flex-1 p-6 pt-4">
          {previewTemplate && (
            <div className="h-full flex flex-col">
              <div className="flex-1 bg-gray-50 rounded-lg overflow-hidden">
                <img
                  src={previewTemplate.image_url || "/placeholder.svg"}
                  alt={`${previewTemplate.name} template preview`}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="mt-4 text-center space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  {previewTemplate.name}
                </h3>
                <Button
                  onClick={() => {
                    onTemplateSelect(previewTemplate.base_template);
                    setPreviewTemplate(null);
                  }}
                  className="mt-4"
                >
                  Select This Template
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogWrapper>
    </div>
  );
}
