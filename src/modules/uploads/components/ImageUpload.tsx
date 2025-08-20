"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn, getInfoSummary, isUploadValid } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { Info, UploadingFile } from "@/types";
import axios from "axios";
import { ImageIcon, Upload, X } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";

interface ImageUploadComponentProps {
  imageUrl: string | null;
  onChange: (newImageUrl: string | null) => void;
  info: Info | null;
}

function ImageUploadComponent({
  imageUrl,
  onChange,
  info,
}: ImageUploadComponentProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<UploadingFile | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = trpc.uploads.image.useMutation();

  // Simulate file upload with progress
  const uploadFile = useCallback(
    async (file: File): Promise<string> => {
      try {
        const response = await uploadMutation.mutateAsync({
          filename: file.name,
        });

        if (!response.success) {
          throw new Error(response.message || "Failed to get upload URL");
        }

        const { uploadUrl, imageUrl } = response.data;

        await axios.put(uploadUrl, file, {
          headers: {
            "Content-Type": file.type,
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadingFile((prev) => (prev ? { ...prev, progress } : prev));
            }
          },
        });

        return imageUrl;
      } catch (error) {
        console.error("Upload error:", error);
        throw error;
      }
    },
    [uploadMutation]
  );

  // Process and upload a single file
  const handleFiles = useCallback(
    async (files: FileList) => {
      const file = Array.from(files).find((f) => f.type.startsWith("image/"));
      if (!file) return;

      const isValid = isUploadValid(info, [file], "image");
      if (!isValid) return;

      const newUploadingFile: UploadingFile = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        progress: 0,
      };

      setUploadingFile(newUploadingFile);

      try {
        const uploadedUrl = await uploadFile(file);
        setUploadingFile((prev) =>
          prev ? { ...prev, url: uploadedUrl, progress: 100 } : prev
        );
        onChange(uploadedUrl);
      } catch (error) {
        console.log(error);
        setUploadingFile((prev) =>
          prev ? { ...prev, error: "Upload failed", progress: 0 } : prev
        );
      }

      setTimeout(() => {
        setUploadingFile(null);
      }, 1000);
    },
    [uploadFile, onChange]
  );

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles]
  );

  // Manual file selection
  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        handleFiles(files);
      }
      e.target.value = "";
    },
    [handleFiles]
  );

  // Remove image
  const handleRemoveImage = useCallback(() => {
    if (imageUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(imageUrl);
    }
    onChange(null);
  }, [imageUrl, onChange]);

  return (
    <div className={cn("space-y-4", !imageUrl && "w-full")}>
      {!imageUrl && !uploadingFile && (
        <div
          className={`
            relative h-36  bg-zinc-50 border-2 border-dashed rounded-lg text-center transition-colors
            ${
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="flex flex-col h-full justify-center gap-3 items-center">
            <ImageIcon className="size-6 text-primary opacity-75" />

            <div>
              <p className="opacity-75 text-base">Drag & Drop an image here</p>
              {info && (
                <p className="text-muted-foreground text-sm">
                  {getInfoSummary(info, "image")}
                </p>
              )}{" "}
            </div>

            <Button
              size={"xs"}
              type="button"
              onClick={handleFileSelect}
              variant="outline"
              disabled={!info}
            >
              <Upload className="h-4 w-4 mr-1" />
              Choose File
            </Button>
          </div>
        </div>
      )}

      {/* Uploading File Progress */}
      {uploadingFile && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Uploading file...</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="truncate flex-1 mr-2">
                {uploadingFile.file.name}
              </span>
              <span className="text-muted-foreground">
                {uploadingFile.error
                  ? "Failed"
                  : `${Math.round(uploadingFile.progress)}%`}
              </span>
            </div>
            <Progress
              value={uploadingFile.progress}
              className={`h-2 ${
                uploadingFile.error ? "bg-destructive/20" : ""
              }`}
            />
            {uploadingFile.error && (
              <p className="text-xs text-destructive">{uploadingFile.error}</p>
            )}
          </div>
        </div>
      )}

      {/* Uploaded Image */}
      {imageUrl && !uploadingFile && (
        <div className="max-h-36 space-y-2">
          <p>Uploaded Image</p>
          <div className="relative group size-32">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden w-full h-full border">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt="Uploaded"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement("div");
                    fallback.className =
                      "w-full h-full flex items-center justify-center bg-muted";
                    fallback.innerHTML =
                      '<svg class="h-8 w-8 text-muted-foreground"><use href="#image-icon"></use></svg>';
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
            {/* Remove button */}
            <button
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-destructive/90"
              aria-label="Remove image"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hidden SVG for fallback icon */}
      <svg className="hidden">
        <defs>
          <g id="image-icon">
            <path d="m21 19-7-7-7 7" />
            <path d="M3 21h18" />
            <path d="M3 10h18" />
            <circle cx="12" cy="7" r="4" />
          </g>
        </defs>
      </svg>
    </div>
  );
}

export default ImageUploadComponent;
